import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Radar,
  Waves,
  Ship,
  ArrowRight,
  ChevronRight,
  Database,
  Layers,
  Activity,
} from "lucide-react";
import { ScrollyGlobeBackground } from "../components/earth/ScrollyGlobeBackground";
import { LiquidButton } from "../components/ui/button";
import { LiquidGlassPanel } from "../components/ui/LiquidGlassPanel";
import { MarisLogoMark } from "../components/ui/MarisLogoMark";

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeStage =
    scrollProgress < 0.15
      ? 0
      : scrollProgress < 0.42
      ? 1
      : scrollProgress < 0.68
      ? 2
      : scrollProgress < 0.88
      ? 3
      : 4;

  const isScrolled = scrollProgress > 0.02;

  return (
    <div className="relative min-h-screen bg-[#000000] text-text font-sans selection:bg-teal selection:text-[#000000]">
      {/* 3D Earth WebGL Canvas Fixed in the Background */}
      <ScrollyGlobeBackground scrollProgress={scrollProgress} activeStage={activeStage} />

      {/* Dynamic Floating Navbar that merges seamlessly with background */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none transition-all duration-300">
        <LiquidGlassPanel
          variant="pill"
          glow={isScrolled ? "cyan" : "subtle"}
          className="pointer-events-auto max-w-4xl mx-auto mt-4 px-6 py-2.5 transition-all duration-300"
        >
          <header className="flex items-center justify-between">
          {/* Clean Logo + Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <MarisLogoMark className="w-7 h-7 text-teal transition-transform duration-300 group-hover:scale-105" />
            <span className="font-extrabold text-base tracking-wider text-white">MARIS</span>
          </Link>

          {/* Minimalist Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-muted">
            <a href="#section-pinpoint" className="hover:text-teal transition-colors">
              Live Pinpoint
            </a>
            <a href="#section-drift" className="hover:text-teal transition-colors">
              Hydrodynamics
            </a>
            <a href="#section-forensics" className="hover:text-teal transition-colors">
              AIS Forensics
            </a>
            <a href="#section-architecture" className="hover:text-teal transition-colors">
              Architecture
            </a>
          </nav>

          {/* Header Action */}
          <div className="flex items-center gap-3">
            <Link to="/console">
              <LiquidButton variant="cyan" size="sm" className="border border-teal/40">
                Launch Console
                <ArrowRight className="w-3.5 h-3.5" />
              </LiquidButton>
            </Link>
          </div>
        </header>
      </LiquidGlassPanel>
    </div>

      {/* Foreground Scroll Narrative Sections */}
      <div className="relative z-10">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO (High Orbit Overview) */}
        {/* ========================================================================= */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
          {/* Centered Headline on the Globe */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-8 max-w-2xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] select-none">
            Pinpoint Illicit Ocean Discharges from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal via-[#7df9ff] to-teal drop-shadow-[0_0_24px_rgba(0,240,255,0.4)]">
              Space
            </span>
          </h1>

          {/* Centered Liquid Glass Action Buttons on the Globe */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/console">
              <LiquidButton
                variant="cyan"
                size="lg"
                className="border border-teal/40 bg-teal/15 px-7 py-3 text-xs sm:text-sm font-mono tracking-wider uppercase shadow-[0_0_24px_rgba(0,240,255,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Enter Command Console
                <ChevronRight className="w-4 h-4 text-teal" />
              </LiquidButton>
            </Link>
            <a href="#section-pinpoint">
              <LiquidButton
                variant="default"
                size="lg"
                className="border border-white/15 px-7 py-3 text-xs sm:text-sm font-mono tracking-wider uppercase hover:border-teal/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Radar className="w-4 h-4 text-teal" />
                Explore Incident Pinpoint
              </LiquidButton>
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: PINPOINT DIVE (Shellcreek Strait INC-0417) */}
        {/* ========================================================================= */}
        <section
          id="section-pinpoint"
          className="min-h-screen flex items-center justify-end px-6 md:px-16 py-20 max-w-7xl mx-auto"
        >
          <div className="w-full md:w-[460px] bg-[#070b12]/80 backdrop-blur-2xl border border-teal/40 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.85)] animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red text-xs font-mono font-bold tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-red animate-ping" />
                ACTIVE CRITICAL INCIDENT
              </div>
              <span className="text-xs font-mono text-teal bg-teal/10 px-2.5 py-0.5 rounded-full border border-teal/30">
                RADAR LOCK
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">INC-0417 · Shellcreek Strait</h2>
            <div className="text-xs font-mono text-teal mb-4">
              58°25.2'N · 006°06.6'W · NORTH SEA SECTOR 04-B
            </div>

            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              The 3D globe camera has zoomed in directly onto the active discharge coordinates. A heavy crude oil slick of
              approximately <strong>1,240 tonnes</strong> was segmented from Sentinel-1 SAR backscatter reflectance.
            </p>

            <div className="space-y-3 bg-[#03060a]/80 p-4 rounded-xl border border-white/10 mb-6 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-faint font-mono">Satellite Sensor</span>
                <span className="font-semibold text-white">Copernicus Sentinel-1 C-Band</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-faint font-mono">Detection Pass</span>
                <span className="font-mono text-white">13:58 UTC (VV Polarization)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-faint font-mono">Estimated Volume</span>
                <span className="font-bold text-red">1,240 tonnes crude</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2">
                <span className="text-text-faint font-mono">Suspect Attribution</span>
                <span className="font-bold text-teal flex items-center gap-1.5">
                  M/T NORDBLOM (87%)
                </span>
              </div>
            </div>

            <Link to="/console" className="block w-full">
              <LiquidButton variant="cyan" size="lg" className="w-full border border-teal/40 bg-teal/10">
                Open Incident in Console
                <ArrowRight className="w-4 h-4" />
              </LiquidButton>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: HYDRODYNAMIC DRIFT PLUME (Oblique Perspective) */}
        {/* ========================================================================= */}
        <section id="section-drift" className="min-h-screen flex items-center justify-start px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <div className="w-full md:w-[480px] bg-[#070b12]/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.85)]">
            <div className="inline-flex items-center gap-2 text-blue text-xs font-mono font-bold tracking-wider mb-3">
              <Waves className="w-4 h-4 text-blue" />
              HYDRODYNAMIC DRIFT PHYSICS
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">50,000 Lagrangian Particles</h2>
            <div className="text-xs font-mono text-blue mb-4">
              HYCOM CURRENTS + GFS WIND FIELDS · 72H ENSEMBLE
            </div>

            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              By running backward Lagrangian particle hindcasts through calibrated hydrodynamic ocean grids, MARIS traces the
              exact time and geographical origin of the discharge, reconstructing the drift cone toward the Scottish shoreline.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="bg-[#03060a]/80 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-text-faint uppercase">CURRENT VELOCITY</span>
                <div className="text-base font-bold text-white mt-1">1.8 kt @ 074°</div>
                <div className="text-[10.5px] text-text-muted mt-0.5">INCOIS HYCOM feed</div>
              </div>
              <div className="bg-[#03060a]/80 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-text-faint uppercase">DIFFUSION COEFF.</span>
                <div className="text-base font-bold text-white mt-1">10 m²/s</div>
                <div className="text-[10.5px] text-text-muted mt-0.5">ADIOS2 weathering</div>
              </div>
            </div>

            <Link to="/drift" className="block w-full">
              <LiquidButton variant="default" size="lg" className="w-full border border-white/15">
                Simulate Drift in Console
                <ArrowRight className="w-4 h-4" />
              </LiquidButton>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: DARK VESSEL AIS FORENSICS */}
        {/* ========================================================================= */}
        <section id="section-forensics" className="min-h-screen flex items-center justify-end px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <div className="w-full md:w-[480px] bg-[#070b12]/80 backdrop-blur-2xl border border-red/40 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.85)]">
            <div className="inline-flex items-center gap-2 text-red text-xs font-mono font-bold tracking-wider mb-3">
              <Ship className="w-4 h-4 text-red" />
              AIS BLACKOUT & TRANSPONDER FORENSICS
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">M/T Nordblom Blackout Audit</h2>
            <div className="text-xs font-mono text-red mb-4">
              MMSI 419004812 · PANAMA FLAG · TANKER (115,000 DWT)
            </div>

            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              The vessel turned off its AIS Class-A transponder for <strong>38 minutes</strong> while transiting directly
              through the Shellcreek spill origin coordinates, altering speed from 14.2 kt to 21.4 kt upon reconnection.
            </p>

            <div className="space-y-2.5 bg-[#03060a]/80 p-4 rounded-xl border border-white/10 mb-6 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-faint font-mono">03:40 UTC</span>
                <span className="text-red font-bold">AIS Signal Lost (Dark Window)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-faint font-mono">04:18 UTC</span>
                <span className="text-white font-semibold">AIS Restored (+18° heading shift)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-faint font-mono">Fuel Load Correlation</span>
                <span className="text-teal font-semibold">Consistent with bilge wash</span>
              </div>
            </div>

            <Link to="/vessels" className="block w-full">
              <LiquidButton variant="destructive" size="lg" className="w-full border border-red/40 bg-red/10 text-red hover:text-white font-bold">
                Inspect Suspect Vessel Registry
                <ArrowRight className="w-4 h-4" />
              </LiquidButton>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: GOOGLE EARTH ENGINE & CLOUD INFERENCE ARCHITECTURE */}
        {/* ========================================================================= */}
        <section id="section-architecture" className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-20 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-teal font-bold">
              CLOUD INTELLIGENCE & SATELLITE API
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Google Earth Engine & FastAPI Integration
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-2">
              Petabyte-scale satellite raster extraction connects directly with high-speed hydrodynamic simulation clusters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 items-center">
            <div className="space-y-4">
              <div className="bg-[#070b12]/80 backdrop-blur-xl p-5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2.5 text-teal text-xs font-mono font-bold mb-1">
                  <Layers className="w-4 h-4" />
                  GOOGLE EARTH ENGINE INGEST
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Automated scripts query the Copernicus Sentinel-1 GRD collection, applying Lee speckle filtering and threshold
                  segmentation on the VV backscatter layer.
                </p>
              </div>

              <div className="bg-[#070b12]/80 backdrop-blur-xl p-5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2.5 text-blue text-xs font-mono font-bold mb-1">
                  <Activity className="w-4 h-4" />
                  HIGH-SPEED PARALLEL SOLVER
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  FastAPI routes dispatch Lagrangian drift solvers across GPU worker clusters to cross-correlate candidate vessel
                  interpolated dead-reckoning lines.
                </p>
              </div>

              <div className="bg-[#070b12]/80 backdrop-blur-xl p-5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2.5 text-teal text-xs font-mono font-bold mb-1">
                  <Database className="w-4 h-4" />
                  COURT-ADMISSIBLE EVIDENCE STORE
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Cryptographically hashes satellite pass metadata, ship MMSI logs, and attribution probabilities for maritime
                  coastguard enforcement handoff.
                </p>
              </div>
            </div>

            {/* Terminal snippet */}
            <div className="bg-[#020509]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 font-mono text-xs text-text-muted shadow-2xl overflow-x-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-text-faint">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-teal/80" />
                  <span className="ml-2 text-teal font-semibold">gee_attribution_pipeline.py</span>
                </div>
                <span className="text-[10px]">Python 3.12 · GEE REST</span>
              </div>
              <pre className="text-[11.5px] leading-relaxed">
                <span className="text-text-faint"># 1. Connect to Google Earth Engine REST API</span>{"\n"}
                <span className="text-blue">import</span> ee{"\n"}
                <span className="text-blue">from</span> maris_core <span className="text-blue">import</span> DriftSolver, AISMatcher{"\n\n"}
                ee.Initialize(opt_url=<span className="text-teal">"https://earthengine.googleapis.com"</span>){"\n\n"}
                <span className="text-text-faint"># 2. Query Sentinel-1 SAR pass over INC-0417</span>{"\n"}
                sar_collection = (ee.ImageCollection(<span className="text-teal">"COPERNICUS/S1_GRD"</span>){"\n"}
                {"  "}.filterBounds(ee.Geometry.Point([-6.11, 58.42])){"\n"}
                {"  "}.filterDate(<span className="text-teal">"2026-09-10"</span>, <span className="text-teal">"2026-09-11"</span>){"\n"}
                {"  "}.filter(ee.Filter.listContains(<span className="text-teal">"transmitterReceiverPolarisation"</span>, <span className="text-teal">"VV"</span>))){"\n\n"}
                <span className="text-text-faint"># 3. Extract oil slick boundary mask</span>{"\n"}
                slick_mask = sar_collection.first().select(<span className="text-teal">"VV"</span>).lt(-21.5){"\n"}
                origin = DriftSolver.hindcast(slick_mask, horizon_hours=48){"\n\n"}
                <span className="text-text-faint"># 4. Rank vessels in blackout envelope</span>{"\n"}
                suspects = AISMatcher.correlate_dark_vessels(origin){"\n"}
                <span className="text-teal font-bold">&gt;&gt;&gt; PRIME MATCH: M/T NORDBLOM (87% CONFIDENCE)</span>
              </pre>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: MISSION LAUNCHPAD & FOOTER */}
        {/* ========================================================================= */}
        <section className="py-24 px-6 border-t border-white/10 bg-[#000000]/90 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Enter the Operational Attribution Console
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto mb-10">
              Access real-time vessel registries, live radar incident mapping, hydrodynamic simulation runs, and escalation
              routing.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <Link to="/console">
                <LiquidButton variant="cyan" size="lg" className="border border-teal/40 bg-teal/10 shadow-[0_0_30px_rgba(0,240,255,0.35)]">
                  Launch Console
                  <ArrowRight className="w-4 h-4" />
                </LiquidButton>
              </Link>
              <Link to="/vessels">
                <LiquidButton variant="default" size="lg" className="border border-white/15">
                  Tracked Vessels Registry
                </LiquidButton>
              </Link>
            </div>

            {/* Console Submodule Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <Link
                to="/console"
                className="p-4 rounded-xl bg-[#070b12]/80 border border-white/10 hover:border-teal/50 transition-all group"
              >
                <div className="text-teal font-mono text-[11px] mb-1 group-hover:underline">/console</div>
                <div className="text-sm font-bold text-white">Live Incidents</div>
                <div className="text-[11px] text-text-muted mt-0.5">3 active spills</div>
              </Link>
              <Link
                to="/vessels"
                className="p-4 rounded-xl bg-[#070b12]/80 border border-white/10 hover:border-teal/50 transition-all group"
              >
                <div className="text-teal font-mono text-[11px] mb-1 group-hover:underline">/vessels</div>
                <div className="text-sm font-bold text-white">Fleet Registry</div>
                <div className="text-[11px] text-text-muted mt-0.5">342 tracked</div>
              </Link>
              <Link
                to="/drift"
                className="p-4 rounded-xl bg-[#070b12]/80 border border-white/10 hover:border-teal/50 transition-all group"
              >
                <div className="text-teal font-mono text-[11px] mb-1 group-hover:underline">/drift</div>
                <div className="text-sm font-bold text-white">Drift Models</div>
                <div className="text-[11px] text-text-muted mt-0.5">HYCOM 72h</div>
              </Link>
              <Link
                to="/alerts"
                className="p-4 rounded-xl bg-[#070b12]/80 border border-white/10 hover:border-teal/50 transition-all group"
              >
                <div className="text-teal font-mono text-[11px] mb-1 group-hover:underline">/alerts</div>
                <div className="text-sm font-bold text-white">Alert Routing</div>
                <div className="text-[11px] text-text-muted mt-0.5">Duty officer desk</div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#000000] px-6 py-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-3">
              <MarisLogoMark className="w-5 h-5 text-teal" />
              <span className="text-white font-semibold">MARIS</span>
              <span className="text-text-faint">|</span>
              <span className="text-text-muted">Maritime Defense & Environmental Intelligence</span>
            </div>

            <div className="flex items-center gap-4 font-mono text-[11px]">
              <span className="text-teal flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                SYSTEM STATUS: NOMINAL
              </span>
              <span className="text-text-faint">|</span>
              <span>GOOGLE EARTH ENGINE & SENTINEL-1 SAR INTEGRATED</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
