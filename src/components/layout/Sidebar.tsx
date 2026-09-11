import { NavLink, Link } from "react-router-dom";
import { CircleDot, Ship, Waves, Bell, Activity, Globe, Menu } from "lucide-react";
import { MarisLogoMark } from "../ui/MarisLogoMark";

const navItems = [
  { to: "/console", label: "Incidents", icon: CircleDot, end: true },
  { to: "/vessels", label: "Vessels", icon: Ship },
  { to: "/drift", label: "Drift model", icon: Waves },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/health", label: "Model health", icon: Activity },
];

export function Sidebar() {
  return (
    <aside className="w-[210px] shrink-0 bg-panel-soft border-r border-border-soft flex flex-col p-3.5">
      <Link to="/" className="flex items-center gap-2.5 px-1.5 pb-5 hover:opacity-90 transition-opacity" title="Back to Public Portal">
        <div className="w-8 h-8 rounded-lg bg-teal-wash border border-teal-dim text-teal flex items-center justify-center">
          <MarisLogoMark className="w-5 h-5 text-teal" />
        </div>
        <div>
          <b className="block text-[14.5px] font-bold tracking-wide">MARIS</b>
          <span className="block text-[9px] tracking-wider text-text-faint font-semibold">
            COMMAND NETWORK
          </span>
        </div>
      </Link>

      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2.5 rounded-md text-[13.5px] font-medium border-l-2 transition-colors ${
                isActive
                  ? "text-teal bg-teal-wash border-l-teal"
                  : "text-text-muted border-l-transparent hover:text-text"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        <div className="my-2 border-t border-border-soft/60" />

        <Link
          to="/"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12.5px] font-medium text-text-faint hover:text-teal hover:bg-teal-wash transition-colors"
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          3D Earth Portal
        </Link>
      </nav>

      <div className="border-t border-border-soft pt-3 mt-2.5">
        <div className="text-[9px] tracking-wider text-text-faint font-semibold mb-1.5 px-1.5">
          STATION
        </div>
        <div className="flex items-center gap-2 px-1.5 text-[12.5px] text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_0_3px_rgba(53,214,196,0.1)]" />
          OCEANIC-7 online
        </div>
        <button className="mt-3 p-1.5 text-text-faint hover:text-text-muted">
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
