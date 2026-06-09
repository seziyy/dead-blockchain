"use client";

import { useState } from "react";
import { ChainCard } from "@/components/ChainCard";
import { ChainFilter } from "@/components/ChainFilter";
import { ErrorState } from "@/components/ErrorState";
import { chains } from "@/lib/mock-data";

export function DashboardClient() {
  const [filter, setFilter] = useState("");
  const normalizedFilter = filter.toLowerCase();
  const filtered = chains.filter((chain) =>
    `${chain.name} ${chain.ticker} ${chain.status}`.toLowerCase().includes(normalizedFilter)
  );

  return (
    <main className="mx-auto w-full max-w-[100vw] overflow-hidden px-4 py-8 sm:max-w-7xl sm:px-6 lg:px-8">
      <div className="border-b-2 border-app-line pb-6">
        <p className="font-mono text-xs font-black uppercase text-app-muted">
          BOT ACTIVITY INDEX / ON-CHAIN RESEARCH
        </p>
      </div>
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="max-w-full break-words text-3xl font-black uppercase leading-[0.95] text-app-text sm:text-5xl lg:text-6xl">
            <span className="block">Chain</span>
            <span className="block">Dashboard</span>
          </h1>
          <p className="mt-4 max-w-[calc(100%-56px)] border-l-4 border-app-line pl-4 leading-7 text-app-muted sm:max-w-2xl">
            Dead does not mean inactive. Dead means human presence is no longer dominant.
          </p>
        </div>
        <ChainFilter value={filter} onChange={setFilter} />
      </div>

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
