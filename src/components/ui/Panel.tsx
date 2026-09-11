import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  meta?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  icon?: ReactNode;
}

export function Panel({
  title,
  meta,
  children,
  className = "",
  bodyClassName = "",
  icon,
}: PanelProps) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-xl border border-white/[0.08] bg-[#05080e]/85 backdrop-blur-xl flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-white/[0.14] transition-colors ${className}`}
    >
      {/* Hairline Specular Reflection */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Corner Tactical Reticles */}
      <span className="pointer-events-none absolute top-1 left-1 font-mono text-[9px] text-teal/25 select-none leading-none">
        +
      </span>
      <span className="pointer-events-none absolute top-1 right-1 font-mono text-[9px] text-teal/25 select-none leading-none">
        +
      </span>
      <span className="pointer-events-none absolute bottom-1 left-1 font-mono text-[9px] text-teal/25 select-none leading-none">
        +
      </span>
      <span className="pointer-events-none absolute bottom-1 right-1 font-mono text-[9px] text-teal/25 select-none leading-none">
        +
      </span>

      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-2 text-[13.5px] font-bold tracking-tight">
            {icon && <span className="text-teal [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>}
            {title}
          </div>
          {meta && (
            <div className="text-[10px] font-mono font-semibold tracking-wider text-text-faint uppercase px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">
              {meta}
            </div>
          )}
        </div>
      )}
      <div className={`flex flex-col flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
