"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, Users, Wallet } from "lucide-react";
import type { ChainMetric } from "@/lib/types";
import { cn, formatNumber, formatPercent } from "@/lib/utils";
import { DeadnessScoreGauge } from "@/components/DeadnessScoreGauge";

const statusStyle = {
  Alive: "bg-app-surface text-app-text",
  "Mixed Activity": "bg-app-elevated text-app-text",
  "Bot-Dominated": "accent-stamp",
  "Mostly Dead": "accent-stamp"
};

export function ChainCard({ chain, index }: { chain: ChainMetric; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ x: -2, y: -2 }}
      className="glass group flex h-full w-[calc(100%-56px)] max-w-full flex-col overflow-hidden p-5 transition sm:w-auto"
    >
      <div className="border-b-2 border-app-line pb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md border-2 border-app-line bg-app-elevated text-lg">
              <Bot size={20} strokeWidth={2.5} />
            </span>
            <h2 className="min-w-0 break-words text-2xl font-black uppercase leading-none text-app-text">{chain.name}</h2>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs font-bold uppercase text-app-muted">{chain.ticker} research profile</p>
            <span className={cn("max-w-full rounded-sm border-2 border-app-line px-2.5 py-1 text-xs font-black uppercase", statusStyle[chain.status])}>
              {chain.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <DeadnessScoreGauge score={chain.deadnessScore} size="sm" />
      </div>

      <div className="mt-5 grid grid-cols-2 border-l-2 border-t-2 border-app-line">
        <Metric icon={Bot} label="BOT ACTIVITY" value={formatPercent(chain.botActivityPercentage)} />
        <Metric icon={Users} label="HUMAN ACTIVITY" value={formatPercent(chain.humanActivityPercentage)} />
        <Metric icon={Wallet} label="ACTIVE WALLETS" value={formatNumber(chain.activeWallets)} />
        <Metric icon={Bot} label="SUSPICIOUS WALLETS" value={formatNumber(chain.suspiciousWallets)} />
      </div>

      <div className="mt-5 rounded-md border-2 border-app-line bg-app-elevated p-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="inline-flex min-w-0 items-center gap-2 font-black uppercase text-app-text">
            <span className="accent-stamp rounded-sm border-2 border-app-line px-1.5 py-0.5 text-xs font-black">
              <Bot size={13} strokeWidth={2.5} />
            </span>
            MEV/ARBITRAGE SIGNAL
          </span>
          <span className="font-mono font-black text-app-text">{chain.mevSignal}/100</span>
        </div>
        <div className="mt-2 h-4 rounded-sm border-2 border-app-line bg-app-surface">
          <div
            className="h-full bg-app-accent"
            style={{ width: `${chain.mevSignal}%` }}
          />
        </div>
      </div>

      <div className="mt-auto pt-5">
        <Link
          href={`/chains/${chain.slug}`}
          className="focus-ring brutal-button flex h-10 items-center justify-center gap-2 text-sm font-black"
        >
          Open chain profile
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}

function Metric({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Bot;
  label: string;
  value: string;
}) {
  const suspicious = label.includes("SUSPICIOUS") || label.includes("BOT");

  return (
    <div className="min-h-[94px] border-b-2 border-r-2 border-app-line bg-app-surface p-3">
      <div className="mb-2 flex items-center justify-between gap-2 text-app-text">
        <Icon size={16} strokeWidth={2.5} />
        {suspicious ? (
          <span className="accent-stamp rounded-sm border border-app-line px-1.5 py-0.5 text-xs" title="robot-flagged metric">
            <Bot size={12} strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
      <p className={cn("font-mono text-xl font-black leading-none text-app-text", suspicious ? "text-app-accent" : "")}>
        {value}
      </p>
      <p className="mt-2 text-[10px] font-black uppercase text-app-muted">{label}</p>
    </div>
  );
}
