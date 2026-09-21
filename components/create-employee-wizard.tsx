"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { INDUSTRIES, ROLE_TEMPLATES, INTEGRATIONS, TOOL_LABEL } from "@/lib/reference-data";
import { createEmployee } from "@/lib/actions";
import { Button, Panel, Avatar, PageHeader } from "@/components/ui/primitives";
import { RiskLevel, IndustryId } from "@/lib/types";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const STEPS = [
  "Industry",
  "Role",
  "Knowledge",
  "Tools",
  "Permissions",
  "Security",
  "Review",
];

const RISK_OPTIONS: { level: RiskLevel; label: string; detail: string }[] = [
  { level: "low", label: "Low and above", detail: "Almost everything routes to a human first. Safest, slowest." },
  { level: "medium", label: "Medium and above", detail: "Routine actions run automatically; anything riskier is reviewed." },
  { level: "high", label: "High and above", detail: "Most day-to-day work runs automatically. Recommended default." },
  { level: "critical", label: "Critical only", detail: "Only the most sensitive actions need a human. Use with trusted employees." },
];

export function CreateEmployeeWizard({
  initialTemplateId,
  initialIndustry,
}: {
  initialTemplateId?: string;
  initialIndustry?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);

  const initialTemplate = ROLE_TEMPLATES.find((t) => t.id === initialTemplateId);

  const [industry, setIndustry] = useState<IndustryId | "">(
    (initialIndustry as IndustryId) || initialTemplate?.suggestedIndustries[0] || ""
  );
  const [templateId, setTemplateId] = useState(initialTemplateId || "");
  const [name, setName] = useState("");
  const [knowledgeNote, setKnowledgeNote] = useState("");
  const [tools, setTools] = useState<Record<string, boolean>>({});
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [requiresApprovalOver, setRequiresApprovalOver] = useState<RiskLevel>("high");

  const template = ROLE_TEMPLATES.find((t) => t.id === templateId);

  const availableTemplates = useMemo(
    () => (industry ? ROLE_TEMPLATES.filter((t) => t.suggestedIndustries.includes(industry)) : ROLE_TEMPLATES),
    [industry]
  );

  function selectTemplate(id: string) {
    setTemplateId(id);
    const t = ROLE_TEMPLATES.find((x) => x.id === id);
    if (t) {
      setTools(Object.fromEntries(t.defaultTools.map((tool) => [tool, true])));
      setPermissions(Object.fromEntries(t.defaultPermissions.map((p) => [p, true])));
      if (!name) setName(t.name);
    }
  }

  const canProceed = [
    !!industry,
    !!templateId,
    name.trim().length > 0,
    true,
    true,
    true,
    true,
  ][step];

  function handleDeploy() {
    if (!template || !industry) return;
    startTransition(async () => {
      const id = await createEmployee({
        name,
        role: template.role,
        industry,
        templateId: template.id,
        knowledgeNote,
        requiresApprovalOver,
      });
      router.push(`/employees/${id}`);
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Create AI employee"
        title="Deploy a new AI employee"
        description="Industry → Role → Knowledge → Tools → Permissions → Security policy → Deploy."
      />

      {/* Stepper */}
      <div className="flex items-center mb-8 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center shrink-0">
            <div
              className={clsx(
                "flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full",
                i === step
                  ? "text-graphite"
                  : i < step
                  ? "text-allow"
                  : "text-ink-soft"
              )}
            >
              <span
                className={clsx(
                  "flex items-center justify-center h-5 w-5 rounded-full text-[11px] font-mono",
                  i === step
                    ? "bg-graphite text-white"
                    : i < step
                    ? "bg-allow text-white"
                    : "bg-line-soft text-ink-soft"
                )}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              {label}
            </div>
            {i < STEPS.length - 1 && <div className="w-6 md:w-10 h-px bg-line mx-1" />}
          </div>
        ))}
      </div>

      <Panel className="p-6 min-h-[360px]">
        {step === 0 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Which industry is this for?</h2>
            <p className="text-sm text-ink-soft mb-5">This determines the default workflows and knowledge suggestions.</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {INDUSTRIES.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setIndustry(i.id)}
                  className={clsx(
                    "text-left rounded-md border p-3 transition-colors",
                    industry === i.id ? "border-graphite bg-mist" : "border-line hover:border-graphite/50"
                  )}
                >
                  <p className="text-sm font-medium text-ink">{i.name}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{i.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Choose a role template</h2>
            <p className="text-sm text-ink-soft mb-5">Start from a template — you&apos;ll customize everything next.</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {availableTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTemplate(t.id)}
                  className={clsx(
                    "text-left rounded-md border p-3 flex gap-3 transition-colors",
                    templateId === t.id ? "border-graphite bg-mist" : "border-line hover:border-graphite/50"
                  )}
                >
                  <Avatar seed={t.avatarSeed} name={t.name} size={32} />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Name it and add business knowledge</h2>
            <p className="text-sm text-ink-soft mb-5">
              Give this employee an identity and the context it needs to work in your business.
            </p>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">Employee name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aria"
              className="w-full rounded-md border border-line px-3 py-2 text-sm mb-4 focus:outline-none focus:border-graphite"
            />
            <label className="block text-xs font-medium text-ink-soft mb-1.5">Business knowledge (optional)</label>
            <textarea
              value={knowledgeNote}
              onChange={(e) => setKnowledgeNote(e.target.value)}
              rows={5}
              placeholder="Paste a script, policy, price list, or anything this employee should know before it starts working."
              className="w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:border-graphite"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Connect tools</h2>
            <p className="text-sm text-ink-soft mb-5">
              This employee can only take actions through tools you connect. Everything else is denied by default.
            </p>
            <div className="flex flex-col gap-2">
              {INTEGRATIONS.map((integ) => {
                const on = !!tools[integ.id];
                return (
                  <div
                    key={integ.id}
                    className="flex items-center justify-between rounded-md border border-line p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{integ.name}</p>
                      <p className="text-xs text-ink-soft">{integ.description}</p>
                    </div>
                    <button
                      onClick={() => setTools((t) => ({ ...t, [integ.id]: !t[integ.id] }))}
                      className={clsx(
                        "text-xs font-mono px-3 py-1.5 rounded-full transition-colors",
                        on ? "bg-allow-bg text-allow" : "bg-line-soft text-ink-soft"
                      )}
                    >
                      {on ? "Connected" : "Off"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Configure permissions</h2>
            <p className="text-sm text-ink-soft mb-5">
              These map directly to what the Security Control Engine will allow at runtime.
            </p>
            <div className="flex flex-col gap-2">
              {(template?.defaultPermissions ?? []).map((p) => {
                const on = !!permissions[p];
                return (
                  <div key={p} className="flex items-center justify-between rounded-md border border-line p-3">
                    <p className="text-sm text-ink capitalize">{p.replace(/_/g, " ")}</p>
                    <button
                      onClick={() => setPermissions((s) => ({ ...s, [p]: !s[p] }))}
                      className={clsx(
                        "text-xs font-mono px-3 py-1.5 rounded-full transition-colors",
                        on ? "bg-allow-bg text-allow" : "bg-line-soft text-ink-soft"
                      )}
                    >
                      {on ? "Granted" : "Denied"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Set the approval threshold</h2>
            <p className="text-sm text-ink-soft mb-5">
              Actions at or above this risk level are sent to the Human Approval Center instead of running automatically.
            </p>
            <div className="flex flex-col gap-2">
              {RISK_OPTIONS.map((opt) => (
                <button
                  key={opt.level}
                  onClick={() => setRequiresApprovalOver(opt.level)}
                  className={clsx(
                    "text-left rounded-md border p-3 transition-colors",
                    requiresApprovalOver === opt.level ? "border-graphite bg-mist" : "border-line hover:border-graphite/50"
                  )}
                >
                  <p className="text-sm font-medium text-ink">{opt.label}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{opt.detail}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && template && industry && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Review and deploy</h2>
            <p className="text-sm text-ink-soft mb-5">Confirm the details below. You can change all of this later, at any time.</p>
            <div className="flex items-center gap-3 mb-5">
              <Avatar seed={name || template.avatarSeed} name={name || template.name} size={44} />
              <div>
                <p className="font-medium text-ink">{name || template.name}</p>
                <p className="text-xs text-ink-soft capitalize">
                  {template.role.replace("-", " ")} · {INDUSTRIES.find((i) => i.id === industry)?.name}
                </p>
              </div>
            </div>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs text-ink-soft mb-1">Tools connected</dt>
                <dd className="text-ink">
                  {Object.entries(tools).filter(([, v]) => v).map(([k]) => TOOL_LABEL[k] ?? k).join(", ") || "None"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft mb-1">Permissions granted</dt>
                <dd className="text-ink">{Object.values(permissions).filter(Boolean).length} of {Object.keys(permissions).length}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft mb-1">Approval threshold</dt>
                <dd className="text-ink capitalize">{requiresApprovalOver} and above</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft mb-1">Business knowledge</dt>
                <dd className="text-ink">{knowledgeNote ? "1 note added" : "None yet"}</dd>
              </div>
            </dl>
          </div>
        )}
      </Panel>

      <div className="flex items-center justify-between mt-5">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft size={15} /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed}>
            Continue <ChevronRight size={15} />
          </Button>
        ) : (
          <Button onClick={handleDeploy} disabled={isPending}>
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Deploy AI employee
          </Button>
        )}
      </div>
    </div>
  );
}
