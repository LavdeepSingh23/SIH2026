const legend = [
  { label: "Now", color: "#F16456" },
  { label: "+24h", color: "#E8B23D" },
  { label: "+48h", color: "#4FA3E8" },
  { label: "+72h", color: "#35D6C4" },
];

export function DriftMap() {
  return (
    <div className="relative flex-1 min-h-[380px] bg-panel-soft">
      <div className="absolute top-3.5 left-4 flex gap-3 z-10">
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-[10.5px] font-semibold text-text-muted">
            <span className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      <div className="absolute top-3.5 right-3.5 flex gap-1.5 z-10">
        <button className="px-2.5 py-1.5 text-[11px] font-bold rounded-md border border-teal-dim bg-teal-wash text-teal">
          FORWARD
        </button>
        <button className="px-2.5 py-1.5 text-[11px] font-bold rounded-md border border-border bg-panel text-text-muted">
          BACKWARD
        </button>
        <button className="px-2.5 py-1.5 text-[11px] font-bold rounded-md border border-border bg-panel text-text-muted">
          ENSEMBLE
        </button>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 900 420" className="absolute inset-0">
        <path
          d="M330,220 C350,205 380,205 395,222 C410,238 390,255 365,252 C345,250 320,238 330,220Z"
          fill="#F16456"
          opacity="0.55"
        />
        <path
          d="M320,215 C370,180 430,190 460,225 C485,255 450,290 400,285 C355,282 305,255 320,215Z"
          fill="none"
          stroke="#E8B23D"
          strokeWidth="1.4"
          opacity="0.7"
        />
        <path
          d="M300,200 C390,140 500,165 545,225 C585,278 520,330 440,325 C370,320 280,270 300,200Z"
          fill="none"
          stroke="#4FA3E8"
          strokeWidth="1.4"
          opacity="0.65"
        />
        <path
          d="M270,185 C410,90 570,130 630,220 C685,300 590,375 470,368 C370,362 235,285 270,185Z"
          fill="none"
          stroke="#35D6C4"
          strokeWidth="1.4"
          opacity="0.55"
        />
      </svg>

      <div className="absolute bottom-3.5 left-4 text-[10.5px] text-text-faint tracking-wide font-semibold z-10">
        SCALE 1:250 000 · CURRENT SOURCE: INCOIS HYCOM
      </div>
    </div>
  );
}
