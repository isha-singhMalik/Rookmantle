"use client";

import { useTransition } from "react";
import { toggleIntegration } from "@/lib/actions";
import { Integration } from "@/lib/types";
import { Panel } from "@/components/ui/primitives";
import clsx from "clsx";
import { Plug } from "lucide-react";

export function IntegrationList({ integrations }: { integrations: Integration[] }) {
  const [isPending, startTransition] = useTransition();

  const byCategory = integrations.reduce<Record<string, Integration[]>>((acc, i) => {
    (acc[i.category] ??= []).push(i);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category}>
          <p className="text-xs font-medium text-ink-soft mb-2">{category}</p>
          <Panel className="divide-y divide-line-soft">
            {items.map((integ) => (
              <div key={integ.id} className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-mist p-2 text-ink-soft">
                    <Plug size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{integ.name}</p>
                    <p className="text-xs text-ink-soft">{integ.description}</p>
                  </div>
                </div>
                <button
                  disabled={isPending}
                  onClick={() => startTransition(() => toggleIntegration(integ.id))}
                  className={clsx(
                    "text-xs font-mono px-3 py-1.5 rounded-full transition-colors shrink-0",
                    integ.connected ? "bg-allow-bg text-allow" : "bg-line-soft text-ink-soft"
                  )}
                >
                  {integ.connected ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </Panel>
        </div>
      ))}
    </div>
  );
}
