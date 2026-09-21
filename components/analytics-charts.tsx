"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Panel } from "@/components/ui/primitives";

const COLORS = {
  allow: "#3f8f6f",
  approval: "#c98a2c",
  block: "#c4453b",
  graphite: "#1b2430",
};

export function VerdictChart({ data }: { data: { name: string; value: number }[] }) {
  const colorFor = (name: string) =>
    name === "Allowed" ? COLORS.allow : name === "Blocked" ? COLORS.block : COLORS.approval;

  return (
    <Panel className="p-5">
      <h2 className="font-display font-semibold text-ink mb-4">Verdicts by volume</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e9ec" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: "#5a6472" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#171d24" }} axisLine={false} tickLine={false} width={100} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #d8dce0" }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
            {data.map((d, i) => (
              <Cell key={i} fill={colorFor(d.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

export function IndustryChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Panel className="p-5">
      <h2 className="font-display font-semibold text-ink mb-4">Tasks completed by industry</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e9ec" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5a6472" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12, fill: "#5a6472" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #d8dce0" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={COLORS.graphite} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

export function DailyActivityChart({ data }: { data: { day: string; allow: number; block: number; approval: number }[] }) {
  return (
    <Panel className="p-5">
      <h2 className="font-display font-semibold text-ink mb-4">Action volume, last 7 days</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e9ec" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#5a6472" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#5a6472" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #d8dce0" }} />
          <Bar dataKey="allow" stackId="a" fill={COLORS.allow} name="Allowed" radius={[0, 0, 0, 0]} />
          <Bar dataKey="approval" stackId="a" fill={COLORS.approval} name="Needs approval" />
          <Bar dataKey="block" stackId="a" fill={COLORS.block} name="Blocked" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}
