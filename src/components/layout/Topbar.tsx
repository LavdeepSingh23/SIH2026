import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, Radio, Clock, ShieldCheck } from "lucide-react";

export function Topbar({ pageTitle }: { pageTitle: string }) {
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setUtcTime(`${h}:${m}:${s} UTC`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative isolate flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#000000]/95 backdrop-blur-xl z-30">
      {/* Hairline Specular Reflection */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal/30 to-transparent" />

      {/* Left Title & Status */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-text-muted hover:text-teal text-[12px] font-mono font-bold px-2 py-1 rounded bg-white/[0.03] border border-white/[0.06] transition-colors"
          title="Return to 3D Orbital Earth"
        >
          <Globe className="w-3.5 h-3.5 text-teal" />
          <span>3D ORBITAL PORTAL</span>
        </Link>

        <span className="text-text-faint">/</span>
        <h1 className="text-[14.5px] font-extrabold tracking-tight text-white">{pageTitle}</h1>

        <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 rounded-full bg-teal-wash/60 border border-teal/30 text-[10.5px] font-mono text-teal">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal" />
          </span>
          DEFENSE DEFCON: NOMINAL
        </div>
      </div>

      {/* Right Telemetry Clock & Sat Status */}
      <div className="flex items-center gap-3 font-mono text-[11px]">
        {/* Military UTC Defense Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-text-muted">
          <Clock className="w-3.5 h-3.5 text-teal" />
          <span className="text-white font-bold">{utcTime || "12:00:00 UTC"}</span>
        </div>

        {/* Sentinel-1 SAR Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-text-muted">
          <Radio className="w-3.5 h-3.5 text-teal animate-pulse" />
          <span>S1A / S1B SYNCED</span>
        </div>

        {/* Quick Help / System Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-text-faint text-[10px]">
          <ShieldCheck className="w-3 h-3 text-teal" />
          <span>INCOIS HYCOM v4</span>
        </div>
      </div>
    </header>
  );
}
