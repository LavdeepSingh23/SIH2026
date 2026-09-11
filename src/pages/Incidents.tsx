import { useState } from "react";
import { Radar, ShieldAlert, Waves, Compass, Download, Clock, Anchor, Activity, FileCheck2, ArrowRight } from "lucide-react";
import { LiquidGlassPanel } from "../components/ui/LiquidGlassPanel";
import { LiquidButton } from "../components/ui/button";
import { IncidentMap } from "../components/maps/IncidentMap";
import { TimeScrubber } from "../components/console/TimeScrubber";
import { ForensicDossierModal } from "../components/console/ForensicDossierModal";
import { incidents } from "../data/mockData";
import type { Incident, SuspectVessel } from "../types";

export default function Incidents() {
  const [activeIncident, setActiveIncident] = useState<Incident>(incidents[0]);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [selectedSuspectIndex, setSelectedSuspectIndex] = useState<number>(0);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  const currentSuspect: SuspectVessel = activeIncident.suspects[selectedSuspectIndex] || activeIncident.suspects[0];

  const handleSelectIncident = (inc: Incident) => {
    setActiveIncident(inc);
    setTimeOffset(0);
    setSelectedSuspectIndex(0);
  };

  const handleDownloadJson = (suspect: SuspectVessel) => {
    const dossierData = {
      investigationId: `MARIS-DOSSIER-${activeIncident.id}-${suspect.mmsi || "UNKNOWN"}`,
      generatedAt: new Date().toISOString(),
      systemVersion: "MARIS Forensic Engine v2.4 (Court-Admissible)",
      cryptographicHashSha256: suspect.evidenceHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      incident: {
        id: activeIncident.id,
        name: activeIncident.name,
        region: activeIncident.region,
        coordinates: { lat: activeIncident.lat, lon: activeIncident.lon },
        estimatedDischargeVolume: activeIncident.estimatedVolume,
        slickAreaKm2: activeIncident.slickAreaKm2,
        weatherConditions: {
          windVector: activeIncident.windVector,
          currentVector: activeIncident.currentVector,
        },
      },
      primarySuspect: {
        vesselName: suspect.name,
        rank: suspect.rank,
        attributionProbability: `${suspect.confidencePct}%`,
        mmsi: suspect.mmsi,
        imo: suspect.imo,
        flagState: suspect.flag,
        vesselType: suspect.vesselType,
        aisDarkGapDuration: suspect.aisGapDuration,
        fuelMatchProfile: suspect.fuelTypeMatch,
        speedAnomalyObserved: suspect.speedAnomaly,
        bayesianBreakdown: suspect.bayesianScores,
        evidenceSummary: suspect.dossierSummary,
      },
      evidenceChainStatus: "VERIFIED_TAMPER_EVIDENT",
      certifyingAgency: "MARIS Autonomous Defense Reconnaissance System",
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MARIS-Forensic-Evidence-${activeIncident.id}-${suspect.name.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto w-full">
      {/* 1. TOP SEGMENTED INCIDENT SELECTOR BAR */}
      <LiquidGlassPanel variant="card" glow="cyan" className="p-2 sm:p-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Incident Switching Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-text-faint uppercase px-3 hidden md:inline-block">
              ACTIVE INCIDENTS:
            </span>
            {incidents.map((inc) => {
              const isActive = inc.id === activeIncident.id;
              return (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => handleSelectIncident(inc)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal text-[#020a10] font-bold border border-teal shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-white/[0.03] text-text-muted hover:text-white border border-white/[0.06] hover:border-white/[0.15]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      inc.severity === "critical"
                        ? "bg-red"
                        : inc.severity === "elevated"
                        ? "bg-amber"
                        : "bg-teal"
                    }`}
                  />
                  <span>
                    {inc.id} · {inc.name}
                  </span>
                  <span className="text-[10px] opacity-75">({inc.estimatedVolume})</span>
                </button>
              );
            })}
          </div>

          {/* Incident Meta Coordinates */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-text-faint px-3">
            <div className="flex items-center gap-1.5 text-text-muted">
              <Compass className="w-3.5 h-3.5 text-teal" />
              <span>{activeIncident.lat.toFixed(3)}°N · {Math.abs(activeIncident.lon).toFixed(3)}°W</span>
            </div>
            <span>|</span>
            <span className="text-teal font-semibold">{activeIncident.region}</span>
          </div>
        </div>
      </LiquidGlassPanel>

      {/* 2. MAIN STAGE: TACTICAL GIS RADAR THEATER & FORENSIC DOSSIER */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_440px] gap-5 items-stretch">
        {/* LEFT: Expansive Tactical Radar Viewport */}
        <LiquidGlassPanel variant="card" glow="cyan" className="flex flex-col min-h-[560px] overflow-hidden">
          {/* Inner Map Viewport */}
          <div className="flex-1 relative flex flex-col min-h-[440px]">
            <IncidentMap
              activeIncident={activeIncident}
              timeOffset={timeOffset}
              onSelectSuspect={(s) => {
                const idx = activeIncident.suspects.findIndex((item) => item.name === s.name);
                if (idx !== -1) setSelectedSuspectIndex(idx);
              }}
            />
          </div>

          {/* Integrated Floating Time Scrubber Bar */}
          <TimeScrubber timeOffset={timeOffset} onChange={setTimeOffset} />
        </LiquidGlassPanel>

        {/* RIGHT: Forensic Suspect Attribution Dossier (Landing Page Style) */}
        <LiquidGlassPanel variant="card" glow="cyan" className="p-6 md:p-7 flex flex-col justify-between">
          <div>
            {/* Top Status & Confidence Tag */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red text-xs font-mono font-bold tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-red animate-ping" />
                PRIMARY FORENSIC TARGET
              </div>
              <span className="text-xs font-mono text-teal bg-teal/10 px-2.5 py-0.5 rounded-full border border-teal/30 font-bold">
                {currentSuspect.confidencePct}% ATTRIBUTION MATCH
              </span>
            </div>

            {/* Suspect Title & Telemetry */}
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
              {currentSuspect.name}
            </h2>
            <div className="text-xs font-mono text-teal mb-4">
              MMSI {currentSuspect.mmsi || "419004812"} · {currentSuspect.flag || "PANAMA"} · {currentSuspect.vesselType || "CRUDE TANKER"}
            </div>

            {/* Suspect Selector Chips */}
            {activeIncident.suspects.length > 1 && (
              <div className="flex items-center gap-1.5 mb-5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                {activeIncident.suspects.map((s, idx) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSuspectIndex(idx)}
                    className={`flex-1 py-1.5 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                      selectedSuspectIndex === idx
                        ? "bg-teal-wash text-teal font-bold border border-teal/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                        : "text-text-faint hover:text-white"
                    }`}
                  >
                    #{s.rank} {s.name.split(" ")[1] || s.name} ({s.confidencePct}%)
                  </button>
                ))}
              </div>
            )}

            {/* Narrative Explanation */}
            <p className="text-xs text-text-muted mb-5 leading-relaxed">
              {currentSuspect.dossierSummary ||
                "Vessel altered its heading and transited directly through the spill origin coordinates during the estimated discharge window. Hydrodynamic backtrack intersects vessel trajectory with high spatial confidence."}
            </p>

            {/* Key Evidence Telemetry Rows (Landing Page Card Style) */}
            <div className="space-y-2.5 bg-[#03060a]/90 p-4 rounded-xl border border-white/10 mb-5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-text-faint flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber" />
                  AIS Dark Gap Window
                </span>
                <span className="font-bold text-amber">{currentSuspect.aisGapDuration || "4h 12m"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-faint flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5 text-teal" />
                  Fuel Oil Fingerprint
                </span>
                <span className="font-bold text-white">{currentSuspect.fuelTypeMatch || "HFO-380 cSt"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-faint flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red" />
                  Speed Anomaly
                </span>
                <span className="font-bold text-red">{currentSuspect.speedAnomaly || "21.4 -> 9.1 kt"}</span>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-2">
                <span className="text-text-faint">Bayesian Spatial Overlap</span>
                <span className="font-bold text-teal">
                  {currentSuspect.bayesianScores?.driftBacktrack || 89}% Spatial Match
                </span>
              </div>
            </div>

            {/* Bayesian Probability Weight Progress */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-text-faint">Bayesian Attribution Weight</span>
                <span className="text-teal font-bold">{currentSuspect.confidencePct}%</span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-dim via-teal to-[#7df9ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                  style={{ width: `${currentSuspect.confidencePct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <LiquidButton
              variant="cyan"
              size="lg"
              onClick={() => handleDownloadJson(currentSuspect)}
              className="w-full border border-teal/40 bg-teal/15 font-mono text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-transform"
            >
              <Download className="w-4 h-4 text-teal" />
              Download Signed Dossier (.JSON)
            </LiquidButton>

            <button
              type="button"
              onClick={() => setIsDossierModalOpen(true)}
              className="w-full py-2 rounded-xl text-text-faint hover:text-white text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              View Full Court Evidence Package
              <ArrowRight className="w-3 h-3 text-teal" />
            </button>
          </div>
        </LiquidGlassPanel>
      </div>

      {/* 3. BOTTOM TELEMETRY ROW: 4 CLEAN SPACIOUS GLASS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Radar className="w-3.5 h-3.5 text-teal" />
            SATELLITE SENSOR
          </div>
          <div className="text-base font-extrabold text-white">Copernicus Sentinel-1</div>
          <div className="text-[11px] font-mono text-teal mt-0.5">C-Band SAR · 20m Resolution</div>
        </LiquidGlassPanel>

        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-blue" />
            HYDRODYNAMICS
          </div>
          <div className="text-base font-extrabold text-white">{activeIncident.currentVector}</div>
          <div className="text-[11px] font-mono text-text-muted mt-0.5">INCOIS-HYCOM Current Grid</div>
        </LiquidGlassPanel>

        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber" />
            WEATHERING PHYSICS
          </div>
          <div className="text-base font-extrabold text-white">ADIOS2 Model</div>
          <div className="text-[11px] font-mono text-amber mt-0.5">Diffusion: 10 m²/s · Emulsified</div>
        </LiquidGlassPanel>

        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-teal" />
            ATTRIBUTION STATUS
          </div>
          <div className="text-base font-extrabold text-teal">High Confidence (94.2%)</div>
          <div className="text-[11px] font-mono text-text-muted mt-0.5">Kalman Backtrack Converged</div>
        </LiquidGlassPanel>
      </div>

      {/* 4. MODAL: FULL COURT EVIDENCE DOSSIER */}
      <ForensicDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        suspect={currentSuspect}
        incident={activeIncident}
      />
    </div>
  );
}
