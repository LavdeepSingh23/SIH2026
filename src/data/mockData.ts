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
  {
    id: "INC-0417",
    name: "Shellcreek Strait",
    tonnage: "1,240 t",
    status: "confirmed · 48h",
    severity: "critical",
    lat: 58.421,
    lon: -6.114,
    region: "North Sea / Minch Basin",
    timeDetected: "T-0 (14:15 UTC)",
    estimatedVolume: "1,240 MT",
    slickAreaKm2: 48.6,
    windVector: "18.4 kt @ 245° (SW)",
    currentVector: "1.42 m/s @ 064° (ENE)",
    suspects: [
      {
        rank: 1,
        name: "M/T NORDBLOM",
        confidencePct: 87,
        note: "AIS gap · fuel load consistent",
        id: "v-nordblom",
        mmsi: "419004812",
        imo: "9488219",
        flag: "Panama",
        vesselType: "Crude Oil Tanker",
        aisGapDuration: "4h 12m",
        fuelTypeMatch: "HFO-380 cSt (High Sulfur)",
        speedAnomaly: "21.4 kt -> 9.1 kt (Decel at origin)",
        evidenceHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        bayesianScores: {
          proximity: 92,
          fuelMatch: 88,
          driftBacktrack: 89,
          speedAnomaly: 79,
        },
        dossierSummary:
          "Vessel deactivated AIS transponder at 58.39°N 006.18°W for 4h 12m during transit through Shellcreek Strait. ADIOS2 hydrodynamic backtrack intersects slick origin with 94.2% spatial confidence. Discharge volume aligns with high-load bilge/slop tank purge.",
      },
      {
        rank: 2,
        name: "M/T KESTREL",
        confidencePct: 61,
        note: "Within 2.4 nm · speed anomaly",
        id: "v-kestrel",
        mmsi: "311887220",
        imo: "9312044",
        flag: "Marshall Islands",
        vesselType: "Chemical Tanker",
        aisGapDuration: "None (Live AIS)",
        fuelTypeMatch: "MGO (Marine Gas Oil)",
        speedAnomaly: "13.1 kt (Steady passage)",
        evidenceHash: "7d793037a0760186574b0282f2f435e78a48b8c7b8d4f0a2e1d2c3b4a5b6c7d8",
        bayesianScores: {
          proximity: 76,
          fuelMatch: 52,
          driftBacktrack: 64,
          speedAnomaly: 52,
        },
        dossierSummary:
          "Within 2.4 nm of slick origin at T-12h. Speed profile constant; satellite radar cross section matches medium tanker profile.",
      },
      {
        rank: 3,
        name: "M/T VALE",
        confidencePct: 34,
        note: "Route overlap · low proximity",
        id: "v-vale",
        mmsi: "228004311",
        imo: "9194458",
        flag: "Liberia",
        vesselType: "Bulk Carrier",
        aisGapDuration: "28m",
        fuelTypeMatch: "VLSFO 0.5%",
        speedAnomaly: "None (9.8 kt)",
        evidenceHash: "3c9a05b38d7d91e6b8d348a0a1f9e2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
        bayesianScores: {
          proximity: 41,
          fuelMatch: 35,
          driftBacktrack: 38,
          speedAnomaly: 22,
        },
        dossierSummary:
          "Route overlap during morning transit. Cross-track drift distance exceeds primary 3-sigma dispersion contour.",
      },
    ],
  },
  {
    id: "INC-0418",
    name: "Nordfjord Approach",
    tonnage: "310 t",
    status: "attribution",
    severity: "elevated",
    lat: 61.912,
    lon: 5.084,
    region: "Norwegian Sea / Sogn Fjord",
    timeDetected: "T-8h (06:30 UTC)",
    estimatedVolume: "310 MT",
    slickAreaKm2: 14.2,
    windVector: "12.1 kt @ 310° (NW)",
    currentVector: "0.85 m/s @ 022° (NNE)",
    suspects: [
      {
        rank: 1,
        name: "MV BERGEN STAR",
        confidencePct: 74,
        note: "Deceleration anomaly outside pilot zone",
        id: "v-bergen",
        mmsi: "257119004",
        imo: "9214430",
        flag: "Norway",
        vesselType: "Container Ship",
        aisGapDuration: "1h 45m",
        fuelTypeMatch: "VLSFO 0.5%",
        speedAnomaly: "16.0 kt -> 8.5 kt (Offshore halt)",
        evidenceHash: "98234fedcba0987654321fedcba09876543210fedcba09876543210fedcba098",
        bayesianScores: {
          proximity: 82,
          fuelMatch: 75,
          driftBacktrack: 78,
          speedAnomaly: 61,
        },
        dossierSummary:
          "Sudden deceleration observed outside Norwegian pilotage waters. Backscatter oil thickness matches heavy bunker emulsification.",
      },
      {
        rank: 2,
        name: "MT SOLVIK",
        confidencePct: 42,
        note: "Transited 4.8 nm seaward",
        id: "v-solvik",
        mmsi: "259887002",
        imo: "9018442",
        flag: "Sweden",
        vesselType: "Product Tanker",
        aisGapDuration: "None",
        fuelTypeMatch: "MDO",
        speedAnomaly: "None (12.6 kt)",
        evidenceHash: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        bayesianScores: {
          proximity: 48,
          fuelMatch: 40,
          driftBacktrack: 45,
          speedAnomaly: 35,
        },
        dossierSummary:
          "Transited 4.8 nm seaward of slick envelope. Low probability correlation with surface current model.",
      },
    ],
  },
  {
    id: "INC-0419",
    name: "Skerry Pass",
    tonnage: "monitoring",
    status: "low load",
    severity: "watch",
    lat: 57.142,
    lon: -7.312,
    region: "Outer Hebrides / Atlantic Shelf",
    timeDetected: "T-22h (18:40 UTC)",
    estimatedVolume: "85 MT",
    slickAreaKm2: 6.8,
    windVector: "24.5 kt @ 210° (SSW)",
    currentVector: "1.90 m/s @ 045° (NE)",
    suspects: [
      {
        rank: 1,
        name: "MV TALARA",
        confidencePct: 68,
        note: "Drifting vessel · unlogged bilge wash",
        id: "v-talara",
        mmsi: "701234098",
        imo: "8821901",
        flag: "Peru",
        vesselType: "Stern Trawler",
        aisGapDuration: "6h 10m",
        fuelTypeMatch: "Marine Diesel Oil",
        speedAnomaly: "7.2 kt -> 2.1 kt (Drifting)",
        evidenceHash: "445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233",
        bayesianScores: {
          proximity: 72,
          fuelMatch: 69,
          driftBacktrack: 71,
          speedAnomaly: 60,
        },
        dossierSummary:
          "Unregistered bilge wash pattern detected during stormy sea state. Transponder intermittent over 6 hours.",
      },
      {
        rank: 2,
        name: "M/T KESTREL",
        confidencePct: 29,
        note: "Distant peripheral track",
        id: "v-kestrel-skerry",
        mmsi: "311887220",
        imo: "9312044",
        flag: "Marshall Islands",
        vesselType: "Chemical Tanker",
        aisGapDuration: "None",
        fuelTypeMatch: "MGO",
        speedAnomaly: "None",
        evidenceHash: "7d793037a0760186574b0282f2f435e78a48b8c7b8d4f0a2e1d2c3b4a5b6c7d8",
        bayesianScores: {
          proximity: 32,
          fuelMatch: 28,
          driftBacktrack: 30,
          speedAnomaly: 26,
        },
        dossierSummary: "Distant peripheral transit. High spatial uncertainty.",
      },
    ],
  },
];

export const suspects: SuspectVessel[] = incidents[0].suspects;

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
