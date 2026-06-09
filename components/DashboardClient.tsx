"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, Bot, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChainCard } from "@/components/ChainCard";
import { ChainFilter } from "@/components/ChainFilter";
import { ErrorState } from "@/components/ErrorState";
import { InfoDrawer } from "@/components/InfoDrawer";
import { chains, networkAverages } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

type DrawerKey = "priority" | "botShare" | "wallets";

export function DashboardClient() {
  const [filter, setFilter] = useState("");
  const [activeDrawer, setActiveDrawer] = useState<DrawerKey | null>(null);
  const normalizedFilter = filter.toLowerCase();
  const filtered = chains.filter((chain) =>
    `${chain.name} ${chain.ticker} ${chain.status}`.toLowerCase().includes(normalizedFilter)
  );
  const averages = networkAverages();
  const flaggedCount = chains.filter((chain) => chain.status === "Bot-Dominated" || chain.status === "Mostly Dead").length;
  const topByDeadness = [...chains].sort((a, b) => b.deadnessScore - a.deadnessScore).slice(0, 5);
  const topByBotActivity = [...chains].sort((a, b) => b.botActivityPercentage - a.botActivityPercentage).slice(0, 5);
  const botShareTrend = chains[0].humanTrend.map((point, index) => ({
    date: point.date,
    botShare: Math.round(
      chains.reduce((sum, chain) => sum + 100 - chain.humanTrend[index].humanShare, 0) / chains.length
    )
  }));
  const suspiciousWalletTrend = chains[0].suspiciousWalletGrowth.map((point, index) => ({
    date: point.date,
    wallets: chains.reduce((sum, chain) => sum + chain.suspiciousWalletGrowth[index].wallets, 0)
  }));
  const walletDistribution = [...chains].sort((a, b) => b.suspiciousWallets - a.suspiciousWallets).slice(0, 6);
  const activeDrawerMeta = activeDrawer ? drawerMeta[activeDrawer] : null;

  const closeDrawer = () => setActiveDrawer(null);
  const handleDrawerCta = () => {
    if (activeDrawer === "botShare") {
      document.getElementById("bot-share-calculation")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    closeDrawer();
    window.setTimeout(() => {
      document.getElementById("chains")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <main className="mx-auto w-full max-w-[100vw] overflow-hidden px-4 py-8 sm:max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="max-w-[calc(100%-56px)] border-l-4 border-app-line pl-4 leading-7 text-app-muted sm:max-w-2xl">
            Dead does not mean inactive. Dead means human presence is no longer dominant.
          </p>
        </div>
        <ChainFilter value={filter} onChange={setFilter} />
      </div>

      <section className="mt-8 grid max-w-[calc(100%-56px)] gap-4 sm:max-w-none sm:grid-cols-2 xl:grid-cols-3">
        <DashboardStat
          icon={AlertTriangle}
          label="Priority chains"
          value={String(flaggedCount)}
          onClick={() => setActiveDrawer("priority")}
        />
        <DashboardStat
          icon={Bot}
          label="Avg bot share"
          value={`${averages.averageBotShare}%`}
          onClick={() => setActiveDrawer("botShare")}
        />
        <DashboardStat
          icon={Wallet}
          label="Suspicious wallets"
          value={formatNumber(averages.suspiciousWallets)}
          onClick={() => setActiveDrawer("wallets")}
        />
      </section>

      <section id="chains" className="mt-8 grid max-w-[calc(100%-56px)] scroll-mt-24 gap-6 sm:max-w-none md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((chain, index) => (
          <ChainCard key={chain.slug} chain={chain} index={index} />
        ))}
      </section>
      {filtered.length === 0 ? (
        <div className="mt-8">
          <ErrorState
            title="No bot ghosts detected yet."
            copy="Try another chain name, ticker, or status label from the current dataset."
          />
        </div>
      ) : null}

      <InfoDrawer
        open={activeDrawer !== null}
        title={activeDrawerMeta?.title ?? ""}
        eyebrow="Metric briefing"
        ctaLabel={activeDrawerMeta?.cta}
        onClose={closeDrawer}
        onCta={handleDrawerCta}
      >
        {activeDrawer === "priority" ? (
          <PriorityChainsContent topByDeadness={topByDeadness} topByBotActivity={topByBotActivity} />
        ) : null}
        {activeDrawer === "botShare" ? (
          <AverageBotShareContent currentAverage={averages.averageBotShare} trend={botShareTrend} />
        ) : null}
        {activeDrawer === "wallets" ? (
          <SuspiciousWalletsContent
            totalWallets={averages.suspiciousWallets}
            distribution={walletDistribution}
            trend={suspiciousWalletTrend}
          />
        ) : null}
      </InfoDrawer>
    </main>
  );
}

const drawerMeta: Record<DrawerKey, { title: string; cta: string }> = {
  priority: {
    title: "Priority Chains",
    cta: "View Research Profiles"
  },
  botShare: {
    title: "Average Bot Share",
    cta: "Learn Methodology"
  },
  wallets: {
    title: "Suspicious Wallets",
    cta: "Explore Wallet Signals"
  }
};

function DashboardStat({
  icon: Icon,
  label,
  value,
  onClick
}: {
  icon: typeof Bot;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="glass focus-ring min-h-[118px] p-4 text-left"
      aria-haspopup="dialog"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-xs font-black uppercase text-app-muted">{label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border-2 border-app-line bg-app-elevated text-app-text">
          <Icon size={17} strokeWidth={2.5} />
        </span>
      </div>
      <p className="mt-4 break-words font-mono text-3xl font-black leading-none text-app-text">{value}</p>
    </button>
  );
}

function PriorityChainsContent({
  topByDeadness,
  topByBotActivity
}: {
  topByDeadness: typeof chains;
  topByBotActivity: typeof chains;
}) {
  return (
    <div className="space-y-6">
      <InfoCopy>
        These chains currently show the strongest automation signals according to our research model.
      </InfoCopy>
      <BulletList
        items={[
          "High bot activity",
          "Large suspicious wallet clusters",
          "Strong MEV behavior",
          "Repetitive transaction patterns"
        ]}
      />
      <ImportantNote>
        This does not mean the chain is unhealthy. It simply means the chain deserves deeper investigation.
      </ImportantNote>
      <RankedList title="Top Chains By Deadness Score" items={topByDeadness} valueKey="deadnessScore" suffix="/100" />
      <RankedList title="Top Chains By Bot Activity" items={topByBotActivity} valueKey="botActivityPercentage" suffix="%" />
      <InfoPanel title="Ranking Methodology">
        Deadness Score combines automation-heavy signals including transaction frequency, repetition, MEV exposure,
        sybil-like wallet behavior, contract interaction patterns, and a placeholder for weaker governance or social
        activity.
      </InfoPanel>
    </div>
  );
}

function AverageBotShareContent({
  currentAverage,
  trend
}: {
  currentAverage: number;
  trend: Array<{ date: string; botShare: number }>;
}) {
  return (
    <div className="space-y-6">
      <InfoCopy>
        Average Bot Share estimates what percentage of observed activity appears automated rather than human-driven.
      </InfoCopy>
      <BulletList
        items={[
          "Transaction frequency",
          "Repetitive behavior",
          "MEV activity",
          "Contract interaction patterns",
          "Sybil-like wallet behavior"
        ]}
      />
      <ImportantNote>
        This is not a certainty score. It is a probabilistic estimate based on on-chain activity patterns.
      </ImportantNote>
      <MetricSpotlight label="Current Average" value={`${currentAverage}%`} />
      <ChartShell title="Historical Trend Chart">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend} margin={{ top: 18, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgb(var(--color-line))" strokeDasharray="0" vertical={false} />
            <XAxis dataKey="date" stroke="rgb(var(--color-muted))" />
            <YAxis stroke="rgb(var(--color-muted))" tickFormatter={(value) => `${value}%`} width={42} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
            <Line type="monotone" dataKey="botShare" stroke="#d71920" strokeWidth={4} dot={{ r: 4, strokeWidth: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>
      <InfoPanel id="bot-share-calculation" title="Calculation">
        The model averages chain-level bot share estimates after comparing repeated transaction shapes, wallet timing,
        automated contract paths, MEV-like behavior, and suspicious cluster features. The output is rounded for the top
        summary card.
      </InfoPanel>
    </div>
  );
}

function SuspiciousWalletsContent({
  totalWallets,
  distribution,
  trend
}: {
  totalWallets: number;
  distribution: typeof chains;
  trend: Array<{ date: string; wallets: number }>;
}) {
  return (
    <div className="space-y-6">
      <InfoCopy>
        Suspicious wallets are addresses that exhibit behavior commonly associated with automation or coordinated
        activity.
      </InfoCopy>
      <BulletList
        items={[
          "Extremely high transaction counts",
          "Repeated interactions",
          "Shared funding sources",
          "Farming behavior",
          "Sybil patterns"
        ]}
      />
      <ImportantNote>
        A suspicious wallet is not necessarily malicious. The label indicates unusual behavioral characteristics.
      </ImportantNote>
      <MetricSpotlight label="Total Suspicious Wallets" value={formatNumber(totalWallets)} />
      <ChartShell title="Distribution By Chain">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={distribution} margin={{ top: 18, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="rgb(var(--color-line))" strokeDasharray="0" vertical={false} />
            <XAxis dataKey="name" stroke="rgb(var(--color-muted))" tick={{ fontSize: 11 }} />
            <YAxis stroke="rgb(var(--color-muted))" tickFormatter={(value) => formatNumber(Number(value))} width={58} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatNumber(Number(value))} />
            <Bar dataKey="suspiciousWallets" fill="#d71920" stroke="#050505" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Recent Growth Trend">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend} margin={{ top: 18, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="rgb(var(--color-line))" strokeDasharray="0" vertical={false} />
            <XAxis dataKey="date" stroke="rgb(var(--color-muted))" />
            <YAxis stroke="rgb(var(--color-muted))" tickFormatter={(value) => formatNumber(Number(value))} width={58} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatNumber(Number(value))} />
            <Line type="monotone" dataKey="wallets" stroke="#050505" strokeWidth={4} dot={{ r: 4, strokeWidth: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  );
}

function InfoCopy({ children }: { children: ReactNode }) {
  return <p className="text-lg font-semibold leading-7 text-app-text">{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 border-[3px] border-app-line bg-app-elevated p-3 text-sm font-black uppercase text-app-text">
          <span className="mt-1 h-3 w-3 shrink-0 border-2 border-app-line bg-app-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ImportantNote({ children }: { children: ReactNode }) {
  return (
    <div className="border-[4px] border-app-line bg-app-surface p-4 shadow-[4px_4px_0_rgb(var(--color-line))]">
      <p className="text-xs font-black uppercase text-app-muted">Important</p>
      <p className="mt-2 text-base font-bold leading-6 text-app-text">{children}</p>
    </div>
  );
}

function RankedList({
  title,
  items,
  valueKey,
  suffix
}: {
  title: string;
  items: typeof chains;
  valueKey: "deadnessScore" | "botActivityPercentage";
  suffix: string;
}) {
  return (
    <InfoPanel title={title}>
      <div className="space-y-3">
        {items.map((chain, index) => (
          <div key={chain.slug} className="grid grid-cols-[32px_1fr_auto] items-center gap-3">
            <span className="grid h-8 w-8 place-items-center border-2 border-app-line bg-app-elevated font-mono text-sm font-black">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase text-app-text">{chain.name}</p>
              <div className="mt-1 h-3 border-2 border-app-line bg-app-elevated">
                <div className="h-full bg-app-accent" style={{ width: `${chain[valueKey]}%` }} />
              </div>
            </div>
            <span className="font-mono text-sm font-black text-app-text">
              {chain[valueKey]}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    </InfoPanel>
  );
}

function MetricSpotlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-[4px] border-app-line bg-app-elevated p-4">
      <p className="text-xs font-black uppercase text-app-muted">{label}</p>
      <p className="mt-2 break-words font-mono text-5xl font-black leading-none text-app-text">{value}</p>
    </div>
  );
}

function ChartShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-[4px] border-app-line bg-app-surface p-4">
      <h3 className="border-b-[3px] border-app-line pb-3 text-lg font-black uppercase text-app-text">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function InfoPanel({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-5 border-[4px] border-app-line bg-app-surface p-4">
      <h3 className="border-b-[3px] border-app-line pb-3 text-lg font-black uppercase text-app-text">{title}</h3>
      <div className="mt-4 text-sm font-semibold leading-6 text-app-text">{children}</div>
    </section>
  );
}

const tooltipStyle = {
  background: "rgb(var(--color-surface))",
  border: "3px solid rgb(var(--color-line))",
  borderRadius: 0,
  color: "rgb(var(--color-text))"
};
