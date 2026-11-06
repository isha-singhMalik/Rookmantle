import { Metadata } from "next";
import { H2, P, Ul, Site, EffectiveDate, DraftNotice } from "@/components/legal/legal-content";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsOfServicePage() {
  return (
    <article>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Terms of Service</h1>
      <EffectiveDate />
      <DraftNotice />

      <P>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Rookmantle, including the
        website, dashboard, and any PWA or mobile app builds (together, the &quot;Service&quot;), operated by{" "}
        <Site field="companyName" /> (&quot;we,&quot; &quot;us&quot;). By creating an account
        or using the Service, you agree to these Terms.
      </P>

      <H2>1. Eligibility & accounts</H2>
      <P>
        You must be at least 18 years old, or the age of majority in your jurisdiction, and able to form a
        binding contract to use the Service on behalf of a business. You are responsible for the accuracy of
        information you provide and for safeguarding your account credentials.
      </P>

      <H2>2. What Rookmantle does — and its limits</H2>
      <P>
        Rookmantle lets you configure and deploy automated &quot;AI employees&quot; that perform tasks through
        connected third-party tools, subject to review by our built-in Security Control Engine. You are
        responsible for:
      </P>
      <Ul>
        <li>Reviewing and approving actions routed to the Human Approval Center — the engine flags risk, it does not replace human judgment.</li>
        <li>Configuring permissions, security policies, and approval thresholds appropriate to your business and applicable law.</li>
        <li>Ensuring you have the legal right to connect any third-party tool or data source to an AI employee.</li>
        <li>The accuracy and legality of the knowledge, scripts, and instructions you provide to an AI employee.</li>
      </Ul>
      <P>
        The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee
        that AI-generated or AI-executed actions will be error-free, and you should not rely on the Service for
        decisions where an error could cause serious harm without independent human review.
      </P>

      <H2>3. Acceptable use</H2>
      <P>
        You agree not to misuse the Service. See the{" "}
        <a href="/legal/acceptable-use-policy" className="text-graphite underline">Acceptable Use Policy</a>{" "}
        for the full list of prohibited uses, which is incorporated into these Terms by reference.
      </P>

      <H2>4. Fees & billing</H2>
      <P>
        Where the Service is offered on a paid plan, fees, billing cycle, and cancellation terms will be
        presented at signup or in your order form. Fees are non-refundable except as required by law or as
        stated in your order form. We may change pricing on notice for future billing periods.
      </P>

      <H2>5. Third-party integrations</H2>
      <P>
        AI employees may connect to third-party services (CRM, email, calendar, and similar). Your use of
        those integrations is also governed by the third party&apos;s own terms and privacy policy. We are not
        responsible for the acts or omissions of third-party providers.
      </P>

      <H2>6. Intellectual property</H2>
      <P>
        We retain all rights in the Service, including its software, design, and the Rookmantle name and
        logo. You retain ownership of the business data, knowledge base content, and workflows you input; you
        grant us a limited license to process that data solely to provide the Service to you.
      </P>

      <H2>7. Confidentiality & data protection</H2>
      <P>
        Each party will protect the other&apos;s confidential information using reasonable care. Our handling of
        personal data is described in the{" "}
        <a href="/legal/privacy-policy" className="text-graphite underline">Privacy Policy</a>. Where you
        process personal data of your own end customers through the Service, you act as the data controller
        and we act as a processor on your behalf; a separate Data Processing Addendum is available on request.
      </P>

      <H2>8. Disclaimers</H2>
      <P>
        To the maximum extent permitted by law, we disclaim all warranties, express or implied, including
        merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the
        Security Control Engine will catch every risky or unauthorized action.
      </P>

      <H2>9. Limitation of liability</H2>
      <P>
        To the maximum extent permitted by law, neither party will be liable for indirect, incidental,
        special, consequential, or punitive damages, or loss of profits or data, arising from the Service.
        Our total liability for any claim will not exceed the amount you paid us in the{" "}
        <Site field="liabilityCapPeriod" /> preceding the claim.
      </P>

      <H2>10. Termination</H2>
      <P>
        Either party may terminate for convenience with notice, or immediately for material breach. On
        termination, your right to access the Service ends; we will retain or delete your data per the{" "}
        <a href="/legal/privacy-policy" className="text-graphite underline">Privacy Policy</a> and applicable law.
      </P>

      <H2>11. Governing law & disputes</H2>
      <P>
        These Terms are governed by the laws of <Site field="governingLaw" />, without
        regard to conflict-of-law principles, and disputes will be subject to the exclusive jurisdiction of
        the courts located in <Site field="jurisdictionCity" />, unless a mandatory consumer-protection law in
        your country of residence gives you the right to a different forum.
      </P>

      <H2>12. Changes to these Terms</H2>
      <P>We may update these Terms from time to time; material changes will be notified in advance via the Service or by email.</P>

      <H2>13. Contact</H2>
      <P>
        <Site field="companyName" /> — <Site field="registeredAddress" /> —{" "}
        <Site field="legalEmail" />
      </P>
    </article>
  );
}
