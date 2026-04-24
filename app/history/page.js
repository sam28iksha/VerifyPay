import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { getRecentScans } from "@/lib/scan-service";
import { formatDate, getRiskPalette } from "@/lib/utils";

export default async function HistoryPage() {
  const results = await getRecentScans(20);

  return (
    <main className="min-h-screen bg-grid">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-700">
            Scan history
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Recent fraud checks
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Stored scans appear here when MongoDB is configured. If the database is unavailable,
            the app still analyzes requests and this page simply stays empty.
          </p>
        </div>

        <div className="grid gap-4">
          {results.length === 0 ? (
            <Card className="text-center">
              <h2 className="text-xl font-semibold text-slate-950">No saved scans yet</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Run a text or image check from the main page and recent results will appear here
                when MongoDB Atlas is connected.
              </p>
            </Card>
          ) : (
            results.map((item) => {
              const palette = getRiskPalette(item.risk_score);
              return (
                <Card key={item._id} className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                        {item.type} scan
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-950">
                        {item.input}
                      </h2>
                    </div>
                    <div
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${palette.soft} ${palette.border} ${palette.text}`}
                    >
                      {item.verdict} • {item.risk_score}%
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{item.reasoning}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    {formatDate(item.createdAt)}
                  </p>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
