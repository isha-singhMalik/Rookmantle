"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  INDUSTRIES,
  ROLE_TEMPLATES,
  INTEGRATIONS,
  TOOL_LABEL,
  PERMISSION_LIBRARY,
  guessSensitivity,
  humanizePermission,
} from "@/lib/reference-data";
import { createEmployee } from "@/lib/actions";
import { Button, Panel, Avatar, PageHeader } from "@/components/ui/primitives";
import { RiskBadge } from "@/components/ui/badges";
import { RiskLevel, IndustryKey, RoleTemplate } from "@/lib/types";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

const CUSTOM = "custom" as const;

const STEPS = ["Industry", "Role", "Work", "Knowledge", "Tools", "Permissions", "Security", "Review"];

const STEP_HINTS = [
  "Pick an industry, or choose the last card and name your own.",
  "Pick a template, or build your own role and give it a title.",
  "Describe the work in a sentence or two (custom roles) and keep at least one step.",
  "Give your AI employee a name.",
  "",
  "",
  "",
  "",
];

const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high", "critical"];

const RISK_OPTIONS: { level: RiskLevel; label: string; detail: string }[] = [
  { level: "low", label: "Low and above", detail: "Almost everything routes to a human first. Safest, slowest." },
  { level: "medium", label: "Medium and above", detail: "Routine actions run automatically; anything riskier is reviewed." },
  { level: "high", label: "High and above", detail: "Most day-to-day work runs automatically. Recommended default." },
  { level: "critical", label: "Critical only", detail: "Only the most sensitive actions need a human. Use with trusted employees." },
];

type StepDraft = { title: string; detail: string };
type PermissionDraft = { label: string; granted: boolean; sensitivity: RiskLevel };

const GENERIC_STEPS: StepDraft[] = [
  { title: "Receive the task", detail: "Pick up the request or trigger that starts the work." },
  { title: "Do the work", detail: "Carry out the task using the connected tools." },
  { title: "Report the result", detail: "Log what happened and tell the right person." },
];

/** Everything a template pre-fills. A custom role starts from a clean, generic base. */
function seedFrom(t?: RoleTemplate) {
  if (!t) {
    return {
      tools: {} as Record<string, boolean>,
      permissions: [] as PermissionDraft[],
      steps: GENERIC_STEPS.map((s) => ({ ...s })),
      jobDescription: "",
    };
  }
  return {
    tools: Object.fromEntries(t.defaultTools.map((tool) => [tool, true])) as Record<string, boolean>,
    permissions: t.defaultPermissions.map((p) => ({
      label: humanizePermission(p),
      granted: true,
      sensitivity: guessSensitivity(p),
    })),
    steps: t.defaultSteps.map((s) => ({ ...s })),
    jobDescription: t.description,
  };
}

function OnOff({ on, onLabel, offLabel, onClick }: { on: boolean; onLabel: string; offLabel: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "text-xs font-mono px-3 py-1.5 rounded-full transition-colors shrink-0",
        on ? "bg-allow-bg text-allow" : "bg-line-soft text-ink-soft"
      )}
    >
      {on ? onLabel : offLabel}
    </button>
  );
}

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
  const seed = seedFrom(initialTemplate);

  const [industry, setIndustry] = useState<IndustryKey | "">(
    (initialIndustry as IndustryKey) || initialTemplate?.suggestedIndustries[0] || ""
  );
  const [customIndustry, setCustomIndustry] = useState("");
  const [templateId, setTemplateId] = useState<string>(
    initialTemplateId === CUSTOM ? CUSTOM : initialTemplate?.id ?? ""
  );
  const [customRole, setCustomRole] = useState("");
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [jobDescription, setJobDescription] = useState(seed.jobDescription);
  const [steps, setSteps] = useState<StepDraft[]>(seed.steps);
  const [name, setName] = useState(initialTemplate?.name ?? "");
  const [knowledgeNote, setKnowledgeNote] = useState("");
  const [tools, setTools] = useState<Record<string, boolean>>(seed.tools);
  const [permissions, setPermissions] = useState<PermissionDraft[]>(seed.permissions);
  const [newPermission, setNewPermission] = useState("");
  const [newPermissionRisk, setNewPermissionRisk] = useState<RiskLevel>("medium");
  const [requiresApprovalOver, setRequiresApprovalOver] = useState<RiskLevel>("high");

  const isCustomRole = templateId === CUSTOM;
  const template = ROLE_TEMPLATES.find((t) => t.id === templateId);

  const availableTemplates = useMemo(
    () =>
      showAllRoles || !industry || industry === CUSTOM
        ? ROLE_TEMPLATES
        : ROLE_TEMPLATES.filter((t) => t.suggestedIndustries.includes(industry)),
    [industry, showAllRoles]
  );

  function selectTemplate(id: string) {
    if (id === templateId) return; // don't wipe edits when clicking the same card again
    setTemplateId(id);
    const t = ROLE_TEMPLATES.find((x) => x.id === id);
    const s = seedFrom(t);
    setTools(s.tools);
    setPermissions(s.permissions);
    setSteps(s.steps);
    setJobDescription(s.jobDescription);
    if (t && !name) setName(t.name);
  }

  const canProceed = [
    !!industry && (industry !== CUSTOM || customIndustry.trim().length > 0),
    !!templateId && (!isCustomRole || customRole.trim().length > 0),
    steps.some((s) => s.title.trim()) && (!isCustomRole || jobDescription.trim().length >= 10),
    name.trim().length > 0,
    true,
    true,
    true,
    true,
  ][step];

  // ---- steps editor helpers ----
  const updateStep = (i: number, field: keyof StepDraft, value: string) =>
    setSteps((s) => s.map((st, idx) => (idx === i ? { ...st, [field]: value } : st)));
  const moveStep = (i: number, dir: -1 | 1) =>
    setSteps((s) => {
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const copy = [...s];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const removeStep = (i: number) => setSteps((s) => s.filter((_, idx) => idx !== i));
  const addStep = () => setSteps((s) => [...s, { title: "", detail: "" }]);

  // ---- permission helpers ----
  function addPermission(label: string, sensitivity: RiskLevel) {
    const text = label.trim();
    if (!text) return;
    setPermissions((p) =>
      p.some((x) => x.label.toLowerCase() === text.toLowerCase()) ? p : [...p, { label: text, granted: true, sensitivity }]
    );
  }
  const togglePermission = (i: number) =>
    setPermissions((p) => p.map((x, idx) => (idx === i ? { ...x, granted: !x.granted } : x)));
  const setPermissionRisk = (i: number, sensitivity: RiskLevel) =>
    setPermissions((p) => p.map((x, idx) => (idx === i ? { ...x, sensitivity } : x)));
  const removePermission = (i: number) => setPermissions((p) => p.filter((_, idx) => idx !== i));

  const industryDisplay =
    industry === CUSTOM ? customIndustry.trim() : INDUSTRIES.find((i) => i.id === industry)?.name ?? "";
  const roleDisplay = isCustomRole ? customRole.trim() : template?.role.replace("-", " ") ?? "";

  function handleDeploy() {
    if (!industry || !templateId) return;
    if (!isCustomRole && !template) return;
    startTransition(async () => {
      const id = await createEmployee({
        name,
        role: isCustomRole ? CUSTOM : template!.role,
        industry,
        customIndustry: industry === CUSTOM ? customIndustry : undefined,
        customRole: isCustomRole ? customRole : undefined,
        jobDescription,
        templateId,
        knowledgeNote,
        requiresApprovalOver,
        tools: Object.entries(tools).filter(([, on]) => on).map(([k]) => k),
        permissions,
        workflowSteps: steps,
      });
      router.push(`/employees/${id}`);
    });
  }

  const inputCls = "w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:border-graphite";

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Create AI employee"
        title="Deploy a new AI employee"
        description="Start from a template or build your own: industry, role, the work it does, tools, permissions and security."
      />

      {/* Stepper */}
      <div className="flex items-center mb-8 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center shrink-0">
            <div
              className={clsx(
                "flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full",
                i === step ? "text-graphite" : i < step ? "text-allow" : "text-ink-soft"
              )}
            >
              <span
                className={clsx(
                  "flex items-center justify-center h-5 w-5 rounded-full text-[11px] font-mono",
                  i === step ? "bg-graphite text-white" : i < step ? "bg-allow text-white" : "bg-line-soft text-ink-soft"
                )}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              {label}
            </div>
            {i < STEPS.length - 1 && <div className="w-4 md:w-8 h-px bg-line mx-1" />}
          </div>
        ))}
      </div>

      <Panel className="p-6 min-h-[360px]">
        {/* 0 — Industry */}
        {step === 0 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Which industry is this for?</h2>
            <p className="text-sm text-ink-soft mb-5">
              Pick one of ours, or define your own if your business is not on the list.
            </p>
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
              <button
                onClick={() => setIndustry(CUSTOM)}
                className={clsx(
                  "text-left rounded-md border border-dashed p-3 transition-colors sm:col-span-2",
                  industry === CUSTOM ? "border-graphite bg-mist" : "border-line hover:border-graphite/50"
                )}
              >
                <p className="text-sm font-medium text-ink flex items-center gap-1.5">
                  <Sparkles size={14} /> Something else: define your own industry
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  For any business we have not listed. You decide what the work looks like.
                </p>
              </button>
            </div>
            {industry === CUSTOM && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-ink-soft mb-1.5">What industry or type of business is it?</label>
                <input
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  maxLength={60}
                  placeholder="e.g. Pet grooming, Law firm, Solar installation"
                  className={inputCls}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* 1 — Role */}
        {step === 1 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Choose a role</h2>
            <p className="text-sm text-ink-soft mb-5">
              Start from a template and adjust it, or build a role of your own from scratch.
            </p>
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
              <button
                onClick={() => selectTemplate(CUSTOM)}
                className={clsx(
                  "text-left rounded-md border border-dashed p-3 flex gap-3 transition-colors sm:col-span-2",
                  isCustomRole ? "border-graphite bg-mist" : "border-line hover:border-graphite/50"
                )}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-mist text-graphite shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Build your own role</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    Define exactly what this AI employee does, with your own title, work, tools and permissions.
                  </p>
                </div>
              </button>
            </div>
            {industry && industry !== CUSTOM && (
              <button
                onClick={() => setShowAllRoles((v) => !v)}
                className="text-xs font-medium text-graphite mt-3"
              >
                {showAllRoles ? "Show only roles suggested for this industry" : "Show all role templates"}
              </button>
            )}
            {isCustomRole && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-ink-soft mb-1.5">Role title</label>
                <input
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  maxLength={60}
                  placeholder="e.g. Inventory Planner"
                  className={inputCls}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* 2 — Work */}
        {step === 2 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">What work should it get done?</h2>
            <p className="text-sm text-ink-soft mb-5">
              {isCustomRole
                ? "Describe the job in plain words, then list the steps it should follow."
                : "This is pre-filled from the template. Change anything so it fits your business."}
            </p>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">Job description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe in plain words what this AI employee should do, for whom, and what a good result looks like."
              className={clsx(inputCls, "mb-5")}
            />

            <p className="text-xs font-medium text-ink-soft mb-1.5">Steps it follows, in order</p>
            <div className="flex flex-col gap-2.5">
              {steps.map((st, i) => (
                <div key={i} className="flex gap-2 rounded-md border border-line p-3">
                  <div className="flex flex-col items-center justify-center gap-1 pt-1">
                    <span className="text-xs font-mono text-ink-soft">{i + 1}</span>
                    <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} aria-label="Move step up" className="text-ink-soft disabled:opacity-20">
                      <ArrowUp size={12} />
                    </button>
                    <button type="button" onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} aria-label="Move step down" className="text-ink-soft disabled:opacity-20">
                      <ArrowDown size={12} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <input
                      value={st.title}
                      onChange={(e) => updateStep(i, "title", e.target.value)}
                      maxLength={80}
                      placeholder="Step title"
                      className="w-full rounded border border-line px-2 py-1 text-sm font-medium focus:outline-none focus:border-graphite"
                    />
                    <input
                      value={st.detail}
                      onChange={(e) => updateStep(i, "detail", e.target.value)}
                      maxLength={240}
                      placeholder="What happens in this step"
                      className="w-full rounded border border-line px-2 py-1 text-xs text-ink-soft focus:outline-none focus:border-graphite"
                    />
                  </div>
                  <button type="button" onClick={() => removeStep(i)} aria-label="Remove step" className="text-ink-soft hover:text-block self-start mt-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="mt-3 w-full rounded-md border border-dashed border-line py-2.5 text-xs font-medium text-ink-soft hover:border-graphite hover:text-ink flex items-center justify-center gap-1.5"
            >
              <Plus size={13} /> Add step
            </button>
          </div>
        )}

        {/* 3 — Knowledge */}
        {step === 3 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Name it and add business knowledge</h2>
            <p className="text-sm text-ink-soft mb-5">
              Give this employee an identity and the context it needs to work in your business.
            </p>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">Employee name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="e.g. Aria"
              className={clsx(inputCls, "mb-4")}
            />
            <label className="block text-xs font-medium text-ink-soft mb-1.5">Business knowledge (optional)</label>
            <textarea
              value={knowledgeNote}
              onChange={(e) => setKnowledgeNote(e.target.value)}
              rows={5}
              placeholder="Paste a script, policy, price list, or anything this employee should know before it starts working."
              className={inputCls}
            />
          </div>
        )}

        {/* 4 — Tools */}
        {step === 4 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Connect tools</h2>
            <p className="text-sm text-ink-soft mb-5">
              This employee can only take actions through tools you connect. Everything else is denied by default.
            </p>
            <div className="flex flex-col gap-2">
              {INTEGRATIONS.map((integ) => (
                <div key={integ.id} className="flex items-center justify-between gap-3 rounded-md border border-line p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{integ.name}</p>
                    <p className="text-xs text-ink-soft">{integ.description}</p>
                  </div>
                  <OnOff
                    on={!!tools[integ.id]}
                    onLabel="Connected"
                    offLabel="Off"
                    onClick={() => setTools((t) => ({ ...t, [integ.id]: !t[integ.id] }))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5 — Permissions */}
        {step === 5 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Set permissions</h2>
            <p className="text-sm text-ink-soft mb-5">
              Decide what this employee is allowed to do and how sensitive each ability is. Edit, remove or add your own.
            </p>

            {permissions.length === 0 ? (
              <p className="text-sm text-ink-soft rounded-md border border-dashed border-line p-4 mb-4">
                No permissions yet. Add some below. An employee with none can not do anything sensitive.
              </p>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                {permissions.map((p, i) => (
                  <div key={p.label} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line p-3">
                    <p className="text-sm text-ink min-w-0 flex-1">{p.label}</p>
                    <div className="flex items-center gap-2">
                      <select
                        value={p.sensitivity}
                        onChange={(e) => setPermissionRisk(i, e.target.value as RiskLevel)}
                        aria-label={`Sensitivity of ${p.label}`}
                        className="rounded-md border border-line px-2 py-1 text-xs"
                      >
                        {RISK_LEVELS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <OnOff on={p.granted} onLabel="Granted" offLabel="Denied" onClick={() => togglePermission(i)} />
                      <button type="button" onClick={() => removePermission(i)} aria-label={`Remove ${p.label}`} className="text-ink-soft hover:text-block">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {PERMISSION_LIBRARY.some((lib) => !permissions.some((p) => p.label.toLowerCase() === lib.label.toLowerCase())) && (
              <div className="mb-4">
                <p className="text-xs font-medium text-ink-soft mb-2">Quick add</p>
                <div className="flex flex-wrap gap-1.5">
                  {PERMISSION_LIBRARY.filter(
                    (lib) => !permissions.some((p) => p.label.toLowerCase() === lib.label.toLowerCase())
                  ).map((lib) => (
                    <button
                      key={lib.label}
                      type="button"
                      onClick={() => addPermission(lib.label, lib.sensitivity)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft hover:border-graphite hover:text-ink"
                    >
                      <Plus size={11} /> {lib.label}
                      <RiskBadge level={lib.sensitivity} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs font-medium text-ink-soft mb-1.5">Add your own</p>
            <div className="flex flex-wrap gap-2">
              <input
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
                maxLength={80}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPermission(newPermission, newPermissionRisk);
                    setNewPermission("");
                  }
                }}
                placeholder="e.g. Approve leave requests"
                className="flex-1 min-w-[10rem] rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:border-graphite"
              />
              <select
                value={newPermissionRisk}
                onChange={(e) => setNewPermissionRisk(e.target.value as RiskLevel)}
                aria-label="Sensitivity of the new permission"
                className="rounded-md border border-line px-2 py-2 text-sm"
              >
                {RISK_LEVELS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Button
                variant="secondary"
                disabled={!newPermission.trim()}
                onClick={() => {
                  addPermission(newPermission, newPermissionRisk);
                  setNewPermission("");
                }}
              >
                <Plus size={14} /> Add
              </Button>
            </div>
          </div>
        )}

        {/* 6 — Security threshold */}
        {step === 6 && (
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

        {/* 7 — Review */}
        {step === 7 && (
          <div>
            <h2 className="font-display font-semibold text-ink mb-1">Review and deploy</h2>
            <p className="text-sm text-ink-soft mb-5">Confirm the details below. You can change all of this later, at any time.</p>
            <div className="flex items-center gap-3 mb-5">
              <Avatar seed={name || roleDisplay} name={name || roleDisplay || "AI"} size={44} />
              <div>
                <p className="font-medium text-ink">{name}</p>
                <p className="text-xs text-ink-soft capitalize">
                  {roleDisplay} · {industryDisplay}
                </p>
              </div>
            </div>
            {jobDescription.trim() && (
              <p className="text-sm text-ink-soft rounded-md bg-mist p-3 mb-5 line-clamp-4">{jobDescription}</p>
            )}
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs text-ink-soft mb-1">Steps in its workflow</dt>
                <dd className="text-ink">{steps.filter((s) => s.title.trim()).length}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft mb-1">Tools connected</dt>
                <dd className="text-ink">
                  {Object.entries(tools).filter(([, v]) => v).map(([k]) => TOOL_LABEL[k] ?? k).join(", ") || "None"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft mb-1">Permissions granted</dt>
                <dd className="text-ink">{permissions.filter((p) => p.granted).length} of {permissions.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft mb-1">Approval threshold</dt>
                <dd className="text-ink capitalize">{requiresApprovalOver} and above</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft mb-1">Business knowledge</dt>
                <dd className="text-ink">{knowledgeNote.trim() ? "1 note added" : "None yet"}</dd>
              </div>
            </dl>
          </div>
        )}
      </Panel>

      <div className="flex items-center justify-between gap-3 mt-5">
        <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
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
      {!canProceed && STEP_HINTS[step] && (
        <p className="text-xs text-ink-soft text-right mt-2">{STEP_HINTS[step]}</p>
      )}
    </div>
  );
}
