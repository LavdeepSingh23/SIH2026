import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  meta?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  icon?: ReactNode;
}

export function Panel({ title, meta, children, className = "", bodyClassName = "", icon }: PanelProps) {
  return (
    <div className={`bg-panel border border-border-soft rounded-xl flex flex-col overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-soft">
          <div className="flex items-center gap-2 text-sm font-bold">
            {icon && <span className="text-teal [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>}
            {title}
          </div>
          {meta && <div className="text-[10.5px] font-semibold tracking-wide text-text-faint">{meta}</div>}
        </div>
      )}
      <div className={`flex flex-col flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
