"use client";

import { Search } from "lucide-react";

type ChainFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ChainFilter({ value, onChange }: ChainFilterProps) {
  return (
    <label className="focus-ring flex h-12 w-80 max-w-[calc(100%-56px)] items-center gap-2 rounded-md border-2 border-app-line bg-app-surface px-3 text-app-text shadow-[2px_2px_0_rgb(var(--color-line))] focus-within:[outline:3px_solid_rgb(var(--color-accent))] focus-within:outline-offset-4 sm:w-full sm:max-w-sm">
      <Search size={17} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="FILTER CHAINS"
        className="h-full min-w-0 flex-1 bg-transparent text-sm font-black uppercase text-app-text outline-none placeholder:text-app-muted"
      />
    </label>
  );
}
