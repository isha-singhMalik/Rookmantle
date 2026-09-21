import { db } from "@/lib/store";
import { PageHeader, Panel, Avatar, EmptyState } from "@/components/ui/primitives";
import Link from "next/link";
import { FileText, StickyNote, HelpCircle, Shield } from "lucide-react";

const TYPE_ICON = { document: FileText, note: StickyNote, faq: HelpCircle, policy: Shield };

export default function KnowledgeBasePage() {
  const entries = db.employees.flatMap((emp) =>
    emp.knowledge.map((k) => ({ ...k, employee: emp }))
  ).sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge base"
        title="What your AI employees know"
        description="Each employee's knowledge is scoped to them alone — they can only draw on what's added here, not on each other's context."
      />

      {entries.length === 0 ? (
        <EmptyState title="No knowledge added yet" detail="Open an employee's page to add documents, notes, or policies." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {entries.map((entry) => {
            const Icon = TYPE_ICON[entry.type];
            return (
              <Panel key={entry.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-mist p-2 text-ink-soft shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{entry.title}</p>
                    <p className="text-sm text-ink-soft mt-1 line-clamp-3">{entry.content}</p>
                    <Link
                      href={`/employees/${entry.employee.id}`}
                      className="flex items-center gap-2 mt-3 pt-3 border-t border-line-soft"
                    >
                      <Avatar seed={entry.employee.avatarSeed} name={entry.employee.name} size={22} />
                      <span className="text-xs text-ink-soft">
                        {entry.employee.name} · {new Date(entry.addedAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
