import { Bot } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3 border-[3px] border-app-line bg-app-surface p-4 text-app-muted shadow-[6px_6px_0_#000]">
        <span className="grid h-10 w-10 place-items-center border-[3px] border-app-line bg-app-elevated text-xl">
          <Bot className="animate-robot-blink" size={22} strokeWidth={2.5} />
        </span>
        <span className="text-sm font-black uppercase">Loading bot traces...</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="glass h-80 animate-pulse p-5">
            <div className="h-5 w-1/2 bg-app-line/80" />
            <div className="mt-6 h-24 bg-app-line/60" />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="h-16 bg-app-line/60" />
              <div className="h-16 bg-app-line/60" />
              <div className="h-16 bg-app-line/60" />
              <div className="h-16 bg-app-line/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
