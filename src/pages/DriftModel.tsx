import { Play } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { Panel } from "../components/ui/Panel";
import { KeyValueRow } from "../components/ui/KeyValueRow";
import { ListRow } from "../components/ui/ListRow";
import { Badge } from "../components/ui/Badge";
import { LineChart } from "../components/ui/LineChart";
import { DriftMap } from "../components/maps/DriftMap";
import { driftStats, driftParameters, driftQueue } from "../data/mockData";

const queueBadge = { running: "running", queued: "queued" } as const;

export default function DriftModel() {
  return (
    <>
      <div className="grid grid-cols-4 gap-3.5">
        {driftStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4 items-stretch">
        <Panel title="Drift projection" meta="ensemble mean" bodyClassName="flex-1">
          <DriftMap />
        </Panel>

        <Panel title="Model parameters" meta="run #4471">
          {driftParameters.map((p) => (
            <KeyValueRow key={p.label} label={p.label} value={p.value} />
          ))}
          <button className="mx-4 mb-4 mt-auto py-2.5 rounded-md bg-panel-soft border border-border text-[12.5px] font-semibold flex items-center justify-center gap-1.5 hover:border-teal-dim">
            <Play className="w-3.5 h-3.5 text-teal" />
            Run new simulation
          </button>
        </Panel>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="Validation accuracy" meta="predicted vs observed">
          <LineChart
            series={[
              { points: [[8, 110], [90, 90], [170, 60], [250, 50], [320, 35]], color: "#35D6C4" },
              { points: [[8, 120], [90, 100], [170, 75], [250, 55], [320, 42]], color: "#4FA3E8", dashed: true },
            ]}
            leftLabel="Predicted"
            rightLabel="Observed"
          />
        </Panel>

        <Panel title="Data freshness" meta="feeds">
          <KeyValueRow label="Ocean currents" value={<Badge tone="synced">2 min</Badge>} />
          <KeyValueRow label="Wind field" value={<Badge tone="synced">6 min</Badge>} />
          <KeyValueRow label="Bathymetry" value={<Badge tone="watch">static</Badge>} />
          <KeyValueRow label="Shoreline mask" value={<Badge tone="watch">static</Badge>} />
        </Panel>

        <Panel title="Simulation queue" meta="4 pending">
          {driftQueue.map((q) => (
            <ListRow
              key={q.id}
              title={q.label}
              subtitle={q.horizon}
              trailing={<Badge tone={queueBadge[q.state as keyof typeof queueBadge]}>{q.state === "running" ? "Running" : "Queued"}</Badge>}
            />
          ))}
        </Panel>
      </div>
    </>
  );
}
