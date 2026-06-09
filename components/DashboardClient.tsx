"use client";

import { useState } from "react";
import { AlertTriangle, Bot, Eye, Wallet } from "lucide-react";
import { ChainCard } from "@/components/ChainCard";
import { ChainFilter } from "@/components/ChainFilter";
import { ErrorState } from "@/components/ErrorState";
import { chains, networkAverages } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function DashboardClient() {
  const [filter, setFilter] = useState("");
  const normalizedFilter = filter.toLowerCase();
  const filtered = chains.filter((chain) =>
    `${chain.name} ${chain.ticker} ${chain.status}`.toLowerCase().includes(normalizedFilter)
  );
  const averages = networkAverages();
  const flaggedCount = chains.filter((chain) => chain.status === "Bot-Dominated" || chain.status === "Mostly Dead").length;
  const watchlistCount = chains.filter((chain) => chain.status === "Watchlist").length;

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

      <section className="mt-8 grid max-w-[calc(100%-56px)] gap-4 sm:max-w-none sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat icon={AlertTriangle} label="Priority chains" value={String(flaggedCount)} />
        <DashboardStat icon={Eye} label="Watchlist" value={String(watchlistCount)} />
        <DashboardStat icon={Bot} label="Avg bot share" value={`${averages.averageBotShare}%`} />
        <DashboardStat icon={Wallet} label="Suspicious wallets" value={formatNumber(averages.suspiciousWallets)} />
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
    </main>
  );
}

function DashboardStat({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Bot;
  label: string;
  value: string;
}) {
  return (
    <div className="glass min-h-[118px] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-xs font-black uppercase text-app-muted">{label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border-2 border-app-line bg-app-elevated text-app-text">
          <Icon size={17} strokeWidth={2.5} />
        </span>
      </div>
      <p className="mt-4 break-words font-mono text-3xl font-black leading-none text-app-text">{value}</p>
    </div>
  );
}
