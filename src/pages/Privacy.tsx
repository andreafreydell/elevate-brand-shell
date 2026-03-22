import {
  LegalCallout,
  LegalDocument,
  LegalList,
  LegalParagraph,
  LegalSection,
  LegalSubheading,
} from "@/components/legal/LegalDocument";

const inlineLinkClassName =
  "underline underline-offset-4 transition-colors hover:text-foreground";

const externalLinkProps = {
  className: inlineLinkClassName,
  rel: "noreferrer",
  target: "_blank",
};

const Privacy = () => {
  return (
    <LegalDocument
      title="Privacy Policy"
      seoTitle="Privacy Policy - GEA | How We Protect Your Information"
      description="GEA's Privacy Policy explains what data we collect, how we use it, which services we work with, and your rights. Written in plain language, not legalese."
      lastUpdated="March 2026"
      intro={
        <>
          <LegalParagraph>
            At GEA, we believe in transparency. This policy explains what
            information we collect, how we use it, and the choices you have. We
            have written it in plain language because we believe you deserve
            clarity, not legalese.
          </LegalParagraph>
          <LegalParagraph>
            GEA is operated by GEA LLC, a Florida limited liability company
            based in Key Biscayne, Florida.
          </LegalParagraph>
        </>
      }
    >
      <LegalSection number="1" title="Information We Collect">
        <LegalSubheading>Information you provide</LegalSubheading>
        <LegalList
          items={[
            "Account details: name, email address, shipping address, phone number",
            "Payment information: processed securely through Stripe (we do not store your card details)",
            "Style preferences: taste profile responses, piece selections, keep history",
            "Communications: messages you send us, survey responses, review content",
          ]}
        />

        <LegalSubheading className="mt-8">
          Information collected automatically
        </LegalSubheading>
        <LegalList
          items={[
            "Usage data: pages visited, features used, clicks, scroll depth, time on page",
            "Device data: browser type, operating system, screen resolution, IP address",
            "Session recordings: anonymized recordings of how you interact with our site (mouse movements, clicks, scrolls) - used to improve the experience, never to identify you personally",
            "Referral data: how you arrived at our site (direct, social media, email, referral link)",
          ]}
        />
      </LegalSection>

      <LegalSection number="2" title="How We Use Your Information">
        <LegalParagraph>We use your information to:</LegalParagraph>
        <LegalList
          items={[
            <span key="deliver">
              <strong>Deliver your membership:</strong> Process payments,
              manage your access, fulfill shipments, handle returns
            </span>,
            <span key="personalize">
              <strong>Personalize your experience:</strong> Curate piece
              recommendations, generate styling suggestions, write personalized
              notes
            </span>,
            <span key="communicate">
              <strong>Communicate with you:</strong> Send shipping updates,
              membership information, styling content, and promotional emails
              (you can opt out of marketing emails at any time)
            </span>,
            <span key="improve">
              <strong>Improve our platform:</strong> Analyze usage patterns,
              identify friction points, test improvements
            </span>,
            <span key="prevent">
              <strong>Prevent fraud:</strong> Detect and prevent unauthorized
              access or misuse
            </span>,
            <span key="legal">
              <strong>Meet legal obligations:</strong> Comply with applicable
              laws and regulations
            </span>,
          ]}
        />

        <LegalCallout title="Our privacy standard" className="mt-8">
          <LegalParagraph>We never sell your personal information.</LegalParagraph>
        </LegalCallout>
      </LegalSection>

      <LegalSection number="3" title="Third-Party Services">
        <LegalParagraph>
          We work with trusted partners to operate GEA. Each processes data
          only for the purpose described:
        </LegalParagraph>

        <LegalList
          items={[
            <span key="stripe">
              <strong>Stripe</strong> - Payment processing. Stripe handles all
              payment card data under PCI-DSS Level 1 compliance. GEA never
              sees or stores your full card number.{" "}
              <a href="https://stripe.com/privacy" {...externalLinkProps}>
                Stripe Privacy Policy
              </a>
            </span>,
            <span key="klaviyo">
              <strong>Klaviyo</strong> - Email and SMS communications. Manages
              our email flows including welcome messages, shipping
              notifications, styling content, and promotional campaigns.{" "}
              <a
                href="https://www.klaviyo.com/legal/privacy"
                {...externalLinkProps}
              >
                Klaviyo Privacy Policy
              </a>
            </span>,
            <span key="meta">
              <strong>Meta (Facebook/Instagram)</strong> - Advertising. The
              Meta Pixel and Conversions API track site interactions to measure
              ad performance and build relevant audiences.{" "}
              <a
                href="https://www.facebook.com/privacy/policy"
                {...externalLinkProps}
              >
                Meta Privacy Policy
              </a>
            </span>,
            <span key="ga4">
              <strong>Google Analytics 4</strong> - Website analytics. Tracks
              anonymized usage patterns (page views, events, conversions) to
              help us understand how members use the site.{" "}
              <a
                href="https://policies.google.com/privacy"
                {...externalLinkProps}
              >
                Google Privacy Policy
              </a>
            </span>,
            <span key="clarity">
              <strong>Microsoft Clarity</strong> - Session recording and
              heatmaps. Records anonymized user sessions to identify usability
              issues. All personal information is masked.{" "}
              <a
                href="https://privacy.microsoft.com/privacystatement"
                {...externalLinkProps}
              >
                Clarity Privacy Policy
              </a>
            </span>,
            <span key="supabase">
              <strong>Supabase</strong> - Data infrastructure. Hosts our member
              database, product catalog, and operational data with row-level
              security.{" "}
              <a href="https://supabase.com/privacy" {...externalLinkProps}>
                Supabase Privacy Policy
              </a>
            </span>,
          ]}
        />
      </LegalSection>

      <LegalSection number="4" title="Cookies & Tracking">
        <LegalParagraph>
          GEA uses cookies and similar technologies to:
        </LegalParagraph>
        <LegalList
          items={[
            "Keep you logged in to your account (essential cookies)",
            "Remember your preferences (functional cookies)",
            "Understand how you use the site via Google Analytics and Microsoft Clarity (analytics cookies)",
            "Measure advertising effectiveness via Meta Pixel (advertising cookies)",
          ]}
        />

        <LegalCallout title="Your choices" className="mt-8">
          <LegalList
            items={[
              "You can disable non-essential cookies through your browser settings",
              <span key="meta-optout">
                You can opt out of Meta tracking at{" "}
                <a href="http://facebook.com/adpreferences" {...externalLinkProps}>
                  facebook.com/adpreferences
                </a>
              </span>,
              <span key="ga-optout">
                You can opt out of Google Analytics at{" "}
                <a
                  href="http://tools.google.com/dlpage/gaoptout"
                  {...externalLinkProps}
                >
                  tools.google.com/dlpage/gaoptout
                </a>
              </span>,
              <span key="clarity-optout">
                You can opt out of Clarity recording at{" "}
                <a href="http://clarity.microsoft.com" {...externalLinkProps}>
                  clarity.microsoft.com
                </a>{" "}
                or by enabling Do Not Track in your browser
              </span>,
            ]}
            className="mt-0"
          />
        </LegalCallout>

        <LegalParagraph>
          Disabling cookies may affect some site functionality.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="5" title="Email & SMS Communications">
        <LegalSubheading>What you will receive</LegalSubheading>
        <LegalList
          items={[
            <span key="transactional">
              <strong>Transactional emails:</strong> Order confirmations,
              shipping updates, return reminders, account notifications. These
              are essential to your membership and cannot be opted out of.
            </span>,
            <span key="membership">
              <strong>Membership content:</strong> Styling guides, care tips,
              collection previews, founder messages. You can unsubscribe from
              these at any time.
            </span>,
            <span key="promotional">
              <strong>Promotional emails:</strong> Special offers, founding
              member updates, referral program news. You can unsubscribe from
              these at any time.
            </span>,
          ]}
        />

        <LegalSubheading className="mt-8">How to unsubscribe</LegalSubheading>
        <LegalParagraph>
          Every marketing email includes an unsubscribe link at the bottom. You
          can also manage your email preferences in your account settings or by
          emailing{" "}
          <a href="mailto:privacy@wearegea.com" className={inlineLinkClassName}>
            privacy@wearegea.com
          </a>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="6" title="Your Rights & Choices">
        <LegalParagraph>
          Depending on your location, you may have the right to:
        </LegalParagraph>
        <LegalList
          items={[
            <span key="access">
              <strong>Access</strong> your personal data - request a copy of
              what we have
            </span>,
            <span key="correct">
              <strong>Correct</strong> inaccurate information
            </span>,
            <span key="delete">
              <strong>Delete</strong> your personal data (subject to legal
              retention requirements)
            </span>,
            <span key="optout">
              <strong>Opt out</strong> of marketing communications
            </span>,
            <span key="object">
              <strong>Object</strong> to certain processing activities
            </span>,
            <span key="portability">
              <strong>Data portability</strong> - receive your data in a
              structured, machine-readable format
            </span>,
          ]}
        />

        <LegalParagraph>
          To exercise any of these rights, email{" "}
          <a href="mailto:privacy@wearegea.com" className={inlineLinkClassName}>
            privacy@wearegea.com
          </a>
          . We will respond within 30 days.
        </LegalParagraph>

        <LegalSubheading className="mt-8">
          California Residents (CCPA)
        </LegalSubheading>
        <LegalParagraph>
          You have additional rights under the California Consumer Privacy Act,
          including the right to know what personal information is collected
          and the right to opt out of the sale of personal information. GEA
          does not sell personal information.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="7" title="Data Security">
        <LegalParagraph>
          We take reasonable measures to protect your information:
        </LegalParagraph>
        <LegalList
          items={[
            "Payment data is processed by Stripe under PCI-DSS Level 1 compliance",
            "Database access is protected by row-level security policies",
            "All data transmitted between your browser and our servers is encrypted via HTTPS/TLS",
            "Access to member data is restricted to authorized personnel only",
          ]}
        />
        <LegalParagraph>
          No system is perfectly secure. If we become aware of a data breach
          affecting your information, we will notify you promptly.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="8" title="Data Retention">
        <LegalParagraph>
          We retain your information for as long as your account is active or
          as needed to provide services. After account closure:
        </LegalParagraph>
        <LegalList
          items={[
            "Account and membership data: retained for 3 years for legal and tax compliance",
            "Payment records: retained as required by financial regulations",
            "Analytics data: anonymized and retained indefinitely",
            "Marketing preferences: deleted upon request",
          ]}
        />
        <LegalParagraph>
          You may request deletion of your data at any time by emailing{" "}
          <a href="mailto:privacy@wearegea.com" className={inlineLinkClassName}>
            privacy@wearegea.com
          </a>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="9" title="Children&apos;s Privacy">
        <LegalParagraph>
          GEA is not intended for individuals under 18 years of age. We do not
          knowingly collect personal information from children. If you believe
          we have collected data from a minor, please contact us immediately.
        </LegalParagraph>
      </LegalSection>

      <LegalSection
        number="10"
        title="Updates & Contact"
        className="border-b border-border"
      >
        <LegalParagraph>
          We may update this policy from time to time. Material changes will be
          communicated via email to your registered address and posted on this
          page with an updated effective date.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Questions or concerns</LegalSubheading>
        <LegalParagraph>
          Email:{" "}
          <a href="mailto:privacy@wearegea.com" className={inlineLinkClassName}>
            privacy@wearegea.com
          </a>
        </LegalParagraph>
        <LegalParagraph>Mail: GEA LLC, Key Biscayne, FL 33149</LegalParagraph>
      </LegalSection>
    </LegalDocument>
  );
};

export default Privacy;
