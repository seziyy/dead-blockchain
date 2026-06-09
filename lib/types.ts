export type ChainStatus =
  | "Alive"
  | "Mixed Activity"
  | "Bot-Dominated"
  | "Mostly Dead";

export type ScoreLevel =
  | "Mostly Human"
  | "Mixed Activity"
  | "Bot-Heavy"
  | "Dead Chain Signal";

export type ChainMetric = {
  slug: string;
  name: string;
  ticker: string;
  accent: string;
  totalTransactions: number;
  botActivityPercentage: number;
  humanActivityPercentage: number;
  activeWallets: number;
  suspiciousWallets: number;
  mevSignal: number;
  deadnessScore: number;
  status: ChainStatus;
  dailyTransactions: Array<{ date: string; transactions: number; bot: number; human: number }>;
  suspiciousWalletGrowth: Array<{ date: string; wallets: number }>;
  botHumanSeries: Array<{ name: string; bot: number; human: number }>;
  behaviorPatterns: Array<{ pattern: string; signal: string; score: number }>;
  automatedContracts: Array<{ contract: string; category: string; automatedShare: number; interactions: number }>;
  humanTrend: Array<{ date: string; humanShare: number }>;
  flaggedReasons: string[];
  scoringSignals: {
    frequency: number;
    repetition: number;
    mev: number;
    sybil: number;
    contractInteraction: number;
    lowBalanceHighActivity: number;
    governancePlaceholder: number;
  };
};

export type DuneQueryGroup = {
  botActivity: string;
  suspiciousWallets: string;
  mevActivity: string;
};
