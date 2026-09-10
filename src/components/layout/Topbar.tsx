import { SlidersHorizontal, BellRing, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function Topbar({ pageTitle }: { pageTitle: string }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
      <div className="flex items-baseline gap-3">
        <Link to="/" className="text-[17px] font-bold text-text hover:text-teal transition-colors" title="Back to 3D Earth Portal">
          MARIS
        </Link>
        <span className="text-[13px] text-text-faint font-medium">{pageTitle}</span>
        <span className="flex items-center gap-1.5 text-[11.5px] text-teal font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-teal" />
          LIVE · OCEANIC 7
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12.5px] font-semibold border border-border bg-panel hover:border-teal-dim">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Region / time
        </button>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12.5px] font-semibold border border-border bg-panel hover:border-teal-dim">
          <BellRing className="w-3.5 h-3.5" />
          Acknowledge alert
        </button>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12.5px] font-semibold bg-red border border-red text-[#1a0906]">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          Create investigation
        </button>
      </div>
    </header>
  );
}
