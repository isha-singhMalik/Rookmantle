"use server";

import { revalidatePath } from "next/cache";
import { db, nextId } from "./store";
import { evaluateAction } from "./security-engine";
import {
  ActionCategory,
  AIEmployee,
  EmployeeRole,
  IndustryId,
  PolicyRule,
  RiskLevel,
} from "./types";
import { ROLE_TEMPLATES } from "./reference-data";

export async function createEmployee(input: {
  name: string;
  role: EmployeeRole;
  industry: IndustryId;
  templateId: string;
  knowledgeNote?: string;
  requiresApprovalOver: RiskLevel;
}) {
  const template = ROLE_TEMPLATES.find((t) => t.id === input.templateId);
  const now = new Date().toISOString();

  const employee: AIEmployee = {
    id: nextId("emp"),
    name: input.name || `${template?.name ?? "AI Employee"}`,
    role: input.role,
    industry: input.industry,
    status: "active",
    avatarSeed: input.name || template?.avatarSeed || "agent",
    createdAt: now,
    knowledge: input.knowledgeNote
      ? [
          {
            id: nextId("kb"),
            title: "Initial business knowledge",
            type: "note",
            content: input.knowledgeNote,
            addedAt: now,
          },
        ]
      : [],
    workflow: {
      id: nextId("wf"),
      name: `${template?.name ?? "New employee"} default workflow`,
      steps: (template?.defaultTools ?? []).length
        ? [
            { id: nextId("s"), title: "Receive task", detail: "Intake the incoming request or trigger." },
            { id: nextId("s"), title: "Take action", detail: "Perform the core task using connected tools." },
            { id: nextId("s"), title: "Report outcome", detail: "Log the result and notify relevant humans." },
          ]
        : [],
    },
    tools: (template?.defaultTools ?? []).map((toolId) => ({
      toolId,
      connected: true,
      scopes: ["read", "write"],
    })),
    permissions: (template?.defaultPermissions ?? []).map((p, i) => ({
      id: `p${i + 1}`,
      label: p.replace(/_/g, " "),
      granted: true,
      sensitivity: "medium" as RiskLevel,
    })),
    requiresApprovalOver: input.requiresApprovalOver,
    stats: { tasksCompleted: 0, actionsBlocked: 0, lastActiveAt: now },
  };

  db.employees.unshift(employee);
  revalidatePath("/dashboard");
  revalidatePath("/employees");
  return employee.id;
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
