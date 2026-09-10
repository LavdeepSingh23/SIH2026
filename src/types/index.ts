export type Severity = "critical" | "elevated" | "watch";
export type AisStatus = "live" | "dark";
export type PipelineState = "live" | "running" | "queued" | "synced" | "held" | "degraded";

export interface Incident {
  id: string;
  name: string;
  tonnage: string;
  status: string;
  severity: Severity;
}

export interface Vessel {
  id: string;
  name: string;
  mmsi: string;
  flag: string;
  type: string;
  speedKt: number;
  aisStatus: AisStatus;
  riskScore: number;
}

export interface SuspectVessel {
  rank: number;
  name: string;
  confidencePct: number;
  note: string;
}

export interface PipelineStage {
  label: string;
  state: PipelineState;
  detail?: string;
}

export interface AlertItem {
  title: string;
  detail: string;
  time: string;
  severity: Severity;
}

export interface DriftRun {
  id: string;
  label: string;
  horizon: string;
  state: PipelineState;
}

export interface HealthComponent {
  name: string;
  status: "Operational" | "Running" | "Degraded";
  latency: string;
  spark: number[];
}

export interface StatCardData {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  accent?: "teal" | "red" | "amber" | "default";
  icon: "warning" | "vessel" | "wave" | "pulse" | "dark" | "flag" | "plus" | "clock" | "particles" | "target" | "bell" | "check";
}
