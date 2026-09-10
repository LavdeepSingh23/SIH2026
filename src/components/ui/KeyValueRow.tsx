import type { ReactNode } from "react";

export function KeyValueRow({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft last:border-b-0 text-[12.5px]">
      <div className="flex items-center gap-2 font-semibold text-text [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:text-text-faint">
        {icon}
        {label}
      </div>
      <div className="font-semibold text-text-muted">{value}</div>
    </div>
  );
}
