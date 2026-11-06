import { Metadata } from "next";
import { H2, P, Ul, Site, EffectiveDate, DraftNotice } from "@/components/legal/legal-content";

export const metadata: Metadata = { title: "Security & Responsible Disclosure" };

export default function SecurityPolicyPage() {
  return (
    <article>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Security Policy & Responsible Disclosure</h1>
      <EffectiveDate />
      <DraftNotice />

      <P>
        Security is the core product, not an afterthought — every AI employee action in Rookmantle passes
        through a Security Control Engine before it runs. This page describes our security practices and how
        to report a vulnerability responsibly.
      </P>

      <H2>1. Security practices</H2>
      <Ul>
        <li>Role-based permissions and per-employee tool access control, enforced server-side on every action.</li>
        <li>Full audit logging of every action attempted, allowed, blocked, or sent for human approval.</li>
        <li>Encryption in transit (HTTPS/TLS) for all traffic to the Service.</li>
        <li>Least-privilege access for internal systems and staff.</li>
        <li>Regular dependency and vulnerability scanning of the codebase.</li>
      </Ul>
      <P>
        As the product matures we will publish more detail here, such as encryption at rest, penetration
        testing, and any independent security certifications.
      </P>

      <H2>2. Reporting a vulnerability</H2>
      <P>
        If you believe you&apos;ve found a security vulnerability in Rookmantle, we want to hear from you. Please
        report it responsibly:
      </P>
      <Ul>
        <li>Email <Site field="securityEmail" /> with a clear description, steps to reproduce, and any proof-of-concept code.</li>
        <li>Give us a reasonable time to investigate and remediate before any public disclosure.</li>
        <li>Do not access, modify, or exfiltrate data beyond what&apos;s needed to demonstrate the issue.</li>
        <li>Do not run automated scanners that could degrade service for other users, and do not attempt
          social engineering, physical attacks, or denial-of-service against Rookmantle or its users.</li>
      </Ul>

      <H2>3. Our commitment</H2>
      <Ul>
        <li>We will acknowledge your report within <Site field="securityResponseTime" />.</li>
        <li>We will keep you updated as we investigate and remediate.</li>
        <li>We will not pursue legal action against researchers who follow this policy in good faith.</li>
        <li>We do not currently run a paid bug bounty programme, but we are glad to credit researchers who report valid issues, with their permission.</li>
      </Ul>

      <H2>4. Out of scope</H2>
      <Ul>
        <li>Vulnerabilities in third-party services connected to Rookmantle by a customer (report those to the third party).</li>
        <li>Issues requiring physical access to a user&apos;s device.</li>
        <li>Missing security headers or best-practice suggestions without a demonstrated impact.</li>
      </Ul>

      <H2>5. Incident response & breach notification</H2>
      <P>
        In the event of a security incident affecting personal data, we will investigate, contain, and notify
        affected users and relevant regulators as required by applicable law (see the{" "}
        <a href="/legal/privacy-policy" className="text-graphite underline">Privacy Policy</a> Section 9 for
        timelines).
      </P>

      <H2>6. Contact</H2>
      <P><Site field="securityEmail" /></P>
    </article>
  );
}
