import { ShieldAlert, Mail, MessageSquare, Webhook } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { Panel } from "../components/ui/Panel";
import { KeyValueRow } from "../components/ui/KeyValueRow";
import { ListRow } from "../components/ui/ListRow";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { alertStats, alerts } from "../data/mockData";

const badgeTone = { critical: "critical", elevated: "elevated", watch: "watch" } as const;
const filterTags = ["AIS gap", "SAR match", "Model complete", "Anomaly"];

export default function Alerts() {
  return (
    <>
      <div className="grid grid-cols-4 gap-3.5">
        {alertStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4 items-stretch">
        <Panel title="Alert feed" meta="today">
          {alerts.map((a) => (
            <ListRow
              key={a.title}
              critical={a.severity === "critical"}
              title={a.title}
              subtitle={a.detail}
              trailing={<Badge tone={badgeTone[a.severity]}>{a.time}</Badge>}
            />
          ))}
        </Panel>

        <Panel title="Alert routing" meta="channels">
          <KeyValueRow icon={<ShieldAlert />} label="Coast Guard duty desk" value={<Badge tone="live">Active</Badge>} />
          <KeyValueRow icon={<Mail />} label="Email digest" value={<Badge tone="live">Active</Badge>} />
          <KeyValueRow icon={<MessageSquare />} label="SMS escalation" value={<Badge tone="held">1 held</Badge>} />
          <KeyValueRow icon={<Webhook />} label="Webhook · ops channel" value={<Badge tone="live">Active</Badge>} />

          <div className="p-4">
            <div className="text-[10.5px] tracking-wide text-text-faint font-bold mb-2.5">FILTER BY TYPE</div>
            <div className="flex flex-wrap gap-1.5">
              {filterTags.map((t) => (
                <span
                  key={t}
                  className="text-[10.5px] font-semibold px-2.5 py-1.5 rounded-md bg-panel-soft border border-border text-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Panel title="Alerts by type" meta="24h">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft text-[12.5px]">
            <span className="font-semibold">AIS gap</span>
            <span className="flex items-center gap-2 text-text-muted font-semibold">
              <span className="inline-block w-14"><ProgressBar percent={70} thin color="red" /></span>7
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft text-[12.5px]">
            <span className="font-semibold">Speed anomaly</span>
            <span className="flex items-center gap-2 text-text-muted font-semibold">
              <span className="inline-block w-14"><ProgressBar percent={40} thin color="amber" /></span>4
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 text-[12.5px]">
            <span className="font-semibold">SAR match</span>
            <span className="flex items-center gap-2 text-text-muted font-semibold">
              <span className="inline-block w-14"><ProgressBar percent={30} thin /></span>3
            </span>
          </div>
        </Panel>

        <Panel title="Alerts by incident" meta="open">
          <KeyValueRow label="INC-0417 · Shellcreek" value="6" />
          <KeyValueRow label="INC-0418 · Nordfjord" value="2" />
          <KeyValueRow label="INC-0419 · Skerry Pass" value="1" />
        </Panel>

        <Panel title="Escalation rules" meta="3 active">
          <ListRow title="Confidence > 80%" subtitle="notify duty officer + SMS" trailing={<Badge tone="live">On</Badge>} />
          <ListRow title="AIS gap > 30 min" subtitle="flag vessel, log event" trailing={<Badge tone="live">On</Badge>} />
        </Panel>
      </div>
    </>
  );
}
