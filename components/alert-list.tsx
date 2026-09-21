"use client";

import { useTransition } from "react";
import { acknowledgeAlert } from "@/lib/actions";
import { SecurityAlert } from "@/lib/types";
import { Panel, Button, EmptyState } from "@/components/ui/primitives";
import { RiskBadge } from "@/components/ui/badges";
import { AlertTriangle, Check } from "lucide-react";
import Link from "next/link";

export function AlertList({ alerts }: { alerts: SecurityAlert[] }) {
  const [isPending, startTransition] = useTransition();

  if (alerts.length === 0) {
    return <EmptyState title="No security alerts" detail="Suspicious activity and blocked actions will show up here." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {alerts.map((alert) => (
        <Panel key={alert.id} className={alert.acknowledged ? "p-4 opacity-50" : "p-4 border-block/30"}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <AlertTriangle size={18} className="text-block mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm text-ink">{alert.title}</p>
                <p className="text-sm text-ink-soft mt-1 max-w-lg">{alert.detail}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-ink-soft font-mono">
                  <Link href={`/employees/${alert.employeeId}`} className="hover:underline">
                    {alert.employeeName}
                  </Link>
                  · {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <RiskBadge level={alert.severity} />
              {!alert.acknowledged && (
                <Button
                  variant="secondary"
                  className="text-xs"
                  disabled={isPending}
                  onClick={() => startTransition(() => acknowledgeAlert(alert.id))}
                >
                  <Check size={12} /> Acknowledge
                </Button>
              )}
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
