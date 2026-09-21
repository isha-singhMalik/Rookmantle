import { CreateEmployeeWizard } from "@/components/create-employee-wizard";

export default async function NewEmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; industry?: string }>;
}) {
  const { template, industry } = await searchParams;
  return <CreateEmployeeWizard initialTemplateId={template} initialIndustry={industry} />;
}
