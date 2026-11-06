import Link from "next/link";
import { ShieldHalf } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-mist px-6">
      <div className="max-w-md">
        <ShieldHalf size={28} className="text-graphite mb-5" strokeWidth={2.25} />
        <p className="font-mono text-xs text-block bg-block-bg inline-block rounded px-2 py-0.5 mb-3">
          404 · BLOCK
        </p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">
          This page doesn&apos;t exist
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          The Security Control Engine checked, and there&apos;s nothing at this address. It may have moved,
          or the link may be mistyped.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-graphite text-white text-sm font-medium px-4 py-2 hover:bg-graphite-2 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md border border-line text-ink text-sm font-medium px-4 py-2 hover:border-graphite transition-colors"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
