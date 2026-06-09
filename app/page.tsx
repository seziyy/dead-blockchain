import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-[calc(100svh-65px)] overflow-hidden bg-app-bg px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative mx-auto flex min-h-[calc(100svh-145px)] max-w-5xl items-center justify-center">
        <div className="glass w-full p-6 sm:p-10">
          <h1 className="flex max-w-full flex-col gap-4 break-words text-4xl font-black uppercase leading-[0.9] text-app-text sm:text-7xl lg:text-8xl">
            <span className="grid h-16 w-16 shrink-0 place-items-center border-[3px] border-app-line bg-app-elevated text-4xl shadow-[4px_4px_0_#000]">
              <Bot size={36} strokeWidth={2.5} />
            </span>
            <span>Dead Blockchain Theory</span>
          </h1>

          <p className="mt-6 max-w-xl border-l-[6px] border-app-line pl-4 text-base leading-7 text-app-muted sm:text-lg">
            Track estimated bot activity across blockchains.
          </p>

          <div className="mt-8">
            <Link
              href="/dashboard"
              className="focus-ring brutal-button accent-stamp inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-black"
            >
              Open Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
