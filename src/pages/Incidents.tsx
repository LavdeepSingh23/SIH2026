import { Radar, Search } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { Panel } from "../components/ui/Panel";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Badge } from "../components/ui/Badge";
import { ListRow } from "../components/ui/ListRow";
import { LineChart } from "../components/ui/LineChart";
import { IncidentMap } from "../components/maps/IncidentMap";
import { incidentStats, incidents, suspects, pipelineStatus } from "../data/mockData";

const badgeTone = { critical: "critical", elevated: "elevated", watch: "watch" } as const;
const suspectColor = (pct: number) => (pct >= 75 ? "red" : "teal") as "red" | "teal";
const suspectTextClass = { red: "text-red", teal: "text-teal" } as const;
const pipelineBadge = {
  live: { tone: "live", label: "Live" },
  running: { tone: "running", label: "Running" },
  queued: { tone: "queued", label: "Queued · 4" },
  synced: { tone: "synced", label: "Synced" },
  held: { tone: "held", label: "1 held" },
  degraded: { tone: "queued", label: "Degraded" },
} as const;

export default function Incidents() {
  return (
    <>
      <div className="grid grid-cols-4 gap-3.5">
        {incidentStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4 items-stretch">
        <Panel title="Live incident map" meta="58.42°N · 006.11°W" icon={<Radar />} bodyClassName="flex-1">
          <IncidentMap />
        </Panel>

        <Panel title="Ranked suspects" meta="by confidence">
          <div className="px-4 py-3.5 flex flex-col gap-4 flex-1">
            {suspects.map((s) => (
              <div key={s.rank}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-[13.5px] font-bold">
                    <span className="text-[11px] text-text-faint font-semibold">
                      {String(s.rank).padStart(2, "0")}
                    </span>
                    {s.name}
                  </div>
                  <div className={`text-[15px] font-extrabold ${suspectTextClass[suspectColor(s.confidencePct)]}`}>
                    {s.confidencePct}%
                  </div>
                </div>
                <ProgressBar percent={s.confidencePct} color={suspectColor(s.confidencePct)} />
                <div className="text-[11.5px] text-text-faint mt-1.5">{s.note}</div>
              </div>
            ))}
          </div>
          <button className="mx-4 mb-4 mt-auto py-2.5 rounded-md bg-panel-soft border border-border text-[12.5px] font-semibold flex items-center justify-center gap-1.5 hover:border-teal-dim">
            <Search className="w-3.5 h-3.5 text-teal" />
            Open evidence chain
          </button>
        </Panel>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-4">
        <Panel title="Active incidents" meta="3 open">
          {incidents.map((inc) => (
            <ListRow
              key={inc.id}
              critical={inc.severity === "critical"}
              title={`${inc.id} · ${inc.name}`}
              subtitle={`${inc.tonnage} · ${inc.status}`}
              trailing={<Badge tone={badgeTone[inc.severity]}>{inc.severity.toUpperCase()}</Badge>}
            />
          ))}
        </Panel>

        <Panel title="Drift timeline" meta="0–48h">
          <LineChart
            series={[{ points: [[8, 120], [150, 70], [320, 30]], color: "#35D6C4" }]}
            markers={[
              { x: 8, y: 120, color: "#F16456" },
              { x: 150, y: 70, color: "#F16456" },
              { x: 320, y: 30, color: "#35D6C4" },
            ]}
            leftLabel="NOW"
            rightLabel="T+48H"
          />
        </Panel>

        <Panel title="Pipeline status" meta="live">
          {pipelineStatus.map((p) => {
            const b = pipelineBadge[p.state];
            return (
              <div
                key={p.label}
                className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft last:border-b-0 text-[12.5px]"
              >
                <span className="font-semibold">{p.label}</span>
                <Badge tone={b.tone}>{p.detail ?? b.label}</Badge>
              </div>
            );
          })}
        </Panel>
      </div>
    </>
  );
}
