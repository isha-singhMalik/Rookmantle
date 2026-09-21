import clsx from "clsx";
import { Panel } from "@/components/ui/primitives";
import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "neutral" | "allow" | "approval" | "block";
  hint?: string;
}) {
  const toneCls = {
    neutral: "text-graphite bg-mist",
    allow: "text-allow bg-allow-bg",
    approval: "text-approval bg-approval-bg",
    block: "text-block bg-block-bg",
  }[tone];

  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ink-soft">{label}</p>
        <div className={clsx("rounded-md p-1.5", toneCls)}>
          <Icon size={15} strokeWidth={2.25} />
        </div>
      </div>
      <p className="font-display text-[26px] font-semibold text-ink mt-2 leading-none">{value}</p>
      {hint && <p className="text-xs text-ink-soft mt-1.5">{hint}</p>}
    </Panel>
  );
}
