"use client";

import { motion } from "framer-motion";
import { getScoreLevel } from "@/lib/scoring";
import { clamp, cn } from "@/lib/utils";

type DeadnessScoreGaugeProps = {
  score: number;
  botLikePercentage: number;
  size?: "sm" | "md" | "lg";
};

export function DeadnessScoreGauge({ score, botLikePercentage, size = "md" }: DeadnessScoreGaugeProps) {
  const normalized = clamp(botLikePercentage);
  const label = getScoreLevel(score);

  return (
    <div className="w-full max-w-full border-[3px] border-app-line bg-app-surface p-3">
      <div className="relative min-h-[62px]">
        <div className="min-w-0">
          <p
            className={cn(
              "editorial-heading font-black uppercase leading-none text-app-text",
              size === "lg" ? "text-5xl sm:text-6xl" : size === "sm" ? "text-3xl" : "text-4xl"
            )}
          >
            {Math.round(botLikePercentage)}%
          </p>
        </div>
        {label !== "Watchlist" ? (
          <span className="accent-stamp absolute right-0 top-0 max-w-[136px] border-[3px] border-app-line px-1.5 py-1 text-center text-[10px] font-black uppercase leading-none sm:text-xs">
            {label}
          </span>
        ) : null}
      </div>
      <div className="mt-3 h-4 border-[3px] border-app-line bg-app-elevated">
        <motion.div
          className="h-full bg-app-accent"
          initial={false}
          animate={{ width: `${normalized}%` }}
          style={{ width: `${normalized}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
