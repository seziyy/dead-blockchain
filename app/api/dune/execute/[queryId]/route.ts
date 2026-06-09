import { NextRequest, NextResponse } from "next/server";
import {
  DuneConfigurationError,
  DuneQueryIdError,
  executeQueryAndWait,
  isDuneConfigured
} from "@/lib/dune";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await context.params;
  const body = await request.json().catch(() => null);
  const params = new URLSearchParams(request.nextUrl.searchParams);

  if (body && typeof body === "object" && "query_parameters" in body) {
    const queryParameters = (body as { query_parameters?: Record<string, unknown> }).query_parameters;

    if (queryParameters) {
      Object.entries(queryParameters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((entry) => params.append(key, String(entry)));
        } else if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
  }

  try {
    const data = await executeQueryAndWait(queryId, params);

    return NextResponse.json({
      ok: true,
      mode: "execute",
      queryId,
      configured: isDuneConfigured(),
      data
    });
  } catch (error) {
    const isSetupError = error instanceof DuneConfigurationError;
    const isQueryIdError = error instanceof DuneQueryIdError;

    return NextResponse.json(
      {
        ok: false,
        mode: "execute",
        queryId,
        configured: isDuneConfigured(),
        error: error instanceof Error ? error.message : "Unknown Dune API error."
      },
      { status: isSetupError ? 503 : isQueryIdError ? 400 : 502 }
    );
  }
}
