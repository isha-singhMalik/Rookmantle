import { db } from "@/lib/store";
import { PageHeader, EmptyState } from "@/components/ui/primitives";
import { WorkflowBuilder } from "@/components/workflow-builder";

export default function WorkflowsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Workflow builder"
        title="Edit how your AI employees work"
        description="Reorder, rename, or rewrite the steps each employee follows. Changes apply immediately."
      />
      {db.employees.length === 0 ? (
        <EmptyState title="No AI employees yet" detail="Deploy an AI employee first, then you can edit its workflow here." />
      ) : (
        <WorkflowBuilder employees={db.employees} />
      )}
    </div>
  );
}
