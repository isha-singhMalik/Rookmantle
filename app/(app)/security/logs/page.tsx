import { db } from "@/lib/store";
import { PageHeader, Panel } from "@/components/ui/primitives";
import { VerdictBadge, RiskBadge } from "@/components/ui/badges";
import { CATEGORY_LABEL } from "@/lib/security-engine";
import { Verdict } from "@/lib/types";
import Link from "next/link";
import clsx from "clsx";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ verdict?: string }>;
}) {
  const { verdict } = await searchParams;
  const logs = verdict ? db.logs.filter((l) => l.verdict === verdict) : db.logs;

  const filters: { label: string; value?: Verdict }[] = [
    { label: "All" },
    { label: "Allowed", value: "ALLOW" },
    { label: "Blocked", value: "BLOCK" },
    { label: "Needs approval", value: "REQUIRE_APPROVAL" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Action logs"
        title="Full audit trail"
        description="Every action any AI employee has attempted, with the Security Control Engine's verdict and reasoning."
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/security/logs?verdict=${f.value}` : "/security/logs"}
            className={clsx(
              "text-xs font-medium px-3 py-1.5 rounded-full border",
              verdict === f.value || (!verdict && !f.value)
                ? "bg-graphite text-white border-graphite"
                : "border-line text-ink-soft hover:border-graphite"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <Panel className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-soft">
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Tool</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Verdict</th>
              <th className="px-4 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                  <Link href={`/employees/${log.employeeId}`} className="hover:underline">
                    {log.employeeName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft max-w-xs">{log.action}</td>
                <td className="px-4 py-3 text-ink-soft whitespace-nowrap">{CATEGORY_LABEL[log.category]}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft whitespace-nowrap">{log.tool}</td>
                <td className="px-4 py-3">
                  <RiskBadge level={log.dataSensitivity} />
                </td>
                <td className="px-4 py-3">
                  <VerdictBadge verdict={log.verdict} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
