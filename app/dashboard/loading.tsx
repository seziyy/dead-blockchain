import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-24 max-w-2xl animate-pulse border-[3px] border-app-line bg-app-surface shadow-[6px_6px_0_#000]" />
      <LoadingSkeleton />
    </main>
  );
}
