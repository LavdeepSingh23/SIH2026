import { useState } from "react";

export function IncidentMap() {
  const [sarActive, setSarActive] = useState(true);
  const [aisActive, setAisActive] = useState(true);
  const [driftActive, setDriftActive] = useState(true);

  return (
    <div className="relative flex-1 min-h-[380px] bg-panel-soft overflow-hidden select-none">
      {/* Top Status */}
      <div className="absolute top-3.5 left-4 flex items-center gap-2 z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
        </span>
        <span className="text-[10px] font-mono text-teal tracking-wider font-semibold uppercase">
          RADAR 24 RPM · ACTIVE SCAN
        </span>
      </div>

      {/* Emergency Signal Tag & Layer Toggles */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-red-wash border border-red/30 text-[10px] text-red font-mono font-semibold tracking-wide mr-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
          EMERGENCY SIGNAL
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setSarActive(!sarActive)}
            className={`px-2.5 py-1.5 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
              sarActive
                ? "border-teal-dim bg-teal-wash text-teal shadow-[0_0_8px_rgba(53,214,196,0.15)]"
                : "border-border bg-panel text-text-muted hover:border-border-soft hover:text-text"
            }`}
            title="Toggle SAR Search Pattern & Grids"
          >
            SAR
          </button>
          <button
            type="button"
            onClick={() => setAisActive(!aisActive)}
            className={`px-2.5 py-1.5 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
              aisActive
                ? "border-teal-dim bg-teal-wash text-teal shadow-[0_0_8px_rgba(53,214,196,0.15)]"
                : "border-border bg-panel text-text-muted hover:border-border-soft hover:text-text"
            }`}
            title="Toggle AIS Vessel Tracking"
          >
            AIS
          </button>
          <button
            type="button"
            onClick={() => setDriftActive(!driftActive)}
            className={`px-2.5 py-1.5 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
              driftActive
                ? "border-teal-dim bg-teal-wash text-teal shadow-[0_0_8px_rgba(53,214,196,0.15)]"
                : "border-border bg-panel text-text-muted hover:border-border-soft hover:text-text"
            }`}
            title="Toggle Drift Dispersion Forecast"
          >
            DRIFT
          </button>
        </div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 900 420" className="absolute inset-0">
        <defs>
          <linearGradient id="sweepGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35D6C4" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#35D6C4" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="sweepGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35D6C4" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#35D6C4" stopOpacity="0.32" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Bathymetry / Grid lines */}
        <g stroke="#102334" strokeWidth="0.8" opacity="0.6">
          <line x1="0" y1="100" x2="900" y2="100" strokeDasharray="2 6" />
          <line x1="0" y1="200" x2="900" y2="200" strokeDasharray="2 6" />
          <line x1="0" y1="300" x2="900" y2="300" strokeDasharray="2 6" />
          <line x1="180" y1="0" x2="180" y2="420" strokeDasharray="2 6" />
          <line x1="360" y1="0" x2="360" y2="420" strokeDasharray="2 6" />
          <line x1="540" y1="0" x2="540" y2="420" strokeDasharray="2 6" />
          <line x1="720" y1="0" x2="720" y2="420" strokeDasharray="2 6" />
        </g>

        {/* Radar Crosshairs */}
        <line x1="140" y1="200" x2="580" y2="200" stroke="#152a3c" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="360" y1="0" x2="360" y2="410" stroke="#152a3c" strokeWidth="1" strokeDasharray="4 3" />

        {/* Range Rings */}
        <circle cx="360" cy="200" r="70" fill="none" stroke="#152a3c" strokeWidth="1" />
        <circle cx="360" cy="200" r="140" fill="none" stroke="#152a3c" strokeWidth="1" />
        <circle cx="360" cy="200" r="210" fill="none" stroke="#152a3c" strokeWidth="1.2" />

        {/* Range Ring Labels */}
        <text x="365" y="134" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono">5 NM</text>
        <text x="365" y="64" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono">10 NM</text>
        <text x="365" y="14" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono">15 NM</text>

        {/* Compass Cardinal Points on Outer Ring (r=210) */}
        <text x="360" y="24" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="middle">000°</text>
        <text x="576" y="203" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono" dominantBaseline="middle">090°</text>
        <text x="360" y="416" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="middle">180°</text>
        <text x="144" y="203" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="end" dominantBaseline="middle">270°</text>

        {/* SAR Layer (Search Area / Grids) */}
        {sarActive && (
          <g className="transition-opacity duration-300">
            {/* Expanding SAR search grid box */}
            <rect
              x="420"
              y="110"
              width="180"
              height="120"
              fill="#E8B23D"
              fillOpacity="0.04"
              stroke="#E8B23D"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            {/* SAR Search Vector Lines */}
            <path
              d="M 430,125 L 590,125 L 590,155 L 430,155 L 430,185 L 590,185 L 590,215 L 430,215"
              fill="none"
              stroke="#E8B23D"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.4"
            />
            <text x="424" y="104" fill="#E8B23D" fontSize="9" fontFamily="IBM Plex Mono" fontWeight={500}>
              SAR SECTOR 04-B · EXPANDING SQUARE
            </text>
          </g>
        )}

        {/* DRIFT Layer (Dispersion Cone) */}
        {driftActive && (
          <g className="transition-opacity duration-300">
            <path
              d="M360,200 L470,120 C500,150 500,190 470,215 L360,200 Z"
              fill="#35D6C4"
              opacity="0.16"
            />
            <path
              d="M360,200 L470,120"
              stroke="#35D6C4"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.45"
            />
            <path
              d="M360,200 L470,215"
              stroke="#35D6C4"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.45"
            />
            {/* Drift Direction Vectors */}
            <path
              d="M390,180 L430,170 M420,190 L460,185 M400,205 L440,205"
              stroke="#35D6C4"
              strokeWidth="1.2"
              strokeDasharray="3 4"
              opacity="0.4"
            />
            <text x="440" y="228" fill="#35D6C4" fontSize="9" fontFamily="IBM Plex Mono" opacity="0.8">
              DRIFT VECTOR 074° @ 1.8 KT
            </text>
          </g>
        )}

        {/* CONTINUOUS ROTATING RADAR SWEEP ANIMATION */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 360 200"
            to="360 360 200"
            dur="4s"
            repeatCount="indefinite"
          />

          {/* Trailing wedge slice 1 (45° to 20° behind leading edge) */}
          <path
            d="M 360,200 L 508.5,51.5 A 210,210 0 0,1 557.3,128.2 Z"
            fill="url(#sweepGradient1)"
            opacity="0.5"
          />

          {/* Trailing wedge slice 2 (20° to 0° behind leading edge) */}
          <path
            d="M 360,200 L 557.3,128.2 A 210,210 0 0,1 570,200 Z"
            fill="url(#sweepGradient2)"
            opacity="0.8"
          />

          {/* Bright leading scanning beam line */}
          <line
            x1="360"
            y1="200"
            x2="570"
            y2="200"
            stroke="#35D6C4"
            strokeWidth="2"
            opacity="0.95"
            filter="url(#radarGlow)"
          />

          {/* Subtle outer tick on the sweep line tip */}
          <circle cx="570" cy="200" r="2.5" fill="#35D6C4" opacity="0.9" />
        </g>

        {/* Center Station Pivot */}
        <circle cx="360" cy="200" r="3.5" fill="#35D6C4" />
        <circle cx="360" cy="200" r="7" fill="none" stroke="#35D6C4" strokeWidth="0.8" opacity="0.6" />

        {/* Emergency Signal: INC-0417 · SHELLCREEK with pulsating radar rings */}
        <g className="cursor-pointer">
          {/* Outer Pulsing Ping Ring 1 */}
          <circle cx="470" cy="168" r="5" fill="none" stroke="#F16456" strokeWidth="1.5">
            <animate attributeName="r" values="5;22;28" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.4;0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Outer Pulsing Ping Ring 2 (Staggered) */}
          <circle cx="470" cy="168" r="5" fill="none" stroke="#F16456" strokeWidth="1">
            <animate attributeName="r" values="5;15;20" dur="2s" begin="0.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.3;0" dur="2s" begin="0.6s" repeatCount="indefinite" />
          </circle>

          {/* Solid Center Red Blip */}
          <circle cx="470" cy="168" r="5" fill="#F16456" />

          {/* Label */}
          <text x="484" y="172" fill="#EAF2F7" fontSize="12" fontFamily="Inter" fontWeight={600}>
            INC-0417 · SHELLCREEK
          </text>
          <text x="484" y="184" fill="#F16456" fontSize="9.5" fontFamily="IBM Plex Mono">
            CRITICAL · SPILL 420 BBL
          </text>
        </g>

        {/* AIS Vessel Targets */}
        {aisActive && (
          <g className="transition-opacity duration-300">
            {/* Target 1: M/T VALE */}
            <g>
              <line x1="225" y1="130" x2="245" y2="136" stroke="#35D6C4" strokeWidth="1.2" opacity="0.7" />
              <circle cx="225" cy="130" r="4" fill="#35D6C4" />
              <circle cx="225" cy="130" r="4" fill="none" stroke="#35D6C4" strokeWidth="1">
                <animate attributeName="r" values="4;12" dur="4s" begin="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="4s" begin="1s" repeatCount="indefinite" />
              </circle>
              <text x="236" y="134" fill="#87A2B5" fontSize="11" fontFamily="Inter">
                M/T VALE
              </text>
              <text x="236" y="145" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono">
                14.2 kt · CRS 110°
              </text>
            </g>

            {/* Target 2: M/T NORDBLOM */}
            <g>
              <line x1="300" y1="240" x2="328" y2="252" stroke="#35D6C4" strokeWidth="1.2" opacity="0.7" />
              <circle cx="300" cy="240" r="4" fill="#35D6C4" />
              <circle cx="300" cy="240" r="4" fill="none" stroke="#35D6C4" strokeWidth="1">
                <animate attributeName="r" values="4;12" dur="4s" begin="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="4s" begin="2.2s" repeatCount="indefinite" />
              </circle>
              <text x="311" y="244" fill="#87A2B5" fontSize="11" fontFamily="Inter">
                M/T NORDBLOM
              </text>
              <text x="311" y="255" fill="#35D6C4" fontSize="9" fontFamily="IBM Plex Mono">
                21.4 kt · SUSPECT #1
              </text>
            </g>

            {/* Target 3: M/T KESTREL */}
            <g>
              <line x1="600" y1="260" x2="582" y2="274" stroke="#35D6C4" strokeWidth="1.2" opacity="0.7" />
              <circle cx="600" cy="260" r="4" fill="#35D6C4" />
              <circle cx="600" cy="260" r="4" fill="none" stroke="#35D6C4" strokeWidth="1">
                <animate attributeName="r" values="4;12" dur="4s" begin="3.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="4s" begin="3.4s" repeatCount="indefinite" />
              </circle>
              <text x="611" y="264" fill="#87A2B5" fontSize="11" fontFamily="Inter">
                M/T KESTREL
              </text>
              <text x="611" y="275" fill="#4B6478" fontSize="9" fontFamily="IBM Plex Mono">
                11.8 kt · CRS 224°
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Map Scale & Nav Info */}
      <div className="absolute bottom-3.5 left-4 flex items-center gap-3 text-[10.5px] text-text-faint tracking-wide font-mono z-10">
        <span>SCALE 1:250 000</span>
        <span>·</span>
        <span>MAG VAR 12°W</span>
        <span>·</span>
        <span className="text-text-muted">LAT 58°25.2'N LON 006°06.6'W</span>
      </div>
    </div>
  );
}
