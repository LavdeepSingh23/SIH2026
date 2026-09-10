import type { ReactNode } from "react";

type BadgeTone = "critical" | "elevated" | "watch" | "live" | "running" | "queued" | "synced" | "held";

const toneStyles: Record<BadgeTone, string> = {
  critical: "text-red bg-red-wash",
  elevated: "text-blue bg-blue/10",
  watch: "text-text-muted bg-border-soft",
  live: "text-teal bg-teal-wash",
  running: "text-blue bg-blue/10",
  queued: "text-amber bg-amber/10",
  synced: "text-teal bg-teal-wash",
  held: "text-red bg-red-wash",
};

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded ${toneStyles[tone]}`}>
      {children}
    </span>
  );
}
