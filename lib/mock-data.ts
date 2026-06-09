import type { ChainMetric } from "@/lib/types";
import { calculateDeadnessScore, getStatus } from "@/lib/scoring";

const baseDates = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function makeChain(input: Omit<ChainMetric, "humanActivityPercentage" | "deadnessScore" | "status" | "botHumanSeries">): ChainMetric {
  const suspiciousWalletPercentage = (input.suspiciousWallets / input.activeWallets) * 100;
  const deadnessScore = Math.round(
    calculateDeadnessScore({
      botActivityPercentage: input.botActivityPercentage,
      suspiciousWalletPercentage,
      lowGovernanceOrSocialActivityPlaceholder: input.scoringSignals.governancePlaceholder
    })
  );

  return {
    ...input,
    humanActivityPercentage: 100 - input.botActivityPercentage,
    deadnessScore,
    status: getStatus(deadnessScore),
    botHumanSeries: [
      { name: "Bot", bot: input.botActivityPercentage, human: 0 },
      { name: "Human", bot: 0, human: 100 - input.botActivityPercentage }
    ]
  };
}

function transactions(seed: number, botShare: number) {
  return baseDates.map((date, index) => {
    const transactionsValue = Math.round(seed * (1 + index * 0.075));
    return {
      date,
      transactions: transactionsValue,
      bot: Math.round(transactionsValue * (botShare / 100)),
      human: Math.round(transactionsValue * (1 - botShare / 100))
    };
  });
}

function suspicious(seed: number) {
  return baseDates.map((date, index) => ({
    date,
    wallets: Math.round(seed * (1 + index * 0.18))
  }));
}

function humanTrend(start: number) {
  return baseDates.map((date, index) => ({
    date,
    humanShare: Math.max(10, Math.round(start - index * 2.6))
  }));
}

export const chains: ChainMetric[] = [
  makeChain({
    slug: "ethereum",
    name: "Ethereum",
    ticker: "ETH",
    accent: "#39e6ff",
    totalTransactions: 2534000000,
    botActivityPercentage: 43,
    activeWallets: 7420000,
    suspiciousWallets: 1260000,
    mevSignal: 68,
    dailyTransactions: transactions(1140000, 43),
    suspiciousWalletGrowth: suspicious(780000),
    behaviorPatterns: [
      { pattern: "Backrun and sandwich clusters", signal: "MEV", score: 82 },
      { pattern: "High-frequency DEX routing", signal: "Arbitrage", score: 71 },
      { pattern: "Repeated contract touches", signal: "Automation", score: 64 }
    ],
    automatedContracts: [
      { contract: "0xdef1...route", category: "DEX router", automatedShare: 62, interactions: 12600000 },
      { contract: "0xmev0...relay", category: "MEV relay", automatedShare: 78, interactions: 4300000 },
      { contract: "0xbrid...gate", category: "Bridge", automatedShare: 41, interactions: 2100000 }
    ],
    humanTrend: humanTrend(61),
    flaggedReasons: [
      "MEV and arbitrage patterns are persistent around DEX activity.",
      "High transaction count does not always mean human usage.",
      "Human share remains meaningful, but automation shapes a large part of settlement flow."
    ],
    scoringSignals: {
      frequency: 58,
      repetition: 49,
      mev: 78,
      sybil: 36,
      contractInteraction: 53,
      lowBalanceHighActivity: 42,
      governancePlaceholder: 28
    }
  }),
  makeChain({
    slug: "solana",
    name: "Solana",
    ticker: "SOL",
    accent: "#6dff9f",
    totalTransactions: 61800000000,
    botActivityPercentage: 62,
    activeWallets: 11900000,
    suspiciousWallets: 3180000,
    mevSignal: 57,
    dailyTransactions: transactions(8400000, 62),
    suspiciousWalletGrowth: suspicious(1690000),
    behaviorPatterns: [
      { pattern: "Low-fee repetitive swaps", signal: "Spam", score: 76 },
      { pattern: "Burst timing across wallet sets", signal: "Sybil", score: 72 },
      { pattern: "Compute-heavy routing loops", signal: "Automation", score: 67 }
    ],
    automatedContracts: [
      { contract: "JUP6...swap", category: "Aggregator", automatedShare: 69, interactions: 28400000 },
      { contract: "MEVx...bot", category: "MEV", automatedShare: 74, interactions: 9200000 },
      { contract: "Brdg...spam", category: "Bridge", automatedShare: 58, interactions: 6300000 }
    ],
    humanTrend: humanTrend(48),
    flaggedReasons: [
      "Very high throughput makes repetitive low-value behavior hard to separate from organic activity.",
      "Many wallets show synchronized timing and similar contract paths.",
      "Automation is not always bad. But invisible automation changes the meaning of adoption."
    ],
    scoringSignals: {
      frequency: 79,
      repetition: 73,
      mev: 61,
      sybil: 68,
      contractInteraction: 65,
      lowBalanceHighActivity: 70,
      governancePlaceholder: 44
    }
  }),
  makeChain({
    slug: "base",
    name: "Base",
    ticker: "BASE",
    accent: "#4f7dff",
    totalTransactions: 1890000000,
    botActivityPercentage: 58,
    activeWallets: 6100000,
    suspiciousWallets: 1930000,
    mevSignal: 52,
    dailyTransactions: transactions(2190000, 58),
    suspiciousWalletGrowth: suspicious(820000),
    behaviorPatterns: [
      { pattern: "Airdrop farming loops", signal: "Farming", score: 79 },
      { pattern: "Bridge-in, swap, bridge-out", signal: "Bridge spam", score: 68 },
      { pattern: "Fresh wallets funded together", signal: "Sybil", score: 74 }
    ],
    automatedContracts: [
      { contract: "0xbase...mint", category: "Mint", automatedShare: 66, interactions: 8100000 },
      { contract: "0xswap...farm", category: "DEX", automatedShare: 63, interactions: 7400000 },
      { contract: "0xair...drop", category: "Campaign", automatedShare: 72, interactions: 4900000 }
    ],
    humanTrend: humanTrend(52),
    flaggedReasons: [
      "Airdrop-style behavior creates a wide band of wallet activity with low balances.",
      "Repeated campaign interactions are clustered around the same time windows.",
      "Dead does not mean inactive. Dead means human presence is no longer dominant."
    ],
    scoringSignals: {
      frequency: 68,
      repetition: 71,
      mev: 48,
      sybil: 73,
      contractInteraction: 62,
      lowBalanceHighActivity: 69,
      governancePlaceholder: 38
    }
  }),
  makeChain({
    slug: "arbitrum",
    name: "Arbitrum",
    ticker: "ARB",
    accent: "#28a0ff",
    totalTransactions: 1520000000,
    botActivityPercentage: 49,
    activeWallets: 4380000,
    suspiciousWallets: 1030000,
    mevSignal: 47,
    dailyTransactions: transactions(1430000, 49),
    suspiciousWalletGrowth: suspicious(540000),
    behaviorPatterns: [
      { pattern: "DEX route repetition", signal: "Arbitrage", score: 58 },
      { pattern: "Protocol incentive loops", signal: "Farming", score: 63 },
      { pattern: "Bridge churn wallets", signal: "Bridge spam", score: 54 }
    ],
    automatedContracts: [
      { contract: "0xarb...swap", category: "DEX", automatedShare: 54, interactions: 5100000 },
      { contract: "0xarb...bridge", category: "Bridge", automatedShare: 49, interactions: 2800000 },
      { contract: "0xarb...farm", category: "Incentives", automatedShare: 61, interactions: 2600000 }
    ],
    humanTrend: humanTrend(57),
    flaggedReasons: [
      "Automation is visible in repeated incentive and DEX paths.",
      "Suspicious wallet share is meaningful but not dominant.",
      "The score is held below critical because organic application usage remains broad."
    ],
    scoringSignals: {
      frequency: 55,
      repetition: 58,
      mev: 45,
      sybil: 49,
      contractInteraction: 52,
      lowBalanceHighActivity: 51,
      governancePlaceholder: 30
    }
  }),
  makeChain({
    slug: "optimism",
    name: "Optimism",
    ticker: "OP",
    accent: "#ff4f6d",
    totalTransactions: 994000000,
    botActivityPercentage: 46,
    activeWallets: 3020000,
    suspiciousWallets: 680000,
    mevSignal: 39,
    dailyTransactions: transactions(980000, 46),
    suspiciousWalletGrowth: suspicious(360000),
    behaviorPatterns: [
      { pattern: "Quest repetition", signal: "Farming", score: 55 },
      { pattern: "Low balance sequencer churn", signal: "Automation", score: 51 },
      { pattern: "Bridge timing clusters", signal: "Bridge spam", score: 47 }
    ],
    automatedContracts: [
      { contract: "0xopti...quest", category: "Campaign", automatedShare: 57, interactions: 3100000 },
      { contract: "0xopti...dex", category: "DEX", automatedShare: 44, interactions: 1900000 },
      { contract: "0xopti...nft", category: "Mint", automatedShare: 39, interactions: 1200000 }
    ],
    humanTrend: humanTrend(60),
    flaggedReasons: [
      "Campaign and quest behavior produce automation-like repetition.",
      "MEV signal is lower than major settlement chains.",
      "The result is mixed rather than clearly bot-dominated."
    ],
    scoringSignals: {
      frequency: 51,
      repetition: 54,
      mev: 37,
      sybil: 46,
      contractInteraction: 48,
      lowBalanceHighActivity: 49,
      governancePlaceholder: 26
    }
  }),
  makeChain({
    slug: "polygon",
    name: "Polygon",
    ticker: "POL",
    accent: "#a855f7",
    totalTransactions: 4930000000,
    botActivityPercentage: 67,
    activeWallets: 9240000,
    suspiciousWallets: 3820000,
    mevSignal: 42,
    dailyTransactions: transactions(3650000, 67),
    suspiciousWalletGrowth: suspicious(2140000),
    behaviorPatterns: [
      { pattern: "Very low value high frequency calls", signal: "Spam", score: 84 },
      { pattern: "Repeated NFT and game contract touches", signal: "Automation", score: 72 },
      { pattern: "Batch-funded wallets", signal: "Sybil", score: 78 }
    ],
    automatedContracts: [
      { contract: "0xpoly...game", category: "Game", automatedShare: 76, interactions: 18600000 },
      { contract: "0xpoly...mint", category: "Mint", automatedShare: 81, interactions: 12400000 },
      { contract: "0xpoly...bridge", category: "Bridge", automatedShare: 63, interactions: 5900000 }
    ],
    humanTrend: humanTrend(44),
    flaggedReasons: [
      "Low-cost execution enables high-volume repetitive activity.",
      "Suspicious wallet growth is rising faster than active wallet growth.",
      "The chain is active, but much of the observable activity looks automated."
    ],
    scoringSignals: {
      frequency: 86,
      repetition: 78,
      mev: 39,
      sybil: 79,
      contractInteraction: 72,
      lowBalanceHighActivity: 82,
      governancePlaceholder: 53
    }
  }),
  makeChain({
    slug: "bnb",
    name: "BNB Chain",
    ticker: "BNB",
    accent: "#ffd166",
    totalTransactions: 8120000000,
    botActivityPercentage: 72,
    activeWallets: 10100000,
    suspiciousWallets: 4680000,
    mevSignal: 63,
    dailyTransactions: transactions(5280000, 72),
    suspiciousWalletGrowth: suspicious(2740000),
    behaviorPatterns: [
      { pattern: "Low balance wallet factories", signal: "Sybil", score: 86 },
      { pattern: "Same-contract farming cycles", signal: "Farming", score: 81 },
      { pattern: "Fast arbitrage loops", signal: "MEV", score: 70 }
    ],
    automatedContracts: [
      { contract: "0xbnb...farm", category: "Yield", automatedShare: 82, interactions: 22100000 },
      { contract: "0xbnb...router", category: "DEX", automatedShare: 74, interactions: 17600000 },
      { contract: "0xbnb...launch", category: "Launchpad", automatedShare: 69, interactions: 6800000 }
    ],
    humanTrend: humanTrend(39),
    flaggedReasons: [
      "Large clusters of low-balance wallets repeat the same contract paths.",
      "MEV, arbitrage, and farming signatures overlap in daily volume.",
      "This score is an estimate based on on-chain behavior patterns."
    ],
    scoringSignals: {
      frequency: 88,
      repetition: 84,
      mev: 64,
      sybil: 86,
      contractInteraction: 78,
      lowBalanceHighActivity: 83,
      governancePlaceholder: 60
    }
  }),
  makeChain({
    slug: "sui",
    name: "Sui",
    ticker: "SUI",
    accent: "#4da2ff",
    totalTransactions: 3860000000,
    botActivityPercentage: 61,
    activeWallets: 4820000,
    suspiciousWallets: 1490000,
    mevSignal: 31,
    dailyTransactions: transactions(2580000, 61),
    suspiciousWalletGrowth: suspicious(760000),
    behaviorPatterns: [
      { pattern: "Sponsored transaction bursts", signal: "Automation", score: 71 },
      { pattern: "Airdrop route repetition", signal: "Farming", score: 74 },
      { pattern: "Object churn across wallet clusters", signal: "Sybil", score: 66 }
    ],
    automatedContracts: [
      { contract: "0xsui...swap", category: "DEX", automatedShare: 62, interactions: 8200000 },
      { contract: "0xsui...mint", category: "Mint", automatedShare: 69, interactions: 6100000 },
      { contract: "0xsui...quest", category: "Campaign", automatedShare: 73, interactions: 4200000 }
    ],
    humanTrend: humanTrend(49),
    flaggedReasons: [
      "Low-cost execution and sponsored flows can make repeated wallet behavior look larger than human adoption.",
      "Campaign and mint routes show clustered timing across wallet sets.",
      "Object-centric activity needs careful filtering before treating raw transaction counts as human demand."
    ],
    scoringSignals: {
      frequency: 72,
      repetition: 70,
      mev: 29,
      sybil: 68,
      contractInteraction: 63,
      lowBalanceHighActivity: 71,
      governancePlaceholder: 41
    }
  }),
  makeChain({
    slug: "monad",
    name: "Monad",
    ticker: "MON",
    accent: "#ff4fd8",
    totalTransactions: 128000000,
    botActivityPercentage: 55,
    activeWallets: 940000,
    suspiciousWallets: 260000,
    mevSignal: 34,
    dailyTransactions: transactions(420000, 55),
    suspiciousWalletGrowth: suspicious(126000),
    behaviorPatterns: [
      { pattern: "Testnet campaign loops", signal: "Farming", score: 69 },
      { pattern: "Faucet-funded repetition", signal: "Sybil", score: 73 },
      { pattern: "Same timing wallet batches", signal: "Automation", score: 66 }
    ],
    automatedContracts: [
      { contract: "test...swap", category: "Testnet DEX", automatedShare: 61, interactions: 1700000 },
      { contract: "test...mint", category: "Mint", automatedShare: 67, interactions: 1120000 },
      { contract: "test...bridge", category: "Bridge", automatedShare: 48, interactions: 620000 }
    ],
    humanTrend: humanTrend(53),
    flaggedReasons: [
      "Placeholder/testnet-ready profile: campaign behavior can overstate adoption.",
      "Faucet-funded wallets often share timing and route similarities.",
      "Replace mock query IDs when mainnet or official analytics become available."
    ],
    scoringSignals: {
      frequency: 64,
      repetition: 70,
      mev: 31,
      sybil: 74,
      contractInteraction: 57,
      lowBalanceHighActivity: 76,
      governancePlaceholder: 42
    }
  }),
  makeChain({
    slug: "avalanche",
    name: "Avalanche",
    ticker: "AVAX",
    accent: "#ff4d4d",
    totalTransactions: 1460000000,
    botActivityPercentage: 48,
    activeWallets: 2760000,
    suspiciousWallets: 690000,
    mevSignal: 44,
    dailyTransactions: transactions(870000, 48),
    suspiciousWalletGrowth: suspicious(340000),
    behaviorPatterns: [
      { pattern: "Subnet and bridge cycling", signal: "Bridge spam", score: 55 },
      { pattern: "DEX arbitrage repetition", signal: "Arbitrage", score: 57 },
      { pattern: "Incentive route loops", signal: "Farming", score: 59 }
    ],
    automatedContracts: [
      { contract: "0xavax...swap", category: "DEX", automatedShare: 52, interactions: 2800000 },
      { contract: "0xavax...bridge", category: "Bridge", automatedShare: 49, interactions: 1700000 },
      { contract: "0xavax...farm", category: "Incentives", automatedShare: 58, interactions: 1300000 }
    ],
    humanTrend: humanTrend(58),
    flaggedReasons: [
      "Automation is visible around DEX and bridge paths, but the profile is still mixed.",
      "Suspicious wallets are concentrated in incentive and cross-chain routes.",
      "Human share remains meaningful across broader application usage."
    ],
    scoringSignals: {
      frequency: 54,
      repetition: 57,
      mev: 43,
      sybil: 50,
      contractInteraction: 51,
      lowBalanceHighActivity: 52,
      governancePlaceholder: 29
    }
  }),
  makeChain({
    slug: "aptos",
    name: "Aptos",
    ticker: "APT",
    accent: "#8cffd2",
    totalTransactions: 2860000000,
    botActivityPercentage: 59,
    activeWallets: 3960000,
    suspiciousWallets: 1240000,
    mevSignal: 28,
    dailyTransactions: transactions(1940000, 59),
    suspiciousWalletGrowth: suspicious(640000),
    behaviorPatterns: [
      { pattern: "Campaign-funded wallet loops", signal: "Farming", score: 72 },
      { pattern: "Repeated module calls", signal: "Automation", score: 65 },
      { pattern: "Timing-synchronized wallets", signal: "Sybil", score: 70 }
    ],
    automatedContracts: [
      { contract: "apt...swap", category: "DEX", automatedShare: 61, interactions: 6200000 },
      { contract: "apt...mint", category: "Mint", automatedShare: 66, interactions: 3900000 },
      { contract: "apt...quest", category: "Campaign", automatedShare: 74, interactions: 3200000 }
    ],
    humanTrend: humanTrend(51),
    flaggedReasons: [
      "Quest and campaign paths create repeated module-call signatures.",
      "Suspicious wallet clusters often share funding and timing patterns.",
      "MEV is lower than EVM-heavy settlement chains, but sybil-like behavior is prominent."
    ],
    scoringSignals: {
      frequency: 69,
      repetition: 67,
      mev: 27,
      sybil: 72,
      contractInteraction: 61,
      lowBalanceHighActivity: 70,
      governancePlaceholder: 39
    }
  }),
  makeChain({
    slug: "zksync",
    name: "zkSync",
    ticker: "ZK",
    accent: "#9aa8ff",
    totalTransactions: 912000000,
    botActivityPercentage: 66,
    activeWallets: 3580000,
    suspiciousWallets: 1560000,
    mevSignal: 36,
    dailyTransactions: transactions(920000, 66),
    suspiciousWalletGrowth: suspicious(840000),
    behaviorPatterns: [
      { pattern: "Airdrop eligibility farming", signal: "Farming", score: 84 },
      { pattern: "Bridge and swap loops", signal: "Bridge spam", score: 73 },
      { pattern: "Low-balance wallet clusters", signal: "Sybil", score: 78 }
    ],
    automatedContracts: [
      { contract: "0xzk...bridge", category: "Bridge", automatedShare: 71, interactions: 5200000 },
      { contract: "0xzk...swap", category: "DEX", automatedShare: 68, interactions: 4600000 },
      { contract: "0xzk...mint", category: "Mint", automatedShare: 76, interactions: 2900000 }
    ],
    humanTrend: humanTrend(45),
    flaggedReasons: [
      "Airdrop-era behavior creates a large band of low-balance repeated wallet activity.",
      "Bridge-in, swap, and bridge-out sequences appear across clustered wallets.",
      "Automation-like activity is high enough to dominate the current mock profile."
    ],
    scoringSignals: {
      frequency: 78,
      repetition: 80,
      mev: 35,
      sybil: 79,
      contractInteraction: 68,
      lowBalanceHighActivity: 82,
      governancePlaceholder: 51
    }
  }),
  makeChain({
    slug: "linea",
    name: "Linea",
    ticker: "LINEA",
    accent: "#5cff9d",
    totalTransactions: 724000000,
    botActivityPercentage: 63,
    activeWallets: 3120000,
    suspiciousWallets: 1210000,
    mevSignal: 32,
    dailyTransactions: transactions(790000, 63),
    suspiciousWalletGrowth: suspicious(610000),
    behaviorPatterns: [
      { pattern: "L2 campaign repetition", signal: "Farming", score: 77 },
      { pattern: "Bridge-funded wallet batches", signal: "Sybil", score: 74 },
      { pattern: "Same-route DEX touches", signal: "Automation", score: 68 }
    ],
    automatedContracts: [
      { contract: "0xlin...bridge", category: "Bridge", automatedShare: 67, interactions: 4100000 },
      { contract: "0xlin...swap", category: "DEX", automatedShare: 63, interactions: 3300000 },
      { contract: "0xlin...quest", category: "Campaign", automatedShare: 75, interactions: 2600000 }
    ],
    humanTrend: humanTrend(47),
    flaggedReasons: [
      "Campaign and bridge paths show a high repeat rate across related wallet sets.",
      "Low-balance wallets remain active beyond typical human session shapes.",
      "The mock profile treats campaign farming as a major automation source."
    ],
    scoringSignals: {
      frequency: 74,
      repetition: 76,
      mev: 31,
      sybil: 75,
      contractInteraction: 64,
      lowBalanceHighActivity: 77,
      governancePlaceholder: 46
    }
  }),
  makeChain({
    slug: "scroll",
    name: "Scroll",
    ticker: "SCR",
    accent: "#ffb84d",
    totalTransactions: 468000000,
    botActivityPercentage: 57,
    activeWallets: 2280000,
    suspiciousWallets: 770000,
    mevSignal: 30,
    dailyTransactions: transactions(520000, 57),
    suspiciousWalletGrowth: suspicious(370000),
    behaviorPatterns: [
      { pattern: "Quest route repetition", signal: "Farming", score: 69 },
      { pattern: "Bridge timing clusters", signal: "Bridge spam", score: 66 },
      { pattern: "Fresh wallet contract touches", signal: "Sybil", score: 68 }
    ],
    automatedContracts: [
      { contract: "0xscr...bridge", category: "Bridge", automatedShare: 61, interactions: 2300000 },
      { contract: "0xscr...swap", category: "DEX", automatedShare: 58, interactions: 1900000 },
      { contract: "0xscr...mint", category: "Mint", automatedShare: 66, interactions: 1500000 }
    ],
    humanTrend: humanTrend(52),
    flaggedReasons: [
      "Bridge and quest behavior produces automation-like repetition.",
      "Suspicious wallet share is meaningful but below the most severe L2 profiles.",
      "The profile remains bot-heavy without crossing into the highest deadness band."
    ],
    scoringSignals: {
      frequency: 67,
      repetition: 68,
      mev: 29,
      sybil: 69,
      contractInteraction: 59,
      lowBalanceHighActivity: 70,
      governancePlaceholder: 40
    }
  }),
  makeChain({
    slug: "starknet",
    name: "Starknet",
    ticker: "STRK",
    accent: "#ff7ad9",
    totalTransactions: 532000000,
    botActivityPercentage: 60,
    activeWallets: 2640000,
    suspiciousWallets: 980000,
    mevSignal: 24,
    dailyTransactions: transactions(610000, 60),
    suspiciousWalletGrowth: suspicious(490000),
    behaviorPatterns: [
      { pattern: "Airdrop claim and bridge loops", signal: "Farming", score: 76 },
      { pattern: "Repeated account abstraction flows", signal: "Automation", score: 65 },
      { pattern: "Batch-funded wallet sets", signal: "Sybil", score: 72 }
    ],
    automatedContracts: [
      { contract: "0xstrk...bridge", category: "Bridge", automatedShare: 65, interactions: 2700000 },
      { contract: "0xstrk...swap", category: "DEX", automatedShare: 58, interactions: 2100000 },
      { contract: "0xstrk...claim", category: "Campaign", automatedShare: 72, interactions: 1600000 }
    ],
    humanTrend: humanTrend(50),
    flaggedReasons: [
      "Airdrop and bridge paths create repeated activity across clustered accounts.",
      "Account abstraction flows can compress many automation signals into similar transaction shapes.",
      "MEV signal is lower, while sybil-style wallet behavior is the stronger concern."
    ],
    scoringSignals: {
      frequency: 70,
      repetition: 69,
      mev: 23,
      sybil: 73,
      contractInteraction: 62,
      lowBalanceHighActivity: 72,
      governancePlaceholder: 43
    }
  }),
  makeChain({
    slug: "blast",
    name: "Blast",
    ticker: "BLAST",
    accent: "#ffe44d",
    totalTransactions: 611000000,
    botActivityPercentage: 69,
    activeWallets: 2840000,
    suspiciousWallets: 1340000,
    mevSignal: 41,
    dailyTransactions: transactions(720000, 69),
    suspiciousWalletGrowth: suspicious(690000),
    behaviorPatterns: [
      { pattern: "Points farming loops", signal: "Farming", score: 86 },
      { pattern: "Yield route repetition", signal: "Automation", score: 79 },
      { pattern: "Batch-funded fresh wallets", signal: "Sybil", score: 80 }
    ],
    automatedContracts: [
      { contract: "0xbla...yield", category: "Yield", automatedShare: 78, interactions: 4600000 },
      { contract: "0xbla...swap", category: "DEX", automatedShare: 70, interactions: 3800000 },
      { contract: "0xbla...points", category: "Campaign", automatedShare: 84, interactions: 3100000 }
    ],
    humanTrend: humanTrend(42),
    flaggedReasons: [
      "Points and yield incentives create strong repeated interaction patterns.",
      "Fresh-wallet clusters account for a high share of visible activity.",
      "The profile is active, but the mock signal is heavily automation-driven."
    ],
    scoringSignals: {
      frequency: 82,
      repetition: 84,
      mev: 40,
      sybil: 82,
      contractInteraction: 73,
      lowBalanceHighActivity: 85,
      governancePlaceholder: 57
    }
  }),
  makeChain({
    slug: "berachain",
    name: "Berachain",
    ticker: "BERA",
    accent: "#ff8a3d",
    totalTransactions: 246000000,
    botActivityPercentage: 58,
    activeWallets: 1380000,
    suspiciousWallets: 420000,
    mevSignal: 35,
    dailyTransactions: transactions(430000, 58),
    suspiciousWalletGrowth: suspicious(210000),
    behaviorPatterns: [
      { pattern: "Testnet and prelaunch loops", signal: "Farming", score: 72 },
      { pattern: "Liquidity route repetition", signal: "Automation", score: 64 },
      { pattern: "Faucet-adjacent wallet batches", signal: "Sybil", score: 70 }
    ],
    automatedContracts: [
      { contract: "bera...swap", category: "DEX", automatedShare: 60, interactions: 1500000 },
      { contract: "bera...vault", category: "Yield", automatedShare: 64, interactions: 980000 },
      { contract: "bera...quest", category: "Campaign", automatedShare: 71, interactions: 860000 }
    ],
    humanTrend: humanTrend(52),
    flaggedReasons: [
      "Prelaunch and campaign behavior can make automation look like early demand.",
      "Repeated liquidity and quest routes appear across related wallet clusters.",
      "Replace mock values as official mainnet analytics mature."
    ],
    scoringSignals: {
      frequency: 67,
      repetition: 69,
      mev: 34,
      sybil: 71,
      contractInteraction: 58,
      lowBalanceHighActivity: 73,
      governancePlaceholder: 42
    }
  })
];

export const explanationCards = [
  {
    title: "Bot Transactions",
    copy: "High-frequency activity that repeats the same transaction shape across short windows."
  },
  {
    title: "Sybil Wallets",
    copy: "Wallet clusters funded together, timed together, or behaving like one operator."
  },
  {
    title: "MEV Activity",
    copy: "Backruns, sandwiches, and arbitrage loops that react faster than people can."
  },
  {
    title: "Airdrop Farming",
    copy: "Campaign behavior designed to look like adoption while optimizing eligibility."
  },
  {
    title: "Ghost TVL",
    copy: "Capital that appears sticky but rotates through the same incentive routes."
  },
  {
    title: "Dead Communities",
    copy: "On-chain noise that keeps rising while human governance and social signals fade."
  }
];

export const methodologySignals = [
  "Wallets with extremely high transaction frequency",
  "Repetitive transaction patterns",
  "Interactions with the same contract many times",
  "Very low balance but high activity",
  "MEV or arbitrage contract interaction",
  "Bridge spam behavior",
  "Airdrop farming patterns",
  "Many wallets funded by the same source",
  "Same transaction timing across wallets",
  "Contract-created wallets with repetitive behavior"
];

export const scoringLevels = [
  { range: "0-25", label: "Mostly Human", copy: "Human presence appears dominant." },
  { range: "26-50", label: "Watchlist", copy: "Automation is visible enough to justify a closer review." },
  { range: "51-75", label: "Bot-Heavy", copy: "Automated behavior likely drives a major share." },
  { range: "76-100", label: "Dead Chain Signal", copy: "Human presence is no longer the dominant signal." }
];

export function getChain(slug: string) {
  return chains.find((chain) => chain.slug === slug);
}

export function networkAverages() {
  const totalChains = chains.length;
  return {
    averageBotShare: Math.round(
      chains.reduce((sum, chain) => sum + chain.botActivityPercentage, 0) / totalChains
    ),
    averageDeadness: Math.round(
      chains.reduce((sum, chain) => sum + chain.deadnessScore, 0) / totalChains
    ),
    totalTransactions: chains.reduce((sum, chain) => sum + chain.totalTransactions, 0),
    suspiciousWallets: chains.reduce((sum, chain) => sum + chain.suspiciousWallets, 0)
  };
}
