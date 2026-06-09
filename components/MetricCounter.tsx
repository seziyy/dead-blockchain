"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { formatNumber } from "@/lib/utils";

type MetricCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
};

export function MetricCounter({ value, suffix = "", prefix = "" }: MetricCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${prefix}${formatNumber(latest)}${suffix}`);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.1, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}
