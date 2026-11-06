/**
 * One place for everything that identifies the business and the site.
 * Fill in the empty strings in `legal` and the legal pages update automatically.
 * Any field left as "" is shown to visitors as an amber placeholder tag,
 * so it's easy to spot what's still missing.
 */
export const siteConfig = {
  name: "Rookmantle",
  title: "Rookmantle — AI employees with a built-in security layer",
  description:
    "Hire AI employees. Customize them for your industry. Control and secure everything they do.",

  // Public URL. On Vercel this is picked up automatically; set NEXT_PUBLIC_SITE_URL
  // in your Vercel project settings once you attach a custom domain.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  founder: "Isha Singh Malik",

  legal: {
    // Set to false once a lawyer has reviewed the policies, to hide the draft banner.
    showDraftNotice: true,
    effectiveDate: "5 November 2026",

    companyName: "", // e.g. "Rookmantle Technologies Pvt. Ltd."
    registeredAddress: "",
    privacyEmail: "",
    legalEmail: "",
    securityEmail: "",
    abuseEmail: "",
    grievanceOfficerName: "",
    grievanceOfficerEmail: "",

    governingLaw: "India",
    jurisdictionCity: "", // courts of which city, e.g. "New Delhi"

    hostingRegion: "", // e.g. "United States (Vercel)"
    analyticsProvider: "", // leave empty while no analytics are running

    liabilityCapPeriod: "12 months",
    securityResponseTime: "2 business days",
  },
};

export type LegalField = keyof typeof siteConfig.legal;
