import { db } from "@/lib/store";
import { PageHeader } from "@/components/ui/primitives";
import { ApprovalCenter } from "@/components/approval-center";

export default function ApprovalsPage() {
  const logs = [...db.logs]
    .filter((l) => l.approvalStatus)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return (
    <div>
      <PageHeader
        eyebrow="Human approval center"
        title="Decisions that need you"
        description="When the Security Control Engine can't auto-decide, it stops here instead of guessing."
      />
      <ApprovalCenter logs={logs} existingEmployeeIds={db.employees.map((e) => e.id)} />
    </div>
  );
}
