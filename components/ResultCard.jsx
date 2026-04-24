import { Bot, Sparkles, TriangleAlert } from "lucide-react";
import RiskMeter from "@/components/RiskMeter";
import { Card } from "@/components/ui/card";
import { cn, getRiskPalette } from "@/lib/utils";

export default function ResultCard({ result }) {
  const palette = getRiskPalette(result?.risk_score);
  const verdictIsScam = result?.verdict === "SCAM";

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Analysis Result
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            {verdictIsScam ? "High caution advised" : "No major fraud indicators"}
          </h3>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
            palette.soft,
            palette.border,
            palette.text
          )}
        >
          <TriangleAlert className="h-4 w-4" />
          {result.verdict}
        </div>
      </div>

      <RiskMeter riskScore={result.risk_score} />

      <div className="rounded-3xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Bot className="h-4 w-4" />
          Reasoning
        </div>
        <p className="text-sm leading-6 text-slate-600">{result.reasoning}</p>
      </div>

      {result.source && (
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <Sparkles className="h-3.5 w-3.5" />
          Source: {result.source === "ai" ? "OpenAI analysis" : "Rule-based fallback"}
        </div>
      )}
    </Card>
  );
}
