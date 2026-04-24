"use client";

import { useState } from "react";
import { LoaderCircle, MessageSquareText } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const placeholderText =
  "Example: Your bank account is blocked. Verify immediately using this link and send the OTP to avoid suspension.";

export default function TextAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Text analysis failed.");
      }

      setResult(data);
    } catch (requestError) {
      setResult(null);
      setError(requestError.message || "Text analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <Card>
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <MessageSquareText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Analyze Message</h2>
            <p className="text-sm text-muted-foreground">
              Paste a suspicious message and we’ll score the fraud risk.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={placeholderText}
            className="min-h-[220px] w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
            required
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={loading || !text.trim()}>
              {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Scanning..." : "Scan Message"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setText(placeholderText);
                setError("");
              }}
            >
              Load Example
            </Button>
          </div>
        </form>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </Card>

      {result ? (
        <ResultCard result={result} />
      ) : (
        <Card className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-slate-950 to-slate-800 text-white">
          <div className="max-w-sm text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200">Ready to scan</p>
            <h3 className="mt-3 text-2xl font-semibold">Results appear here after analysis</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              VerifyPay uses OpenAI first and automatically falls back to rule-based fraud
              detection if the API is unavailable.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
