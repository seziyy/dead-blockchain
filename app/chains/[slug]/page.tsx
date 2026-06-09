import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot, Signal, Users, Wallet } from "lucide-react";
import { BotHumanChart } from "@/components/BotHumanChart";
import { DeadnessScoreGauge } from "@/components/DeadnessScoreGauge";
import { HumanActivityTrendChart, SuspiciousWalletGrowthChart, TransactionTrendChart } from "@/components/TransactionTrendChart";
import { SuspiciousWalletTable } from "@/components/SuspiciousWalletTable";
import { chains, getChain } from "@/lib/mock-data";
import { calculateBotScore } from "@/lib/scoring";
import { cn, formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  return chains.map((chain) => ({ slug: chain.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chain = getChain(slug);
  return {
    title: chain ? `${chain.name} | Dead Blockchain Theory` : "Chain Profile"
  };
}

export default async function ChainDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chain = getChain(slug);

  if (!chain) {
    notFound();
  }

  const botScore = Math.round(calculateBotScore(chain.scoringSignals));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="focus-ring brutal-button inline-flex items-center gap-2 px-3 py-2 text-sm font-black text-app-muted hover:text-app-text"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 border-[3px] border-app-line bg-app-surface px-3 py-1.5 text-sm font-black uppercase text-app-text shadow-[4px_4px_0_#000]">
            {chain.ticker} chain profile
          </p>
          <h1 className="mt-5 break-words text-5xl font-black uppercase leading-[0.9] text-app-text sm:text-7xl">{chain.name}</h1>
          <p className="mt-5 max-w-2xl border-l-[6px] border-app-line pl-4 leading-7 text-app-muted">
            This score is an estimate based on on-chain behavior patterns. Automation is
            not always bad, but invisible automation changes the meaning of adoption.
          </p>
        </div>
        <div className="glass p-5">
          <DeadnessScoreGauge score={chain.deadnessScore} size="lg" />
          <div className="mt-5 border-[3px] border-app-line bg-app-elevated p-3">
            <p className="text-xs font-black uppercase text-app-muted">Weighted bot behavior score</p>
            <p className="mt-1 font-mono text-2xl font-black text-app-accent">{botScore}/100</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailStat icon={Bot} label="Estimated bot activity" value={`${chain.botActivityPercentage}%`} />
        <DetailStat icon={Users} label="Estimated human activity" value={`${chain.humanActivityPercentage}%`} />
        <DetailStat icon={Wallet} label="Active wallets" value={formatNumber(chain.activeWallets)} />
        <DetailStat icon={Signal} label="MEV/arbitrage signal" value={`${chain.mevSignal}/100`} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <BotHumanChart chain={chain} />
        <TransactionTrendChart chain={chain} />
        <SuspiciousWalletGrowthChart chain={chain} />
        <HumanActivityTrendChart chain={chain} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass p-5">
          <h2 className="border-b-[3px] border-app-line pb-3 text-xl font-black uppercase text-app-text">Top Bot-Like Behavior Patterns</h2>
          <div className="mt-5 space-y-4">
            {chain.behaviorPatterns.map((pattern) => (
              <div key={pattern.pattern} className="border-[3px] border-app-line bg-app-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black uppercase text-app-text">{pattern.pattern}</p>
                    <p className="mt-1 text-sm text-app-muted">{pattern.signal}</p>
                  </div>
                  <span className="accent-stamp inline-flex items-center gap-1 border-[3px] border-app-line px-2 py-1 text-sm font-black">
                    <Bot size={14} strokeWidth={2.5} />
                    {pattern.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-5">
          <h2 className="border-b-[3px] border-app-line pb-3 text-xl font-black uppercase text-app-text">Why This Chain Is Flagged</h2>
          <div className="mt-5 space-y-3">
            {chain.flaggedReasons.map((reason) => (
              <p key={reason} className="border-[3px] border-app-line bg-app-surface p-4 leading-7 text-app-muted">
                {reason}
              </p>
            ))}
          </div>
          <div className="mt-5 border-[3px] border-app-line bg-app-elevated p-4">
            <p className="text-sm font-black uppercase text-app-text">Deadness Score explanation</p>
            <p className="mt-2 text-sm leading-6 text-app-muted">
              deadness_score = bot activity percentage * 0.6 + suspicious wallet
              percentage * 0.25 + governance or social activity placeholder * 0.15.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SuspiciousWalletTable chain={chain} />
      </section>
    </main>
  );
}

function DetailStat({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Bot;
  label: string;
  value: string;
}) {
  const suspicious = label.toLowerCase().includes("bot") || label.toLowerCase().includes("mev");

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between gap-2">
        <Icon className="text-app-text" size={18} strokeWidth={2.5} />
        {suspicious ? (
          <span className="accent-stamp border-[3px] border-app-line px-2 py-0.5 text-xs">
            <Bot size={14} strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-xs font-black uppercase text-app-muted">{label}</p>
      <p className={cn("mt-2 font-mono text-3xl font-black text-app-text", suspicious ? "text-app-accent" : "")}>{value}</p>
    </div>
  );
}
