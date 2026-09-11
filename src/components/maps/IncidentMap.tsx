import { useState } from "react";
import { Compass, Ship } from "lucide-react";
import type { Incident, SuspectVessel } from "../../types";

interface IncidentMapProps {
  activeIncident: Incident;
  timeOffset: number; // -48 to +48 hours
  onSelectSuspect?: (suspect: SuspectVessel) => void;
}

export function IncidentMap({
  activeIncident,
  timeOffset,
  onSelectSuspect,
}: IncidentMapProps) {
  const [sarActive, setSarActive] = useState(true);
  const [aisActive, setAisActive] = useState(true);
  const [driftActive, setDriftActive] = useState(true);
  const [currentsActive, setCurrentsActive] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState<SuspectVessel | null>(null);

  // Dynamic Slick calculation based on timeOffset
  // At T=0, slick is at (470, 168)
  // Backtracking (timeOffset < 0): moves backwards along reverse current to release point (375, 230) at T=-18
  // Forecasting (timeOffset > 0): expands and drifts northeast towards (580, 110)
  const normTime = Math.max(-48, Math.min(48, timeOffset));
  const slickCenterX = 470 + normTime * 3.2;
  const slickCenterY = 168 - normTime * 1.6;
  const slickRadius = Math.max(8, 22 + normTime * 0.45);

  // Vessel 1 (Top Suspect) Position along track based on timeOffset
  // At T=-18h, Nordblom crosses (375, 230) where spill release happened!
  const nordblomX = 375 + (normTime + 18) * 4.8;
  const nordblomY = 230 - (normTime + 18) * 1.5;

  return (
    <div className="relative flex-1 min-h-[420px] bg-[#000000] overflow-hidden select-none flex flex-col justify-between">
      {/* Top Telemetry Overlay */}
      <div className="absolute top-3.5 left-4 flex items-center gap-3 z-20">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#05080e]/80 border border-white/[0.08] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
          </span>
          <span className="text-[10px] font-mono text-teal tracking-wider font-semibold uppercase">
            SENTINEL-1 SAR · 24 RPM SCAN
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#05080e]/80 border border-white/[0.08] text-[10px] font-mono text-text-muted backdrop-blur-md">
          <Compass className="w-3 h-3 text-teal" />
          <span>{activeIncident.lat.toFixed(3)}°N · {Math.abs(activeIncident.lon).toFixed(3)}°W</span>
          <span className="text-text-faint">|</span>
          <span className="text-white font-semibold">{activeIncident.region}</span>
        </div>
      </div>

      {/* Layer Toggles Floating Dock (21st.dev style) */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-20">
        <button
          type="button"
          onClick={() => setSarActive(!sarActive)}
          className={`px-2.5 py-1 text-[10.5px] font-mono font-bold rounded-md border transition-all cursor-pointer ${
            sarActive
              ? "border-teal/50 bg-teal-wash text-teal shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              : "border-white/[0.08] bg-[#05080e]/80 text-text-faint hover:text-white"
          }`}
          title="Toggle Sentinel-1 Synthetic Aperture Radar"
        >
          SAR
        </button>
        <button
          type="button"
          onClick={() => setAisActive(!aisActive)}
          className={`px-2.5 py-1 text-[10.5px] font-mono font-bold rounded-md border transition-all cursor-pointer ${
            aisActive
              ? "border-teal/50 bg-teal-wash text-teal shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              : "border-white/[0.08] bg-[#05080e]/80 text-text-faint hover:text-white"
          }`}
          title="Toggle AIS Vessel Tracking & Dark Fleet Detection"
        >
          AIS
        </button>
        <button
          type="button"
          onClick={() => setDriftActive(!driftActive)}
          className={`px-2.5 py-1 text-[10.5px] font-mono font-bold rounded-md border transition-all cursor-pointer ${
            driftActive
              ? "border-teal/50 bg-teal-wash text-teal shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              : "border-white/[0.08] bg-[#05080e]/80 text-text-faint hover:text-white"
          }`}
          title="Toggle Lagrangian Hydrodynamic Drift Dispersion"
        >
          DRIFT
        </button>
        <button
          type="button"
          onClick={() => setCurrentsActive(!currentsActive)}
          className={`px-2.5 py-1 text-[10.5px] font-mono font-bold rounded-md border transition-all cursor-pointer ${
            currentsActive
              ? "border-teal/50 bg-teal-wash text-teal shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              : "border-white/[0.08] bg-[#05080e]/80 text-text-faint hover:text-white"
          }`}
          title="Toggle HYCOM Ocean Surface Currents"
        >
          CURRENTS
        </button>
      </div>

      {/* Main Interactive Tactical SVG Canvas */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 440"
        className="absolute inset-0 select-none cursor-crosshair"
      >
        <defs>
          <linearGradient id="radarSweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.22" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Pure Obsidian Grid Background */}
        <g stroke="#0e1824" strokeWidth="0.8">
          <line x1="0" y1="110" x2="900" y2="110" strokeDasharray="2 6" />
          <line x1="0" y1="220" x2="900" y2="220" strokeDasharray="2 6" />
          <line x1="0" y1="330" x2="900" y2="330" strokeDasharray="2 6" />
          <line x1="180" y1="0" x2="180" y2="440" strokeDasharray="2 6" />
          <line x1="360" y1="0" x2="360" y2="440" strokeDasharray="2 6" />
          <line x1="540" y1="0" x2="540" y2="440" strokeDasharray="2 6" />
          <line x1="720" y1="0" x2="720" y2="440" strokeDasharray="2 6" />
        </g>

        {/* Radar Range Rings from Center (360, 220) */}
        <g stroke="#102030" strokeWidth="1">
          <circle cx="360" cy="220" r="80" fill="none" />
          <circle cx="360" cy="220" r="160" fill="none" />
          <circle cx="360" cy="220" r="240" fill="none" />
          <line x1="120" y1="220" x2="600" y2="220" strokeDasharray="4 4" />
          <line x1="360" y1="0" x2="360" y2="440" strokeDasharray="4 4" />
        </g>

        {/* Range Ring Distance Annotations */}
        <text x="365" y="145" fill="#305068" fontSize="9" fontFamily="Space Mono">5 NM</text>
        <text x="365" y="65" fill="#305068" fontSize="9" fontFamily="Space Mono">10 NM</text>
        <text x="365" y="18" fill="#305068" fontSize="9" fontFamily="Space Mono">15 NM</text>

        {/* HYCOM Ocean Current Vector Field (Arrows) */}
        {currentsActive && (
          <g stroke="#00f0ff" strokeWidth="0.9" opacity="0.35">
            {[
              [140, 90], [260, 80], [380, 70], [500, 60], [620, 50],
              [120, 190], [240, 180], [360, 170], [480, 160], [600, 150],
              [160, 290], [280, 280], [400, 270], [520, 260], [640, 250],
              [200, 390], [320, 380], [440, 370], [560, 360], [680, 350],
            ].map(([x, y], i) => (
              <g key={i}>
                <line x1={x} y1={y} x2={x + 22} y2={y - 8} strokeDasharray="2 3" />
                <polygon points={`${x + 22},${y - 8} ${x + 16},${y - 12} ${x + 17},${y - 5}`} fill="#00f0ff" />
              </g>
            ))}
          </g>
        )}

        {/* SAR Detection Layer */}
        {sarActive && (
          <g className="transition-all duration-300">
            {/* Satellite Pass Swath Boundary */}
            <rect
              x="280"
              y="50"
              width="460"
              height="340"
              fill="#00f0ff"
              fillOpacity="0.02"
              stroke="#00f0ff"
              strokeWidth="1"
              strokeDasharray="6 4"
              opacity="0.3"
            />
            <text x="290" y="44" fill="#00f0ff" fontSize="9" fontFamily="Space Mono" opacity="0.7">
              SENTINEL-1A · C-BAND SAR SWATH (IW_GRDH_1SDV)
            </text>
          </g>
        )}

        {/* DRIFT Dispersion Cone & Backtrack Origin */}
        {driftActive && (
          <g className="transition-all duration-300">
            {/* Backtrack Origin release node at T-18h */}
            <g>
              <circle cx="375" cy="230" r="4" fill="#ff3b30" />
              <circle cx="375" cy="230" r="10" fill="none" stroke="#ff3b30" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
              <text x="360" y="252" fill="#ff3b30" fontSize="9" fontFamily="Space Mono" textAnchor="middle" fontWeight="bold">
                T-18h DISCHARGE ORIGIN
              </text>
            </g>

            {/* Dispersion cone connecting release to forecast */}
            <path
              d="M375,230 L540,110 C600,140 600,190 540,220 Z"
              fill="#00f0ff"
              fillOpacity="0.08"
            />
            <path
              d="M375,230 L540,110"
              stroke="#00f0ff"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            <path
              d="M375,230 L540,220"
              stroke="#00f0ff"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
          </g>
        )}

        {/* CONTINUOUS ROTATING RADAR SWEEP BEAM */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 360 220"
            to="360 360 220"
            dur="4.5s"
            repeatCount="indefinite"
          />
          {/* Sweeping Wedge Slice */}
          <path
            d="M 360,220 L 586,138 A 240,240 0 0,1 600,220 Z"
            fill="url(#radarSweepGradient)"
          />
          {/* Beam Leading Line */}
          <line
            x1="360"
            y1="220"
            x2="600"
            y2="220"
            stroke="#00f0ff"
            strokeWidth="1.8"
            opacity="0.9"
            filter="url(#glowFilter)"
          />
        </g>

        {/* Dynamic Oil Slick Blob (changes with timeOffset) */}
        <g className="cursor-pointer" onClick={() => setSelectedVessel(null)}>
          {/* Outer Pulsing Ping Ring */}
          <circle cx={slickCenterX} cy={slickCenterY} r={slickRadius} fill="none" stroke="#ff3b30" strokeWidth="1.5">
            <animate attributeName="r" values={`${slickRadius};${slickRadius + 16}`} dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Slick Core Body */}
          <ellipse
            cx={slickCenterX}
            cy={slickCenterY}
            rx={slickRadius}
            ry={slickRadius * 0.58}
            fill="#ff3b30"
            fillOpacity="0.25"
            stroke="#ff3b30"
            strokeWidth="1.6"
          />

          {/* Core Center Blip */}
          <circle cx={slickCenterX} cy={slickCenterY} r="4" fill="#ff3b30" filter="url(#glowFilter)" />

          {/* Slick Label */}
          <text x={slickCenterX + slickRadius + 8} y={slickCenterY - 2} fill="#ffffff" fontSize="12" fontFamily="Space Mono" fontWeight="bold">
            {activeIncident.id} · {activeIncident.name.toUpperCase()}
          </text>
          <text x={slickCenterX + slickRadius + 8} y={slickCenterY + 12} fill="#ff3b30" fontSize="9.5" fontFamily="Space Mono">
            {activeIncident.severity.toUpperCase()} · {activeIncident.estimatedVolume} · {activeIncident.slickAreaKm2} km²
          </text>
        </g>

        {/* AIS Vessels Layer */}
        {aisActive && (
          <g>
            {/* Top Suspect: M/T NORDBLOM with Dark Transponder Gap Segment */}
            <g
              className="cursor-pointer group"
              onClick={() => {
                const s = activeIncident.suspects[0];
                if (s) {
                  setSelectedVessel(s);
                  onSelectSuspect?.(s);
                }
              }}
            >
              {/* Vessel Track Path */}
              <line x1="200" y1="285" x2="330" y2="244" stroke="#00f0ff" strokeWidth="1.2" opacity="0.6" />
              {/* DARK AIS GAP SEGMENT (Dashed Red) */}
              <line
                x1="330"
                y1="244"
                x2="460"
                y2="204"
                stroke="#ff3b30"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.9"
              />
              <line x1="460" y1="204" x2="620" y2="154" stroke="#00f0ff" strokeWidth="1.2" opacity="0.6" />

              {/* Dynamic Vessel Blip based on scrubber */}
              <circle cx={nordblomX} cy={nordblomY} r="5" fill="#00f0ff" filter="url(#glowFilter)" />
              <circle cx={nordblomX} cy={nordblomY} r="10" fill="none" stroke="#00f0ff" strokeWidth="1">
                <animate attributeName="r" values="5;14" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2.5s" repeatCount="indefinite" />
              </circle>

              {/* Nordblom Label */}
              <text x={nordblomX + 10} y={nordblomY - 2} fill="#00f0ff" fontSize="11" fontFamily="Space Mono" fontWeight="bold">
                {activeIncident.suspects[0]?.name || "M/T NORDBLOM"}
              </text>
              <text x={nordblomX + 10} y={nordblomY + 11} fill="#ff3b30" fontSize="9" fontFamily="Space Mono">
                [AIS GAP 4h 12m] · 87% ATTRIBUTION
              </text>
            </g>

            {/* Suspect 2: M/T KESTREL */}
            {activeIncident.suspects[1] && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  const s = activeIncident.suspects[1];
                  setSelectedVessel(s);
                  onSelectSuspect?.(s);
                }}
              >
                <line x1="580" y1="310" x2="520" y2="240" stroke="#00f0ff" strokeWidth="1" opacity="0.4" />
                <circle cx="535" cy="258" r="4" fill="#00f0ff" opacity="0.8" />
                <text x="548" y="260" fill="#94a3b8" fontSize="10" fontFamily="Space Mono">
                  {activeIncident.suspects[1].name}
                </text>
                <text x="548" y="271" fill="#475569" fontSize="8.5" fontFamily="Space Mono">
                  {activeIncident.suspects[1].confidencePct}% Match · Live AIS
                </text>
              </g>
            )}

            {/* Suspect 3: M/T VALE */}
            {activeIncident.suspects[2] && (
              <g
                className="cursor-pointer"
                onClick={() => {
                  const s = activeIncident.suspects[2];
                  setSelectedVessel(s);
                  onSelectSuspect?.(s);
                }}
              >
                <line x1="220" y1="120" x2="270" y2="135" stroke="#00f0ff" strokeWidth="1" opacity="0.4" />
                <circle cx="250" cy="129" r="4" fill="#00f0ff" opacity="0.8" />
                <text x="260" y="131" fill="#94a3b8" fontSize="10" fontFamily="Space Mono">
                  {activeIncident.suspects[2].name}
                </text>
                <text x="260" y="142" fill="#475569" fontSize="8.5" fontFamily="Space Mono">
                  {activeIncident.suspects[2].confidencePct}% Match
                </text>
              </g>
            )}
          </g>
        )}

        {/* Center Station Pivot Cross */}
        <circle cx="360" cy="220" r="3" fill="#00f0ff" />
        <circle cx="360" cy="220" r="7" fill="none" stroke="#00f0ff" strokeWidth="0.8" opacity="0.5" />
      </svg>

      {/* In-Map Clicked Vessel HUD Card (Appears when vessel clicked) */}
      {selectedVessel && (
        <div className="absolute bottom-12 right-4 z-30 w-72 rounded-xl border border-teal/40 bg-[#05080e]/95 p-3.5 shadow-[0_0_24px_rgba(0,240,255,0.2)] backdrop-blur-xl animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-teal font-mono text-[11px] font-bold">
              <Ship className="w-3.5 h-3.5" />
              {selectedVessel.name}
            </div>
            <button
              type="button"
              onClick={() => setSelectedVessel(null)}
              className="text-text-faint hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-text-muted mb-2.5">
            <div>
              <span className="text-text-faint block">FLAG:</span>
              <span className="text-white font-bold">{selectedVessel.flag || "Panama"}</span>
            </div>
            <div>
              <span className="text-text-faint block">MATCH:</span>
              <span className="text-teal font-bold">{selectedVessel.confidencePct}%</span>
            </div>
            <div>
              <span className="text-text-faint block">AIS STATUS:</span>
              <span className="text-amber font-bold">{selectedVessel.aisGapDuration || "Live"}</span>
            </div>
            <div>
              <span className="text-text-faint block">FUEL:</span>
              <span className="text-white truncate block">{selectedVessel.fuelTypeMatch || "HFO-380"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectSuspect?.(selectedVessel)}
            className="w-full py-1.5 rounded-lg bg-teal-wash border border-teal/40 text-teal text-[10.5px] font-mono font-bold hover:bg-teal hover:text-[#020a10] transition-colors"
          >
            Open Evidence Dossier →
          </button>
        </div>
      )}

      {/* Map Bottom Footer Telemetry */}
      <div className="relative z-10 px-4 py-2 border-t border-white/[0.06] bg-[#020408]/90 flex items-center justify-between text-[10px] font-mono text-text-faint">
        <div className="flex items-center gap-3">
          <span>SCALE 1:250 000</span>
          <span>·</span>
          <span>CURRENT: {activeIncident.currentVector}</span>
          <span>·</span>
          <span>WIND: {activeIncident.windVector}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-teal font-bold">SCRUBBER TIME: {timeOffset >= 0 ? `+${timeOffset}h` : `${timeOffset}h`}</span>
        </div>
      </div>
    </div>
  );
}
