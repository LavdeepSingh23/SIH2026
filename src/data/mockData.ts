import type {
  Incident,
  Vessel,
  SuspectVessel,
  PipelineStage,
  AlertItem,
  DriftRun,
  HealthComponent,
  StatCardData,
} from "../types";

export const incidentStats: StatCardData[] = [
  { label: "ACTIVE INCIDENTS", value: "3", delta: "+1", icon: "warning" },
  { label: "SUSPECT VESSELS", value: "12", unit: "AIS", icon: "vessel" },
  { label: "DRIFT FORECAST", value: "48", unit: "hours", icon: "wave" },
  { label: "MODEL HEALTH", value: "98%", unit: "nominal", accent: "teal", icon: "pulse" },
];

export const vesselStats: StatCardData[] = [
  { label: "TRACKED VESSELS", value: "342", icon: "vessel" },
  { label: "AIS-DARK NOW", value: "7", accent: "red", icon: "dark" },
  { label: "FLAGGED / HIGH RISK", value: "12", icon: "flag" },
  { label: "NEW TODAY", value: "5", delta: "+5", icon: "plus" },
];

export const driftStats: StatCardData[] = [
  { label: "ACTIVE SIMULATIONS", value: "2", icon: "wave" },
  { label: "PARTICLES MODELED", value: "50", unit: "k", icon: "particles" },
  { label: "FORECAST HORIZON", value: "72", unit: "hours", icon: "clock" },
  { label: "LAST RUN", value: "6", unit: "min ago", accent: "teal", icon: "clock" },
];

export const alertStats: StatCardData[] = [
  { label: "OPEN ALERTS", value: "9", icon: "bell" },
  { label: "CRITICAL", value: "2", accent: "red", icon: "warning" },
  { label: "ACKNOWLEDGED TODAY", value: "14", icon: "check" },
  { label: "AVG RESPONSE", value: "4", unit: "min", accent: "teal", icon: "clock" },
];

export const healthStats: StatCardData[] = [
  { label: "OVERALL UPTIME", value: "99.4%", accent: "teal", icon: "pulse" },
  { label: "AVG INFERENCE LATENCY", value: "860", unit: "ms", icon: "clock" },
  { label: "DATA FRESHNESS", value: "2", unit: "min", icon: "wave" },
  { label: "FAILED JOBS · 24H", value: "1", accent: "amber", icon: "warning" },
];

export const incidents: Incident[] = [
  { id: "INC-0417", name: "Shellcreek Strait", tonnage: "1,240 t", status: "confirmed · 48h", severity: "critical" },
  { id: "INC-0418", name: "Nordfjord", tonnage: "310 t", status: "attribution", severity: "elevated" },
  { id: "INC-0419", name: "Skerry Pass", tonnage: "monitoring", status: "low load", severity: "watch" },
];

export const suspects: SuspectVessel[] = [
  { rank: 1, name: "M/T NORDBLOM", confidencePct: 87, note: "AIS gap · fuel load consistent" },
  { rank: 2, name: "M/T KESTREL", confidencePct: 61, note: "Within 2.4 nm · speed anomaly" },
  { rank: 3, name: "M/T VALE", confidencePct: 34, note: "Route overlap · low proximity" },
];

export const pipelineStatus: PipelineStage[] = [
  { label: "SAR / EO ingest", state: "live" },
  { label: "Drift model", state: "running" },
  { label: "Vessel match", state: "queued", detail: "Queued · 4" },
  { label: "Evidence store", state: "synced" },
  { label: "Alert routing", state: "held", detail: "1 held" },
];

export const vessels: Vessel[] = [
  { id: "1", name: "M/T Nordblom", mmsi: "419004812", flag: "Panama", type: "Tanker", speedKt: 21.4, aisStatus: "dark", riskScore: 87 },
  { id: "2", name: "M/T Kestrel", mmsi: "311887220", flag: "Marshall Is.", type: "Tanker", speedKt: 13.1, aisStatus: "live", riskScore: 61 },
  { id: "3", name: "M/T Vale", mmsi: "228004311", flag: "Liberia", type: "Tanker", speedKt: 9.8, aisStatus: "live", riskScore: 34 },
  { id: "4", name: "MV Bergen Star", mmsi: "257119004", flag: "Norway", type: "Cargo", speedKt: 16.0, aisStatus: "live", riskScore: 18 },
  { id: "5", name: "MV Talara", mmsi: "701234098", flag: "Peru", type: "Fishing", speedKt: 7.2, aisStatus: "dark", riskScore: 45 },
  { id: "6", name: "MT Solvik", mmsi: "259887002", flag: "Sweden", type: "Tanker", speedKt: 12.6, aisStatus: "live", riskScore: 9 },
];

export const fleetDistribution = [
  { label: "Tanker", count: 120, pct: 80 },
  { label: "Cargo", count: 90, pct: 60 },
  { label: "Fishing", count: 60, pct: 40 },
  { label: "Other", count: 72, pct: 48 },
];

export const topFlagStates = [
  { label: "Panama", count: 64 },
  { label: "Marshall Islands", count: 51 },
  { label: "Liberia", count: 47 },
  { label: "Norway", count: 33 },
];

export const driftParameters = [
  { label: "Ocean currents", value: "INCOIS HYCOM" },
  { label: "Wind field", value: "IMD GFS 0.25°" },
  { label: "Time step", value: "15 min" },
  { label: "Particle count", value: "50,000" },
  { label: "Diffusion coeff.", value: "10 m²/s" },
  { label: "Weathering model", value: "ADIOS2" },
];

export const driftQueue: DriftRun[] = [
  { id: "1", label: "INC-0417 · ensemble", horizon: "72h horizon", state: "running" },
  { id: "2", label: "INC-0418 · forward", horizon: "48h horizon", state: "queued" },
  { id: "3", label: "INC-0419 · backward", horizon: "24h hindcast", state: "queued" },
];

export const alerts: AlertItem[] = [
  { title: "AIS gap detected — M/T Nordblom", detail: "went dark near active drift cone · INC-0417", time: "14:12", severity: "critical" },
  { title: "Model confidence spike — M/T Nordblom", detail: "attribution score crossed 85% threshold", time: "14:34", severity: "critical" },
  { title: "New SAR pass ingested", detail: "reprocessing spill boundary for INC-0417", time: "13:58", severity: "elevated" },
  { title: "Drift forecast updated", detail: "revised wind data applied to run #4471", time: "13:20", severity: "watch" },
  { title: "Speed anomaly — M/T Kestrel", detail: "14.2 kt over posted route limit", time: "12:45", severity: "elevated" },
  { title: "Evidence chain synced", detail: "3 new records added to case INC-0417", time: "11:58", severity: "watch" },
];

export const healthComponents: HealthComponent[] = [
  { name: "SAR / EO ingest", status: "Operational", latency: "142 ms avg", spark: [18, 14, 16, 10, 12, 8, 10, 6] },
  { name: "Spill detection", status: "Operational", latency: "310 ms avg", spark: [10, 12, 9, 14, 11, 13, 10, 12] },
  { name: "Drift model", status: "Running", latency: "2.1 s avg", spark: [20, 16, 18, 10, 14, 8, 12, 9] },
  { name: "Vessel attribution", status: "Degraded", latency: "4.8 s avg", spark: [8, 14, 10, 18, 15, 22, 17, 20] },
  { name: "Evidence fusion", status: "Operational", latency: "96 ms avg", spark: [14, 12, 13, 11, 12, 10, 11, 9] },
  { name: "Alert engine", status: "Operational", latency: "44 ms avg", spark: [12, 13, 11, 12, 10, 12, 11, 10] },
];
