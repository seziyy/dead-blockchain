"use client";

import { motion } from "framer-motion";
import { getScoreLevel } from "@/lib/scoring";
import { clamp, cn } from "@/lib/utils";

type DeadnessScoreGaugeProps = {
  score: number;
  size?: "sm" | "md" | "lg";
};

export function DeadnessScoreGauge({ score, size = "md" }: DeadnessScoreGaugeProps) {
  const normalized = clamp(score);
  const label = getScoreLevel(score);

  return (
    <div className="w-full max-w-full border-[3px] border-app-line bg-app-surface p-3">
      <div className="relative min-h-[78px]">
        <div className="min-w-0">
          <p className="whitespace-nowrap text-xs font-black uppercase text-app-muted">Deadness Score</p>
          <p
            className={cn(
              "editorial-heading mt-1 font-black uppercase leading-none text-app-text",
              size === "lg" ? "text-5xl sm:text-6xl" : size === "sm" ? "text-3xl" : "text-4xl"
            )}
          >
            {Math.round(score)}
          </p>
        </div>
        <span className="accent-stamp absolute right-0 top-0 max-w-[136px] border-[3px] border-app-line px-1.5 py-1 text-center text-[10px] font-black uppercase leading-none sm:text-xs">
          {label}
        </span>
      </div>
      <div className="mt-3 h-4 border-[3px] border-app-line bg-app-elevated">
        <motion.div
          className="h-full bg-app-accent"
          initial={{ width: 0 }}
          animate={{ width: `${normalized}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 font-mono text-xs font-bold uppercase text-app-muted">
        Deadness Score: {Math.round(score)}
      </p>
    </div>
  );
}
