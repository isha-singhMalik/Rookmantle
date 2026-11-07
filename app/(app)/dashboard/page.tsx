import { db } from "@/lib/store";
import { PageHeader, Panel, Avatar, LinkButton } from "@/components/ui/primitives";
import { StatCard } from "@/components/stat-card";
import { VerdictBadge } from "@/components/ui/badges";
import { INDUSTRIES } from "@/lib/reference-data";
import { Users, Building2, CheckCircle2, Clock, ShieldX, BellRing, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const employees = db.employees;
  const activeIndustries = new Set(employees.map((e) => e.industry)).size;
  const tasksCompleted = employees.reduce((sum, e) => sum + e.stats.tasksCompleted, 0);
  const pendingApprovals = db.logs.filter((l) => l.approvalStatus === "pending").length;
  const blockedActions = db.logs.filter((l) => l.verdict === "BLOCK").length;
  const openAlerts = db.alerts.filter((a) => !a.acknowledged).length;

  const recentLogs = db.logs.slice(0, 6);

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${db.business.name}`}
        description="Every action below has already passed through the Security Control Engine."
        action={<LinkButton href="/employees/new">Deploy AI employee</LinkButton>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total AI employees" value={employees.length} icon={Users} />
        <StatCard label="Active industries" value={activeIndustries} icon={Building2} />
        <StatCard label="Tasks completed" value={tasksCompleted} icon={CheckCircle2} tone="allow" />
        <StatCard label="Pending approvals" value={pendingApprovals} icon={Clock} tone="approval" />
        <StatCard label="Blocked actions" value={blockedActions} icon={ShieldX} tone="block" />
        <StatCard label="Open security alerts" value={openAlerts} icon={BellRing} tone={openAlerts ? "block" : "neutral"} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Panel className="lg:col-span-3 min-w-0 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink">Recent AI employee activity</h2>
            <Link href="/security/logs" className="text-xs text-ink-soft hover:text-ink inline-flex items-center gap-1">
              View all logs <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-line-soft">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-ink truncate">
                    <span className="font-medium">{log.employeeName}</span> — {log.action}
                  </p>
                  <p className="text-xs text-ink-soft font-mono mt-0.5">
                    {new Date(log.timestamp).toLocaleString()} · {log.tool}
                  </p>
                </div>
                <VerdictBadge verdict={log.verdict} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="lg:col-span-2 min-w-0 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink">Your AI employees</h2>
            <Link href="/employees" className="text-xs text-ink-soft hover:text-ink inline-flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {employees.slice(0, 4).map((emp) => (
              <Link
                key={emp.id}
                href={`/employees/${emp.id}`}
                className="flex items-center gap-3 rounded-md p-2 -mx-2 hover:bg-mist transition-colors"
              >
                <Avatar seed={emp.avatarSeed} name={emp.name} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{emp.name}</p>
                  <p className="text-xs text-ink-soft capitalize truncate">
                    {emp.role} · {INDUSTRIES.find((i) => i.id === emp.industry)?.name}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    emp.status === "active" ? "bg-allow-bg text-allow" : "bg-mist text-ink-soft"
                  }`}
                >
                  {emp.status}
                </span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
