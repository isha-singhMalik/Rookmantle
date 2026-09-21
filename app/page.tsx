import Link from "next/link";
import { LiveFeed } from "@/components/landing/live-feed";
import { INDUSTRIES } from "@/lib/reference-data";
import {
  ShieldHalf,
  ArrowUpRight,
  ShieldCheck,
  Fingerprint,
  ScrollText,
  UserCheck,
} from "lucide-react";

const FLOW = [
  {
    title: "Deploy",
    detail: "Pick an industry and a role template, add your business knowledge, and connect the tools this employee needs.",
  },
  {
    title: "Act",
    detail: "Your AI employee works the way a new hire would — qualifying leads, answering tickets, updating records.",
  },
  {
    title: "Control",
    detail: "Every single action is checked by the Security Control Engine first: allowed, blocked, or sent to a human.",
  },
];

const SECURITY_FEATURES = [
  { icon: Fingerprint, label: "Agent identity", detail: "Every employee has a unique, auditable identity." },
  { icon: ShieldCheck, label: "Role-based permissions", detail: "Access is granted per action, not per employee." },
  { icon: ScrollText, label: "Full audit trail", detail: "Every action, allowed or not, is logged permanently." },
  { icon: UserCheck, label: "Human approval workflows", detail: "Sensitive actions wait for a person, automatically." },
];

export default function LandingPage() {
  return (
    <div className="bg-mist">
      {/* Header */}
      <header className="border-b border-line bg-paper sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5 md:px-8">
          <div className="flex items-center gap-2">
            <ShieldHalf size={20} className="text-graphite" strokeWidth={2.25} />
            <span className="font-display font-semibold text-ink">Secure AI Workforce</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
            <a href="#how-it-works" className="hover:text-ink">How it works</a>
            <a href="#industries" className="hover:text-ink">Industries</a>
            <a href="#security" className="hover:text-ink">Security</a>
          </nav>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-graphite text-white text-sm font-medium px-4 py-2 hover:bg-graphite-2 transition-colors"
          >
            Open dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-[38px] md:text-[46px] font-semibold text-ink leading-[1.08] tracking-tight max-w-lg">
            Hire AI employees. Control everything they do.
          </h1>
          <p className="text-ink-soft text-base leading-relaxed mt-5 max-w-md">
            Deploy AI workers for sales, support, recruiting, operations, and more — customized for your industry,
            with every action checked by a built-in security layer before it runs.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md bg-graphite text-white text-sm font-medium px-5 py-2.5 hover:bg-graphite-2 transition-colors"
            >
              Open the console
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 rounded-md border border-line text-ink text-sm font-medium px-5 py-2.5 hover:border-graphite transition-colors"
            >
              Browse AI employees
            </Link>
          </div>
          <div className="flex items-center gap-6 mt-10 pt-8 border-t border-line-soft">
            <div>
              <p className="font-display text-2xl font-semibold text-ink">11</p>
              <p className="text-xs text-ink-soft mt-0.5">industries supported</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ink">8</p>
              <p className="text-xs text-ink-soft mt-0.5">AI employee roles</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ink">100%</p>
              <p className="text-xs text-ink-soft mt-0.5">actions security-checked</p>
            </div>
          </div>
        </div>
        <LiveFeed />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-line bg-paper py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <p className="text-sm text-ink-soft mb-2">How it works</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink max-w-lg mb-12">
            Every AI employee follows the same three-stage loop.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {FLOW.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-graphite text-white font-mono text-sm">
                    {i + 1}
                  </span>
                  <h3 className="font-display font-semibold text-ink text-lg">{step.title}</h3>
                </div>
                <p className="text-sm text-ink-soft leading-relaxed max-w-xs">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <p className="text-sm text-ink-soft mb-2">Works everywhere</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink max-w-lg mb-10">
            One core platform. Any industry.
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {INDUSTRIES.map((industry) => (
              <div key={industry.id} className="rounded-lg border border-line bg-paper p-4 hover:border-graphite/40 transition-colors">
                <p className="font-medium text-sm text-ink">{industry.name}</p>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">{industry.description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink-soft mt-6">
            Don&apos;t see yours? New industries and workflows plug into the same core platform — nothing to rebuild.
          </p>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="border-t border-line bg-graphite py-16 md:py-20 text-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <p className="text-sm text-white/50 mb-2">Security by default</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-lg mb-12">
            Autonomy without losing control.
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {SECURITY_FEATURES.map(({ icon: Icon, label, detail }) => (
              <div key={label}>
                <Icon size={20} className="text-[#7fd6ac] mb-3" strokeWidth={2} />
                <p className="font-medium text-sm">{label}</p>
                <p className="text-white/50 text-xs mt-1.5 leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 md:py-20 text-center">
        <div className="max-w-xl mx-auto px-5">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-3">
            Hire AI employees. Customize them for your industry.
          </h2>
          <p className="text-ink-soft text-sm mb-7">Control and secure everything they do.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-graphite text-white text-sm font-medium px-5 py-2.5 hover:bg-graphite-2 transition-colors"
          >
            Open the console <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-6">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between text-xs text-ink-soft">
          <span>Secure AI Workforce — prototype build</span>
          <span className="font-mono">v0.1.0</span>
        </div>
      </footer>
    </div>
  );
}
