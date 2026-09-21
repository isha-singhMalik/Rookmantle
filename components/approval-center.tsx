"use client";

import { useTransition } from "react";
import { decideApproval } from "@/lib/actions";
import { ActionLogEntry } from "@/lib/types";
import { Panel, Button, EmptyState } from "@/components/ui/primitives";
import { RiskBadge } from "@/components/ui/badges";
import { CATEGORY_LABEL } from "@/lib/security-engine";
import { Check, X, Clock3 } from "lucide-react";
import Link from "next/link";

export function ApprovalCenter({ logs }: { logs: ActionLogEntry[] }) {
  const [isPending, startTransition] = useTransition();

  const pending = logs.filter((l) => l.approvalStatus === "pending");
  const decided = logs.filter((l) => l.approvalStatus === "approved" || l.approvalStatus === "rejected");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display font-semibold text-ink mb-3 flex items-center gap-2">
          <Clock3 size={16} className="text-approval" /> Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <EmptyState title="Nothing waiting on you" detail="Actions that need a human decision will appear here." />
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((log) => (
              <Panel key={log.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm text-ink">{log.action}</p>
                    <p className="text-xs text-ink-soft mt-1 max-w-lg">{log.reason}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-ink-soft font-mono flex-wrap">
                      <Link href={`/employees/${log.employeeId}`} className="hover:underline">
                        {log.employeeName}
                      </Link>
                      · {CATEGORY_LABEL[log.category]} · {log.tool} · {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <RiskBadge level={log.dataSensitivity} />
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-line-soft">
                  <Button
                    className="text-xs"
                    disabled={isPending}
                    onClick={() => startTransition(() => decideApproval(log.id, "approved"))}
                  >
                    <Check size={13} /> Approve
                  </Button>
                  <Button
                    variant="danger"
                    className="text-xs"
                    disabled={isPending}
                    onClick={() => startTransition(() => decideApproval(log.id, "rejected"))}
                  >
                    <X size={13} /> Reject
                  </Button>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </div>

      {decided.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-ink mb-3">Recently decided</h2>
          <Panel className="divide-y divide-line-soft">
            {decided.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3.5">
                <div>
                  <p className="text-sm text-ink">{log.action}</p>
                  <p className="text-xs text-ink-soft font-mono">{log.employeeName} · by {log.approvedBy}</p>
                </div>
                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded-full ${
                    log.approvalStatus === "approved" ? "bg-allow-bg text-allow" : "bg-block-bg text-block"
                  }`}
                >
                  {log.approvalStatus}
                </span>
              </div>
            ))}
          </Panel>
        </div>
      )}
    </div>
  );
}
