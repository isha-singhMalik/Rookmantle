import { siteConfig, LegalField } from "@/lib/site-config";

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

const FIELD_LABEL: Record<LegalField, string> = {
  showDraftNotice: "",
  effectiveDate: "Effective Date",
  companyName: "Company Legal Name",
  registeredAddress: "registered address",
  privacyEmail: "privacy email",
  legalEmail: "legal email",
  securityEmail: "security email",
  abuseEmail: "abuse email",
  grievanceOfficerName: "Grievance Officer name",
  grievanceOfficerEmail: "Grievance Officer email",
  governingLaw: "governing law",
  jurisdictionCity: "city",
  hostingRegion: "hosting region",
  analyticsProvider: "analytics provider",
  liabilityCapPeriod: "liability period",
  securityResponseTime: "response time",
};

/** Renders a value from lib/site-config.ts, or an amber placeholder if it's still empty. */
export function Site({ field }: { field: LegalField }) {
  const value = siteConfig.legal[field];
  if (typeof value === "string" && value.trim()) return <>{value}</>;
  return <Placeholder>{FIELD_LABEL[field]}</Placeholder>;
}

export function EffectiveDate() {
  return <p className="text-xs text-ink-soft font-mono mb-8">Last updated: {siteConfig.legal.effectiveDate}</p>;
}

export function DraftNotice() {
  if (!siteConfig.legal.showDraftNotice) return null;
  return (
    <div className="rounded-md border border-approval/30 bg-approval-bg p-4 mb-8">
      <p className="text-sm text-approval font-medium mb-1">This is a draft, not legal advice</p>
      <p className="text-sm text-ink-soft leading-relaxed">
        Fields shown in <Placeholder>amber</Placeholder> have not been filled in yet. This policy has not
        yet been reviewed by a lawyer and should be before the product handles real user accounts,
        personal data, or payments.
      </p>
    </div>
  );
}
