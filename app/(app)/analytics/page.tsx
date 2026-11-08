import { db } from "@/lib/store";
import { industryLabel } from "@/lib/labels";
import { PageHeader } from "@/components/ui/primitives";
import { StatCard } from "@/components/stat-card";
import { VerdictChart, IndustryChart, DailyActivityChart } from "@/components/analytics-charts";
import { TrendingUp, ShieldCheck, Percent } from "lucide-react";

export default function AnalyticsPage() {
  const logs = db.logs;
  const employees = db.employees;

  const verdictData = [
    { name: "Allowed", value: logs.filter((l) => l.verdict === "ALLOW").length },
    { name: "Needs approval", value: logs.filter((l) => l.verdict === "REQUIRE_APPROVAL").length },
    { name: "Blocked", value: logs.filter((l) => l.verdict === "BLOCK").length },
  ];

  const tasksByIndustry = new Map<string, number>();
  for (const e of employees) {
    const key = industryLabel(e);
    tasksByIndustry.set(key, (tasksByIndustry.get(key) ?? 0) + e.stats.tasksCompleted);
  }
  const industryData = [...tasksByIndustry.entries()]
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const dailyData = days.map((d) => {
    const dayLogs = logs.filter((l) => new Date(l.timestamp).toDateString() === d.toDateString());
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      allow: dayLogs.filter((l) => l.verdict === "ALLOW").length,
      approval: dayLogs.filter((l) => l.verdict === "REQUIRE_APPROVAL").length,
      block: dayLogs.filter((l) => l.verdict === "BLOCK").length,
    };
  });

  const totalActions = logs.length;
  const autoRate = totalActions ? Math.round((verdictData[0].value / totalActions) * 100) : 0;
  const totalTasks = employees.reduce((s, e) => s + e.stats.tasksCompleted, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="How your AI workforce is performing"
        description="Aggregated across every industry, employee, and security decision."
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total actions evaluated" value={totalActions} icon={TrendingUp} />
        <StatCard label="Auto-approval rate" value={`${autoRate}%`} icon={Percent} tone="allow" />
        <StatCard label="Tasks completed" value={totalTasks} icon={ShieldCheck} tone="allow" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <VerdictChart data={verdictData} />
        <IndustryChart data={industryData} />
      </div>
      <DailyActivityChart data={dailyData} />
    </div>
  );
}
