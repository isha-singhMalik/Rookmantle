import { db } from "@/lib/store";
import { INDUSTRIES } from "@/lib/reference-data";
import { notFound } from "next/navigation";
import { Avatar, Panel } from "@/components/ui/primitives";
import { StatusDot, VerdictBadge } from "@/components/ui/badges";
import { StatusToggle } from "@/components/employee/status-toggle";
import { KnowledgePanel } from "@/components/employee/knowledge-panel";
import { ToolsPanel } from "@/components/employee/tools-panel";
import { PermissionsPanel } from "@/components/employee/permissions-panel";
import { ApprovalPanel } from "@/components/employee/approval-panel";
import { SimulatePanel } from "@/components/employee/simulate-panel";
import { CheckCircle2, ShieldX, Clock } from "lucide-react";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = db.employees.find((e) => e.id === id);
  if (!employee) notFound();

  const activity = db.logs.filter((l) => l.employeeId === id).slice(0, 8);

  return (
    <div>
      <Panel className="p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar seed={employee.avatarSeed} name={employee.name} size={52} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-semibold text-ink">{employee.name}</h1>
                <StatusDot status={employee.status} />
              </div>
              <p className="text-sm text-ink-soft capitalize">
                {employee.role.replace("-", " ")} · {INDUSTRIES.find((i) => i.id === employee.industry)?.name} · ID{" "}
                <span className="font-mono">{employee.id}</span>
              </p>
            </div>
          </div>
          <StatusToggle employeeId={employee.id} status={employee.status} />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-line-soft">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-allow" />
            <div>
              <p className="font-mono text-sm text-ink">{employee.stats.tasksCompleted}</p>
              <p className="text-[11px] text-ink-soft">tasks completed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldX size={16} className="text-block" />
            <div>
              <p className="font-mono text-sm text-ink">{employee.stats.actionsBlocked}</p>
              <p className="text-[11px] text-ink-soft">actions blocked</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-ink-soft" />
            <div>
              <p className="font-mono text-sm text-ink">{new Date(employee.stats.lastActiveAt).toLocaleDateString()}</p>
              <p className="text-[11px] text-ink-soft">last active</p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Panel className="p-5">
            <h2 className="font-display font-semibold text-ink mb-3">Workflow — {employee.workflow.name}</h2>
            <ol className="flex flex-col gap-3">
              {employee.workflow.steps.map((step, i) => (
                <li key={step.id} className="flex gap-3">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-mist text-xs font-mono text-ink-soft shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{step.title}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel className="p-5">
            <KnowledgePanel employeeId={employee.id} items={employee.knowledge} />
          </Panel>

          <Panel className="p-5">
            <ToolsPanel employeeId={employee.id} tools={employee.tools} />
          </Panel>

          <Panel className="p-5">
            <PermissionsPanel employeeId={employee.id} permissions={employee.permissions} />
          </Panel>

          <Panel className="p-5">
            <h2 className="font-display font-semibold text-ink mb-3">Recent action history</h2>
            {activity.length === 0 ? (
              <p className="text-sm text-ink-soft">No actions logged yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-line-soft">
                {activity.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-ink truncate">{log.action}</p>
                      <p className="text-xs text-ink-soft font-mono">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                    <VerdictBadge verdict={log.verdict} />
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel className="p-5">
            <ApprovalPanel employeeId={employee.id} current={employee.requiresApprovalOver} />
          </Panel>
          <SimulatePanel employee={employee} />
        </div>
      </div>
    </div>
  );
}
