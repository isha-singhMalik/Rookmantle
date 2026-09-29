import Link from "next/link";
import { ShieldHalf, ArrowLeft } from "lucide-react";

const LEGAL_PAGES = [
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/terms-of-service", label: "Terms of Service" },
  { href: "/legal/cookie-policy", label: "Cookie Policy" },
  { href: "/legal/security-policy", label: "Security & Responsible Disclosure" },
  { href: "/legal/acceptable-use-policy", label: "Acceptable Use Policy" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-line bg-paper">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <ShieldHalf size={20} className="text-graphite" strokeWidth={2.25} />
            <span className="font-display font-semibold text-ink">Rookmantle</span>
          </Link>
          <Link href="/" className="text-xs text-ink-soft hover:text-ink inline-flex items-center gap-1.5">
            <ArrowLeft size={13} /> Back to home
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-4 gap-10">
        <nav className="md:col-span-1">
          <p className="text-xs font-medium text-ink-soft mb-2">Policies</p>
          <div className="flex flex-col gap-0.5">
            {LEGAL_PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="text-sm text-ink-soft hover:text-ink hover:bg-paper rounded-md px-2 py-1.5 -mx-2"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="md:col-span-3 max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
