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
  return (
    <div className="bg-panel border border-border-soft rounded-xl px-4 py-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10.5px] tracking-wide text-text-faint font-semibold">{label}</span>
        <Icon className="w-[15px] h-[15px] text-text-faint" />
      </div>
      <div className={`text-[26px] font-extrabold flex items-baseline gap-1.5 ${accentColor[accent]}`}>
        {value}
        {unit && <small className="text-[12.5px] font-medium text-text-muted">{unit}</small>}
        {delta && <span className="text-xs font-semibold text-teal">{delta}</span>}
      </div>
    </div>
  );
}
