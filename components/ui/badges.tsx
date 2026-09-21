import { RiskLevel, Verdict } from "@/lib/types";
import { ShieldCheck, ShieldX, ShieldAlert } from "lucide-react";
import clsx from "clsx";

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const map: Record<Verdict, { label: string; cls: string; Icon: typeof ShieldCheck }> = {
    ALLOW: { label: "Allowed", cls: "text-allow bg-allow-bg", Icon: ShieldCheck },
    BLOCK: { label: "Blocked", cls: "text-block bg-block-bg", Icon: ShieldX },
    REQUIRE_APPROVAL: { label: "Needs approval", cls: "text-approval bg-approval-bg", Icon: ShieldAlert },
  };
  const { label, cls, Icon } = map[verdict];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-mono tracking-tight",
        cls
      )}
    >
      <Icon size={13} strokeWidth={2.25} />
      {label}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, string> = {
    low: "text-allow bg-allow-bg",
    medium: "text-approval bg-approval-bg",
    high: "text-block bg-block-bg",
    critical: "text-white bg-block",
  };
  return (
    <span className={clsx("inline-block rounded px-2 py-0.5 text-[11px] font-mono font-medium", map[level])}>
      {level}
    </span>
  );
}

export function StatusDot({ status }: { status: "active" | "paused" | "draft" }) {
  const map = {
    active: "bg-allow",
    paused: "bg-approval",
    draft: "bg-ink-soft",
  };
  return <span className={clsx("inline-block h-2 w-2 rounded-full", map[status])} />;
}
