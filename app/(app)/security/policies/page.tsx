import { db } from "@/lib/store";
import { PageHeader } from "@/components/ui/primitives";
import { PolicyManager } from "@/components/policy-manager";

export default function PoliciesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Permissions & security policies"
        title="Rules the Security Control Engine enforces"
        description="The most specific matching rule wins: role + industry + category beats a general 'all' rule. Every AI employee action is checked against these before it runs."
      />
      <PolicyManager policies={db.policies} />
    </div>
  );
}
