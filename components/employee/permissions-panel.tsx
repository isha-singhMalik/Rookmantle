"use client";

import { useTransition } from "react";
import { togglePermission } from "@/lib/actions";
import { Permission } from "@/lib/types";
import { RiskBadge } from "@/components/ui/badges";
import clsx from "clsx";

export function PermissionsPanel({ employeeId, permissions }: { employeeId: string; permissions: Permission[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <h2 className="font-display font-semibold text-ink mb-3">Permissions</h2>
      <div className="flex flex-col gap-2">
        {permissions.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-md border border-line p-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-ink">{p.label}</p>
              <RiskBadge level={p.sensitivity} />
            </div>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => togglePermission(employeeId, p.id))}
              className={clsx(
                "text-xs font-mono px-3 py-1.5 rounded-full transition-colors shrink-0",
                p.granted ? "bg-allow-bg text-allow" : "bg-block-bg text-block"
              )}
            >
              {p.granted ? "Granted" : "Denied"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
