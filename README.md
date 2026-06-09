# Dead Blockchain Theory

A modern Next.js dashboard inspired by Dead Internet Theory. It estimates whether
blockchain activity is mostly human-driven or produced by bots, MEV systems,
sybil wallets, airdrop farmers, arbitrage agents, bridge spam, and other
automated behavior.

Positioning:

> Are blockchains alive... or just machines talking to machines?

## Stack

- Next.js 16+
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Dune Analytics API-ready server routes

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Dune API Key

Create a local env file:

```bash
cp .env.example .env.local
```

Then set:

```bash
DUNE_API_KEY=your_dune_api_key
```

The key is only read by server-side API routes. It is never exposed to frontend
components.

## Replacing Mock Query IDs

Mock data lives in [lib/mock-data.ts](./lib/mock-data.ts). Dune query IDs live
in [config/dune-queries.ts](./config/dune-queries.ts).

Replace placeholders like this:

```ts
export const DUNE_QUERIES = {
  ethereum: {
    botActivity: "1234567",
    suspiciousWallets: "2345678",
    mevActivity: "3456789"
  }
};
```

Use the proxy endpoints from the app:

- `GET /api/dune/query/[queryId]` for latest cached query results
- `POST /api/dune/execute/[queryId]` for manual execution and polling

The Dune endpoints supported internally are:

- `POST /api/v1/query/{query_id}/execute`
- `GET /api/v1/execution/{execution_id}/status`
- `GET /api/v1/execution/{execution_id}/results`
- `GET /api/v1/query/{query_id}/results`

Query parameters can be passed in the URL. For manual execution, you can also
send a JSON body:

```json
{
  "query_parameters": {
    "chain": "ethereum",
    "days": 30
  }
}
```

## Scoring Model

Bot score:

```text
bot_score =
frequency_score * 0.25 +
repetition_score * 0.20 +
mev_score * 0.20 +
sybil_score * 0.15 +
contract_interaction_score * 0.10 +
low_balance_high_activity_score * 0.10
```

Deadness score:

```text
deadness_score =
bot_activity_percentage * 0.6 +
suspicious_wallet_percentage * 0.25 +
low_governance_or_social_activity_placeholder * 0.15
```

Score levels:

- `0-25`: Mostly Human
- `26-50`: Mixed Activity
- `51-75`: Bot-Heavy
- `76-100`: Dead Chain Signal

## Product Notes

This dashboard treats bot detection as an estimate, not absolute truth.
Automation can be useful and legitimate. The purpose is to make invisible
automation visible so high transaction counts are not mistaken for human
adoption by default.

The generated hero image used by the landing page is saved at
`public/images/dead-blockchain-hero.png`.
