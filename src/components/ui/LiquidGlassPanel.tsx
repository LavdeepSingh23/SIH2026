import * as React from "react";
import { cn } from "@/lib/utils";

export interface LiquidGlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "pill" | "card";
  glow?: "cyan" | "subtle" | "none";
}

export function LiquidGlassPanel({
  children,
  className,
  variant = "card",
  glow = "cyan",
  ...props
}: LiquidGlassPanelProps) {
  const roundedClass = variant === "pill" ? "rounded-full" : "rounded-2xl";

  const glowShadow =
    glow === "cyan"
      ? "shadow-[0_0_16px_rgba(0,0,0,0.6),0_8px_32px_rgba(0,0,0,0.85),inset_2.5px_2.5px_1px_-1px_rgba(255,255,255,0.35),inset_-2.5px_-2.5px_1px_-1px_rgba(0,240,255,0.35),inset_0_0_16px_rgba(0,240,255,0.08),0_0_24px_rgba(0,240,255,0.2)] border-teal/35"
      : glow === "subtle"
      ? "shadow-[0_0_12px_rgba(0,0,0,0.6),0_6px_24px_rgba(0,0,0,0.8),inset_2px_2px_1px_-1px_rgba(255,255,255,0.25),inset_-2px_-2px_1px_-1px_rgba(255,255,255,0.1),inset_0_0_12px_rgba(255,255,255,0.04),0_0_20px_rgba(0,0,0,0.5)] border-white/15"
      : "shadow-2xl border-white/10";

  return (
    <div className={cn("relative isolate group", roundedClass, className)} {...props}>
      {/* 1. Frosted Liquid Glass Specular & Inset Bevel Lighting */}
      <div
        className={cn(
          "absolute inset-0 -z-10 transition-all duration-300 bg-[#070b12]/60 backdrop-blur-2xl border",
          roundedClass,
          glowShadow
        )}
      />

      {/* 2. Glass Distortion Filter via SVG #container-glass */}
      <div
        className={cn("absolute inset-0 -z-20 overflow-hidden", roundedClass)}
        style={{ backdropFilter: 'url("#container-glass")' }}
      />

      {/* 3. Hairline Top Specular Light Reflection */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/45 to-transparent",
          variant === "pill" ? "top-[1px]" : "top-0"
        )}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* Embedded SVG Glass Refraction Filter Definition */}
      <svg className="hidden pointer-events-none" aria-hidden="true">
        <defs>
          <filter
            id="container-glass"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.05"
              numOctaves="1"
              seed="1"
              result="turbulence"
            />
            <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="70"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
            <feComposite in="finalBlur" in2="finalBlur" operator="over" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

