import {
  AIEmployee,
  ActionLogEntry,
  Business,
  Integration,
  PolicyRule,
  SecurityAlert,
} from "./types";
import { INTEGRATIONS, ROLE_TEMPLATES } from "./reference-data";

interface StoreShape {
  business: Business;
  employees: AIEmployee[];
  policies: PolicyRule[];
  logs: ActionLogEntry[];
  alerts: SecurityAlert[];
  integrations: Integration[];
}

function daysAgo(n: number, hourOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() - hourOffset);
  return d.toISOString();
}

function seed(): StoreShape {
  const employees: AIEmployee[] = [
    {
      id: "emp-1",
      name: "Aria",
      role: "sales",
      industry: "real-estate",
      status: "active",
      avatarSeed: "aria",
      createdAt: daysAgo(40),
      knowledge: [
        {
          id: "kb-1",
          title: "Listing catalogue Q3",
          type: "document",
          content: "Current available listings, price bands, and neighborhood notes for Q3.",
          addedAt: daysAgo(38),
        },
        {
          id: "kb-2",
          title: "Qualification script",
          type: "note",
          content: "Ask budget, timeline, financing status, and preferred neighborhoods before booking a visit.",
          addedAt: daysAgo(35),
        },
      ],
      workflow: {
        id: "wf-1",
        name: "Lead to site visit",
        steps: [
          { id: "s1", title: "Qualify inbound lead", detail: "Collect budget, timeline, and location preference." },
          { id: "s2", title: "Match listings", detail: "Shortlist 2–4 listings that fit stated criteria." },
          { id: "s3", title: "Book site visit", detail: "Offer available slots and confirm on the calendar." },
        ],
      },
      tools: [
        { toolId: "crm", connected: true, scopes: ["read", "write"] },
        { toolId: "email", connected: true, scopes: ["send"] },
        { toolId: "calendar", connected: true, scopes: ["book"] },
      ],
      permissions: [
        { id: "p1", label: "Read lead records", granted: true, sensitivity: "low" },
        { id: "p2", label: "Update lead status", granted: true, sensitivity: "medium" },
        { id: "p3", label: "Send email to leads", granted: true, sensitivity: "medium" },
        { id: "p4", label: "Book calendar meetings", granted: true, sensitivity: "low" },
        { id: "p5", label: "Apply pricing discounts", granted: false, sensitivity: "high" },
      ],
      requiresApprovalOver: "high",
      stats: { tasksCompleted: 214, actionsBlocked: 3, lastActiveAt: daysAgo(0, 2) },
    },
    {
      id: "emp-2",
      name: "Baxter",
      role: "support",
      industry: "customer-support",
      status: "active",
      avatarSeed: "baxter",
      createdAt: daysAgo(60),
      knowledge: [
        {
          id: "kb-3",
          title: "Refund policy",
          type: "policy",
          content: "Refunds under $50 can be issued directly. Above that, escalate to a human agent.",
          addedAt: daysAgo(59),
        },
      ],
      workflow: {
        id: "wf-2",
        name: "Ticket triage",
        steps: [
          { id: "s1", title: "Triage ticket", detail: "Classify urgency and topic." },
          { id: "s2", title: "Draft resolution", detail: "Propose a fix using the knowledge base." },
          { id: "s3", title: "Escalate if unresolved", detail: "Route to a human agent when confidence is low." },
        ],
      },
      tools: [
        { toolId: "helpdesk", connected: true, scopes: ["read", "write"] },
        { toolId: "email", connected: true, scopes: ["send"] },
        { toolId: "knowledge_base", connected: true, scopes: ["read"] },
      ],
      permissions: [
        { id: "p1", label: "Read support tickets", granted: true, sensitivity: "low" },
        { id: "p2", label: "Reply to tickets", granted: true, sensitivity: "medium" },
        { id: "p3", label: "Issue refunds under $50", granted: true, sensitivity: "high" },
        { id: "p4", label: "Access billing records", granted: false, sensitivity: "critical" },
      ],
      requiresApprovalOver: "high",
      stats: { tasksCompleted: 891, actionsBlocked: 12, lastActiveAt: daysAgo(0, 0) },
    },
    {
      id: "emp-3",
      name: "Priya",
      role: "recruiter",
      industry: "recruitment",
      status: "active",
      avatarSeed: "priya",
      createdAt: daysAgo(20),
      knowledge: [
        {
          id: "kb-4",
          title: "Open roles brief",
          type: "document",
          content: "Requirements and screening criteria for currently open roles.",
          addedAt: daysAgo(19),
        },
      ],
      workflow: {
        id: "wf-3",
        name: "Candidate screening",
        steps: [
          { id: "s1", title: "Screen resume", detail: "Match resume against role requirements." },
          { id: "s2", title: "Schedule interview", detail: "Offer interviewer availability." },
          { id: "s3", title: "Send status update", detail: "Notify candidate of next steps." },
        ],
      },
      tools: [
        { toolId: "ats", connected: false, scopes: [] },
        { toolId: "email", connected: true, scopes: ["send"] },
        { toolId: "calendar", connected: true, scopes: ["book"] },
      ],
      permissions: [
        { id: "p1", label: "Read candidate profiles", granted: true, sensitivity: "medium" },
        { id: "p2", label: "Update candidate stage", granted: true, sensitivity: "medium" },
        { id: "p3", label: "Schedule interviews", granted: true, sensitivity: "low" },
      ],
      requiresApprovalOver: "high",
      stats: { tasksCompleted: 76, actionsBlocked: 5, lastActiveAt: daysAgo(1, 4) },
    },
    {
      id: "emp-4",
      name: "Rohan",
      role: "accounting",
      industry: "accounting",
      status: "paused",
      avatarSeed: "rohan",
      createdAt: daysAgo(90),
      knowledge: [],
      workflow: {
        id: "wf-4",
        name: "Client document collection",
        steps: [
          { id: "s1", title: "Request documents", detail: "Send a checklist of pending documents." },
          { id: "s2", title: "Send filing reminder", detail: "Remind clients ahead of deadlines." },
        ],
      },
      tools: [
        { toolId: "accounting_software", connected: false, scopes: [] },
        { toolId: "email", connected: true, scopes: ["send"] },
        { toolId: "drive", connected: true, scopes: ["read", "write"] },
      ],
      permissions: [
        { id: "p1", label: "Read invoices", granted: true, sensitivity: "high" },
        { id: "p2", label: "Request client documents", granted: true, sensitivity: "medium" },
        { id: "p3", label: "Initiate payments", granted: false, sensitivity: "critical" },
      ],
      requiresApprovalOver: "medium",
      stats: { tasksCompleted: 132, actionsBlocked: 8, lastActiveAt: daysAgo(6) },
    },
    {
      id: "emp-5",
      name: "Nyah",
      role: "operations",
      industry: "logistics",
      status: "active",
      avatarSeed: "nyah",
      createdAt: daysAgo(15),
      knowledge: [],
      workflow: {
        id: "wf-5",
        name: "Shipment monitoring",
        steps: [
          { id: "s1", title: "Update shipment status", detail: "Sync tracking events to the customer record." },
          { id: "s2", title: "Notify on delay", detail: "Message the customer if an ETA slips." },
        ],
      },
      tools: [
        { toolId: "erp", connected: true, scopes: ["read", "write"] },
        { toolId: "email", connected: true, scopes: ["send"] },
      ],
      permissions: [
        { id: "p1", label: "Read shipment records", granted: true, sensitivity: "low" },
        { id: "p2", label: "Update order status", granted: true, sensitivity: "medium" },
        { id: "p3", label: "Contact vendors directly", granted: true, sensitivity: "medium" },
      ],
      requiresApprovalOver: "high",
      stats: { tasksCompleted: 58, actionsBlocked: 1, lastActiveAt: daysAgo(0, 6) },
    },
  ];

  const policies: PolicyRule[] = [
    {
      id: "pol-1",
      name: "Financial actions need sign-off",
      appliesToRole: "all",
      appliesToIndustry: "all",
      category: "financial",
      maxAutoApproveRisk: "low",
      blockAbove: "critical",
      description: "Any financial action above low risk requires a human administrator to approve before execution.",
      enabled: true,
    },
    {
      id: "pol-2",
      name: "Support refunds capped",
      appliesToRole: "support",
      appliesToIndustry: "all",
      category: "financial",
      maxAutoApproveRisk: "medium",
      blockAbove: "critical",
      description: "Support employees may auto-process refunds up to medium risk; high risk needs approval.",
      enabled: true,
    },
    {
      id: "pol-3",
      name: "Healthcare data is always sensitive",
      appliesToRole: "all",
      appliesToIndustry: "healthcare",
      category: "data_access",
      maxAutoApproveRisk: "low",
      blockAbove: "critical",
      description: "Patient data access above low risk requires approval; critical requests are blocked outright.",
      enabled: true,
    },
    {
      id: "pol-4",
      name: "Communication is low-touch",
      appliesToRole: "all",
      appliesToIndustry: "all",
      category: "communication",
      maxAutoApproveRisk: "medium",
      blockAbove: "critical",
      description: "Standard customer communication auto-approves up to medium risk.",
      enabled: true,
    },
    {
      id: "pol-5",
      name: "Accounting record updates reviewed",
      appliesToRole: "accounting",
      appliesToIndustry: "all",
      category: "record_update",
      maxAutoApproveRisk: "low",
      blockAbove: "high",
      description: "Ledger and invoice updates from AI accounting assistants need review above low risk.",
      enabled: true,
    },
  ];

  const logs: ActionLogEntry[] = [
    {
      id: "log-1",
      employeeId: "emp-1",
      employeeName: "Aria",
      industry: "real-estate",
      action: "Sent qualification email to new lead",
      category: "communication",
      tool: "email",
      dataSensitivity: "low",
      riskScore: 10,
      verdict: "ALLOW",
      reason: 'Within policy "Communication is low-touch" auto-approve threshold.',
      timestamp: daysAgo(0, 1),
    },
    {
      id: "log-2",
      employeeId: "emp-2",
      employeeName: "Baxter",
      industry: "customer-support",
      action: "Issued $35 refund for delayed order",
      category: "financial",
      tool: "helpdesk",
      dataSensitivity: "medium",
      riskScore: 35,
      verdict: "ALLOW",
      reason: 'Within policy "Support refunds capped" auto-approve threshold.',
      timestamp: daysAgo(0, 3),
    },
    {
      id: "log-3",
      employeeId: "emp-2",
      employeeName: "Baxter",
      industry: "customer-support",
      action: "Attempted to access customer billing history",
      category: "data_access",
      tool: "helpdesk",
      dataSensitivity: "critical",
      riskScore: 100,
      verdict: "BLOCK",
      reason: "Baxter does not hold the billing-records permission.",
      timestamp: daysAgo(0, 5),
    },
    {
      id: "log-4",
      employeeId: "emp-4",
      employeeName: "Rohan",
      industry: "accounting",
      action: "Requested to initiate client payment",
      category: "financial",
      tool: "accounting_software",
      dataSensitivity: "critical",
      riskScore: 100,
      verdict: "BLOCK",
      reason: "Rohan does not have an active connection to accounting_software.",
      timestamp: daysAgo(1, 2),
    },
    {
      id: "log-5",
      employeeId: "emp-3",
      employeeName: "Priya",
      industry: "recruitment",
      action: "Updated candidate stage to Offer",
      category: "record_update",
      tool: "email",
      dataSensitivity: "medium",
      riskScore: 40,
      verdict: "REQUIRE_APPROVAL",
      reason: "Priya's configured approval threshold (high+) was reached.",
      timestamp: daysAgo(0, 8),
      approvalStatus: "pending",
    },
    {
      id: "log-6",
      employeeId: "emp-5",
      employeeName: "Nyah",
      industry: "logistics",
      action: "Notified customer of 2-day shipment delay",
      category: "communication",
      tool: "email",
      dataSensitivity: "low",
      riskScore: 10,
      verdict: "ALLOW",
      reason: "Low enough risk with no matching restrictive policy.",
      timestamp: daysAgo(0, 10),
    },
    {
      id: "log-7",
      employeeId: "emp-1",
      employeeName: "Aria",
      industry: "real-estate",
      action: "Applied 12% discount to listing quote",
      category: "financial",
      tool: "crm",
      dataSensitivity: "high",
      riskScore: 85,
      verdict: "REQUIRE_APPROVAL",
      reason: 'Policy "Financial actions need sign-off" requires human sign-off.',
      timestamp: daysAgo(2, 1),
      approvalStatus: "pending",
    },
  ];

  const alerts: SecurityAlert[] = [
    {
      id: "alert-1",
      employeeId: "emp-2",
      employeeName: "Baxter",
      title: "Unauthorized data access attempt",
      detail: "Baxter attempted to access billing history without the required permission. The request was blocked before execution.",
      severity: "critical",
      timestamp: daysAgo(0, 5),
      relatedLogId: "log-3",
      acknowledged: false,
    },
    {
      id: "alert-2",
      employeeId: "emp-4",
      employeeName: "Rohan",
      title: "Action attempted on disconnected tool",
      detail: "Rohan attempted to initiate a payment through accounting_software, which is not connected for this business.",
      severity: "high",
      timestamp: daysAgo(1, 2),
      relatedLogId: "log-4",
      acknowledged: false,
    },
    {
      id: "alert-3",
      employeeId: "emp-1",
      employeeName: "Aria",
      title: "Unusual discount size requested",
      detail: "Aria requested a discount above the typical range for real-estate quotes. Held for human approval.",
      severity: "medium",
      timestamp: daysAgo(2, 1),
      relatedLogId: "log-7",
      acknowledged: true,
    },
  ];

  return {
    business: { id: "biz-1", name: "Northbridge Ventures", industries: ["real-estate", "customer-support", "recruitment", "accounting", "logistics"] },
    employees,
    policies,
    logs,
    alerts,
    integrations: INTEGRATIONS.map((i) => ({ ...i })),
  };
}

// Persist across Next.js hot-reloads / module re-evaluations in dev.
const globalForStore = globalThis as unknown as { __sawStore?: StoreShape };

export const db: StoreShape = globalForStore.__sawStore ?? seed();
if (!globalForStore.__sawStore) {
  globalForStore.__sawStore = db;
}

export function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export { ROLE_TEMPLATES };
