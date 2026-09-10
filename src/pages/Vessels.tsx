import { useState } from "react";
import { Ship, Search } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { Panel } from "../components/ui/Panel";
import { ProgressBar } from "../components/ui/ProgressBar";
import { ListRow } from "../components/ui/ListRow";
import { Badge } from "../components/ui/Badge";
import { vesselStats, vessels, fleetDistribution, topFlagStates } from "../data/mockData";
import type { Vessel } from "../types";

function AisPill({ status }: { status: Vessel["aisStatus"] }) {
  const live = status === "live";
  return (
    <span
      className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
        live ? "text-teal bg-teal-wash" : "text-red bg-red-wash"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {live ? "Live" : "Dark"}
    </span>
  );
}

export default function Vessels() {
  const [selected, setSelected] = useState<Vessel>(vessels[0]);

  return (
    <>
      <div className="grid grid-cols-4 gap-3.5">
        {vesselStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4 items-stretch">
        <Panel title="Vessel registry" meta="342 tracked" bodyClassName="overflow-x-auto">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["Vessel", "Flag", "Type", "Speed", "AIS", "Risk"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-[10px] tracking-wide text-text-faint font-bold border-b border-border-soft"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vessels.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className={`cursor-pointer hover:bg-panel-soft ${selected.id === v.id ? "bg-panel-soft" : ""}`}
                >
                  <td className="px-4 py-2.5 border-b border-border-soft">
                    <span className="text-text font-bold">{v.name}</span>{" "}
                    <span className="font-mono text-text-faint">{v.mmsi}</span>
                  </td>
                  <td className="px-4 py-2.5 border-b border-border-soft text-text-muted">{v.flag}</td>
                  <td className="px-4 py-2.5 border-b border-border-soft text-text-muted">{v.type}</td>
                  <td className="px-4 py-2.5 border-b border-border-soft text-text-muted">{v.speedKt} kt</td>
                  <td className="px-4 py-2.5 border-b border-border-soft">
                    <AisPill status={v.aisStatus} />
                  </td>
                  <td className="px-4 py-2.5 border-b border-border-soft text-text-muted">
                    <span className="inline-block w-14 mr-2 align-middle">
                      <ProgressBar
                        percent={v.riskScore}
                        thin
                        color={v.riskScore >= 70 ? "red" : v.riskScore >= 40 ? "amber" : "teal"}
                      />
                    </span>
                    {v.riskScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Vessel detail" meta="selected">
          <div className="p-4 flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] rounded-lg bg-red-wash border border-red/30 text-red flex items-center justify-center">
                <Ship className="w-5 h-5" />
              </div>
              <div>
                <b className="text-[15px]">{selected.name}</b>
                <span className="block text-[11px] text-text-faint mt-0.5">
                  MMSI {selected.mmsi} · {selected.flag}
                </span>
              </div>
            </div>

            <div className="h-[90px] rounded-md bg-panel-soft border border-border-soft overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 260 90">
                <path
                  d="M10,70 C60,50 90,20 140,30 C180,38 210,15 250,20"
                  fill="none"
                  stroke="#35D6C4"
                  strokeWidth="1.6"
                  strokeDasharray="3 4"
                />
                <circle cx="250" cy="20" r="4" fill="#F16456" />
                <circle cx="10" cy="70" r="3" fill="#35D6C4" />
              </svg>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["AIS gap 03:40–04:12", "Fuel load consistent", "Route overlap", `${selected.flag} flag`].map(
                (t) => (
                  <span
                    key={t}
                    className="text-[10.5px] font-semibold px-2.5 py-1.5 rounded-md bg-panel-soft border border-border text-text-muted"
                  >
                    {t}
                  </span>
                )
              )}
            </div>

            <button className="py-2.5 rounded-md bg-panel-soft border border-border text-[12.5px] font-semibold flex items-center justify-center gap-1.5 hover:border-teal-dim">
              <Search className="w-3.5 h-3.5 text-teal" />
              Open evidence chain
            </button>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="Fleet distribution" meta="by type">
          {fleetDistribution.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft last:border-b-0 text-[12.5px]"
            >
              <span className="font-semibold">{f.label}</span>
              <span className="flex items-center gap-2 text-text-muted font-semibold">
                <span className="inline-block w-14">
                  <ProgressBar percent={f.pct} thin />
                </span>
                {f.count}
              </span>
            </div>
          ))}
        </Panel>

        <Panel title="Top flag states" meta="by count">
          {topFlagStates.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft last:border-b-0 text-[12.5px]"
            >
              <span className="font-semibold">{f.label}</span>
              <span className="text-text-muted font-semibold">{f.count}</span>
            </div>
          ))}
        </Panel>

        <Panel title="Recent AIS gaps" meta="24h">
          <ListRow title="M/T Nordblom" subtitle="32 min · near INC-0417" trailing={<Badge tone="critical">FLAG</Badge>} />
          <ListRow title="MV Talara" subtitle="1h 10m · sector 09" trailing={<Badge tone="watch">LOW</Badge>} />
        </Panel>
      </div>
    </>
  );
}
