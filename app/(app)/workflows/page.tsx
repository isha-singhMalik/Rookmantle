import { db } from "@/lib/store";
import { PageHeader } from "@/components/ui/primitives";
import { WorkflowBuilder } from "@/components/workflow-builder";

export default function WorkflowsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Workflow builder"
        title="Edit how your AI employees work"
        description="Reorder, rename, or rewrite the steps each employee follows. Changes apply immediately."
      />
      <WorkflowBuilder employees={db.employees} />
    </div>
  );
}
