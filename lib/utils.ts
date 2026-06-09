import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(value: number) {
  return Intl.NumberFormat("en", {
    notation: value >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000000 ? 1 : 0
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}
