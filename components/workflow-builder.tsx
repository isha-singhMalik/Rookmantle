"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { AIEmployee } from "@/lib/types";
import { roleLabel } from "@/lib/labels";
import { updateWorkflowSteps } from "@/lib/actions";
import { Avatar, Button, Panel } from "@/components/ui/primitives";
import { ArrowUp, ArrowDown, Trash2, Plus, Save } from "lucide-react";

type StepDraft = { title: string; detail: string };

export function WorkflowBuilder({ employees }: { employees: AIEmployee[] }) {
  const [selectedId, setSelectedId] = useState(employees[0]?.id ?? "");
  const selected = employees.find((e) => e.id === selectedId) ?? employees[0];
  const [steps, setSteps] = useState<StepDraft[]>(
    selected?.workflow.steps.map((s) => ({ title: s.title, detail: s.detail })) ?? []
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function selectEmployee(emp: AIEmployee) {
    setSelectedId(emp.id);
    setSteps(emp.workflow.steps.map((s) => ({ title: s.title, detail: s.detail })));
    setSaved(false);
  }

  function updateStep(i: number, field: keyof StepDraft, value: string) {
    setSteps((s) => s.map((step, idx) => (idx === i ? { ...step, [field]: value } : step)));
  }

  function move(i: number, dir: -1 | 1) {
    setSteps((s) => {
      const copy = [...s];
      const j = i + dir;
      if (j < 0 || j >= copy.length) return s;
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function remove(i: number) {
    setSteps((s) => s.filter((_, idx) => idx !== i));
  }

  function addStep() {
    setSteps((s) => [...s, { title: "New step", detail: "" }]);
  }

  function save() {
    if (!selected) return;
    startTransition(async () => {
      await updateWorkflowSteps(selected.id, steps);
      setSaved(true);
    });
  }

  return (
    <div className="grid lg:grid-cols-4 gap-5">
      <Panel className="lg:col-span-1 p-2 h-fit">
        {employees.map((emp) => (
          <button
            key={emp.id}
            onClick={() => selectEmployee(emp)}
            className={clsx(
              "w-full flex items-center gap-2.5 rounded-md p-2.5 text-left transition-colors",
              selectedId === emp.id ? "bg-mist" : "hover:bg-mist/60"
            )}
          >
            <Avatar seed={emp.avatarSeed} name={emp.name} size={30} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{emp.name}</p>
              <p className="text-xs text-ink-soft capitalize truncate">{roleLabel(emp)}</p>
            </div>
          </button>
        ))}
      </Panel>

      {selected && (
        <Panel className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-semibold text-ink">{selected.workflow.name}</h2>
            <Button onClick={save} disabled={isPending} className="text-xs">
              <Save size={13} /> {saved ? "Saved" : "Save workflow"}
            </Button>
          </div>
          <p className="text-sm text-ink-soft mb-4">Steps run in order, top to bottom, for {selected.name}.</p>

          <div className="flex flex-col gap-2.5">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 rounded-md border border-line p-3">
                <div className="flex flex-col items-center justify-center gap-1 pt-1">
                  <span className="text-xs font-mono text-ink-soft">{i + 1}</span>
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-soft disabled:opacity-20">
                    <ArrowUp size={12} />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === steps.length - 1} className="text-ink-soft disabled:opacity-20">
                    <ArrowDown size={12} />
                  </button>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <input
                    value={step.title}
                    onChange={(e) => updateStep(i, "title", e.target.value)}
                    className="w-full rounded border border-line px-2 py-1 text-sm font-medium focus:outline-none focus:border-graphite"
                  />
                  <input
                    value={step.detail}
                    onChange={(e) => updateStep(i, "detail", e.target.value)}
                    placeholder="Describe what happens in this step"
                    className="w-full rounded border border-line px-2 py-1 text-xs text-ink-soft focus:outline-none focus:border-graphite"
                  />
                </div>
                <button onClick={() => remove(i)} className="text-ink-soft hover:text-block self-start mt-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addStep}
            className="mt-3 w-full rounded-md border border-dashed border-line py-2.5 text-xs font-medium text-ink-soft hover:border-graphite hover:text-ink flex items-center justify-center gap-1.5"
          >
            <Plus size={13} /> Add step
          </button>
        </Panel>
      )}
    </div>
  );
}
