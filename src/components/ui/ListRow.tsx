import type { ReactNode } from "react";

export function ListRow({
  title,
  subtitle,
  trailing,
  critical = false,
}: {
  title: string;
  subtitle: string;
  trailing: ReactNode;
  critical?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 border-b border-border-soft last:border-b-0 ${
        critical ? "bg-red-wash border-l-2 border-l-red" : ""
      }`}
    >
      <div>
        <div className="text-[13px] font-bold">{title}</div>
        <div className="text-[11px] text-text-faint mt-0.5">{subtitle}</div>
      </div>
      {trailing}
    </div>
  );
}
