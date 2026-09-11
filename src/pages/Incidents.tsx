import { useState } from "react";
import { Globe, Layers, Radar, Compass, Download, Clock, Anchor, Activity, FileCheck2, ChevronRight, ChevronLeft, ShieldAlert, Waves } from "lucide-react";
import { LiquidGlassPanel } from "../components/ui/LiquidGlassPanel";
import { LiquidButton } from "../components/ui/button";
import { InteractiveEarth } from "../components/earth/InteractiveEarth";
import { GoogleEarthMap } from "../components/earth/GoogleEarthMap";
import { IncidentMap } from "../components/maps/IncidentMap";
import { TimeScrubber } from "../components/console/TimeScrubber";
import { ForensicDossierModal } from "../components/console/ForensicDossierModal";
import { GLOBAL_INCIDENTS, type IncidentHotspot } from "../components/earth/earthUtils";
import { incidents } from "../data/mockData";
import type { Incident, SuspectVessel } from "../types";

export default function Incidents() {
  const [viewMode, setViewMode] = useState<"globe" | "google" | "radar">("globe");
  const [selectedHotspot, setSelectedHotspot] = useState<IncidentHotspot>(GLOBAL_INCIDENTS[0]);
  const [activeIncident, setActiveIncident] = useState<Incident>(incidents[0]);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [selectedSuspectIndex, setSelectedSuspectIndex] = useState<number>(0);
  const [isDossierOpen, setIsDossierOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Layers for 3D Earth
  const [showSAR, setShowSAR] = useState(true);
  const [showAIS, setShowAIS] = useState(true);
  const [showDrift, setShowDrift] = useState(true);

  const currentSuspect: SuspectVessel =
    activeIncident.suspects[selectedSuspectIndex] || activeIncident.suspects[0];

  const handleSelectHotspot = (hotspot: IncidentHotspot) => {
    setSelectedHotspot(hotspot);
    const matched = incidents.find((i) => i.id === hotspot.id) || {
      id: hotspot.id,
      name: hotspot.name,
      tonnage: hotspot.spillTonnage,
      status: "monitoring",
      severity: hotspot.severity,
      lat: hotspot.lat,
      lon: hotspot.lng,
      region: hotspot.region,
      timeDetected: "T-0 (14:15 UTC)",
      estimatedVolume: hotspot.spillTonnage,
      slickAreaKm2: 38.4,
      windVector: "16.2 kt @ 230°",
      currentVector: "1.4 kt @ 070°",
      suspects: [
        {
          rank: 1,
          name: hotspot.suspect,
          confidencePct: hotspot.confidence,
          note: hotspot.description,
          mmsi: "419004812",
          flag: "Panama",
          vesselType: "Crude Oil Tanker",
          aisGapDuration: "4h 12m",
          fuelTypeMatch: "HFO-380 cSt",
          speedAnomaly: "Offshore deceleration detected",
          dossierSummary: hotspot.description,
        },
      ],
    };
    setActiveIncident(matched);
    setTimeOffset(0);
    setSelectedSuspectIndex(0);
  };

  const handleDownloadJson = (suspect: SuspectVessel) => {
    const dossierData = {
      investigationId: `MARIS-DOSSIER-${activeIncident.id}-${suspect.mmsi || "UNKNOWN"}`,
      generatedAt: new Date().toISOString(),
      systemVersion: "MARIS 3D Autonomous Surveillance Engine v2.5",
      cryptographicHashSha256:
        suspect.evidenceHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      incident: {
        id: activeIncident.id,
        name: activeIncident.name,
        region: activeIncident.region,
        coordinates: { lat: activeIncident.lat, lon: activeIncident.lon },
        estimatedVolume: activeIncident.estimatedVolume,
        slickAreaKm2: activeIncident.slickAreaKm2,
      },
      primarySuspect: {
        vesselName: suspect.name,
        rank: suspect.rank,
        attributionConfidence: `${suspect.confidencePct}%`,
        mmsi: suspect.mmsi,
        flag: suspect.flag,
        vesselType: suspect.vesselType,
        aisDarkGapDuration: suspect.aisGapDuration,
        fuelMatch: suspect.fuelTypeMatch,
        speedAnomaly: suspect.speedAnomaly,
        bayesianBreakdown: suspect.bayesianScores,
        evidenceSummary: suspect.dossierSummary,
      },
      status: "VERIFIED_TAMPER_EVIDENT",
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
    <div className="flex flex-col gap-4 max-w-[1700px] mx-auto w-full">
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING COMMAND DOCK (21st.dev Liquid Glass Pill) */}
      {/* ========================================================================= */}
      <LiquidGlassPanel variant="card" glow="cyan" className="p-2 sm:p-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Incident Hotspot Pills (Auto-spins 3D globe) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-text-faint uppercase px-2 hidden sm:inline-block">
              TARGET INCIDENTS:
            </span>
            {GLOBAL_INCIDENTS.map((hotspot) => {
              const isActive = hotspot.id === activeIncident.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => handleSelectHotspot(hotspot)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal text-[#020a10] font-bold border border-teal shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-white/[0.03] text-text-muted hover:text-white border border-white/[0.06] hover:border-white/[0.15]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hotspot.severity === "critical"
                        ? "bg-red animate-pulse"
                        : hotspot.severity === "elevated"
                        ? "bg-amber"
                        : "bg-teal"
                    }`}
                  />
                  <span>
                    {hotspot.id} · {hotspot.name}
                  </span>
                  <span className="text-[10px] opacity-75">({hotspot.spillTonnage})</span>
                </button>
              );
            })}
          </div>

          {/* Viewport Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-black/60 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("globe")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                viewMode === "globe"
                  ? "bg-teal text-[#020a10] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  : "text-text-muted hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              3D Orbit
            </button>
            <button
              type="button"
              onClick={() => setViewMode("google")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                viewMode === "google"
                  ? "bg-teal text-[#020a10] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  : "text-text-muted hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Google Earth
            </button>
            <button
              type="button"
              onClick={() => setViewMode("radar")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                viewMode === "radar"
                  ? "bg-teal text-[#020a10] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  : "text-text-muted hover:text-white"
              }`}
            >
              <Radar className="w-3.5 h-3.5" />
              Radar HUD
            </button>
          </div>
        </div>
      </LiquidGlassPanel>

      {/* ========================================================================= */}
      {/* 2. LIVING SURVEILLANCE STAGE: FULL-HEIGHT 3D GLOBE + FLOATING GLASS HUD */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[660px] lg:h-[720px] rounded-2xl overflow-hidden border border-white/10 bg-[#000000] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col isolate">
        {/* Background Viewport: 3D Orbit Globe / Google Earth / Tactical Radar */}
        <div className="absolute inset-0 z-0">
          {viewMode === "globe" && (
            <InteractiveEarth
              selectedIncident={selectedHotspot}
              onSelectIncident={handleSelectHotspot}
              showSARLayer={showSAR}
              showAISLayer={showAIS}
              showDriftLayer={showDrift}
            />
          )}

          {viewMode === "google" && (
            <GoogleEarthMap
              selectedIncident={selectedHotspot}
              onSelectIncident={handleSelectHotspot}
              showDriftLayer={showDrift}
            />
          )}

          {viewMode === "radar" && (
            <IncidentMap
              activeIncident={activeIncident}
              timeOffset={timeOffset}
              onSelectSuspect={(s) => {
                const idx = activeIncident.suspects.findIndex((item) => item.name === s.name);
                if (idx !== -1) setSelectedSuspectIndex(idx);
              }}
            />
          )}
        </div>

        {/* Top Floating Telemetry Overlay on Globe */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-xl border border-white/10 text-xs font-mono pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
            </span>
            <span className="text-teal font-bold tracking-wider">
              {viewMode === "globe" ? "3D ORBITAL SURVEILLANCE" : viewMode === "google" ? "GOOGLE EARTH 3D SATELLITE" : "TACTICAL RADAR SCAN"}
            </span>
            <span className="text-text-faint">|</span>
            <span className="text-white font-semibold">{activeIncident.region}</span>
          </div>

          {/* Layer toggles for 3D Globe */}
          {viewMode === "globe" && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/75 backdrop-blur-xl border border-white/10 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowSAR(!showSAR)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  showSAR ? "bg-teal-wash text-teal font-bold border border-teal/40" : "text-text-faint hover:text-white"
                }`}
              >
                SAR Orbit
              </button>
              <button
                type="button"
                onClick={() => setShowAIS(!showAIS)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  showAIS ? "bg-teal-wash text-teal font-bold border border-teal/40" : "text-text-faint hover:text-white"
                }`}
              >
                AIS Routes
              </button>
              <button
                type="button"
                onClick={() => setShowDrift(!showDrift)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  showDrift ? "bg-teal-wash text-teal font-bold border border-teal/40" : "text-text-faint hover:text-white"
                }`}
              >
                Drift Cone
              </button>
            </div>
          )}
        </div>

        {/* RIGHT FLOATING FORENSIC INTELLIGENCE CARD (21st.dev Liquid Glass) */}
        <div
          className={`absolute top-4 right-4 z-20 transition-all duration-300 pointer-events-auto ${
            isDossierOpen ? "w-[380px] sm:w-[420px]" : "w-auto"
          }`}
        >
          {isDossierOpen ? (
            <LiquidGlassPanel variant="card" glow="cyan" className="p-5 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.95)]">
              {/* Header with Collapse toggle */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-red text-xs font-mono font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red animate-ping" />
                  PRIMARY ATTRIBUTION TARGET
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-teal bg-teal/10 px-2 py-0.5 rounded-full border border-teal/30 font-bold">
                    {currentSuspect.confidencePct}% MATCH
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDossierOpen(false)}
                    className="p-1 rounded-md text-text-faint hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Collapse dossier"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Suspect Title & Details */}
              <h3 className="text-2xl font-black text-white tracking-tight mb-0.5">
                {currentSuspect.name}
              </h3>
              <div className="text-[11px] font-mono text-teal mb-3">
                MMSI {currentSuspect.mmsi || "419004812"} · {currentSuspect.flag || "PANAMA"} · {currentSuspect.vesselType || "CRUDE TANKER"}
              </div>

              {/* Suspect Selector Chips */}
              {activeIncident.suspects.length > 1 && (
                <div className="flex items-center gap-1.5 mb-3.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  {activeIncident.suspects.map((s, idx) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedSuspectIndex(idx)}
                      className={`flex-1 py-1 text-[10.5px] font-mono rounded-lg transition-all cursor-pointer ${
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

              {/* Narrative Summary */}
              <p className="text-[11.5px] text-text-muted mb-4 leading-relaxed line-clamp-3">
                {currentSuspect.dossierSummary ||
                  "Vessel transited through the spill origin coordinates during the estimated discharge window. Hydrodynamic backtrack intersects vessel trajectory with high spatial confidence."}
              </p>

              {/* Key Telemetry Rows */}
              <div className="space-y-2 bg-[#03060a]/90 p-3.5 rounded-xl border border-white/10 mb-4 text-[11px] font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-text-faint flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber" />
                    AIS Dark Window
                  </span>
                  <span className="font-bold text-amber">{currentSuspect.aisGapDuration || "4h 12m"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-faint flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-teal" />
                    Fuel Oil Match
                  </span>
                  <span className="font-bold text-white">{currentSuspect.fuelTypeMatch || "HFO-380 cSt"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-faint flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-red" />
                    Speed Profile
                  </span>
                  <span className="font-bold text-red">{currentSuspect.speedAnomaly || "Decel at origin"}</span>
                </div>
              </div>

              {/* Bayesian Progress */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[10.5px] font-mono">
                  <span className="text-text-faint">Bayesian Attribution Weight</span>
                  <span className="text-teal font-bold">{currentSuspect.confidencePct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-dim via-teal to-[#7df9ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                    style={{ width: `${currentSuspect.confidencePct}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <LiquidButton
                  variant="cyan"
                  size="default"
                  onClick={() => handleDownloadJson(currentSuspect)}
                  className="w-full border border-teal/40 bg-teal/15 font-mono text-[11px] tracking-wider uppercase shadow-[0_0_16px_rgba(0,240,255,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                  <Download className="w-3.5 h-3.5 text-teal" />
                  Download Signed Dossier (.JSON)
                </LiquidButton>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-1.5 rounded-lg text-text-faint hover:text-white text-[10.5px] font-mono flex items-center justify-center gap-1 transition-colors"
                >
                  <FileCheck2 className="w-3 h-3" />
                  View Full Evidence Package →
                </button>
              </div>
            </LiquidGlassPanel>
          ) : (
            <button
              type="button"
              onClick={() => setIsDossierOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-black/80 backdrop-blur-xl border border-teal/40 text-teal font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(0,240,255,0.25)] hover:bg-teal-wash transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>FORENSIC DOSSIER ({currentSuspect.confidencePct}%)</span>
            </button>
          )}
        </div>

        {/* BOTTOM FLOATING TIME-SCRUBBER CAPSULE */}
        <div className="absolute bottom-4 inset-x-4 z-20 max-w-2xl mx-auto pointer-events-auto">
          <LiquidGlassPanel variant="card" glow="subtle" className="p-2 shadow-[0_0_30px_rgba(0,0,0,0.85)]">
            <TimeScrubber timeOffset={timeOffset} onChange={setTimeOffset} />
          </LiquidGlassPanel>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM TELEMETRY ROW: 4 CLEAN GLASS METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Radar className="w-3.5 h-3.5 text-teal" />
            SATELLITE SENSOR
          </div>
          <div className="text-base font-extrabold text-white">Copernicus Sentinel-1</div>
          <div className="text-[11px] font-mono text-teal mt-0.5">C-Band SAR · 20m Dual-Pol (VV/VH)</div>
        </LiquidGlassPanel>

        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-blue" />
            HYDRODYNAMICS
          </div>
          <div className="text-base font-extrabold text-white">{activeIncident.currentVector}</div>
          <div className="text-[11px] font-mono text-text-muted mt-0.5">INCOIS-HYCOM Lagrangian Grid</div>
        </LiquidGlassPanel>

        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber" />
            WEATHERING PHYSICS
          </div>
          <div className="text-base font-extrabold text-white">ADIOS2 Model</div>
          <div className="text-[11px] font-mono text-amber mt-0.5">10 m²/s Diffusion · Emulsification</div>
        </LiquidGlassPanel>

        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-teal" />
            ATTRIBUTION STATUS
          </div>
          <div className="text-base font-extrabold text-teal">High Confidence ({currentSuspect.confidencePct}%)</div>
          <div className="text-[11px] font-mono text-text-muted mt-0.5">Kalman Particle Backtrack Lock</div>
        </LiquidGlassPanel>
      </div>

      {/* MODAL: FULL COURT EVIDENCE DOSSIER */}
      <ForensicDossierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suspect={currentSuspect}
        incident={activeIncident}
      />
    </div>
  );
}
