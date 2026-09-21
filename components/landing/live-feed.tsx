"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type FeedVerdict = "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL";
interface FeedRow {
  employee: string;
  action: string;
  verdict: FeedVerdict;
}

const SCRIPT: FeedRow[] = [
  { employee: "Aria · Sales", action: "sent qualification email to new lead", verdict: "ALLOW" },
  { employee: "Baxter · Support", action: "issued $35 refund for delayed order", verdict: "ALLOW" },
  { employee: "Baxter · Support", action: "requested access to billing history", verdict: "BLOCK" },
  { employee: "Priya · Recruiter", action: "updated candidate stage to Offer", verdict: "REQUIRE_APPROVAL" },
  { employee: "Rohan · Accounting", action: "attempted payment via disconnected tool", verdict: "BLOCK" },
  { employee: "Nyah · Operations", action: "notified customer of shipment delay", verdict: "ALLOW" },
  { employee: "Aria · Sales", action: "applied 12% discount to quote", verdict: "REQUIRE_APPROVAL" },
  { employee: "Priya · Recruiter", action: "scheduled interview for Thu 2pm", verdict: "ALLOW" },
];

const VERDICT_STYLE: Record<FeedVerdict, { label: string; cls: string }> = {
  ALLOW: { label: "ALLOW", cls: "text-[#7fd6ac]" },
  BLOCK: { label: "BLOCK", cls: "text-[#f39a92]" },
  REQUIRE_APPROVAL: { label: "APPROVAL", cls: "text-[#f0c274]" },
};

export function LiveFeed() {
  const [visible, setVisible] = useState<(FeedRow & { id: number })[]>(
    SCRIPT.slice(0, 4).map((r, i) => ({ ...r, id: i }))
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let cursor = 4;
    const interval = setInterval(() => {
      const row = SCRIPT[cursor % SCRIPT.length];
      setVisible((v) => [...v.slice(-4), { ...row, id: cursor }]);
      cursor += 1;
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl bg-graphite border border-white/10 overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="h-2 w-2 rounded-full bg-[#7fd6ac]" />
        <p className="font-mono text-[11px] text-white/60">security-control-engine · live</p>
      </div>
      <div className="p-4 flex flex-col gap-2.5 h-[280px] justify-end">
        {visible.map((row) => (
          <div
            key={row.id}
            className="flex items-baseline justify-between gap-3 font-mono text-[12.5px] leading-snug animate-[fadeIn_0.4s_ease]"
          >
            <span className="text-white/50 truncate">
              <span className="text-white/80">{row.employee}</span> {row.action}
            </span>
            <span className={clsx("shrink-0 font-medium", VERDICT_STYLE[row.verdict].cls)}>
              {VERDICT_STYLE[row.verdict].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
