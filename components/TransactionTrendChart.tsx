"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Bot } from "lucide-react";
import type { ChainMetric } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function TransactionTrendChart({ chain }: { chain: ChainMetric }) {
  return (
    <div className="chart-panel glass p-5">
      <h2 className="border-b-[3px] border-app-line pb-3 text-xl font-black uppercase text-app-text">Daily Transactions</h2>
      <ResponsiveContainer width="100%" height={270}>
        <AreaChart data={chain.dailyTransactions} margin={{ top: 20, right: 12, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgb(var(--color-line))" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="date" stroke="rgb(var(--color-muted))" />
          <YAxis stroke="rgb(var(--color-muted))" tickFormatter={(value) => formatNumber(Number(value))} width={78} />
          <Tooltip
            formatter={(value) => formatNumber(Number(value))}
            contentStyle={{
              background: "rgb(var(--color-surface))",
              border: "3px solid rgb(var(--color-line))",
              borderRadius: 0,
              color: "rgb(var(--color-text))"
            }}
          />
          <Area
            type="monotone"
            dataKey="transactions"
            stroke="#050505"
            fill="#050505"
            fillOpacity={0.08}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SuspiciousWalletGrowthChart({ chain }: { chain: ChainMetric }) {
  return (
    <div className="chart-panel glass p-5">
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-app-line pb-3">
        <h2 className="text-xl font-black uppercase text-app-text">Suspicious Wallet Growth</h2>
        <span className="accent-stamp inline-flex items-center gap-1.5 border-[3px] border-app-line px-2.5 py-1 text-xs font-black uppercase">
          <Bot size={13} strokeWidth={2.5} />
          flagged
        </span>
      </div>
      <ResponsiveContainer width="100%" height={270}>
        <LineChart data={chain.suspiciousWalletGrowth} margin={{ top: 20, right: 12, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgb(var(--color-line))" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="date" stroke="rgb(var(--color-muted))" />
          <YAxis stroke="rgb(var(--color-muted))" tickFormatter={(value) => formatNumber(Number(value))} width={78} />
          <Tooltip
            formatter={(value) => formatNumber(Number(value))}
            contentStyle={{
              background: "rgb(var(--color-surface))",
              border: "3px solid rgb(var(--color-line))",
              borderRadius: 0,
              color: "rgb(var(--color-text))"
            }}
          />
          <Line type="monotone" dataKey="wallets" stroke="#d71920" strokeWidth={4} dot={{ r: 4, strokeWidth: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HumanActivityTrendChart({ chain }: { chain: ChainMetric }) {
  return (
    <div className="chart-panel glass p-5">
      <h2 className="border-b-[3px] border-app-line pb-3 text-xl font-black uppercase text-app-text">Human Activity Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chain.humanTrend} margin={{ top: 20, right: 12, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgb(var(--color-line))" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="date" stroke="rgb(var(--color-muted))" />
          <YAxis stroke="rgb(var(--color-muted))" tickFormatter={(value) => `${value}%`} width={42} />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              background: "rgb(var(--color-surface))",
              border: "3px solid rgb(var(--color-line))",
              borderRadius: 0,
              color: "rgb(var(--color-text))"
            }}
          />
          <Line type="monotone" dataKey="humanShare" stroke="#050505" strokeWidth={4} dot={{ r: 4, strokeWidth: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
