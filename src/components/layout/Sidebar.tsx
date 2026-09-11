import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { CircleDot, Ship, Waves, Bell, Activity, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { MarisLogoMark } from "../ui/MarisLogoMark";

const navItems = [
  { to: "/console", label: "Attribution Console", icon: CircleDot, end: true },
  { to: "/vessels", label: "Vessel Registry", icon: Ship },
  { to: "/drift", label: "Drift Simulation", icon: Waves },
  { to: "/alerts", label: "Alert Center", icon: Bell },
  { to: "/health", label: "Model Health", icon: Activity },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`shrink-0 bg-[#02050b] border-r border-white/[0.08] flex flex-col p-3 select-none relative isolate transition-all duration-300 ${
        collapsed ? "w-[64px]" : "w-[210px]"
      }`}
    >
      {/* Hairline Right Border Specular */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-teal/30 via-white/10 to-transparent" />

      {/* Brand Header */}
      <div className="flex items-center justify-between mb-3">
        <Link
          to="/"
          className={`flex items-center gap-2.5 p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-teal/30 transition-all group overflow-hidden ${
            collapsed ? "justify-center w-full" : ""
          }`}
          title="Return to 3D Earth Portal"
        >
          <div className="w-8 h-8 shrink-0 rounded-lg bg-teal-wash border border-teal/40 text-teal flex items-center justify-center group-hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all">
            <MarisLogoMark className="w-5 h-5 text-teal" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <b className="block text-[13.5px] font-bold tracking-wider text-white truncate">MARIS</b>
              <span className="block text-[8px] font-mono tracking-widest text-teal font-semibold truncate">
                COMMAND
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 p-2.5 rounded-lg text-[13px] font-medium border-l-2 transition-all ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "text-teal bg-teal-wash/60 border-l-teal shadow-[inset_0_0_16px_rgba(0,240,255,0.06)] font-semibold"
                  : "text-text-muted border-l-transparent hover:text-white hover:bg-white/[0.03]"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0 text-teal/70" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

        <div className="my-2 border-t border-white/[0.06]" />

        <Link
          to="/"
          title={collapsed ? "3D Orbital Earth" : undefined}
          className={`flex items-center gap-2.5 p-2.5 rounded-lg text-[12px] font-mono text-text-faint hover:text-teal hover:bg-teal-wash/30 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Globe className="w-4 h-4 shrink-0 text-teal" />
          {!collapsed && <span className="truncate">3D Orbital Earth</span>}
        </Link>
      </nav>

      {/* Collapse Toggle & Station Status */}
      <div className="border-t border-white/[0.06] pt-2.5 mt-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-teal/30 text-text-faint hover:text-teal text-[10px] font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          {!collapsed && <span>COLLAPSE DOCK</span>}
        </button>

        {!collapsed && (
          <div className="px-1 text-[9.5px] font-mono text-text-faint flex items-center justify-between">
            <span>DEFENSE NODE</span>
            <span className="text-teal font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              ONLINE
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
