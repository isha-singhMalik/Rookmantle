"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { PolicyRule, RiskLevel } from "@/lib/types";
import { addPolicy, togglePolicy } from "@/lib/actions";
import { INDUSTRIES } from "@/lib/reference-data";
import { Button, Panel } from "@/components/ui/primitives";
import { RiskBadge } from "@/components/ui/badges";
import { Plus, Power } from "lucide-react";

const ROLES = ["all", "sales", "support", "recruiter", "operations", "accounting", "marketing", "follow-up", "research", "custom"];
const CATEGORIES = ["all", "communication", "data_access", "financial", "scheduling", "record_update", "external_tool"];
const RISKS: RiskLevel[] = ["low", "medium", "high", "critical"];

export function PolicyManager({ policies }: { policies: PolicyRule[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    appliesToRole: "all",
    appliesToIndustry: "all",
    category: "all",
    maxAutoApproveRisk: "medium" as RiskLevel,
    blockAbove: "critical" as RiskLevel,
    description: "",
  });

  function submit() {
    if (!form.name.trim()) return;
    startTransition(async () => {
      await addPolicy(form);
      setForm({ ...form, name: "", description: "" });
      setOpen(false);
    });
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen((o) => !o)} variant="secondary" className="text-sm">
          <Plus size={14} /> New policy rule
        </Button>
      </div>

      {open && (
        <Panel className="p-5 mb-5">
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Rule name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:border-graphite"
                placeholder="e.g. Marketing sends need review in Healthcare"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Applies to role</label>
              <select
                value={form.appliesToRole}
                onChange={(e) => setForm((f) => ({ ...f, appliesToRole: e.target.value }))}
                className="w-full rounded-md border border-line px-2 py-2 text-sm"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r === "all" ? "All roles" : r === "custom" ? "Custom roles (built by you)" : r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Applies to industry</label>
              <select
                value={form.appliesToIndustry}
                onChange={(e) => setForm((f) => ({ ...f, appliesToIndustry: e.target.value }))}
                className="w-full rounded-md border border-line px-2 py-2 text-sm"
              >
                <option value="all">All industries</option>
                <option value="custom">Custom industries (defined by you)</option>
                {INDUSTRIES.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Action category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-md border border-line px-2 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === "all" ? "All categories" : c.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">Auto-approve up to</label>
                <select
                  value={form.maxAutoApproveRisk}
                  onChange={(e) => setForm((f) => ({ ...f, maxAutoApproveRisk: e.target.value as RiskLevel }))}
                  className="w-full rounded-md border border-line px-2 py-2 text-sm"
                >
                  {RISKS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5">Block at/above</label>
                <select
                  value={form.blockAbove}
                  onChange={(e) => setForm((f) => ({ ...f, blockAbove: e.target.value as RiskLevel }))}
                  className="w-full rounded-md border border-line px-2 py-2 text-sm"
                >
                  {RISKS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-ink-soft mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:border-graphite"
                placeholder="Explain what this rule does and why."
              />
            </div>
          </div>
          <Button onClick={submit} disabled={isPending}>Create rule</Button>
        </Panel>
      )}

      <div className="flex flex-col gap-3">
        {policies.map((p) => (
          <Panel key={p.id} className={clsx("p-4", !p.enabled && "opacity-50")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-sm text-ink">{p.name}</p>
                <p className="text-xs text-ink-soft mt-1 max-w-xl">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[11px] font-mono bg-mist text-ink-soft rounded px-1.5 py-0.5">
                    role: {p.appliesToRole}
                  </span>
                  <span className="text-[11px] font-mono bg-mist text-ink-soft rounded px-1.5 py-0.5">
                    industry: {p.appliesToIndustry}
                  </span>
                  <span className="text-[11px] font-mono bg-mist text-ink-soft rounded px-1.5 py-0.5">
                    category: {p.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => startTransition(() => togglePolicy(p.id))}
                  className={clsx(
                    "text-xs font-mono px-2.5 py-1 rounded-full flex items-center gap-1",
                    p.enabled ? "bg-allow-bg text-allow" : "bg-line-soft text-ink-soft"
                  )}
                >
                  <Power size={11} /> {p.enabled ? "Enabled" : "Disabled"}
                </button>
                <div className="flex gap-1.5 text-[11px]">
                  <RiskBadge level={p.maxAutoApproveRisk} />
                  <span className="text-ink-soft self-center">auto</span>
                  <RiskBadge level={p.blockAbove} />
                  <span className="text-ink-soft self-center">block</span>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
