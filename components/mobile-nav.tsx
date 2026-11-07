"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft, Menu, X, Plus, ShieldHalf, LayoutGrid, Users, ClipboardCheck, BellRing } from "lucide-react";
import { navGroups, allNavHrefs } from "@/lib/nav";

const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/security/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/security/alerts", label: "Alerts", icon: BellRing },
];

/**
 * Phone navigation: top bar (with Back on inner pages), bottom tab bar, and a full menu drawer.
 * Installed PWAs have no browser back button, so the app has to provide its own.
 * Everything here is hidden from the md breakpoint up, where the sidebar takes over.
 */
export function MobileNav({ businessName }: { businessName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Remember whether the user has moved between pages inside the app this visit.
  // Only then is router.back() guaranteed to stay in Rookmantle; otherwise (a deep link,
  // a fresh app launch, arriving from another site) Back goes to the parent page instead
  // of leaving the app.
  const startPath = useRef(pathname);
  const movedInApp = useRef(false);
  useEffect(() => {
    if (pathname !== startPath.current) movedInApp.current = true;
  }, [pathname]);

  // Stop the page behind the drawer from scrolling while it's open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isTopLevel = pathname === "/" || allNavHrefs.includes(pathname);

  function goBack() {
    if (movedInApp.current) {
      router.back();
    } else {
      router.push(pathname.startsWith("/employees/") ? "/employees" : "/dashboard");
    }
  }

  return (
    <>
      {/* Top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-3 border-b border-line bg-paper">
        {isTopLevel ? (
          <Link href="/dashboard" className="flex items-center gap-2 px-1">
            <ShieldHalf size={20} className="text-graphite" strokeWidth={2.25} />
            <span className="font-display font-semibold text-ink">Rookmantle</span>
          </Link>
        ) : (
          <button
            onClick={goBack}
            aria-label="Go back"
            className="flex items-center gap-1.5 rounded-md px-2 py-2 -ml-1 text-sm font-medium text-ink"
          >
            <ArrowLeft size={18} /> Back
          </button>
        )}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-2 text-ink"
        >
          <Menu size={21} />
        </button>
      </header>

      {/* Bottom tab bar */}
      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5">
          {TABS.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-graphite" : "text-ink-soft"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {tab.label}
              </Link>
            );
          })}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-soft"
          >
            <Menu size={20} />
            More
          </button>
        </div>
      </nav>

      {/* Menu drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[84%] max-w-sm bg-paper flex flex-col shadow-xl">
            <div className="flex items-center justify-between h-14 px-4 border-b border-line shrink-0">
              <div className="min-w-0">
                <p className="text-[11px] text-ink-soft leading-none mb-1">Business</p>
                <p className="text-sm font-medium text-ink truncate">{businessName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-2 text-ink -mr-2"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              <Link
                href="/employees/new"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md bg-graphite text-white text-sm font-medium px-4 py-2.5 mb-5"
              >
                <Plus size={15} /> Deploy AI employee
              </Link>
              {navGroups.map((group) => (
                <div key={group.label} className="mb-4">
                  <p className="px-2 mb-1 text-[11px] font-medium text-ink-soft">{group.label}</p>
                  {group.items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={clsx(
                          "flex items-center gap-3 rounded-md px-2.5 py-3 text-sm",
                          active ? "bg-graphite text-white font-medium" : "text-ink hover:bg-mist"
                        )}
                      >
                        <Icon size={17} strokeWidth={2} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="shrink-0 border-t border-line px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
              <Link href="/" onClick={() => setOpen(false)}>Home page</Link>
              <Link href="/legal/privacy-policy" onClick={() => setOpen(false)}>Privacy</Link>
              <Link href="/legal/terms-of-service" onClick={() => setOpen(false)}>Terms</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
