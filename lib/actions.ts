"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, nextId } from "./store";
import { evaluateAction } from "./security-engine";
import {
  ActionCategory,
  AIEmployee,
  IndustryKey,
  PolicyRule,
  RiskLevel,
  RoleKey,
} from "./types";
import { INTEGRATIONS, ROLE_TEMPLATES } from "./reference-data";

const clean = (v: string | undefined, max: number) => (v ?? "").trim().slice(0, max);

export async function createEmployee(input: {
  name: string;
  role: RoleKey;
  industry: IndustryKey;
  customIndustry?: string;
  customRole?: string;
  jobDescription?: string;
  templateId: string;
  knowledgeNote?: string;
  requiresApprovalOver: RiskLevel;
  tools: string[];
  permissions: { label: string; granted: boolean; sensitivity: RiskLevel }[];
  workflowSteps: { title: string; detail: string }[];
}) {
  const template = ROLE_TEMPLATES.find((t) => t.id === input.templateId);
  const now = new Date().toISOString();

  const isCustomIndustry = input.industry === "custom";
  const isCustomRole = input.role === "custom";
  const customIndustry = clean(input.customIndustry, 60);
  const customRole = clean(input.customRole, 60);
  const roleName = isCustomRole ? customRole || "Custom role" : template?.name ?? "AI Employee";

  // Only accept tools that really exist; ignore anything else.
  const knownTools = new Set(INTEGRATIONS.map((i) => i.id));
  const tools = Array.from(new Set(input.tools)).filter((id) => knownTools.has(id)).slice(0, 30);

  const permissions = input.permissions
    .map((p) => ({ label: clean(p.label, 80), granted: !!p.granted, sensitivity: p.sensitivity }))
    .filter((p) => p.label)
    .slice(0, 40)
    .map((p, i) => ({ id: `p${i + 1}`, ...p }));

  const steps = input.workflowSteps
    .map((st) => ({ title: clean(st.title, 80), detail: clean(st.detail, 240) }))
    .filter((st) => st.title)
    .slice(0, 20);

  const name = clean(input.name, 60) || roleName;

  const employee: AIEmployee = {
    id: nextId("emp"),
    name,
    role: input.role,
    industry: input.industry,
    customIndustry: isCustomIndustry ? customIndustry || "Custom industry" : undefined,
    customRole: isCustomRole ? customRole || "Custom role" : undefined,
    jobDescription: clean(input.jobDescription, 1000) || undefined,
    status: "active",
    avatarSeed: name || template?.avatarSeed || "agent",
    createdAt: now,
    knowledge: clean(input.knowledgeNote, 5000)
      ? [
          {
            id: nextId("kb"),
            title: "Initial business knowledge",
            type: "note",
            content: clean(input.knowledgeNote, 5000),
            addedAt: now,
          },
        ]
      : [],
    workflow: {
      id: nextId("wf"),
      name: `${roleName} workflow`,
      steps: steps.map((st) => ({ id: nextId("s"), ...st })),
    },
    tools: tools.map((toolId) => ({ toolId, connected: true, scopes: ["read", "write"] })),
    permissions,
    requiresApprovalOver: input.requiresApprovalOver,
    stats: { tasksCompleted: 0, actionsBlocked: 0, lastActiveAt: now },
  };

  db.employees.unshift(employee);
  revalidatePath("/dashboard");
  revalidatePath("/employees");
  revalidatePath("/workflows");
  revalidatePath("/analytics");
  return employee.id;
}

/**
 * Permanently removes an AI employee and everything configured on it
 * (knowledge, workflow, tool connections, permissions).
 *
 * The audit trail (action logs and security alerts) is deliberately KEPT so the
 * history of what the employee did stays intact. Approvals still pending for this
 * employee are rejected automatically so nothing is left waiting on a person who no
 * longer exists.
 */
export async function deleteEmployee(employeeId: string) {
  const index = db.employees.findIndex((e) => e.id === employeeId);
  if (index === -1) redirect("/employees");

  for (const log of db.logs) {
    if (log.employeeId === employeeId && log.approvalStatus === "pending") {
      log.approvalStatus = "rejected";
      log.approvedBy = "System (employee deleted)";
    }
  }
  db.employees.splice(index, 1);

  revalidatePath("/employees");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/knowledge-base");
  revalidatePath("/workflows");
  revalidatePath("/security/logs");
  revalidatePath("/security/alerts");
  revalidatePath("/security/approvals");
  redirect("/employees");
}

export async function updateEmployeeStatus(employeeId: string, status: AIEmployee["status"]) {
  const emp = db.employees.find((e) => e.id === employeeId);
  if (emp) emp.status = status;
  revalidatePath(`/employees/${employeeId}`);
  revalidatePath("/dashboard");
}

export async function toggleEmployeeTool(employeeId: string, toolId: string) {
  const emp = db.employees.find((e) => e.id === employeeId);
  if (!emp) return;
  const existing = emp.tools.find((t) => t.toolId === toolId);
  if (existing) {
    existing.connected = !existing.connected;
  } else {
    emp.tools.push({ toolId, connected: true, scopes: ["read"] });
  }
  revalidatePath(`/employees/${employeeId}`);
}

export async function togglePermission(employeeId: string, permissionId: string) {
  const emp = db.employees.find((e) => e.id === employeeId);
  const perm = emp?.permissions.find((p) => p.id === permissionId);
  if (perm) perm.granted = !perm.granted;
  revalidatePath(`/employees/${employeeId}`);
}

export async function addKnowledgeItem(employeeId: string, title: string, content: string) {
  const emp = db.employees.find((e) => e.id === employeeId);
  if (!emp) return;
  emp.knowledge.unshift({
    id: nextId("kb"),
    title: title || "Untitled note",
    type: "note",
    content,
    addedAt: new Date().toISOString(),
  });
  revalidatePath(`/employees/${employeeId}`);
  revalidatePath("/knowledge-base");
}

export async function updateWorkflowSteps(
  employeeId: string,
  steps: { title: string; detail: string }[]
) {
  const emp = db.employees.find((e) => e.id === employeeId);
  if (!emp) return;
  emp.workflow.steps = steps.map((s) => ({ id: nextId("s"), title: s.title, detail: s.detail }));
  revalidatePath(`/employees/${employeeId}`);
  revalidatePath("/workflows");
}

export async function updateApprovalThreshold(employeeId: string, level: RiskLevel) {
  const emp = db.employees.find((e) => e.id === employeeId);
  if (emp) emp.requiresApprovalOver = level;
  revalidatePath(`/employees/${employeeId}`);
}

export async function toggleIntegration(integrationId: string) {
  const integ = db.integrations.find((i) => i.id === integrationId);
  if (integ) integ.connected = !integ.connected;
  revalidatePath("/integrations");
}

export async function addPolicy(policy: {
  name: string;
  appliesToRole: string;
  appliesToIndustry: string;
  category: string;
  maxAutoApproveRisk: RiskLevel;
  blockAbove: RiskLevel;
  description: string;
}) {
  db.policies.unshift({
    id: nextId("pol"),
    name: policy.name,
    appliesToRole: policy.appliesToRole as PolicyRule["appliesToRole"],
    appliesToIndustry: policy.appliesToIndustry as PolicyRule["appliesToIndustry"],
    category: policy.category as PolicyRule["category"],
    maxAutoApproveRisk: policy.maxAutoApproveRisk,
    blockAbove: policy.blockAbove,
    description: policy.description,
    enabled: true,
  });
  revalidatePath("/security/policies");
}

export async function togglePolicy(policyId: string) {
  const p = db.policies.find((x) => x.id === policyId);
  if (p) p.enabled = !p.enabled;
  revalidatePath("/security/policies");
}

export async function acknowledgeAlert(alertId: string) {
  const alert = db.alerts.find((a) => a.id === alertId);
  if (alert) alert.acknowledged = true;
  revalidatePath("/security/alerts");
}

export async function decideApproval(logId: string, decision: "approved" | "rejected", approver = "Admin") {
  const log = db.logs.find((l) => l.id === logId);
  if (!log) return;
  log.approvalStatus = decision;
  log.approvedBy = approver;
  if (decision === "approved") {
    const emp = db.employees.find((e) => e.id === log.employeeId);
    if (emp) emp.stats.tasksCompleted += 1;
  } else {
    const emp = db.employees.find((e) => e.id === log.employeeId);
    if (emp) emp.stats.actionsBlocked += 1;
  }
  revalidatePath("/security/approvals");
  revalidatePath("/security/logs");
  revalidatePath("/dashboard");
}

export async function simulateAction(input: {
  employeeId: string;
  action: string;
  category: ActionCategory;
  tool: string;
  dataSensitivity: RiskLevel;
}) {
  const employee = db.employees.find((e) => e.id === input.employeeId);
  if (!employee) throw new Error("Employee not found");

  const result = evaluateAction({
    employee,
    action: input.action,
    category: input.category,
    tool: input.tool,
    dataSensitivity: input.dataSensitivity,
    policies: db.policies,
  });

  const log = {
    id: nextId("log"),
    employeeId: employee.id,
    employeeName: employee.name,
    industry: employee.industry,
    action: input.action,
    category: input.category,
    tool: input.tool,
    dataSensitivity: input.dataSensitivity,
    riskScore: result.riskScore,
    verdict: result.verdict,
    reason: result.reason,
    timestamp: new Date().toISOString(),
    approvalStatus: result.verdict === "REQUIRE_APPROVAL" ? ("pending" as const) : undefined,
  };
  db.logs.unshift(log);

  if (result.verdict === "ALLOW") {
    employee.stats.tasksCompleted += 1;
    employee.stats.lastActiveAt = log.timestamp;
  }
  if (result.verdict === "BLOCK") {
    employee.stats.actionsBlocked += 1;
  }

  if (result.flagAsSuspicious || result.verdict === "BLOCK") {
    db.alerts.unshift({
      id: nextId("alert"),
      employeeId: employee.id,
      employeeName: employee.name,
      title: result.verdict === "BLOCK" ? "Action blocked by security engine" : "Suspicious activity flagged",
      detail: result.reason,
      severity: result.riskLevel,
      timestamp: log.timestamp,
      relatedLogId: log.id,
      acknowledged: false,
    });
  }

  revalidatePath("/security/logs");
  revalidatePath("/security/alerts");
  revalidatePath("/security/approvals");
  revalidatePath("/dashboard");
  revalidatePath(`/employees/${employee.id}`);

  return { ...result, logId: log.id };
}
