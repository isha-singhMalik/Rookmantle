import type { Metadata } from "next";
import { ShieldHalf } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-mist px-6">
      <div className="max-w-sm text-center">
        <ShieldHalf size={28} className="text-graphite mx-auto mb-4" strokeWidth={2.25} />
        <h1 className="font-display text-xl font-semibold text-ink mb-2">You&apos;re offline</h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          Rookmantle needs a connection to show live data and run security checks. Reconnect and
          this page will take you straight back.
        </p>
      </div>
    </main>
  );
}
