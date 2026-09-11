import { NavLink, Link } from "react-router-dom";
import { CircleDot, Ship, Waves, Bell, Activity, Globe } from "lucide-react";
import { MarisLogoMark } from "../ui/MarisLogoMark";

const navItems = [
  { to: "/console", label: "Attribution Console", icon: CircleDot, end: true },
  { to: "/vessels", label: "Vessel Registry", icon: Ship },
  { to: "/drift", label: "Drift Simulation", icon: Waves },
  { to: "/alerts", label: "Alert Center", icon: Bell },
  { to: "/health", label: "Model Health", icon: Activity },
];

export function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 bg-[#02050b] border-r border-white/[0.08] flex flex-col p-3.5 select-none relative isolate">
      {/* Hairline Right Border Specular */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-teal/30 via-white/10 to-transparent" />

      {/* Brand Header */}
      <Link
        to="/"
        className="flex items-center gap-2.5 px-2 py-3 mb-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-teal/30 transition-all group"
        title="Return to 3D Earth Portal"
      >
        <div className="w-8 h-8 rounded-lg bg-teal-wash border border-teal/40 text-teal flex items-center justify-center group-hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all">
          <MarisLogoMark className="w-5 h-5 text-teal" />
        </div>
        <div>
          <b className="block text-[14px] font-bold tracking-wider text-white">MARIS</b>
          <span className="block text-[8.5px] font-mono tracking-widest text-teal font-semibold">
            DEFENSE COMMAND
          </span>
        </div>
      </Link>

      {/* Navigation items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium border-l-2 transition-all ${
                isActive
                  ? "text-teal bg-teal-wash/60 border-l-teal shadow-[inset_0_0_16px_rgba(0,240,255,0.06)] font-semibold"
                  : "text-text-muted border-l-transparent hover:text-white hover:bg-white/[0.03]"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0 text-teal/70" />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="my-3 border-t border-white/[0.06]" />

        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-mono text-text-faint hover:text-teal hover:bg-teal-wash/30 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 shrink-0 text-teal" />
          <span>3D Orbital Earth</span>
        </Link>
      </nav>

      {/* Station Status Bottom Footer */}
      <div className="border-t border-white/[0.06] pt-3 mt-auto flex flex-col gap-1.5 px-1 font-mono text-[10px]">
        <div className="flex items-center justify-between text-text-faint">
          <span>STATION</span>
          <span className="text-teal font-bold">GRID 04-B</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal" />
          </span>
          <span>OCEANIC-7 ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
