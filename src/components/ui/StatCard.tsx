import { GlowCard } from "./GlowCard";
import {
  AlertTriangle,
  Ship,
  Waves,
  Activity,
  WifiOff,
  Flag,
  Plus,
  Clock,
  CircleDot,
  Target,
  Bell,
  CheckCircle2,
} from "lucide-react";
import type { StatCardData } from "../../types";

const iconMap: Record<StatCardData["icon"], typeof AlertTriangle> = {
  warning: AlertTriangle,
  vessel: Ship,
  wave: Waves,
  pulse: Activity,
  dark: WifiOff,
  flag: Flag,
  plus: Plus,
  clock: Clock,
  particles: CircleDot,
  target: Target,
  bell: Bell,
  check: CheckCircle2,
};

const accentColor: Record<NonNullable<StatCardData["accent"]>, string> = {
  teal: "text-teal",
  red: "text-red",
  amber: "text-amber",
  default: "text-text",
};

export function StatCard({ label, value, unit, delta, accent = "default", icon }: StatCardData) {
  const Icon = iconMap[icon];
  const glowType = accent === "red" ? "red" : accent === "teal" ? "cyan" : "subtle";

  return (
    <GlowCard glowColor={glowType} className="px-4 py-3.5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-wider text-text-faint font-mono font-semibold uppercase">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-teal/80" />
        </div>
      </div>
      <div className={`text-[26px] font-extrabold flex items-baseline gap-1.5 tracking-tight ${accentColor[accent]}`}>
        {value}
        {unit && <small className="text-[12px] font-mono font-medium text-text-muted">{unit}</small>}
        {delta && (
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-teal-wash text-teal border border-teal/20 ml-auto">
            {delta}
          </span>
        )}
      </div>
    </GlowCard>
  );
}
