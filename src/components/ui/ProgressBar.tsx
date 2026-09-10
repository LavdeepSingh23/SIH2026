const colorMap = {
  teal: "bg-teal",
  red: "bg-red",
  amber: "bg-amber",
} as const;

interface ProgressBarProps {
  percent: number;
  color?: keyof typeof colorMap;
  thin?: boolean;
}

export function ProgressBar({ percent, color = "teal", thin = false }: ProgressBarProps) {
  return (
    <div className={`w-full rounded-full bg-border-soft overflow-hidden ${thin ? "h-[5px]" : "h-1"}`}>
      <div
        className={`h-full rounded-full ${colorMap[color]}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
