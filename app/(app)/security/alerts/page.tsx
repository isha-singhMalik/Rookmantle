import { db } from "@/lib/store";
import { PageHeader } from "@/components/ui/primitives";
import { AlertList } from "@/components/alert-list";

export default function AlertsPage() {
  const alerts = [...db.alerts].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return (
    <div>
      <PageHeader
        eyebrow="Security alerts"
        title="Flagged activity"
        description="Blocked actions and suspicious patterns the Security Control Engine has flagged for review."
      />
      <AlertList alerts={alerts} existingEmployeeIds={db.employees.map((e) => e.id)} />
    </div>
  );
}
