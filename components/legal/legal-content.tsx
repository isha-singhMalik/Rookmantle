export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-lg font-semibold text-ink mt-8 mb-2.5">{children}</h2>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-medium text-ink mt-5 mb-1.5">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-ink-soft leading-relaxed mb-3">{children}</p>;
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 text-sm text-ink-soft leading-relaxed mb-3 space-y-1.5">{children}</ul>;
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs bg-approval-bg text-approval rounded px-1.5 py-0.5">
      {children}
    </span>
  );
}

export function EffectiveDate({ date }: { date: string }) {
  return <p className="text-xs text-ink-soft font-mono mb-8">Last updated: {date}</p>;
}

export function DraftNotice() {
  return (
    <div className="rounded-md border border-approval/30 bg-approval-bg p-4 mb-8">
      <p className="text-sm text-approval font-medium mb-1">This is a draft template, not legal advice</p>
      <p className="text-sm text-ink-soft leading-relaxed">
        Fields shown in <Placeholder>amber</Placeholder> need to be filled in with your real details.
        Have this reviewed by a lawyer in your jurisdiction before relying on it, especially once the
        product handles real user accounts, personal data, or payments.
      </p>
    </div>
  );
}
