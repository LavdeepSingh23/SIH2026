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
    <div className="flex min-h-screen bg-[#000000] text-text dashboard-shell selection:bg-white selection:text-black">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col bg-[#000000] relative isolate">
        <Topbar pageTitle={pageTitle} />
        <main className="px-6 pt-5 pb-7 flex flex-col gap-4 flex-1 bg-[#000000]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
