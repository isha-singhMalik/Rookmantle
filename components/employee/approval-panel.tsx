"use client";

import { useTransition } from "react";
import { updateApprovalThreshold } from "@/lib/actions";
import { RiskLevel } from "@/lib/types";
import clsx from "clsx";

const OPTIONS: { level: RiskLevel; label: string }[] = [
  { level: "low", label: "Low+" },
  { level: "medium", label: "Medium+" },
  { level: "high", label: "High+" },
  { level: "critical", label: "Critical only" },
];

export function ApprovalPanel({ employeeId, current }: { employeeId: string; current: RiskLevel }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <h2 className="font-display font-semibold text-ink mb-1">Security policy</h2>
      <p className="text-sm text-ink-soft mb-3">
        Actions at or above this risk level are sent to the Human Approval Center instead of running automatically.
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.level}
            disabled={isPending}
            onClick={() => startTransition(() => updateApprovalThreshold(employeeId, opt.level))}
            className={clsx(
              "text-xs font-mono px-3 py-1.5 rounded-full border transition-colors",
              current === opt.level
                ? "bg-graphite text-white border-graphite"
                : "border-line text-ink-soft hover:border-graphite"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
