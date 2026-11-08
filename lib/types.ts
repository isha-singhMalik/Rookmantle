// Core domain types for Rookmantle

export type Verdict = "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type IndustryId =
  | "real-estate"
  | "recruitment"
  | "healthcare"
  | "manufacturing"
  | "accounting"
  | "logistics"
  | "retail"
  | "education"
  | "finance"
  | "ecommerce"
  | "customer-support";

/** An industry from our list, or "custom" for one the business defines itself. */
export type IndustryKey = IndustryId | "custom";

export interface Industry {
  id: IndustryId;
  name: string;
  description: string;
  sampleWorkflows: string[];
}

export type EmployeeRole =
  | "sales"
  | "support"
  | "recruiter"
  | "operations"
  | "accounting"
  | "marketing"
  | "follow-up"
  | "research";

/** A role from our templates, or "custom" for one the business defines itself. */
export type RoleKey = EmployeeRole | "custom";

export interface RoleTemplate {
  id: string;
  role: EmployeeRole;
  name: string;
  description: string;
  defaultTools: string[];
  defaultPermissions: string[];
  suggestedIndustries: IndustryId[];
  avatarSeed: string;
  defaultSteps: { title: string; detail: string }[];
}

export type EmployeeStatus = "active" | "paused" | "draft";

export interface KnowledgeItem {
  id: string;
  title: string;
  type: "document" | "note" | "faq" | "policy";
  content: string;
  addedAt: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  detail: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export interface ToolConnection {
  toolId: string;
  connected: boolean;
  scopes: string[];
}

export interface Permission {
  id: string;
  label: string;
  granted: boolean;
  sensitivity: RiskLevel;
}

export interface AIEmployee {
  id: string;
  name: string;
  role: RoleKey;
  industry: IndustryKey;
  /** Only set when industry is "custom": the business's own industry name. */
  customIndustry?: string;
  /** Only set when role is "custom": the business's own role title. */
  customRole?: string;
  /** Plain-language description of the work this employee should get done. */
  jobDescription?: string;
  status: EmployeeStatus;
  avatarSeed: string;
  createdAt: string;
  knowledge: KnowledgeItem[];
  workflow: Workflow;
  tools: ToolConnection[];
  permissions: Permission[];
  requiresApprovalOver: RiskLevel; // actions at/above this risk require approval
  stats: {
    tasksCompleted: number;
    actionsBlocked: number;
    lastActiveAt: string;
  };
}

export type ActionCategory =
  | "communication"
  | "data_access"
  | "financial"
  | "scheduling"
  | "record_update"
  | "external_tool";

export interface ActionLogEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  industry: IndustryKey;
  action: string;
  category: ActionCategory;
  tool: string;
  dataSensitivity: RiskLevel;
  riskScore: number; // 0-100
  verdict: Verdict;
  reason: string;
  timestamp: string;
  approvedBy?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
}

export interface SecurityAlert {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  detail: string;
  severity: RiskLevel;
  timestamp: string;
  relatedLogId?: string;
  acknowledged: boolean;
}

export interface PolicyRule {
  id: string;
  name: string;
  appliesToRole: RoleKey | "all";
  appliesToIndustry: IndustryKey | "all";
  category: ActionCategory | "all";
  maxAutoApproveRisk: RiskLevel; // risk at/below this auto-allows
  blockAbove: RiskLevel; // risk at/above this blocks outright
  description: string;
  enabled: boolean;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  connected: boolean;
}

export interface Business {
  id: string;
  name: string;
  industries: IndustryId[];
}
