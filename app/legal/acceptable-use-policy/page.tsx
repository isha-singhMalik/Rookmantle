import { H2, P, Ul, Placeholder, EffectiveDate, DraftNotice } from "@/components/legal/legal-content";

export default function AcceptableUsePolicyPage() {
  return (
    <article>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Acceptable Use Policy</h1>
      <EffectiveDate date="[Effective Date]" />
      <DraftNotice />

      <P>
        This policy sets out what you may not do with Rookmantle, including through the AI employees you
        configure and deploy. It applies to everyone who accesses the Service.
      </P>

      <H2>1. Prohibited uses</H2>
      <P>You may not use Rookmantle, or configure an AI employee, to:</P>
      <Ul>
        <li>Violate any applicable law, including data protection, consumer protection, anti-spam (e.g. CAN-SPAM, India&apos;s IT Act), or financial services regulation.</li>
        <li>Send unsolicited bulk communications, or communications that misrepresent the sender&apos;s identity.</li>
        <li>Collect, process, or transmit personal data without a lawful basis or the necessary consents.</li>
        <li>Harass, deceive, defraud, or discriminate against any person.</li>
        <li>Attempt to circumvent, disable, or probe the Security Control Engine&apos;s permission checks, rate limits, or approval workflows.</li>
        <li>Access or attempt to access another customer&apos;s data, account, or AI employees without authorization.</li>
        <li>Reverse engineer, scrape, or resell the Service except as expressly permitted.</li>
        <li>Introduce malware, or use the Service to attack, disrupt, or gain unauthorized access to any system.</li>
        <li>Use the Service for high-risk activity where failure could cause death, personal injury, or severe
          property/environmental damage, without independent human safeguards.</li>
        <li>Impersonate a real person or organization, or generate deceptive content (e.g. fabricated
          quotes, deepfakes) through a connected AI employee.</li>
      </Ul>

      <H2>2. Industry-specific obligations</H2>
      <P>
        If you deploy AI employees in a regulated industry (healthcare, finance, recruitment, etc.), you remain
        responsible for complying with sector-specific law — for example patient privacy rules, fair lending
        and anti-discrimination law in hiring, or financial promotion rules. Configure permissions and approval
        thresholds accordingly, and route regulated decisions through the Human Approval Center rather than
        full automation where law requires human involvement.
      </P>

      <H2>3. Reporting misuse</H2>
      <P>
        If you become aware of misuse of the Service by another user, report it to{" "}
        <Placeholder>abuse@rookmantle.example</Placeholder>.
      </P>

      <H2>4. Enforcement</H2>
      <P>
        Violating this policy may result in warning, suspension, or termination of your account, and, where
        required, a report to law enforcement or affected third parties. See the{" "}
        <a href="/legal/terms-of-service" className="text-graphite underline">Terms of Service</a> for the full
        termination provisions.
      </P>
    </article>
  );
}
