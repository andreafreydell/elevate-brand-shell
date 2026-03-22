import { Link } from "react-router-dom";
import {
  LegalCallout,
  LegalDocument,
  LegalList,
  LegalParagraph,
  LegalSection,
  LegalSubheading,
} from "@/components/legal/LegalDocument";

const inlineLinkClassName = "underline underline-offset-4 transition-colors hover:text-foreground";

const Terms = () => {
  return (
    <LegalDocument
      title="Terms of Service"
      seoTitle="Terms of Service - GEA | Fashion-House Jewelry Access"
      description="Read GEA's Terms of Service. Clear, plain-language terms covering membership, access, billing, piece care, shipping, returns, and your rights as a GEA member."
      lastUpdated="March 2026"
      intro={
        <>
          <LegalParagraph>
            Welcome to GEA. These terms govern your use of our platform, your
            membership, and your access to our jewelry collection. Please read
            them carefully.
          </LegalParagraph>
          <LegalParagraph>
            By creating an account or accessing any part of geagems.com, you
            agree to these terms. If you do not agree, please do not use our
            services.
          </LegalParagraph>
          <LegalParagraph>
            GEA is operated by GEA LLC, a Florida limited liability company
            based in Key Biscayne, Florida.
          </LegalParagraph>
        </>
      }
    >
      <LegalSection number="1" title="Your GEA Account">
        <LegalParagraph>
          To access GEA&apos;s membership and collection, you must create an
          account. You agree to:
        </LegalParagraph>
        <LegalList
          items={[
            "Provide accurate and complete information",
            "Keep your login credentials secure",
            "Notify us immediately if you suspect unauthorized access",
            "Be at least 18 years of age",
          ]}
        />
        <LegalParagraph>
          You are responsible for all activity under your account.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="2" title="Membership & Access">
        <LegalParagraph>
          GEA is a fashion-house jewelry access platform. Membership grants you
          access to curated, high-design jewelry - you do not purchase or own
          the pieces during your access period unless a piece becomes yours
          through our Keep Your Favorite program.
        </LegalParagraph>

        <LegalSubheading className="mt-8">How it works</LegalSubheading>
        <LegalList
          items={[
            "You select pieces from our curated collection each cycle",
            "You wear and enjoy them for the duration of your cycle",
            "At the end of your cycle, you return the pieces you are not keeping and select what is next",
            "Every piece is professionally cleaned, inspected, and sealed before it reaches you",
          ]}
        />

        <LegalParagraph>
          Membership does not transfer ownership of any jewelry unless you
          keep a piece through the benefit included with your cycle or complete
          an additional keep purchase and receive confirmation from GEA.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="3" title="Membership Tiers & Billing">
        <LegalSubheading>Tiers</LegalSubheading>
        <LegalParagraph>
          GEA offers membership tiers with different access levels. Current
          tiers, pricing, and included items are displayed on our membership
          page and confirmed at checkout. GEA may update tier structure or
          pricing for future enrollments, but any rate lock or founding promise
          expressly confirmed at enrollment will be honored according to those
          terms.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Billing</LegalSubheading>
        <LegalList
          items={[
            "Membership is billed monthly on a recurring basis",
            "Your payment method is charged on the same date each month",
            "You authorize GEA to charge your payment method for recurring membership fees",
            "If a payment fails, we may retry the charge and notify you before pausing or cancelling access",
          ]}
        />

        <LegalSubheading className="mt-8">Founding Members</LegalSubheading>
        <LegalParagraph>
          Founding 100 members receive a permanent rate lock at their
          enrollment price for as long as their membership remains active and
          in good standing.
        </LegalParagraph>

        <LegalCallout title="Cancellation" className="mt-8">
          <LegalList
            items={[
              "You may cancel your membership at any time",
              "Cancellation takes effect at the end of your current billing cycle",
              "You retain access through the end of your paid period",
              "All pieces must be returned before your membership fully closes",
              "No cancellation fees apply",
            ]}
            className="mt-0"
          />
        </LegalCallout>

        <LegalSubheading className="mt-8">Refunds</LegalSubheading>
        <LegalParagraph>
          Membership fees are generally non-refundable for completed cycles. If
          you experience a service issue, contact us and we will work to
          resolve it fairly.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="4" title="Piece Care & Responsibility">
        <LegalParagraph>
          When you access jewelry through GEA, you agree to treat each piece
          with reasonable care.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Normal wear</LegalSubheading>
        <LegalParagraph>
          On us. We expect pieces to show signs of normal, careful use. You
          will never be charged for standard wear.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Repairable damage</LegalSubheading>
        <LegalParagraph>
          If a piece is damaged beyond normal wear but can be repaired, a fixed
          repair fee may apply. The applicable fee schedule is disclosed in
          your account or before checkout so it is never a surprise.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Loss or theft</LegalSubheading>
        <LegalParagraph>
          If a piece is lost, stolen, or not returned in recoverable condition,
          you are responsible for the replacement cost. Replacement costs are
          displayed for each piece.
        </LegalParagraph>

        <LegalCallout title="Our commitment" className="mt-8">
          <LegalList
            items={[
              "Every piece passes a 4-point inspection before sealing: structure, surface, stones, and mechanism",
              "We professionally clean, UV-sanitize, and seal every piece after each cycle",
              "Damage-related charges are disclosed upfront - no surprise fees",
              "If you believe a damage assessment is incorrect, contact us within 7 days for review",
            ]}
            className="mt-0"
          />
        </LegalCallout>
      </LegalSection>

      <LegalSection number="5" title="Shipping, Returns & Exchanges">
        <LegalSubheading>Shipping</LegalSubheading>
        <LegalList
          items={[
            "GEA ships to addresses within the United States",
            "Shipments include tamper-evident sealed packaging",
            "Tracking updates are provided at key transit points",
            "Signature may be required for high-value shipments",
          ]}
        />

        <LegalSubheading className="mt-8">Returns</LegalSubheading>
        <LegalList
          items={[
            "Return shipping is prepaid - we provide a return label with every shipment",
            "Pieces must be returned by the end of your cycle in the same condition received, accounting for normal wear",
            "Returns must include all original pieces and packaging materials",
          ]}
        />

        <LegalSubheading className="mt-8">Late returns</LegalSubheading>
        <LegalParagraph>
          If pieces are not returned by the cycle deadline, we will contact
          you. After any applicable grace period, late-return fees or
          replacement charges may apply according to the fee schedule shown in
          your account or at checkout.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="6" title="Keep Your Favorite">
        <LegalParagraph>
          If you fall in love with a piece, one piece from your current cycle
          is included to keep at no additional cost. Any additional keep
          pricing and member pricing details are shown in your dashboard or at
          checkout for the pieces currently in your access set.
        </LegalParagraph>
        <LegalParagraph>
          Once you complete a keep purchase, that piece becomes your property
          upon purchase confirmation. All keep purchases are final sale.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="7" title="Referral Program">
        <LegalParagraph>
          GEA members may invite others through our referral program.
        </LegalParagraph>
        <LegalList
          items={[
            "Referral credits are applied to membership renewals only",
            "Credits accumulate up to a maximum of $45 at any time",
            "For Founding 100 members, referral credits do not expire",
            "Credits are not redeemable for cash",
          ]}
        />
        <LegalParagraph>
          Full referral terms are available at{" "}
          <Link to="/refer" className={inlineLinkClassName}>
            /refer
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="8" title="Intellectual Property">
        <LegalParagraph>
          All content on geagems.com - including text, photography, design,
          logos, and brand elements - is the property of GEA LLC and protected
          by intellectual property laws. You may not reproduce, distribute, or
          create derivative works from our content without written permission.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="9" title="Limitation of Liability">
        <LegalParagraph>
          To the maximum extent permitted by law, GEA&apos;s total liability to
          you for any claims arising from your use of our services is limited
          to the amount you paid in membership fees during the 3 months
          preceding the claim.
        </LegalParagraph>
        <LegalParagraph>
          GEA is not liable for indirect, incidental, special, or
          consequential damages, including lost profits, data loss, or business
          interruption.
        </LegalParagraph>
      </LegalSection>

      <LegalSection
        number="10"
        title="General Provisions"
        className="border-b border-border"
      >
        <LegalSubheading>Governing law</LegalSubheading>
        <LegalParagraph>
          These terms are governed by the laws of the State of Florida, without
          regard to conflict of law provisions.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Dispute resolution</LegalSubheading>
        <LegalParagraph>
          Any disputes will be addressed through good-faith negotiation first.
          If negotiation does not resolve the issue, disputes will be resolved
          in the courts of Miami-Dade County, Florida.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Modifications</LegalSubheading>
        <LegalParagraph>
          We may update these terms from time to time. Material changes will be
          communicated by email to your registered address and posted on this
          page. Continued use of GEA after changes constitutes acceptance.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Severability</LegalSubheading>
        <LegalParagraph>
          If any provision is found unenforceable, the remaining provisions
          continue in full effect.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Entire agreement</LegalSubheading>
        <LegalParagraph>
          These terms, together with our Privacy Policy, constitute the entire
          agreement between you and GEA regarding your use of our services.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Contact</LegalSubheading>
        <LegalParagraph>
          For questions about these terms, email{" "}
          <a
            href="mailto:legal@wearegea.com"
            className={inlineLinkClassName}
          >
            legal@wearegea.com
          </a>
          .
        </LegalParagraph>
      </LegalSection>
    </LegalDocument>
  );
};

export default Terms;
