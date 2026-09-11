import { useState } from "react";
import { Radar, Search, ShieldAlert, Wind, Waves, Compass, Activity } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { Panel } from "../components/ui/Panel";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Badge } from "../components/ui/Badge";
import { IncidentMap } from "../components/maps/IncidentMap";
import { TimeScrubber } from "../components/console/TimeScrubber";
import { TelemetryTerminal } from "../components/console/TelemetryTerminal";
import { ForensicDossierModal } from "../components/console/ForensicDossierModal";
import { incidentStats, incidents } from "../data/mockData";
import type { Incident, SuspectVessel } from "../types";

const badgeTone = { critical: "critical", elevated: "elevated", watch: "watch" } as const;
const suspectColor = (pct: number) => (pct >= 75 ? "red" : "teal") as "red" | "teal";
const suspectTextClass = { red: "text-red", teal: "text-teal" } as const;

export default function Incidents() {
  const [activeIncident, setActiveIncident] = useState<Incident>(incidents[0]);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [selectedSuspect, setSelectedSuspect] = useState<SuspectVessel | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const handleOpenDossier = (suspect: SuspectVessel) => {
    setSelectedSuspect(suspect);
    setIsDossierOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Top Stat Cards (21st.dev Glow Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {incidentStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* 2. Main Center Bento: Tactical GIS Map with Time Scrubber & Ranked Suspects */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-stretch">
        {/* Left: GIS Map + Time Scrubber */}
        <Panel
          title="Tactical GIS Radar Map"
          meta={`${activeIncident.lat.toFixed(3)}°N · ${Math.abs(activeIncident.lon).toFixed(3)}°W // ${activeIncident.region}`}
          icon={<Radar />}
          bodyClassName="flex flex-col flex-1"
        >
          <div className="flex-1 flex flex-col min-h-[420px] relative">
            <IncidentMap
              activeIncident={activeIncident}
              timeOffset={timeOffset}
              onSelectSuspect={handleOpenDossier}
            />
          </div>
          {/* Integrated Time Scrubber */}
          <TimeScrubber timeOffset={timeOffset} onChange={setTimeOffset} />
        </Panel>

        {/* Right: Suspect Attribution Ranking */}
        <Panel
          title="Ranked Suspects"
          meta={`${activeIncident.suspects.length} vessels correlated`}
          icon={<ShieldAlert className="text-red" />}
          className="flex flex-col"
        >
          <div className="px-4 py-3.5 flex flex-col gap-3.5 flex-1 overflow-y-auto">
            {activeIncident.suspects.map((s) => (
              <div
                key={s.rank}
                onClick={() => handleOpenDossier(s)}
                className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-teal/30 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-[13px] font-bold">
                    <span className="text-[10px] font-mono text-text-faint px-1.5 py-0.5 rounded bg-white/[0.04]">
                      #{s.rank}
                    </span>
                    <span className="group-hover:text-teal transition-colors">{s.name}</span>
                  </div>
                  <div className={`text-[15px] font-mono font-extrabold ${suspectTextClass[suspectColor(s.confidencePct)]}`}>
                    {s.confidencePct}%
                  </div>
                </div>

                <ProgressBar percent={s.confidencePct} color={suspectColor(s.confidencePct)} />

                <div className="text-[11px] text-text-faint mt-2 font-mono flex items-center justify-between">
                  <span>{s.note}</span>
                  <span className="text-teal/80 text-[10px] group-hover:translate-x-0.5 transition-transform">
                    Inspect →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 pt-2 mt-auto border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                if (activeIncident.suspects[0]) {
                  handleOpenDossier(activeIncident.suspects[0]);
                }
              }}
              className="w-full py-2.5 rounded-lg bg-teal text-[#020a10] text-[12px] font-mono font-bold flex items-center justify-center gap-2 hover:bg-[#3bf8ff] transition-all cursor-pointer shadow-[0_0_16px_rgba(0,240,255,0.25)]"
            >
              <Search className="w-3.5 h-3.5" />
              Open Primary Evidence Chain
            </button>
          </div>
        </Panel>
      </div>

      {/* 3. Bottom Bento: Incident Selector + Environmental Telemetry + Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.4fr] gap-4">
        {/* Active Incidents Selector */}
        <Panel title="Active Maritime Incidents" meta={`${incidents.length} monitored`}>
          <div className="divide-y divide-white/[0.06]">
            {incidents.map((inc) => {
              const isActive = inc.id === activeIncident.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setActiveIncident(inc);
                    setTimeOffset(0);
                  }}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    isActive
                      ? "bg-teal-wash/40 border-l-2 border-l-teal"
                      : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-teal font-bold">{inc.id}</span>
                      <span className="text-[13px] font-bold text-white">{inc.name}</span>
                    </div>
                    <div className="text-[11px] font-mono text-text-faint mt-0.5">
                      {inc.estimatedVolume} · {inc.timeDetected}
                    </div>
                  </div>
                  <Badge tone={badgeTone[inc.severity]}>{inc.severity.toUpperCase()}</Badge>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Environmental Drift & Backtrack Telemetry */}
        <Panel title="Hydrodynamic Ingest" meta="NOAA / HYCOM / IMD">
          <div className="p-4 flex flex-col gap-3.5 text-[11.5px] font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="flex items-center gap-1.5 text-text-muted">
                <Wind className="w-3.5 h-3.5 text-teal" />
                Surface Wind Vector
              </span>
              <span className="text-white font-bold">{activeIncident.windVector}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="flex items-center gap-1.5 text-text-muted">
                <Waves className="w-3.5 h-3.5 text-blue" />
                Ocean Current Flow
              </span>
              <span className="text-teal font-bold">{activeIncident.currentVector}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="flex items-center gap-1.5 text-text-muted">
                <Compass className="w-3.5 h-3.5 text-amber" />
                Slick Surface Footprint
              </span>
              <span className="text-white font-bold">{activeIncident.slickAreaKm2} km²</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-muted">
                <Activity className="w-3.5 h-3.5 text-teal" />
                Kalman Convergence
              </span>
              <span className="text-teal font-bold">±180m @ 94.2%</span>
            </div>
          </div>
        </Panel>

        {/* Live Streaming Defense Terminal (21st.dev Style) */}
        <Panel title="System Ingest Stream" meta="Real-time" className="min-h-[220px]">
          <TelemetryTerminal />
        </Panel>
      </div>

      {/* 4. Court-Admissible Forensic Dossier Modal */}
      <ForensicDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        suspect={selectedSuspect}
        incident={activeIncident}
      />
    </div>
  );
}
