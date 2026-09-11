import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Gauge } from "lucide-react";

interface TimeScrubberProps {
  timeOffset: number; // in hours, from -48 to +48
  onChange: (hours: number) => void;
}

export function TimeScrubber({ timeOffset, onChange }: TimeScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (timeOffset >= 48) {
        setIsPlaying(false);
      } else {
        onChange(Math.min(48, timeOffset + 1));
      }
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, timeOffset, playbackSpeed, onChange]);

  const formatHourLabel = (h: number) => {
    if (h === 0) return "T-0 (DETECTION TIME)";
    if (h < 0) return `T - ${Math.abs(h)}h (BACKTRACK ORIGIN)`;
    return `T + ${h}h (DRIFT FORECAST)`;
  };

  const getPhaseTone = (h: number) => {
    if (h < 0) return "text-teal";
    if (h === 0) return "text-white";
    return "text-amber";
  };

  return (
    <div className="relative isolate px-4 py-3 border-t border-white/[0.08] bg-[#03060c]/90 flex flex-col gap-2.5">
      {/* Top Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
              isPlaying
                ? "bg-teal text-[#020a10] border-teal shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                : "bg-white/[0.04] text-white border-white/[0.1] hover:border-teal/50 hover:text-teal"
            }`}
            title={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          {/* Step Back (-1h) */}
          <button
            type="button"
            onClick={() => onChange(Math.max(-48, timeOffset - 1))}
            disabled={timeOffset <= -48}
            className="w-7 h-7 rounded-md bg-white/[0.03] border border-white/[0.08] text-text-muted hover:text-white hover:border-white/[0.2] flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Step backward 1 hour"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Step Forward (+1h) */}
          <button
            type="button"
            onClick={() => onChange(Math.min(48, timeOffset + 1))}
            disabled={timeOffset >= 48}
            className="w-7 h-7 rounded-md bg-white/[0.03] border border-white/[0.08] text-text-muted hover:text-white hover:border-white/[0.2] flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Step forward 1 hour"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Reset to T-0 */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onChange(0);
            }}
            className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono font-semibold text-text-faint hover:text-teal hover:border-teal/30 flex items-center gap-1 transition-colors"
            title="Reset to T-0 Overpass"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            T-0
          </button>
        </div>

        {/* Center Readout Badge */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className={`text-[12px] font-mono font-bold tracking-wider ${getPhaseTone(timeOffset)}`}>
            {formatHourLabel(timeOffset)}
          </span>
        </div>

        {/* Playback Speed Multiplier */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-md p-0.5 text-[10px] font-mono">
          <Gauge className="w-3 h-3 text-text-faint ml-1 mr-0.5" />
          {([1, 2, 5] as const).map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                playbackSpeed === spd
                  ? "bg-teal-wash text-teal font-bold border border-teal/30"
                  : "text-text-faint hover:text-text"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubbing Slider Track with Milestones */}
      <div className="relative flex flex-col gap-1">
        <input
          type="range"
          min="-48"
          max="48"
          step="1"
          value={timeOffset}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-ew-resize accent-teal focus:outline-none"
        />

        {/* Timeline Milestone Markers */}
        <div className="flex justify-between items-center text-[9px] font-mono text-text-faint px-0.5 select-none pt-0.5">
          <span
            className={`cursor-pointer hover:text-teal transition-colors ${timeOffset === -48 ? "text-teal font-bold" : ""}`}
            onClick={() => onChange(-48)}
          >
            -48h [ORIGIN SEARCH]
          </span>
          <span
            className={`cursor-pointer hover:text-red transition-colors ${timeOffset === -18 ? "text-red font-bold" : ""}`}
            onClick={() => onChange(-18)}
            title="Estimated Discharge Event"
          >
            -18h · DISCHARGE
          </span>
          <span
            className={`cursor-pointer hover:text-white transition-colors ${timeOffset === 0 ? "text-white font-bold" : ""}`}
            onClick={() => onChange(0)}
            title="Sentinel-1 SAR Overpass"
          >
            T-0 · SAR PASS
          </span>
          <span
            className={`cursor-pointer hover:text-amber transition-colors ${timeOffset === 24 ? "text-amber font-bold" : ""}`}
            onClick={() => onChange(24)}
            title="T+24h Drift Envelope"
          >
            +24h FORECAST
          </span>
          <span
            className={`cursor-pointer hover:text-amber transition-colors ${timeOffset === 48 ? "text-amber font-bold" : ""}`}
            onClick={() => onChange(48)}
          >
            +48h [SHORELINE]
          </span>
        </div>
      </div>
    </div>
  );
}

