"use client";

import { useState, useTransition } from "react";
import { deleteEmployee } from "@/lib/actions";
import { Button, Panel } from "@/components/ui/primitives";
import { Trash2 } from "lucide-react";

export function DeleteEmployee({ employeeId, employeeName }: { employeeId: string; employeeName: string }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [isPending, startTransition] = useTransition();

  const matches = typed.trim().toLowerCase() === employeeName.trim().toLowerCase();

  return (
    <Panel className="p-5 border-block/30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-semibold text-ink">Delete this AI employee</h2>
          <p className="text-sm text-ink-soft mt-1 max-w-xl">
            Permanently removes {employeeName} and its configuration. If you only want it to stop
            working for now, use Pause employee instead.
          </p>
        </div>
        {!open && (
          <Button variant="secondary" onClick={() => setOpen(true)} className="text-block border-block/40 hover:border-block">
            <Trash2 size={14} /> Delete employee
          </Button>
        )}
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-line-soft">
          <ul className="text-sm text-ink-soft space-y-1.5 mb-4 list-disc pl-5">
            <li>
              <span className="text-ink font-medium">Removed:</span> its knowledge, workflow, connected tools
              and permissions. This cannot be undone.
            </li>
            <li>
              <span className="text-ink font-medium">Kept:</span> its past action logs and security alerts,
              so your audit trail stays complete.
            </li>
            <li>
              <span className="text-ink font-medium">Auto-rejected:</span> any of its actions still waiting in
              the Approval Center.
            </li>
          </ul>
          <label className="block text-xs font-medium text-ink-soft mb-1.5">
            Type <span className="font-mono text-ink">{employeeName}</span> to confirm
          </label>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoFocus
            className="w-full max-w-xs rounded-md border border-line px-3 py-2 text-sm mb-3 focus:outline-none focus:border-block"
          />
          <div className="flex gap-2">
            <Button
              variant="danger"
              disabled={!matches || isPending}
              onClick={() => startTransition(() => deleteEmployee(employeeId))}
            >
              <Trash2 size={14} /> {isPending ? "Deleting…" : "Delete permanently"}
            </Button>
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                setOpen(false);
                setTyped("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
}
