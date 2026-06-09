"use client";

import { ErrorState } from "@/components/ErrorState";

export default function GlobalError() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <ErrorState
        title="Something stopped the analysis"
        copy="Refresh the page or check the local server logs for the failing route."
      />
    </main>
  );
}
