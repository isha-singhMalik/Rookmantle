"use client";

import { useState, useTransition } from "react";
import { simulateAction } from "@/lib/actions";
import { ActionCategory, AIEmployee, RiskLevel } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/security-engine";
import { TOOL_LABEL } from "@/lib/reference-data";
import { Button, Panel } from "@/components/ui/primitives";
import { VerdictBadge, RiskBadge } from "@/components/ui/badges";
import { Play } from "lucide-react";

const CATEGORIES: ActionCategory[] = [
  "communication",
  "data_access",
  "financial",
  "scheduling",
  "record_update",
  "external_tool",
];

const SENSITIVITIES: RiskLevel[] = ["low", "medium", "high", "critical"];

interface Result {
  verdict: "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL";
  riskScore: number;
  riskLevel: RiskLevel;
  reason: string;
}

export function SimulatePanel({ employee }: { employee: AIEmployee }) {
  const [action, setAction] = useState("Send a follow-up message to a customer");
  const [category, setCategory] = useState<ActionCategory>("communication");
  const [tool, setTool] = useState(employee.tools[0]?.toolId ?? "email");
  const [sensitivity, setSensitivity] = useState<RiskLevel>("low");
  const [result, setResult] = useState<Result | null>(null);
  const [isPending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      const res = await simulateAction({
        employeeId: employee.id,
        action,
        category,
        tool,
        dataSensitivity: sensitivity,
      });
      setResult(res);
    });
  }

  return (
    <Panel className="p-5 border-graphite/20">
      <h2 className="font-display font-semibold text-ink mb-1">Simulate an action</h2>
      <p className="text-sm text-ink-soft mb-4">
        Test what {employee.name} would do. Every request goes through the same Security Control Engine used in production.
      </p>

      <label className="block text-xs font-medium text-ink-soft mb-1.5">Action description</label>
      <input
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="w-full rounded-md border border-line px-3 py-2 text-sm mb-3 focus:outline-none focus:border-graphite"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ActionCategory)}
            className="w-full min-w-0 rounded-md border border-line px-2 py-2 text-xs focus:outline-none focus:border-graphite"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1.5">Tool used</label>
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value)}
            className="w-full min-w-0 rounded-md border border-line px-2 py-2 text-xs focus:outline-none focus:border-graphite"
          >
            {employee.tools.map((t) => (
              <option key={t.toolId} value={t.toolId}>
                {TOOL_LABEL[t.toolId] ?? t.toolId} {!t.connected && "(disconnected)"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1.5">Data sensitivity</label>
          <select
            value={sensitivity}
            onChange={(e) => setSensitivity(e.target.value as RiskLevel)}
            className="w-full min-w-0 rounded-md border border-line px-2 py-2 text-xs focus:outline-none focus:border-graphite"
          >
            {SENSITIVITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button onClick={run} disabled={isPending} className="w-full mb-4">
        <Play size={14} />
        Run through Security Control Engine
      </Button>

      {result && (
        <div className="rounded-md bg-mist p-4">
          <div className="flex items-center justify-between mb-2">
            <VerdictBadge verdict={result.verdict} />
            <div className="flex items-center gap-2 text-xs text-ink-soft">
              Risk score <span className="font-mono text-ink">{result.riskScore}</span>
              <RiskBadge level={result.riskLevel} />
            </div>
          </div>
          <p className="text-sm text-ink-soft">{result.reason}</p>
        </div>
      )}
    </Panel>
  );
}
