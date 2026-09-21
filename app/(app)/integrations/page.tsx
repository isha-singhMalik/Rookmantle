import { db } from "@/lib/store";
import { PageHeader } from "@/components/ui/primitives";
import { IntegrationList } from "@/components/integration-list";

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tool & integration management"
        title="Business-wide integrations"
        description="These are the tools available to connect to your AI employees. Disconnecting a tool here immediately blocks any employee action that depends on it."
      />
      <IntegrationList integrations={db.integrations} />
    </div>
  );
}
