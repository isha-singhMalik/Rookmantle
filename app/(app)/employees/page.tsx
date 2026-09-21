import { db } from "@/lib/store";
import { INDUSTRIES } from "@/lib/reference-data";
import { PageHeader, Panel, Avatar, LinkButton } from "@/components/ui/primitives";
import { StatusDot } from "@/components/ui/badges";
import Link from "next/link";

export default function EmployeesPage() {
  const employees = db.employees;

  return (
    <div>
      <PageHeader
        eyebrow="Workforce"
        title="Your AI employees"
        description="Every employee here has its own identity, permissions, and security policy — controlled independently of the others."
        action={<LinkButton href="/employees/new">Deploy AI employee</LinkButton>}
      />

      <Panel className="divide-y divide-line-soft">
        {employees.map((emp) => (
          <Link
            key={emp.id}
            href={`/employees/${emp.id}`}
            className="flex items-center gap-4 p-4 hover:bg-mist transition-colors"
          >
            <Avatar seed={emp.avatarSeed} name={emp.name} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink">{emp.name}</p>
                <StatusDot status={emp.status} />
                <span className="text-xs text-ink-soft capitalize">{emp.status}</span>
              </div>
              <p className="text-xs text-ink-soft capitalize mt-0.5">
                {emp.role.replace("-", " ")} · {INDUSTRIES.find((i) => i.id === emp.industry)?.name}
              </p>
            </div>
            <div className="hidden sm:flex gap-6 text-right">
              <div>
                <p className="font-mono text-sm text-ink">{emp.stats.tasksCompleted}</p>
                <p className="text-[11px] text-ink-soft">completed</p>
              </div>
              <div>
                <p className="font-mono text-sm text-block">{emp.stats.actionsBlocked}</p>
                <p className="text-[11px] text-ink-soft">blocked</p>
              </div>
            </div>
          </Link>
        ))}
      </Panel>
    </div>
  );
}
