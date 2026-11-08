import { Industry, RoleTemplate, Integration, RiskLevel } from "./types";

export const INDUSTRIES: Industry[] = [
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Lead qualification, property matching, site visit booking.",
    sampleWorkflows: ["Qualify inbound lead", "Match listings to buyer criteria", "Book a site visit"],
  },
  {
    id: "recruitment",
    name: "Recruitment",
    description: "Candidate screening, interview scheduling, follow-ups.",
    sampleWorkflows: ["Screen resume against role", "Schedule interview", "Send status follow-up"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Appointment management, patient communication, admin workflows.",
    sampleWorkflows: ["Confirm appointment", "Send intake form", "Reschedule on request"],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Order tracking, inventory coordination, vendor communication.",
    sampleWorkflows: ["Track purchase order", "Flag low inventory", "Contact vendor for ETA"],
  },
  {
    id: "accounting",
    name: "Accounting & CA Firms",
    description: "Client communication, document collection, reminders.",
    sampleWorkflows: ["Request missing documents", "Send filing reminder", "Reconcile client ledger note"],
  },
  {
    id: "logistics",
    name: "Logistics",
    description: "Shipment tracking, dispatch coordination, delay alerts.",
    sampleWorkflows: ["Update shipment status", "Notify customer of delay", "Coordinate pickup slot"],
  },
  {
    id: "retail",
    name: "Retail",
    description: "Order support, restock alerts, loyalty follow-ups.",
    sampleWorkflows: ["Answer order status query", "Flag restock need", "Send loyalty offer"],
  },
  {
    id: "education",
    name: "Education",
    description: "Admissions queries, enrollment follow-ups, scheduling.",
    sampleWorkflows: ["Answer admissions FAQ", "Follow up on incomplete application", "Schedule counselor call"],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Client onboarding, statement queries, compliance reminders.",
    sampleWorkflows: ["Verify onboarding document", "Answer statement query", "Send compliance reminder"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Cart recovery, order support, review follow-ups.",
    sampleWorkflows: ["Send cart recovery message", "Resolve delivery query", "Request product review"],
  },
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Ticket triage, resolution drafting, escalation routing.",
    sampleWorkflows: ["Triage incoming ticket", "Draft resolution reply", "Escalate to human agent"],
  },
];

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: "tpl-sales",
    role: "sales",
    name: "AI Sales Employee",
    description: "Qualifies leads, answers product questions, and books calls.",
    defaultTools: ["crm", "email", "calendar"],
    defaultPermissions: ["read_leads", "update_lead_status", "send_email", "book_meeting"],
    suggestedIndustries: ["real-estate", "retail", "ecommerce", "education"],
    avatarSeed: "sales",
    defaultSteps: [
      { title: "Qualify the lead", detail: "Ask about budget, timeline and needs before anything else." },
      { title: "Answer questions", detail: "Use the knowledge base to answer product and pricing questions." },
      { title: "Book the next step", detail: "Offer time slots and confirm a call or meeting." },
    ],
  },
  {
    id: "tpl-support",
    role: "support",
    name: "AI Customer Support Employee",
    description: "Triages tickets, drafts resolutions, escalates when unsure.",
    defaultTools: ["helpdesk", "email", "knowledge_base"],
    defaultPermissions: ["read_tickets", "reply_ticket", "issue_refund_under_limit"],
    suggestedIndustries: ["customer-support", "retail", "ecommerce", "logistics"],
    avatarSeed: "support",
    defaultSteps: [
      { title: "Triage the ticket", detail: "Classify the topic and how urgent it is." },
      { title: "Draft the resolution", detail: "Propose a fix using the knowledge base." },
      { title: "Escalate when unsure", detail: "Hand over to a human agent when confidence is low." },
    ],
  },
  {
    id: "tpl-recruiter",
    role: "recruiter",
    name: "AI Recruiter",
    description: "Screens candidates, schedules interviews, sends updates.",
    defaultTools: ["ats", "email", "calendar"],
    defaultPermissions: ["read_candidates", "update_candidate_stage", "schedule_interview"],
    suggestedIndustries: ["recruitment"],
    avatarSeed: "recruiter",
    defaultSteps: [
      { title: "Screen the candidate", detail: "Match the profile against the role requirements." },
      { title: "Schedule the interview", detail: "Offer interviewer availability and confirm a slot." },
      { title: "Send a status update", detail: "Tell the candidate what happens next." },
    ],
  },
  {
    id: "tpl-ops",
    role: "operations",
    name: "AI Operations Employee",
    description: "Tracks orders, coordinates vendors, flags exceptions.",
    defaultTools: ["erp", "email", "sheets"],
    defaultPermissions: ["read_orders", "update_order_status", "contact_vendor"],
    suggestedIndustries: ["manufacturing", "logistics", "retail"],
    avatarSeed: "ops",
    defaultSteps: [
      { title: "Track the order", detail: "Check the status of open orders and shipments." },
      { title: "Flag exceptions", detail: "Raise delays, shortages or mismatches early." },
      { title: "Contact the vendor", detail: "Ask for an update or ETA when something slips." },
    ],
  },
  {
    id: "tpl-accounting",
    role: "accounting",
    name: "AI Accounting Assistant",
    description: "Collects documents, sends reminders, drafts reconciliation notes.",
    defaultTools: ["accounting_software", "email", "drive"],
    defaultPermissions: ["read_invoices", "request_documents", "draft_reconciliation"],
    suggestedIndustries: ["accounting", "finance"],
    avatarSeed: "accounting",
    defaultSteps: [
      { title: "Request documents", detail: "Send clients a checklist of what is still missing." },
      { title: "Send reminders", detail: "Remind clients ahead of filing deadlines." },
      { title: "Draft reconciliation notes", detail: "Prepare notes for a human to review and sign off." },
    ],
  },
  {
    id: "tpl-marketing",
    role: "marketing",
    name: "AI Marketing Assistant",
    description: "Drafts campaigns, segments audiences, schedules sends.",
    defaultTools: ["email", "crm", "social"],
    defaultPermissions: ["read_contacts", "draft_campaign", "schedule_send"],
    suggestedIndustries: ["retail", "ecommerce", "education", "real-estate"],
    avatarSeed: "marketing",
    defaultSteps: [
      { title: "Segment the audience", detail: "Choose who should receive this campaign." },
      { title: "Draft the campaign", detail: "Write the message and any variations." },
      { title: "Schedule the send", detail: "Queue it for the right time, pending approval." },
    ],
  },
  {
    id: "tpl-followup",
    role: "follow-up",
    name: "AI Follow-up Employee",
    description: "Sends timed nudges and re-engagement messages.",
    defaultTools: ["email", "whatsapp", "crm"],
    defaultPermissions: ["read_contacts", "send_message"],
    suggestedIndustries: ["real-estate", "recruitment", "healthcare", "accounting"],
    avatarSeed: "followup",
    defaultSteps: [
      { title: "Find who is due", detail: "List the contacts that need a nudge today." },
      { title: "Send a timed nudge", detail: "Send a short, relevant follow-up message." },
      { title: "Log the response", detail: "Record replies and flag anything that needs a human." },
    ],
  },
  {
    id: "tpl-research",
    role: "research",
    name: "AI Research Assistant",
    description: "Gathers information and prepares briefs for the team.",
    defaultTools: ["web", "drive", "sheets"],
    defaultPermissions: ["read_public_web", "write_internal_doc"],
    suggestedIndustries: ["finance", "healthcare", "education", "manufacturing"],
    avatarSeed: "research",
    defaultSteps: [
      { title: "Gather sources", detail: "Collect relevant public information on the topic." },
      { title: "Summarise findings", detail: "Pull out what matters and what is uncertain." },
      { title: "Prepare a brief", detail: "Write it up for the team in a short format." },
    ],
  },
];

export const INTEGRATIONS: Integration[] = [
  { id: "crm", name: "CRM", category: "Sales", description: "Customer and lead records.", connected: true },
  { id: "email", name: "Email", category: "Communication", description: "Send and read business email.", connected: true },
  { id: "calendar", name: "Calendar", category: "Scheduling", description: "Book and manage meetings.", connected: true },
  { id: "helpdesk", name: "Helpdesk", category: "Support", description: "Support ticket queue.", connected: true },
  { id: "knowledge_base", name: "Knowledge Base", category: "Support", description: "Internal help articles.", connected: true },
  { id: "ats", name: "Applicant Tracking System", category: "Recruitment", description: "Candidate pipeline.", connected: false },
  { id: "erp", name: "ERP", category: "Operations", description: "Orders, inventory, vendors.", connected: false },
  { id: "sheets", name: "Spreadsheets", category: "Data", description: "Read/write structured data.", connected: true },
  { id: "accounting_software", name: "Accounting Software", category: "Finance", description: "Invoices and ledgers.", connected: false },
  { id: "drive", name: "File Storage", category: "Data", description: "Shared documents and files.", connected: true },
  { id: "social", name: "Social Accounts", category: "Marketing", description: "Post and schedule content.", connected: false },
  { id: "whatsapp", name: "WhatsApp Business", category: "Communication", description: "Message customers on WhatsApp.", connected: false },
  { id: "web", name: "Web Access", category: "Research", description: "Read public web pages.", connected: true },
];

export const TOOL_LABEL: Record<string, string> = Object.fromEntries(
  INTEGRATIONS.map((i) => [i.id, i.name])
);

/** Ready-made permissions people can add to a custom AI employee with one click. */
export const PERMISSION_LIBRARY: { label: string; sensitivity: RiskLevel }[] = [
  { label: "Read customer records", sensitivity: "low" },
  { label: "Read internal documents", sensitivity: "low" },
  { label: "Book calendar meetings", sensitivity: "low" },
  { label: "Send emails to customers", sensitivity: "medium" },
  { label: "Send WhatsApp or SMS messages", sensitivity: "medium" },
  { label: "Update records in connected tools", sensitivity: "medium" },
  { label: "Publish content publicly", sensitivity: "medium" },
  { label: "Access personal or sensitive data", sensitivity: "high" },
  { label: "Access financial or billing data", sensitivity: "high" },
  { label: "Issue refunds or credits", sensitivity: "high" },
  { label: "Delete records", sensitivity: "high" },
  { label: "Initiate payments", sensitivity: "critical" },
];

/** "issue_refund_under_limit" -> "Issue refund under limit" */
export function humanizePermission(key: string): string {
  const text = key.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Sensible default sensitivity for a template permission, based on what it touches. */
export function guessSensitivity(key: string): RiskLevel {
  const s = key.toLowerCase();
  if (/(payment|transfer)/.test(s)) return "critical";
  if (/(refund|invoice|billing|financial|discount|delete)/.test(s)) return "high";
  if (/(send|update|schedule|book|contact|reply|reconcil)/.test(s)) return "medium";
  return "low";
}
