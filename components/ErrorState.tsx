import { Bot } from "lucide-react";

export function ErrorState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="glass p-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center border-[3px] border-app-line bg-app-elevated text-3xl shadow-[4px_4px_0_#000]">
        <Bot className="animate-robot-blink" size={28} strokeWidth={2.5} />
      </span>
      <h2 className="mt-4 text-xl font-black uppercase text-app-text">{title}</h2>
      <p className="mt-2 text-app-muted">{copy}</p>
    </div>
  );
}
