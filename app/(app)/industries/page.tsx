import { INDUSTRIES } from "@/lib/reference-data";
import { db } from "@/lib/store";
import { PageHeader, Panel } from "@/components/ui/primitives";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function IndustriesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Industry selection"
        title="Choose the industry you're deploying into"
        description="The core AI employee system is identical everywhere — only the workflows, knowledge, and rules change per industry. Add a new one any time without touching the core platform."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRIES.map((industry) => {
          const activeCount = db.employees.filter((e) => e.industry === industry.id).length;
          return (
            <Panel key={industry.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-ink">{industry.name}</h3>
                {activeCount > 0 && (
                  <span className="text-[11px] font-mono text-allow bg-allow-bg rounded-full px-2 py-0.5">
                    {activeCount} deployed
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-soft mb-4 flex-1">{industry.description}</p>
              <ul className="text-xs text-ink-soft space-y-1 mb-4">
                {industry.sampleWorkflows.map((w) => (
                  <li key={w} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-line" />
                    {w}
                  </li>
                ))}
              </ul>
              <Link
                href={`/marketplace?industry=${industry.id}`}
                className="text-sm font-medium text-graphite inline-flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                Browse roles for this industry <ArrowUpRight size={14} />
              </Link>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
