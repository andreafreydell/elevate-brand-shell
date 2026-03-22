import {
  LegalCallout,
  LegalDocument,
  LegalList,
  LegalParagraph,
  LegalSection,
  LegalSubheading,
} from "@/components/legal/LegalDocument";

const inlineLinkClassName = "underline underline-offset-4 transition-colors hover:text-foreground";
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
            have written it in plain language because you deserve clarity, not
            legalese.
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
            "Account details such as your name, email address, shipping address, and phone number",
            "Payment information processed securely through Stripe - GEA does not store your full card details",
            "Style preferences, taste profile responses, piece selections, and keep history",
            "Messages you send us, survey responses, and review content",
          ]}
        />

        <LegalSubheading className="mt-8">
          Information collected automatically
        </LegalSubheading>
        <LegalList
          items={[
            "Usage data such as pages visited, features used, clicks, scroll depth, and time on page",
            "Device data such as browser type, operating system, screen resolution, and IP address",
            "Session recordings and heatmap signals that help us improve site usability",
            "Referral data showing how you arrived at our site, including direct visits, social media, email, or referral links",
          ]}
        />
      </LegalSection>

      <LegalSection number="2" title="How We Use Your Information">
        <LegalList
          items={[
            <span key="deliver">
              <strong>Deliver your membership:</strong> process payments, manage
              access, fulfill shipments, and handle returns.
            </span>,
            <span key="personalize">
              <strong>Personalize your experience:</strong> curate piece
              recommendations, style guidance, and personalized notes.
            </span>,
            <span key="communicate">
              <strong>Communicate with you:</strong> send shipping updates,
              membership information, editorial content, and promotional emails.
            </span>,
            <span key="improve">
              <strong>Improve our platform:</strong> analyze usage patterns,
              identify friction points, and test improvements.
            </span>,
            <span key="prevent">
              <strong>Prevent fraud:</strong> detect unauthorized access or
              misuse.
            </span>,
            <span key="legal">
              <strong>Meet legal obligations:</strong> comply with applicable
              laws and regulations.
            </span>,
          ]}
        />

        <LegalCallout title="Our privacy standard" className="mt-8">
          <LegalParagraph>
            We never sell your personal information.
          </LegalParagraph>
        </LegalCallout>
      </LegalSection>

      <LegalSection number="3" title="Third-Party Services">
        <LegalParagraph>
          We work with trusted partners to operate GEA. Depending on the
          feature you use and the services we enable, they may process data only
          for the purpose described below.
        </LegalParagraph>

        <LegalList
          items={[
            <span key="stripe">
              <strong>Stripe</strong> - payment processing. Stripe handles
              payment card data under PCI-compliant standards.{" "}
              <a href="https://stripe.com/privacy" {...externalLinkProps}>
                Stripe Privacy Policy
              </a>
            </span>,
            <span key="klaviyo">
              <strong>Klaviyo</strong> - email and SMS communications, including
              welcome flows, announcements, and promotional campaigns.{" "}
              <a
                href="https://www.klaviyo.com/legal/privacy"
                {...externalLinkProps}
              >
                Klaviyo Privacy Policy
              </a>
            </span>,
            <span key="meta">
              <strong>Meta (Facebook and Instagram)</strong> - advertising,
              audience measurement, and campaign attribution.{" "}
              <a
                href="https://www.facebook.com/privacy/policy"
                {...externalLinkProps}
              >
                Meta Privacy Policy
              </a>
            </span>,
            <span key="ga4">
              <strong>Google Analytics 4</strong> - site analytics and
              conversion measurement.{" "}
              <a
                href="https://policies.google.com/privacy"
                {...externalLinkProps}
              >
                Google Privacy Policy
              </a>
            </span>,
            <span key="clarity">
              <strong>Microsoft Clarity</strong> - session insights and
              heatmaps used to improve site usability.{" "}
              <a
                href="https://privacy.microsoft.com/privacystatement"
                {...externalLinkProps}
              >
                Microsoft Privacy Statement
              </a>
            </span>,
            <span key="supabase">
              <strong>Supabase</strong> - member data infrastructure, product
              catalog storage, and operational data.{" "}
              <a href="https://supabase.com/privacy" {...externalLinkProps}>
                Supabase Privacy Policy
              </a>
            </span>,
            <span key="lovable">
              <strong>Lovable</strong> - site development and publishing tooling
              used to build and support portions of the GEA experience.
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
            "Keep you logged in to your account through essential cookies",
            "Remember your preferences through functional cookies",
            "Understand how you use the site through analytics tools such as Google Analytics and Microsoft Clarity",
            "Measure advertising effectiveness through Meta tools",
          ]}
        />

        <LegalCallout title="Your choices" className="mt-8">
          <LegalList
            items={[
              "You can disable non-essential cookies through your browser settings",
              "You can manage Meta ad preferences through your Meta account settings",
              "You can opt out of Google Analytics with Google's browser add-on",
              "You can limit Clarity-style session recording by using browser privacy controls or Do Not Track settings where supported",
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
              <strong>Transactional emails:</strong> order confirmations,
              shipping updates, return reminders, and account notices tied to
              your membership.
            </span>,
            <span key="membership">
              <strong>Membership content:</strong> styling guides, care tips,
              collection previews, and founder messages that support the member
              experience.
            </span>,
            <span key="promotional">
              <strong>Promotional messages:</strong> special offers, founding
              member news, and referral program updates.
            </span>,
          ]}
        />

        <LegalSubheading className="mt-8">How to unsubscribe</LegalSubheading>
        <LegalParagraph>
          Every marketing email includes an unsubscribe link at the bottom. You
          can also manage your preferences in your account settings or by
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
              <strong>Access</strong> your personal data and request a copy.
            </span>,
            <span key="correct">
              <strong>Correct</strong> inaccurate information.
            </span>,
            <span key="delete">
              <strong>Delete</strong> your personal data, subject to legal
              retention requirements.
            </span>,
            <span key="optout">
              <strong>Opt out</strong> of marketing communications.
            </span>,
            <span key="object">
              <strong>Object</strong> to certain processing activities.
            </span>,
            <span key="portability">
              <strong>Data portability</strong> and receive your data in a
              structured, machine-readable format.
            </span>,
          ]}
        />

        <LegalParagraph>
          To exercise these rights, email{" "}
          <a href="mailto:privacy@wearegea.com" className={inlineLinkClassName}>
            privacy@wearegea.com
          </a>
          . We aim to respond within 30 days.
        </LegalParagraph>

        <LegalSubheading className="mt-8">California residents</LegalSubheading>
        <LegalParagraph>
          California residents may have additional rights under the California
          Consumer Privacy Act, including the right to know what personal
          information is collected and the right to request deletion. GEA does
          not sell personal information.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="7" title="Data Security">
        <LegalParagraph>
          We take reasonable measures to protect your information.
        </LegalParagraph>
        <LegalList
          items={[
            "Payment data is processed by Stripe using industry-standard security controls",
            "Database access is restricted through application controls and limited internal access",
            "Data transmitted between your browser and our systems is encrypted through HTTPS/TLS",
            "Access to member data is limited to authorized personnel who need it to do their work",
          ]}
        />
        <LegalParagraph>
          No system is perfectly secure. If we become aware of a breach that
          affects your personal information, we will notify you as required by
          law.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="8" title="Data Retention">
        <LegalParagraph>
          We retain personal information for as long as your account is active
          or as needed to provide services. After account closure:
        </LegalParagraph>
        <LegalList
          items={[
            "Account and membership data may be retained for up to 3 years for legal, tax, and operational compliance",
            "Payment records are retained as required by financial regulations and processor requirements",
            "Analytics data may be aggregated or anonymized and retained for longer periods",
            "Marketing preferences are updated or deleted when you unsubscribe or request deletion",
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
          we have collected data from a minor, please contact us immediately so
          we can investigate and remove it where appropriate.
        </LegalParagraph>
      </LegalSection>

      <LegalSection
        number="10"
        title="Updates & Contact"
        className="border-b border-border"
      >
        <LegalParagraph>
          We may update this policy from time to time. Material changes will be
          communicated by email to your registered address and posted on this
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
