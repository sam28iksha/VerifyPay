"use client";

import ImageAnalyzer from "@/components/ImageAnalyzer";
import Navbar from "@/components/Navbar";
import TextAnalyzer from "@/components/TextAnalyzer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";

const tabItems = [
  { value: "text", label: "Analyze Message" },
  { value: "image", label: "Analyze Screenshot" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-grid">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Card className="mb-8 overflow-hidden border-none bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 text-white">
          <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-200">
                AI-powered fraud detection
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Analyze risky payment messages and screenshots before they cost you.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                VerifyPay checks suspicious text and visual payment evidence with OpenAI,
                then falls back automatically to rule-based detection if the AI path fails.
              </p>
            </div>

            <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Reliability first</p>
                <p className="mt-2 text-xl font-semibold">Never crashes on AI failures</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Flexible history</p>
                <p className="mt-2 text-xl font-semibold">MongoDB-backed scan logs</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Scam-focused UX</p>
                <p className="mt-2 text-xl font-semibold">Risk scores, verdicts, and reasoning</p>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="text" items={tabItems}>
          {({ value, setValue, items }) => (
            <div className="space-y-6">
              <TabsList items={items} value={value} onChange={setValue} />
              {value === "text" ? <TextAnalyzer /> : <ImageAnalyzer />}
            </div>
          )}
        </Tabs>
      </section>
    </main>
  );
}
