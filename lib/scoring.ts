import type { ChainStatus, ScoreLevel } from "@/lib/types";
import { clamp } from "@/lib/utils";

export function calculateBotScore(input: {
  frequency: number;
  repetition: number;
  mev: number;
  sybil: number;
  contractInteraction: number;
  lowBalanceHighActivity: number;
}) {
  return clamp(
    input.frequency * 0.25 +
      input.repetition * 0.2 +
      input.mev * 0.2 +
      input.sybil * 0.15 +
      input.contractInteraction * 0.1 +
      input.lowBalanceHighActivity * 0.1
  );
}

export function calculateDeadnessScore(input: {
  botActivityPercentage: number;
  suspiciousWalletPercentage: number;
  lowGovernanceOrSocialActivityPlaceholder: number;
}) {
  return clamp(
    input.botActivityPercentage * 0.6 +
      input.suspiciousWalletPercentage * 0.25 +
      input.lowGovernanceOrSocialActivityPlaceholder * 0.15
  );
}

export function getScoreLevel(score: number): ScoreLevel {
  if (score <= 25) return "Mostly Human";
  if (score <= 50) return "Mixed Activity";
  if (score <= 75) return "Bot-Heavy";
  return "Dead Chain Signal";
}

export function getStatus(score: number): ChainStatus {
  if (score <= 25) return "Alive";
  if (score <= 50) return "Mixed Activity";
  if (score <= 75) return "Bot-Dominated";
  return "Mostly Dead";
}
