import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn, getRiskLevel, getRiskPalette } from "@/lib/utils";

export default function RiskMeter({ riskScore = 0 }) {
  const palette = getRiskPalette(riskScore);
  const level = getRiskLevel(riskScore);

  const Icon =
    level === "high" ? ShieldAlert : level === "medium" ? AlertTriangle : ShieldCheck;

  return (
    <div className={cn("rounded-3xl border p-4", palette.soft, palette.border)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", palette.text)} />
          <span className="text-sm font-medium text-slate-700">Risk score</span>
        </div>
        <span className={cn("text-2xl font-bold", palette.text)}>{riskScore}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/80">
        <div
          className={cn("h-full rounded-full transition-all duration-500", palette.bg)}
          style={{ width: `${Math.max(6, riskScore)}%` }}
        />
      </div>
    </div>
  );
}
