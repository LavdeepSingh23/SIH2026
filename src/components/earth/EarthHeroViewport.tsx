import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Layers, Radar, Ship, Waves, ArrowRight, X } from "lucide-react";
import { InteractiveEarth } from "./InteractiveEarth";
import { GoogleEarthMap } from "./GoogleEarthMap";
import { GLOBAL_INCIDENTS, type IncidentHotspot } from "./earthUtils";

export function EarthHeroViewport() {
  const [viewMode, setViewMode] = useState<"globe" | "google">("globe");
  const [selectedIncident, setSelectedIncident] = useState<IncidentHotspot | null>(GLOBAL_INCIDENTS[0]);

  const [showSAR, setShowSAR] = useState(true);
  const [showAIS, setShowAIS] = useState(true);
  const [showDrift, setShowDrift] = useState(true);

  return (
    <div className="relative w-full h-[580px] lg:h-[640px] rounded-2xl overflow-hidden border border-border bg-panel shadow-2xl flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-panel/90 backdrop-blur-md border border-border-soft rounded-lg pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode("globe")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === "globe"
                ? "bg-teal text-[#081420] shadow-[0_0_12px_rgba(53,214,196,0.3)]"
                : "text-text-muted hover:text-text hover:bg-panel-soft"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            3D Global Orbit
          </button>
          <button
            type="button"
            onClick={() => setViewMode("google")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === "google"
                ? "bg-teal text-[#081420] shadow-[0_0_12px_rgba(53,214,196,0.3)]"
                : "text-text-muted hover:text-text hover:bg-panel-soft"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Google Earth 3D
          </button>
        </div>

        {/* Right: Layer Toggles (for 3D Globe) */}
        {viewMode === "globe" && (
          <div className="flex items-center gap-1.5 p-1 bg-panel/90 backdrop-blur-md border border-border-soft rounded-lg pointer-events-auto shadow-lg">
            <button
              type="button"
              onClick={() => setShowSAR(!showSAR)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                showSAR ? "text-teal bg-teal-wash border border-teal-dim" : "text-text-muted border border-transparent"
              }`}
              title="Toggle Sentinel-1 SAR Satellite & Radar Scan"
            >
              <Radar className="w-3 h-3" />
              SAR Satellite
            </button>
            <button
              type="button"
              onClick={() => setShowAIS(!showAIS)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                showAIS ? "text-teal bg-teal-wash border border-teal-dim" : "text-text-muted border border-transparent"
              }`}
              title="Toggle AIS Vessel Trajectory Arcs"
            >
              <Ship className="w-3 h-3" />
              AIS Routes
            </button>
            <button
              type="button"
              onClick={() => setShowDrift(!showDrift)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                showDrift ? "text-teal bg-teal-wash border border-teal-dim" : "text-text-muted border border-transparent"
              }`}
              title="Toggle Hydrodynamic Dispersion Vectors"
            >
              <Waves className="w-3 h-3" />
              Spill Drift
            </button>
          </div>
        )}
      </div>

      {/* Main 3D / Satellite Viewport */}
      <div className="w-full flex-1 min-h-0 relative">
        {viewMode === "globe" ? (
          <InteractiveEarth
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            showSARLayer={showSAR}
            showAISLayer={showAIS}
            showDriftLayer={showDrift}
          />
        ) : (
          <GoogleEarthMap
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            showDriftLayer={showDrift}
          />
        )}
      </div>

      {/* Bottom Floating Incident Strip */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pointer-events-none">
        {/* Hotspot quick-selector chips */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-panel/85 backdrop-blur-md p-2 rounded-xl border border-border-soft">
          <span className="text-[10px] font-bold text-text-faint tracking-wider uppercase px-1">INCIDENTS:</span>
          {GLOBAL_INCIDENTS.map((inc) => (
            <button
              key={inc.id}
              type="button"
              onClick={() => setSelectedIncident(inc)}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-bold transition-all flex items-center gap-1.5 ${
                selectedIncident?.id === inc.id
                  ? "bg-teal-wash border border-teal text-teal shadow-[0_0_8px_rgba(53,214,196,0.2)]"
                  : "bg-panel-soft border border-border text-text-muted hover:text-text hover:border-border-soft"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  inc.severity === "critical" ? "bg-red" : inc.severity === "elevated" ? "bg-amber" : "bg-teal"
                }`}
              />
              {inc.name}
            </button>
          ))}
        </div>

        {/* Selected Incident Telemetry HUD Card */}
        {selectedIncident && (
          <div className="w-full sm:w-[320px] bg-panel/95 backdrop-blur-xl border border-teal-dim/60 rounded-xl p-4 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9.5px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      selectedIncident.severity === "critical"
                        ? "bg-red-wash text-red"
                        : selectedIncident.severity === "elevated"
                        ? "bg-amber/10 text-amber"
                        : "bg-teal-wash text-teal"
                    }`}
                  >
                    {selectedIncident.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-text-faint">{selectedIncident.id}</span>
                </div>
                <h4 className="text-sm font-bold text-text mt-1">{selectedIncident.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="text-text-faint hover:text-text p-1 rounded hover:bg-panel-soft"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 text-[11.5px] border-t border-border-soft pt-2 mb-3">
              <div className="flex justify-between">
                <span className="text-text-faint">Coordinates</span>
                <span className="font-mono text-text-muted">
                  {selectedIncident.lat.toFixed(2)}°N, {Math.abs(selectedIncident.lng).toFixed(2)}°{selectedIncident.lng < 0 ? "W" : "E"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-faint">Spill Tonnage</span>
                <span className="font-semibold text-text">{selectedIncident.spillTonnage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-faint">Suspect Attribution</span>
                <span className="font-bold text-teal flex items-center gap-1">
                  {selectedIncident.suspect.split(" ")[0]} ({selectedIncident.confidence}%)
                </span>
              </div>
            </div>

            <Link
              to="/console"
              className="w-full py-2 px-3 rounded-md bg-teal text-[#081420] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-teal/90 transition-all shadow-[0_0_12px_rgba(53,214,196,0.25)]"
            >
              Investigate in Console
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Orbit Navigation Hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-1.5 text-[10px] font-mono text-text-faint bg-panel/60 backdrop-blur-md px-3 py-1 rounded-full border border-border-soft pointer-events-none">
        <span>DRAG TO ROTATE GLOBE</span>
        <span>·</span>
        <span>SCROLL TO ZOOM</span>
        <span>·</span>
        <span>CLICK PIN TO FLY-TO</span>
      </div>
    </div>
  );
}
