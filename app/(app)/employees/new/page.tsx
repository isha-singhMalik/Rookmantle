import { CreateEmployeeWizard } from "@/components/create-employee-wizard";

export default async function NewEmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; industry?: string; custom?: string }>;
}) {
  const { template, industry, custom } = await searchParams;
  return (
    <CreateEmployeeWizard
      initialTemplateId={custom ? "custom" : template}
      initialIndustry={industry}
    />
  );
}
