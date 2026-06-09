"use client";

import { Bot } from "lucide-react";
import type { ChainMetric } from "@/lib/types";

export function BotHumanChart({ chain }: { chain: ChainMetric }) {
  const data = [
    { name: "BOT ACTIVITY", value: chain.botActivityPercentage, color: "bg-app-accent", robot: true },
    { name: "HUMAN ACTIVITY", value: chain.humanActivityPercentage, color: "bg-app-text", robot: false }
  ];

  return (
    <div className="chart-panel glass p-5">
      <h2 className="border-b-[3px] border-app-line pb-3 text-xl font-black uppercase text-app-text">
        Bot vs Human Activity
      </h2>
      <div className="mt-6 space-y-5">
        {data.map((item) => (
          <div key={item.name} className="border-[3px] border-app-line bg-app-surface p-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-4xl font-black leading-none text-app-text">{item.value}%</p>
                <p className="mt-2 text-xs font-black uppercase text-app-muted">{item.name}</p>
              </div>
              {item.robot ? (
                <span className="accent-stamp border-[3px] border-app-line px-2 py-1 text-xs font-black">
                  <Bot size={14} strokeWidth={2.5} />
                </span>
              ) : null}
            </div>
            <div className="mt-3 h-6 border-[3px] border-app-line bg-app-elevated">
              <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
