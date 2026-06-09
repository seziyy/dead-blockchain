const DUNE_BASE_URL = "https://api.dune.com/api/v1";
const QUERY_ID_PLACEHOLDER = "QUERY_ID_HERE";

type DuneRequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

export type DuneExecutionStatus = {
  execution_id: string;
  state: string;
  submitted_at?: string;
  expires_at?: string;
};

export type DuneQueryResult = {
  execution_id?: string;
  query_id?: number;
  state?: string;
  result?: {
    rows?: unknown[];
    metadata?: Record<string, unknown>;
  };
  error?: string;
};

function getApiKey() {
  const apiKey = process.env.DUNE_API_KEY;

  if (!apiKey) {
    throw new DuneConfigurationError("DUNE_API_KEY is not configured.");
  }

  return apiKey;
}

export class DuneConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuneConfigurationError";
  }
}

export class DuneQueryIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuneQueryIdError";
  }
}

export function isDuneConfigured() {
  return Boolean(process.env.DUNE_API_KEY);
}

function assertQueryId(queryId: string) {
  if (!queryId || queryId === QUERY_ID_PLACEHOLDER) {
    throw new DuneQueryIdError("Replace QUERY_ID_HERE with a real Dune query id.");
  }

  if (!/^\d+$/.test(queryId)) {
    throw new DuneQueryIdError("Dune query id must be numeric.");
  }
}

async function duneFetch<T>(path: string, options: DuneRequestOptions = {}): Promise<T> {
  const response = await fetch(`${DUNE_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Dune-API-Key": getApiKey()
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : `Dune request failed with ${response.status}.`;
    throw new Error(message);
  }

  return payload as T;
}

function toSearchParams(searchParams: URLSearchParams) {
  const forwarded = new URLSearchParams();

  searchParams.forEach((value, key) => {
    forwarded.append(key, value);
  });

  const query = forwarded.toString();
  return query ? `?${query}` : "";
}

function toQueryParameters(searchParams: URLSearchParams) {
  const queryParameters: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const current = queryParameters[key];
    if (Array.isArray(current)) {
      current.push(value);
    } else if (typeof current === "string") {
      queryParameters[key] = [current, value];
    } else {
      queryParameters[key] = value;
    }
  });

  return queryParameters;
}

function isCompleted(state: string) {
  return ["QUERY_STATE_COMPLETED", "EXECUTION_STATE_COMPLETED", "COMPLETED"].includes(state);
}

function isFailed(state: string) {
  return ["QUERY_STATE_FAILED", "EXECUTION_STATE_FAILED", "FAILED", "CANCELLED"].includes(state);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getLatestQueryResult(queryId: string, searchParams: URLSearchParams) {
  assertQueryId(queryId);
  return duneFetch<DuneQueryResult>(`/query/${queryId}/results${toSearchParams(searchParams)}`);
}

export async function executeQueryAndWait(queryId: string, searchParams: URLSearchParams) {
  assertQueryId(queryId);
  const queryParameters = toQueryParameters(searchParams);
  const hasParameters = Object.keys(queryParameters).length > 0;
  const execution = await duneFetch<{ execution_id: string }>(`/query/${queryId}/execute`, {
    method: "POST",
    body: hasParameters ? { query_parameters: queryParameters } : {}
  });

  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const status = await duneFetch<DuneExecutionStatus>(
      `/execution/${execution.execution_id}/status`
    );

    if (isCompleted(status.state)) {
      return duneFetch<DuneQueryResult>(`/execution/${execution.execution_id}/results`);
    }

    if (isFailed(status.state)) {
      throw new Error(`Dune execution ${execution.execution_id} ended with ${status.state}.`);
    }

    await wait(Math.min(1200 + attempt * 450, 6000));
  }

  throw new Error(`Dune execution ${execution.execution_id} timed out while polling.`);
}
