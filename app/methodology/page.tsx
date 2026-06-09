import { MethodologyCard } from "@/components/MethodologyCard";
import { methodologySignals, scoringLevels } from "@/lib/mock-data";

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="max-w-3xl">
        <p className="inline-flex items-center gap-2 border-[3px] border-app-line bg-app-surface px-3 py-1.5 text-sm font-black uppercase text-app-text shadow-[4px_4px_0_#000]">
          Research methodology
        </p>
        <h1 className="mt-5 text-6xl font-black uppercase leading-[0.9] text-app-text sm:text-7xl">How the Bot Index Works</h1>
        <p className="mt-5 border-l-[6px] border-app-line pl-4 leading-7 text-app-muted">
          Bot detection is an estimate, not absolute truth. The dashboard uses behavioral
          signals that can suggest automation, sybil activity, MEV, airdrop farming, or
          repetitive contract interaction.
        </p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <MethodologyCard
          title="Detection Heuristics"
          copy="The model looks for patterns that are difficult to explain as ordinary human use when they appear together."
          items={methodologySignals}
        />
        <MethodologyCard
          title="Important Caveat"
          copy="Automation is not always bad. Market makers, keepers, solvers, bridge relayers, and data indexers can be useful. The dashboard measures whether visible adoption is likely human-dominant, not whether a chain is good or bad."
        />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass p-5">
          <h2 className="border-b-[3px] border-app-line pb-3 text-xl font-black uppercase text-app-text">Scoring Model</h2>
          <div className="mt-5 border-[3px] border-app-line bg-app-surface p-4 font-mono text-sm leading-7 text-app-muted">
            <p>bot_score =</p>
            <p>frequency_score * 0.25 +</p>
            <p>repetition_score * 0.20 +</p>
            <p>mev_score * 0.20 +</p>
            <p>sybil_score * 0.15 +</p>
            <p>contract_interaction_score * 0.10 +</p>
            <p>low_balance_high_activity_score * 0.10</p>
          </div>
          <div className="mt-4 border-[3px] border-app-line bg-app-elevated p-4 font-mono text-sm leading-7 text-app-muted">
            <p>deadness_score =</p>
            <p>bot_activity_percentage * 0.6 +</p>
            <p>suspicious_wallet_percentage * 0.25 +</p>
            <p>low_governance_or_social_activity_placeholder * 0.15</p>
          </div>
        </div>

        <div className="glass p-5">
          <h2 className="border-b-[3px] border-app-line pb-3 text-xl font-black uppercase text-app-text">Score Levels</h2>
          <div className="mt-5 space-y-3">
            {scoringLevels.map((level) => (
              <div key={level.range} className="border-[3px] border-app-line bg-app-surface p-4">
                <div className={`flex items-center gap-3 ${level.label === "Watchlist" ? "justify-end" : "justify-between"}`}>
                  {level.label !== "Watchlist" ? (
                    <p className="font-black uppercase text-app-text">{level.label}</p>
                  ) : null}
                  <span className="border-[3px] border-app-line bg-app-elevated px-2 py-1 text-sm font-black text-app-text">
                    {level.range}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-app-muted">{level.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
