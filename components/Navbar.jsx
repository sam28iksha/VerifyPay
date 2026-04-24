import Link from "next/link";
import { ShieldCheck, History } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight">VerifyPay</p>
            <p className="text-sm text-muted-foreground">
              Fraud checks for messages and payment screenshots
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            <History className="h-4 w-4" />
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
