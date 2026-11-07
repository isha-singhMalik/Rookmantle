"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ShieldHalf } from "lucide-react";
import { navGroups } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 shrink-0 flex-col border-r border-line bg-paper">
      <Link href="/" className="flex items-center gap-2 px-5 h-16 border-b border-line">
        <ShieldHalf size={20} className="text-graphite" strokeWidth={2.25} />
        <span className="font-display font-semibold text-[15px] text-ink leading-tight">
          Rookmantle
        </span>
      </Link>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-2 mb-1.5 text-[11px] font-medium text-ink-soft">{group.label}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-graphite text-white font-medium"
                        : "text-ink-soft hover:bg-mist hover:text-ink"
                    )}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
