import { StatCard } from "../components/ui/StatCard";
import { Panel } from "../components/ui/Panel";
import { KeyValueRow } from "../components/ui/KeyValueRow";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { LineChart } from "../components/ui/LineChart";
import { Sparkline } from "../components/ui/Sparkline";
import { healthStats, healthComponents } from "../data/mockData";

const statusBadge = { Operational: "live", Running: "running", Degraded: "queued" } as const;
const sparkColor = { Operational: "#35d6c4", Running: "#4fa3e8", Degraded: "#e8b23d" } as const;

const resources = [
  { label: "GPU", pct: 72, color: "teal" as const },
  { label: "CPU", pct: 48, color: "teal" as const },
  { label: "Storage", pct: 61, color: "amber" as const },
];

export default function ModelHealth() {
  return (
    <>
      <div className="grid grid-cols-4 gap-3.5">
        {healthStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Panel title="Pipeline components" meta="6 stages">
        <div className="grid grid-cols-3 gap-3 p-4">
          {healthComponents.map((c) => (
            <div key={c.name} className="bg-panel-soft border border-border-soft rounded-md p-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <b className="text-[12.5px]">{c.name}</b>
                <Badge tone={statusBadge[c.status]}>{c.status}</Badge>
              </div>
              <div className="text-[20px] font-extrabold">
                {c.latency.split(" ")[0]}
                <small className="text-[11px] text-text-faint font-medium ml-1">
                  {c.latency.split(" ").slice(1).join(" ")}
                </small>
              </div>
              <Sparkline values={c.spark} color={sparkColor[c.status]} />
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="Latency over time" meta="6h window">
          <LineChart
            series={[{ points: [[8, 100], [60, 90], [110, 95], [160, 70], [210, 110], [260, 60], [320, 75]], color: "#35D6C4" }]}
            leftLabel="-6h"
            rightLabel="now"
          />
        </Panel>

        <Panel title="Resource usage" meta="cluster">
          <div className="p-4 flex flex-col gap-3.5">
            {resources.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-[12px] font-semibold mb-1.5">
                  <span>{r.label}</span>
                  <span className="text-text-faint">{r.pct}%</span>
                </div>
                <ProgressBar percent={r.pct} color={r.color} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Data source status" meta="feeds">
          <KeyValueRow label="Sentinel-1 SAR" value={<Badge tone="synced">Synced</Badge>} />
          <KeyValueRow label="AIS · LRIT/VMS" value={<Badge tone="synced">Synced</Badge>} />
          <KeyValueRow label="INCOIS ocean data" value={<Badge tone="synced">Synced</Badge>} />
          <KeyValueRow label="IMD weather" value={<Badge tone="queued">Delayed</Badge>} />
        </Panel>
      </div>
    </>
  );
}
