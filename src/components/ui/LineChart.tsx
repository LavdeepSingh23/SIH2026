interface Series {
  points: [number, number][];
  color: string;
  dashed?: boolean;
}

export function LineChart({
  series,
  markers = [],
  leftLabel,
  rightLabel,
}: {
  series: Series[];
  markers?: { x: number; y: number; color: string }[];
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="px-4 py-3.5 flex flex-col flex-1">
      <svg width="100%" height="100%" viewBox="0 0 340 140" preserveAspectRatio="none" className="flex-1">
        <line x1="0" y1="0" x2="0" y2="140" stroke="#152a3c" />
        <line x1="0" y1="140" x2="340" y2="140" stroke="#152a3c" />
        {series.map((s, i) => (
          <polyline
            key={i}
            points={s.points.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeDasharray={s.dashed ? "3 4" : undefined}
          />
        ))}
        {markers.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r={4} fill={m.color} />
        ))}
      </svg>
      <div className="flex justify-between text-[10.5px] font-semibold text-text-faint mt-1.5">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
