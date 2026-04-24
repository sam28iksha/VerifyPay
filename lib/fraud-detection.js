import OpenAI from "openai";

const MODEL = "gpt-4o-mini";

const categoryRules = [
  {
    label: "urgency language",
    points: 18,
    terms: ["urgent", "immediately", "asap", "now", "act fast", "final warning"]
  },
  {
    label: "phishing language",
    points: 24,
    terms: ["click", "link", "verify", "login", "confirm account", "update details"]
  },
  {
    label: "financial pressure",
    points: 28,
    terms: ["pay", "transfer", "blocked", "refund", "penalty", "deposit", "upi"]
  },
  {
    label: "sensitive information request",
    points: 30,
    terms: ["otp", "pin", "password", "cvv", "bank details", "passcode"]
  }
];

function normalizeAnalysis(result, fallbackReasoning) {
  const risk_score = Math.max(
    0,
    Math.min(100, Number.parseInt(result?.risk_score, 10) || 0)
  );
  const verdict = risk_score >= 60 ? "SCAM" : "SAFE";
  const reasoning =
    typeof result?.reasoning === "string" && result.reasoning.trim()
      ? result.reasoning.trim()
      : fallbackReasoning;

  return {
    risk_score,
    verdict,
    reasoning
  };
}

export function fallbackAnalysis(text) {
  const source = typeof text === "string" ? text.toLowerCase() : "";
  let riskScore = 8;
  const hits = [];

  for (const rule of categoryRules) {
    const matchedTerms = rule.terms.filter((term) => source.includes(term));
    if (matchedTerms.length > 0) {
      riskScore += Math.min(rule.points, matchedTerms.length * Math.ceil(rule.points / 2));
      hits.push(`${rule.label}: ${matchedTerms.join(", ")}`);
    }
  }

  const repeatedPunctuation = (source.match(/[!?]{2,}/g) || []).length;
  if (repeatedPunctuation > 0) {
    riskScore += 6;
    hits.push("aggressive punctuation");
  }

  const hasUrl = /(https?:\/\/|bit\.ly|tinyurl|wa\.me)/i.test(source);
  if (hasUrl) {
    riskScore += 15;
    hits.push("suspicious link pattern");
  }

  const finalScore = Math.min(riskScore, 100);
  const verdict = finalScore >= 60 ? "SCAM" : "SAFE";
  const reasoning =
    hits.length > 0
      ? `Rule-based fallback flagged ${hits.join("; ")}. This message shows patterns commonly used in payment scams or phishing attempts.`
      : "Rule-based fallback found few scam indicators. The message does not strongly suggest fraud, but it should still be verified before sharing money or sensitive details.";

  return {
    risk_score: finalScore,
    verdict,
    reasoning
  };
}

function extractJsonPayload(content) {
  if (!content || typeof content !== "string") {
    throw new Error("Empty AI response");
  }

  const trimmed = content.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in AI response");
  }

  return trimmed.slice(start, end + 1);
}

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export async function analyzeTextWithAI(text) {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a fraud detection analyst. Always return a JSON object with risk_score (0-100), verdict (SAFE or SCAM), and reasoning."
      },
      {
        role: "user",
        content: `Analyze this message for fraud or phishing risk:\n\n${text}`
      }
    ]
  });

  const raw = completion.choices?.[0]?.message?.content;
  const parsed = JSON.parse(extractJsonPayload(raw));
  return normalizeAnalysis(
    parsed,
    "AI response was missing reasoning, so a conservative interpretation was used."
  );
}

export async function analyzeImageWithAI({ base64, mimeType }) {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You analyze payment screenshots for fraud risk. Return JSON with risk_score (0-100), verdict (SAFE or SCAM), and reasoning."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Inspect this screenshot for scam indicators, edited payment proof, suspicious pressure, or sensitive data exposure."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64}`
            }
          }
        ]
      }
    ]
  });

  const raw = completion.choices?.[0]?.message?.content;
  const parsed = JSON.parse(extractJsonPayload(raw));
  return normalizeAnalysis(
    parsed,
    "AI response was incomplete, so the screenshot was interpreted conservatively."
  );
}

export function fallbackImageAnalysis(fileName = "") {
  const fallback = fallbackAnalysis(fileName);
  const risk_score = Math.max(fallback.risk_score, 18);
  return {
    risk_score,
    verdict: risk_score >= 60 ? "SCAM" : "SAFE",
    reasoning:
      "Image analysis switched to the fallback detector. The file name was checked for obvious fraud terms, but a visual AI review was unavailable."
  };
}
