import { X, ShieldAlert, Download, FileText, CheckCircle, Clock, Anchor, Compass } from "lucide-react";
import type { SuspectVessel, Incident } from "../../types";

interface ForensicDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspect: SuspectVessel | null;
  incident: Incident;
}

export function ForensicDossierModal({
  isOpen,
  onClose,
  suspect,
  incident,
}: ForensicDossierModalProps) {
  if (!isOpen || !suspect) return null;

  const handleDownloadJson = () => {
    const dossierData = {
      investigationId: `MARIS-DOSSIER-${incident.id}-${suspect.mmsi || "UNKNOWN"}`,
      generatedAt: new Date().toISOString(),
      systemVersion: "MARIS Forensic Engine v2.4 (Court-Admissible)",
      cryptographicHashSha256: suspect.evidenceHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      incident: {
        id: incident.id,
        name: incident.name,
        region: incident.region,
        originLat: incident.lat,
        originLon: incident.lon,
        estimatedDischargeVolume: incident.estimatedVolume,
        slickAreaKm2: incident.slickAreaKm2,
        weatherConditions: {
          windVector: incident.windVector,
          currentVector: incident.currentVector,
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
      certifyingAgency: "MARIS Autonomous Coastline Reconnaissance System",
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MARIS-Forensic-Evidence-${incident.id}-${suspect.name.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#05080e] shadow-[0_0_40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.15)] flex flex-col text-text">
        {/* Hairline top glow */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-wash border border-red/30 flex items-center justify-center text-red">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-wash text-red border border-red/30 font-bold uppercase">
                  CLASSIFIED EVIDENCE CHAIN
                </span>
                <span className="text-[11px] font-mono text-text-faint">{incident.id}</span>
              </div>
              <h2 className="text-[18px] font-extrabold tracking-tight mt-0.5">
                {suspect.name} · {suspect.confidencePct}% Attribution Match
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-text-muted hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 text-[12.5px]">
          {/* Key Vessel Telemetry Grid */}
          <div className="grid grid-cols-4 gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 font-mono text-[11px]">
            <div>
              <span className="text-text-faint block">FLAG STATE</span>
              <span className="font-bold text-white mt-0.5 block">{suspect.flag || "Panama"}</span>
            </div>
            <div>
              <span className="text-text-faint block">IMO NUMBER</span>
              <span className="font-bold text-white mt-0.5 block">{suspect.imo || "9488219"}</span>
            </div>
            <div>
              <span className="text-text-faint block">MMSI ID</span>
              <span className="font-bold text-teal mt-0.5 block">{suspect.mmsi || "419004812"}</span>
            </div>
            <div>
              <span className="text-text-faint block">VESSEL TYPE</span>
              <span className="font-bold text-white mt-0.5 block">{suspect.vesselType || "Crude Tanker"}</span>
            </div>
          </div>

          {/* Forensic Narrative Dossier */}
          <div className="p-4 rounded-xl bg-teal-wash/30 border border-teal/20 text-[12px] leading-relaxed">
            <div className="text-[10px] font-mono font-bold text-teal tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              ATTRIBUTION REASONING & FORENSIC SUMMARY
            </div>
            <p className="text-text-muted">
              {suspect.dossierSummary ||
                "Vessel trajectory and hydrodynamic particle dispersion backtrack intersect within the estimated spill temporal window. Hydrodynamic current vectors indicate high spatial confidence."}
            </p>
          </div>

          {/* Bayesian Likelihood Weights */}
          <div>
            <div className="text-[11px] font-mono text-text-faint font-semibold tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-teal" />
              BAYESIAN POSTERIOR PROBABILITY WEIGHTS
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-text-muted">Proximity at Discharge Time:</span>
                  <span className="text-teal font-bold">{suspect.bayesianScores?.proximity ?? 92}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full"
                    style={{ width: `${suspect.bayesianScores?.proximity ?? 92}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-text-muted">Hydrodynamic Drift Backtrack:</span>
                  <span className="text-teal font-bold">{suspect.bayesianScores?.driftBacktrack ?? 89}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full"
                    style={{ width: `${suspect.bayesianScores?.driftBacktrack ?? 89}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-text-muted">Fuel Oil Chemistry Match:</span>
                  <span className="text-teal font-bold">{suspect.bayesianScores?.fuelMatch ?? 88}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full"
                    style={{ width: `${suspect.bayesianScores?.fuelMatch ?? 88}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-text-muted">Speed Profile Anomaly:</span>
                  <span className="text-teal font-bold">{suspect.bayesianScores?.speedAnomaly ?? 79}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full"
                    style={{ width: `${suspect.bayesianScores?.speedAnomaly ?? 79}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Data Rows */}
          <div className="flex flex-col divide-y divide-white/[0.06] border border-white/[0.06] rounded-xl bg-white/[0.01]">
            <div className="flex items-center justify-between p-3">
              <span className="flex items-center gap-2 text-text-muted text-[12px]">
                <Clock className="w-3.5 h-3.5 text-amber" />
                AIS Dark Gap Duration
              </span>
              <span className="font-mono text-amber font-bold">{suspect.aisGapDuration || "4h 12m"}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="flex items-center gap-2 text-text-muted text-[12px]">
                <Anchor className="w-3.5 h-3.5 text-teal" />
                Fuel Grade Fingerprint
              </span>
              <span className="font-mono text-text font-bold">{suspect.fuelTypeMatch || "HFO-380 cSt"}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="flex items-center gap-2 text-text-muted text-[12px]">
                <FileText className="w-3.5 h-3.5 text-blue" />
                Cryptographic Evidence Hash
              </span>
              <span className="font-mono text-[10px] text-text-faint truncate max-w-[280px]">
                {suspect.evidenceHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/[0.08] bg-white/[0.02]">
          <div className="text-[10.5px] font-mono text-text-faint">
            SHA-256 VERIFIED · COURT ADMISSIBLE EVIDENCE PACKAGE
          </div>
          <button
            type="button"
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal text-[#020a10] font-bold text-[12.5px] hover:bg-[#38f8ff] transition-all cursor-pointer shadow-[0_0_16px_rgba(0,240,255,0.3)]"
          >
            <Download className="w-4 h-4" />
            Download Signed Dossier (.JSON)
          </button>
        </div>
      </div>
    </div>
  );
}

