import { useState, useEffect, useRef } from "react";
import { Terminal, Pause, Play, Copy, Check, Trash2 } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  category: "INGEST" | "HYCOM" | "AIS-GAP" | "KALMAN" | "ALERT";
  message: string;
}

const initialLogs: LogEntry[] = [
  {
    id: "l-1",
    timestamp: "14:15:02",
    category: "INGEST",
    message: "Sentinel-1A SAR Ground Range Detected (GRD) swath S1A_IW_GRDH_1SDV ingested.",
  },
  {
    id: "l-2",
    timestamp: "14:15:08",
    category: "INGEST",
    message: "Dual-polarization (VV/VH) adaptive thresholding: 48.6 km² dark slick geometry segmented.",
  },
  {
    id: "l-3",
    timestamp: "14:15:15",
    category: "HYCOM",
    message: "INCOIS-HYCOM current field vector applied: 1.42 m/s @ 064° (ENE), 50k particles seeded.",
  },
  {
    id: "l-4",
    timestamp: "14:15:22",
    category: "KALMAN",
    message: "Lagrangian particle backtracking initialized (T-48h). Diffusion coeff: 10 m²/s.",
  },
  {
    id: "l-5",
    timestamp: "14:15:31",
    category: "AIS-GAP",
    message: "ANOMALY: M/T NORDBLOM (MMSI 419004812) ceased broadcast for 4h 12m near spill center.",
  },
  {
    id: "l-6",
    timestamp: "14:15:42",
    category: "KALMAN",
    message: "Backtrack trajectory converges with M/T NORDBLOM path at T-18h (Bayesian P: 87.4%).",
  },
  {
    id: "l-7",
    timestamp: "14:15:56",
    category: "ALERT",
    message: "HIGH-CONFIDENCE ATTRIBUTION: Probable deliberate high-load bilge purge identified.",
  },
];

const liveSimMessages: Array<{ category: LogEntry["category"]; message: string }> = [
  { category: "HYCOM", message: "IMD GFS wind gust recalculation: 18.4 kt (SW). Stokes drift coefficient adjusted to 0.032." },
  { category: "INGEST", message: "Sentinel-2 MSI cloud-free optical verification requested for 58.421°N, 006.114°W." },
  { category: "AIS-GAP", message: "Coastal AIS receiver Minch-North confirms signal loss duration: 252 minutes." },
  { category: "KALMAN", message: "ADIOS2 weathering model: Evaporation rate 31.4% (HFO 380 cSt emulsification index: 0.42)." },
  { category: "ALERT", message: "Defense alert routed to UK Coastguard MRCC & EMSA CleanSeaNet node." },
  { category: "INGEST", message: "RADARSAT Constellation Mission (RCM) pass scheduled for T+11h cross-validation." },
];

export function TelemetryTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Periodic simulated live logs
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const randomMsg = liveSimMessages[Math.floor(Math.random() * liveSimMessages.length)];
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, "0")}:${String(
        now.getUTCMinutes()
      ).padStart(2, "0")}:${String(now.getUTCSeconds()).padStart(2, "0")}`;

      setLogs((prev) => [
        ...prev.slice(-40), // keep last 40 entries
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          category: randomMsg.category,
          message: randomMsg.message,
        },
      ]);
    }, 6500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-scroll to bottom on new log
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const handleCopy = () => {
    const text = logs.map((l) => `[${l.timestamp} UTC] [${l.category}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeStyle = (cat: LogEntry["category"]) => {
    switch (cat) {
      case "ALERT":
        return "bg-red-wash text-red border-red/30";
      case "AIS-GAP":
        return "bg-amber/10 text-amber border-amber/30";
      case "KALMAN":
        return "bg-teal-wash text-teal border-teal/30";
      case "HYCOM":
        return "bg-blue/10 text-blue border-blue/30";
      case "INGEST":
      default:
        return "bg-white/[0.04] text-text-muted border-white/[0.08]";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#03070f]/90 font-mono text-[11px] overflow-hidden">
      {/* Terminal Bar Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal animate-ping" />
            <Terminal className="w-3.5 h-3.5 text-teal" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-text">
            FORENSIC TELEMETRY STREAM
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-wash text-teal border border-teal/30 font-semibold">
            {isPaused ? "PAUSED" : "LIVE FEED"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded bg-white/[0.03] border border-white/[0.08] hover:border-teal/40 hover:text-teal text-text-faint transition-colors"
            title={isPaused ? "Resume feed" : "Pause feed"}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded bg-white/[0.03] border border-white/[0.08] hover:border-teal/40 hover:text-teal text-text-faint transition-colors"
            title="Copy logs to clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-teal" /> : <Copy className="w-3 h-3" />}
          </button>
          <button
            type="button"
            onClick={() => setLogs([])}
            className="p-1 rounded bg-white/[0.03] border border-white/[0.08] hover:border-red/40 hover:text-red text-text-faint transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Log Feed Display */}
      <div
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 leading-relaxed scroll-smooth select-text"
      >
        {logs.length === 0 ? (
          <div className="text-text-faint text-center py-6">Logs cleared. Awaiting new telemetry events...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-white/[0.02] p-1 rounded transition-colors">
              <span className="text-text-faint shrink-0">{log.timestamp}</span>
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded border shrink-0 font-bold ${getBadgeStyle(
                  log.category
                )}`}
              >
                {log.category}
              </span>
              <span className="text-text-muted break-words flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

