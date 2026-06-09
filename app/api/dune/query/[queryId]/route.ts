import { NextRequest, NextResponse } from "next/server";
import {
  DuneConfigurationError,
  DuneQueryIdError,
  getLatestQueryResult,
  isDuneConfigured
} from "@/lib/dune";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await context.params;

  try {
    const data = await getLatestQueryResult(queryId, request.nextUrl.searchParams);

    return NextResponse.json({
      ok: true,
      mode: "latest",
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
        mode: "latest",
        queryId,
        configured: isDuneConfigured(),
        error: error instanceof Error ? error.message : "Unknown Dune API error."
      },
      { status: isSetupError ? 503 : isQueryIdError ? 400 : 502 }
    );
  }
}
