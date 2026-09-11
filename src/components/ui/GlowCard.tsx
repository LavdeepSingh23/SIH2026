import * as React from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "red" | "subtle";
}

export function GlowCard({
  children,
  className,
  glowColor = "cyan",
  ...props
}: GlowCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const glowRgba =
    glowColor === "cyan"
      ? "rgba(0, 240, 255, 0.14)"
      : glowColor === "red"
      ? "rgba(255, 59, 48, 0.16)"
      : "rgba(255, 255, 255, 0.08)";

  const borderHoverClass =
    glowColor === "cyan"
      ? "hover:border-teal/30"
      : glowColor === "red"
      ? "hover:border-red/40"
      : "hover:border-white/20";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos(null);
      }}
      className={cn(
        "relative isolate overflow-hidden rounded-xl border border-white/[0.08] bg-[#05080e]/85 backdrop-blur-xl transition-all duration-300",
        "shadow-[0_4px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]",
        borderHoverClass,
        className
      )}
      {...props}
    >
      {/* 1. Mouse Spotlight Radial Glow (21st.dev signature) */}
      {isHovered && mousePos && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowRgba}, transparent 80%)`,
          }}
        />
      )}

      {/* 2. Top Hairline Specular Reflection */}
      <div className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

