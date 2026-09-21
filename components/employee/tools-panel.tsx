"use client";

import { useTransition } from "react";
import { toggleEmployeeTool } from "@/lib/actions";
import { ToolConnection } from "@/lib/types";
import { TOOL_LABEL, INTEGRATIONS } from "@/lib/reference-data";
import clsx from "clsx";

export function ToolsPanel({ employeeId, tools }: { employeeId: string; tools: ToolConnection[] }) {
  const [isPending, startTransition] = useTransition();
  const relevant = INTEGRATIONS.filter((i) => tools.some((t) => t.toolId === i.id));

  return (
    <div>
      <h2 className="font-display font-semibold text-ink mb-3">Connected tools</h2>
      <div className="flex flex-col gap-2">
        {relevant.map((integ) => {
          const conn = tools.find((t) => t.toolId === integ.id);
          const on = !!conn?.connected;
          return (
            <div key={integ.id} className="flex items-center justify-between rounded-md border border-line p-3">
              <div>
                <p className="text-sm font-medium text-ink">{TOOL_LABEL[integ.id] ?? integ.name}</p>
                <p className="text-xs text-ink-soft">{integ.description}</p>
              </div>
              <button
                disabled={isPending}
                onClick={() => startTransition(() => toggleEmployeeTool(employeeId, integ.id))}
                className={clsx(
                  "text-xs font-mono px-3 py-1.5 rounded-full transition-colors shrink-0",
                  on ? "bg-allow-bg text-allow" : "bg-line-soft text-ink-soft"
                )}
              >
                {on ? "Connected" : "Disconnected"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
