import {
  AIEmployee,
  ActionCategory,
  PolicyRule,
  RiskLevel,
  Verdict,
} from "./types";

const RISK_ORDER: Record<RiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

export function riskAtLeast(a: RiskLevel, b: RiskLevel) {
  return RISK_ORDER[a] >= RISK_ORDER[b];
}

export function riskFromScore(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export interface EvaluationInput {
  employee: AIEmployee;
  action: string;
  category: ActionCategory;
  tool: string;
  dataSensitivity: RiskLevel;
  policies: PolicyRule[];
}

export interface EvaluationResult {
  verdict: Verdict;
  riskScore: number;
  riskLevel: RiskLevel;
  reason: string;
  matchedPolicy?: string;
  flagAsSuspicious: boolean;
}

/**
 * Central Security Control Engine.
 *
 * Every AI employee action is scored for risk and checked against:
 *  1. Whether the employee even holds the tool/permission it is trying to use.
 *  2. The most specific matching policy rule for the business.
 *  3. The employee's own approval threshold.
 *
 * Returns ALLOW, BLOCK, or REQUIRE_APPROVAL — never executes anything itself.
 */
export function evaluateAction(input: EvaluationInput): EvaluationResult {
  const { employee, category, tool, dataSensitivity, policies } = input;

  // 1. Identity & access check — does this employee even have the tool connected?
  const toolConn = employee.tools.find((t) => t.toolId === tool);
  if (!toolConn || !toolConn.connected) {
    return {
      verdict: "BLOCK",
      riskScore: 100,
      riskLevel: "critical",
      reason: `${employee.name} does not have an active connection to "${tool}". Action denied at the identity layer before execution.`,
      flagAsSuspicious: true,
    };
  }

  // 2. Base risk score from data sensitivity + category weight.
  const sensitivityScore = { low: 10, medium: 35, high: 65, critical: 90 }[dataSensitivity];
  const categoryWeight: Record<ActionCategory, number> = {
    communication: 0,
    scheduling: 0,
    record_update: 5,
    data_access: 10,
    external_tool: 10,
    financial: 20,
  };
  const riskScore = Math.min(100, sensitivityScore + categoryWeight[category]);

  // 3. Find most specific matching policy: role+industry > role > industry > all.
  const candidates = policies.filter(
    (p) =>
      p.enabled &&
      (p.appliesToRole === "all" || p.appliesToRole === employee.role) &&
      (p.appliesToIndustry === "all" || p.appliesToIndustry === employee.industry) &&
      (p.category === "all" || p.category === category)
  );
  const specificityScore = (p: PolicyRule) =>
    (p.appliesToRole !== "all" ? 2 : 0) +
    (p.appliesToIndustry !== "all" ? 2 : 0) +
    (p.category !== "all" ? 1 : 0);
  candidates.sort((a, b) => specificityScore(b) - specificityScore(a));
  const policy = candidates[0];

  const riskLevel = riskFromScore(riskScore);

  // 4. Policy-driven outright block.
  if (policy && riskAtLeast(riskLevel, policy.blockAbove)) {
    return {
      verdict: "BLOCK",
      riskScore,
      riskLevel,
      reason: `Blocked by policy "${policy.name}": ${category.replace("_", " ")} actions at ${riskLevel} risk exceed the allowed threshold for this role/industry.`,
      matchedPolicy: policy.name,
      flagAsSuspicious: riskLevel === "critical",
    };
  }

  // 5. Policy or employee threshold requiring human approval.
  const employeeRequiresApproval = riskAtLeast(riskLevel, employee.requiresApprovalOver);
  const policyRequiresApproval = policy ? !riskAtLeast(policy.maxAutoApproveRisk, riskLevel) : riskLevel !== "low";

  if (employeeRequiresApproval || policyRequiresApproval) {
    return {
      verdict: "REQUIRE_APPROVAL",
      riskScore,
      riskLevel,
      reason: policy
        ? `Policy "${policy.name}" requires human sign-off for ${riskLevel} risk ${category.replace("_", " ")} actions.`
        : `${employee.name}'s configured approval threshold (${employee.requiresApprovalOver}+) was reached.`,
      matchedPolicy: policy?.name,
      flagAsSuspicious: false,
    };
  }

  // 6. Otherwise, allow.
  return {
    verdict: "ALLOW",
    riskScore,
    riskLevel,
    reason: policy
      ? `Within policy "${policy.name}" auto-approve threshold for ${employee.role} in ${employee.industry}.`
      : `Low enough risk (${riskLevel}) with no matching restrictive policy — executed automatically.`,
    matchedPolicy: policy?.name,
    flagAsSuspicious: false,
  };
}

export const CATEGORY_LABEL: Record<ActionCategory, string> = {
  communication: "Communication",
  data_access: "Data access",
  financial: "Financial",
  scheduling: "Scheduling",
  record_update: "Record update",
  external_tool: "External tool call",
};
