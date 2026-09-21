import { ROLE_TEMPLATES, INDUSTRIES, TOOL_LABEL } from "@/lib/reference-data";
import { PageHeader, Panel, Avatar, LinkButton } from "@/components/ui/primitives";
import { IndustryId } from "@/lib/types";
import clsx from "clsx";
import Link from "next/link";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry } = await searchParams;

  const templates = industry
    ? ROLE_TEMPLATES.filter((t) => t.suggestedIndustries.includes(industry as IndustryId))
    : ROLE_TEMPLATES;

  const activeIndustryName = INDUSTRIES.find((i) => i.id === industry)?.name;

  return (
    <div>
      <PageHeader
        eyebrow="AI Employee Marketplace"
        title={activeIndustryName ? `Templates for ${activeIndustryName}` : "Choose an AI employee to deploy"}
        description="Every template ships with default tools and permissions. You'll customize knowledge, access, and security policy in the next step."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/marketplace"
          className={clsx(
            "text-xs font-medium px-3 py-1.5 rounded-full border",
            !industry ? "bg-graphite text-white border-graphite" : "border-line text-ink-soft hover:border-graphite"
          )}
        >
          All industries
        </Link>
        {INDUSTRIES.map((i) => (
          <Link
            key={i.id}
            href={`/marketplace?industry=${i.id}`}
            className={clsx(
              "text-xs font-medium px-3 py-1.5 rounded-full border",
              industry === i.id ? "bg-graphite text-white border-graphite" : "border-line text-ink-soft hover:border-graphite"
            )}
          >
            {i.name}
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <Panel key={t.id} className="p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <Avatar seed={t.avatarSeed} name={t.name} />
              <div>
                <h3 className="font-display font-semibold text-ink text-[15px]">{t.name}</h3>
                <p className="text-xs text-ink-soft capitalize">{t.role.replace("-", " ")}</p>
              </div>
            </div>
            <p className="text-sm text-ink-soft mb-4 flex-1">{t.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {t.defaultTools.map((tool) => (
                <span key={tool} className="text-[11px] font-mono text-ink-soft bg-mist rounded px-1.5 py-0.5">
                  {TOOL_LABEL[tool] ?? tool}
                </span>
              ))}
            </div>
            <LinkButton
              href={`/employees/new?template=${t.id}${industry ? `&industry=${industry}` : ""}`}
              className="w-full"
            >
              Deploy this employee
            </LinkButton>
          </Panel>
        ))}
      </div>
    </div>
  );
}
