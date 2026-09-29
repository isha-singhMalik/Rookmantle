import { H2, H3, P, Ul, Placeholder, EffectiveDate, DraftNotice } from "@/components/legal/legal-content";

export default function CookiePolicyPage() {
  return (
    <article>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Cookie Policy</h1>
      <EffectiveDate date="[Effective Date]" />
      <DraftNotice />

      <P>
        This policy explains how Rookmantle uses cookies and similar technologies (local storage, IndexedDB,
        service workers) on the website, dashboard, and PWA/mobile builds, and how you can control them, in
        line with the EU ePrivacy Directive, GDPR, CCPA/CPRA, and India&apos;s IT Rules on cookies/tracking.
      </P>

      <H2>1. What are cookies & similar technologies</H2>
      <P>
        Cookies are small text files placed on your device by a website. We also use related browser storage
        technologies (local storage, session storage, IndexedDB) and, because Rookmantle is a Progressive Web
        App, a service worker that can cache assets for offline use and faster loading.
      </P>

      <H2>2. Categories we use</H2>
      <H3>Strictly necessary</H3>
      <Ul>
        <li>Session and authentication cookies that keep you logged in and secure.</li>
        <li>CSRF/security tokens required for the Service to function.</li>
        <li>PWA service worker cache, used to serve the app shell offline and speed up repeat visits.</li>
      </Ul>
      <H3>Functional</H3>
      <Ul>
        <li>Remembering preferences such as your last-selected industry filter or dashboard settings.</li>
      </Ul>
      <H3>Analytics</H3>
      <Ul>
        <li>Aggregated usage analytics to understand which features are used, if enabled (
          <Placeholder>name your analytics provider, e.g. Plausible/PostHog/GA</Placeholder>).</li>
      </Ul>
      <H3>Marketing</H3>
      <Ul>
        <li>Only used if you opt in — e.g. to measure the effectiveness of a marketing campaign. None are set by default.</li>
      </Ul>

      <H2>3. Consent</H2>
      <P>
        Strictly necessary cookies do not require consent under most laws, as the Service cannot function
        without them. Where required (EU/UK visitors, and any non-essential cookie generally), we will ask for
        your consent via a cookie banner before setting analytics or marketing cookies, and let you withdraw
        consent at any time.
      </P>

      <H2>4. How to control cookies</H2>
      <Ul>
        <li>Use the in-app cookie preference control (once implemented) to manage non-essential categories.</li>
        <li>Most browsers let you block or delete cookies via Settings → Privacy.</li>
        <li>To clear PWA-cached data specifically, use your browser&apos;s &quot;Clear site data&quot; option for
          this site, or uninstall the app if installed to your home screen/app drawer.</li>
      </Ul>
      <P>Blocking strictly necessary cookies or clearing service-worker cache may log you out or disable offline functionality.</P>

      <H2>5. Third-party cookies</H2>
      <P>
        If you connect third-party tools to an AI employee, or if the Service embeds a third-party widget, that
        third party may set its own cookies under its own policy — we don&apos;t control those.
      </P>

      <H2>6. Changes & contact</H2>
      <P>
        We may update this policy as our use of cookies changes. Questions: <Placeholder>privacy@rookmantle.example</Placeholder>.
      </P>
    </article>
  );
}
