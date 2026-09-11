import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const titles: Record<string, string> = {
  "/console": "Attribution Console",
  "/vessels": "Vessel Registry",
  "/drift": "Drift Simulation",
  "/alerts": "Alert Center",
  "/health": "Model Health",
};

export function AppShell() {
  const { pathname } = useLocation();
  const pageTitle = titles[pathname] ?? "Attribution Console";

  return (
    <div className="flex min-h-screen bg-[#000000] text-text dashboard-shell selection:bg-teal selection:text-black">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col bg-[#000000] relative isolate">
        {/* Subtle Background Radial Tactical Glow */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[300px] bg-teal/[0.02] blur-[120px] -z-10" />

        <Topbar pageTitle={pageTitle} />
        <main className="px-6 pt-5 pb-7 flex flex-col gap-4 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
