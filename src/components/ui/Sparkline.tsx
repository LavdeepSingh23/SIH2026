export function Sparkline({ values, color = "#35d6c4" }: { values: number[]; color?: string }) {
  const w = 200;
  const h = 26;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" className="mt-2">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.6} />
    </svg>
  );
}
