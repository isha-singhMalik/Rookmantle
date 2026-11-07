import {
  LayoutGrid,
  Building2,
  Store,
  Users,
  BookOpen,
  Workflow,
  Plug,
  ShieldCheck,
  ScrollText,
  BellRing,
  ClipboardCheck,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Single source of truth for navigation: used by the desktop sidebar and the mobile menu. */
export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Workforce",
    items: [
      { href: "/industries", label: "Industries", icon: Building2 },
      { href: "/marketplace", label: "Marketplace", icon: Store },
      { href: "/employees", label: "AI Employees", icon: Users },
      { href: "/knowledge-base", label: "Knowledge base", icon: BookOpen },
      { href: "/workflows", label: "Workflow builder", icon: Workflow },
      { href: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    label: "Security",
    items: [
      { href: "/security/policies", label: "Policies & permissions", icon: ShieldCheck },
      { href: "/security/logs", label: "Action logs", icon: ScrollText },
      { href: "/security/alerts", label: "Security alerts", icon: BellRing },
      { href: "/security/approvals", label: "Approval center", icon: ClipboardCheck },
    ],
  },
];

export const allNavHrefs = navGroups.flatMap((g) => g.items.map((i) => i.href));
