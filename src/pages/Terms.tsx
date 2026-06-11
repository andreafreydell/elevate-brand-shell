import { Link } from "react-router-dom";
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

const Terms = () => {
  return (
    <LegalDocument
      title="Terms of Service"
      seoTitle="Terms of Service - GEA | Fashion-House Jewelry Access"
      description="Read GEA's Terms of Service. Clear, plain-language terms covering membership, access, billing, piece care, shipping, returns, and your rights as a GEA member."
      lastUpdated="June 2026"
      intro={
        <>
          <LegalParagraph>
            Welcome to GEA. These Terms of Service govern your use of our platform, your
            membership, and your access to our jewelry collection. Please read them carefully.
          </LegalParagraph>
          <LegalParagraph>
            By creating an account, purchasing a membership, submitting information through our platform, or accessing any part of <strong>geagems.com</strong>, you agree to these Terms. If you do not agree, please do not use our services.
          </LegalParagraph>
          <LegalParagraph>
            GEA is operated by <strong>AMBIENTE HOME LLC</strong>, a Florida limited liability company
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
            "Notify us immediately if you suspect unauthorized account access",
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
          access to curated, high-design jewelry. You do not purchase or own
          the pieces during your access period unless a piece becomes yours through the included <strong>Keep Your Favorite</strong> benefit or an additional keep purchase.
        </LegalParagraph>

        <LegalSubheading className="mt-8">How it works</LegalSubheading>
        <LegalList
          items={[
            "You select jewelry from our curated collection each cycle",
            "You wear and enjoy your selected piece during your cycle",
            "At the end of your cycle, you return the piece you are not keeping and select a new one",
            "Every piece is professionally cleaned, inspected, and sealed before it reaches you",
          ]}
        />

        <LegalParagraph>
          Unless otherwise stated in your membership tier or expressly approved by GEA, each shipment is capped at <strong>one piece per package per cycle</strong>.
        </LegalParagraph>

        <LegalParagraph>
          Membership does not transfer ownership of any jewelry unless a piece becomes yours through the included Keep Your Favorite benefit or an additional keep purchase, as described in Section 6.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="3" title="Membership Tiers & Billing">
        <LegalSubheading>Tiers</LegalSubheading>
        <LegalParagraph>
          GEA offers membership tiers with different access levels. Current
          tiers, pricing, included benefits, and any applicable package limits are displayed on our membership
          page at the time of enrollment. Your selected tier and rate are
          confirmed at checkout.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Billing</LegalSubheading>
        <LegalList
          items={[
            "Membership is billed monthly on a recurring basis",
            "Your payment method is charged on the same date each month",
            "You authorize GEA to charge your payment method for recurring membership fees and any other amounts owed under these Terms",
            "If a payment fails, we may attempt to process it again and notify you",
            "If payment cannot be collected after reasonable attempts, your membership may be paused or cancelled",
          ]}
        />

        <LegalSubheading className="mt-8">Founding Members</LegalSubheading>
        <LegalParagraph>
          Founding 100 members receive a permanent rate lock at their
          enrollment price for as long as their membership remains active and
          in good standing.
        </LegalParagraph>
        <LegalParagraph>
          GEA may revoke the Founding 100 rate lock if the membership is cancelled, unpaid, suspended for non-return, or otherwise no longer in good standing.
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
          Membership fees are non-refundable once a billing cycle has begun, except where required by law or where GEA expressly approves a refund or credit in writing for a verified service issue.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="4" title="Piece Care & Responsibility">
        <LegalParagraph>
          When you access jewelry through GEA, you agree to treat each piece
          with reasonable care.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Normal wear</LegalSubheading>
        <LegalParagraph>
          Normal wear and tear on up to <strong>one piece per package per cycle</strong> is included in your membership and will not result in a damage fee.
        </LegalParagraph>
        <LegalParagraph>
          Normal wear means minor signs of careful use that do not materially affect the piece&apos;s structure, stones, closure, plating, finish, or ability to be worn again.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Repairable damage</LegalSubheading>
        <LegalParagraph>
          If a piece is returned with damage beyond normal wear but can be repaired, a repair fee may apply.
        </LegalParagraph>
        <LegalParagraph>
          A repair fee schedule is available in your member account. Because damage can only be assessed after a returned piece is inspected, any assessed repair fee will be communicated to you before your payment method is charged.
        </LegalParagraph>
        <LegalParagraph>
          Examples of repairable damage may include, without limitation, broken closures, bent posts, missing small components, loosened stones, significant surface damage, or damage caused by water, perfume, cosmetics, chemicals, improper storage, or unreasonable use.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Loss or theft</LegalSubheading>
        <LegalParagraph>
          If a piece is lost, stolen, not returned, or returned in a condition that cannot reasonably be repaired, you are responsible for up to the retail price or replacement value of the piece, as displayed in your account.
        </LegalParagraph>
        <LegalParagraph>
          If you believe a loss, theft, replacement, or damage assessment is incorrect, you must contact us within <strong>7 days</strong> of receiving the assessment notice. We will review the assessment in good faith before finalizing the charge where commercially reasonable.
        </LegalParagraph>

        <LegalCallout title="Our commitment" className="mt-8">
          <LegalList
            items={[
              "Every piece passes a 4-point inspection before sealing: structure, surface, stones, mechanism",
              "We professionally clean, UV-sanitize, inspect, and seal every piece after each cycle",
              "Damage, repair, replacement, or loss fees are assessed only after inspection or confirmed non-return and are communicated before charging whenever commercially reasonable",
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
            "Return shipping is prepaid using the return label provided by GEA",
            "Pieces must be returned by the end of your cycle in the same condition received, accounting for normal wear as described in Section 4",
            "Returns must include all original pieces and packaging materials provided for return",
            "You are responsible for following the return instructions provided with your shipment or in your account",
          ]}
        />

        <LegalSubheading className="mt-8">Late returns</LegalSubheading>
        <LegalParagraph>
          If a piece is not returned by the cycle deadline, we will contact
          you. Continued non-return may result in late fees, membership suspension, replacement charges, or cancellation of your membership.
        </LegalParagraph>
        <LegalParagraph>
          GEA may charge your payment method for amounts owed due to non-return, loss, theft, or replacement as described in these Terms.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="6" title="Keep Your Favorite">
        <LegalParagraph>
          If you fall in love with a piece, one piece from your cycle is
          included to keep at no additional cost, subject to the terms of your membership tier.
        </LegalParagraph>
        <LegalParagraph>
          Keep pricing for any additional eligible pieces is displayed in your member dashboard for each
          piece in your current access set.
        </LegalParagraph>
        <LegalParagraph>
          Kept pieces become your property upon purchase confirmation. All keep
          purchases are final sale.
        </LegalParagraph>
        <LegalParagraph>
          GEA may exclude certain limited-edition, high-value, or unavailable pieces from keep eligibility. Any exclusions will be displayed in your account or communicated before purchase confirmation.
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
            "For Founding 100 members, referral credits do not expire while the membership remains active and in good standing",
            "Credits are not redeemable for cash",
            "Full referral terms are available at /refer",
          ]}
        />
        <LegalParagraph>
          GEA may modify, suspend, or terminate the referral program at any time, provided that earned credits already reflected in your account will remain available according to the terms in effect when earned, unless fraud, abuse, or misuse is suspected.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="8" title="The Next Chapter, Profile Answers & Member Data">
        <LegalParagraph>
          GEA may offer interactive features, including but not limited to <strong>The Next Chapter</strong>, style profiles, becoming-profiles, questionnaires, email prompts, notebooks, recommendation flows, and monthly chapter experiences.
        </LegalParagraph>
        <LegalParagraph>
          When you submit answers, preferences, reflections, profile information, or other content through these features, you authorize GEA to use that information to:
        </LegalParagraph>
        <LegalList
          items={[
            "Personalize your membership experience",
            "Curate jewelry recommendations",
            "Generate or improve your monthly chapters",
            "Send you membership-related emails, prompts, reminders, recommendations, and updates",
            "Improve GEA’s products, services, content, and member experience",
          ]}
        />
        <LegalParagraph>
          GEA may use your submitted information together with your membership activity, preferences, and account information to provide a more personalized experience.
        </LegalParagraph>
        <LegalParagraph>
          GEA does not claim ownership over your personal reflections or profile answers. However, you grant GEA a limited right to use them as needed to operate, personalize, maintain, and improve the GEA experience.
        </LegalParagraph>
        <LegalParagraph>
          GEA&apos;s collection, use, storage, and protection of personal information is further described in our Privacy Policy. If there is a conflict between these Terms and the Privacy Policy regarding personal data practices, the Privacy Policy will govern.
        </LegalParagraph>
        <LegalParagraph>
          You may unsubscribe from marketing emails at any time, but you may still receive transactional or service-related communications about your account, membership, shipments, returns, billing, or legal notices.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="9" title="Intellectual Property">
        <LegalParagraph>
          All content on <strong>geagems.com</strong>, including text, photography, design, logos, graphics, product descriptions, brand elements, and platform features, is the property of AMBIENTE HOME LLC or its licensors and is protected by intellectual property laws.
        </LegalParagraph>
        <LegalParagraph>
          You may not reproduce, distribute, modify, display, sell, license, or create derivative works from our content without prior written permission.
        </LegalParagraph>
        <LegalParagraph>
          You may not use GEA&apos;s name, logo, photography, product imagery, styling, or brand elements in a way that implies affiliation, endorsement, or partnership without written approval.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="10" title="Limitation of Liability">
        <LegalParagraph>
          To the maximum extent permitted by law, GEA&apos;s total liability to
          you for any claims arising from or related to your use of our services is limited
          to the amount you paid in membership fees during the <strong>3 months</strong> preceding the claim.
        </LegalParagraph>

        <LegalParagraph>
          GEA is not liable for indirect, incidental, special, consequential, exemplary, or punitive damages, including lost profits, data loss, business interruption, reputational harm, or loss of opportunity.
        </LegalParagraph>
        <LegalParagraph>
          This limitation of liability does not limit or reduce any membership fees, repair fees, replacement costs, loss charges, late fees, keep purchases, or other amounts you owe to GEA under these Terms.
        </LegalParagraph>
        <LegalParagraph>
          Some jurisdictions do not allow certain limitations of liability, so some of the above limitations may not apply to you.
        </LegalParagraph>
      </LegalSection>

      <LegalSection number="11" title="Dispute Resolution">
        <LegalSubheading>Good-faith resolution</LegalSubheading>
        <LegalParagraph>
          Before filing any claim, you and GEA agree to try to resolve the dispute through good-faith negotiation. To begin this process, you must email <a href="mailto:concierge@geagems.com" className={inlineLinkClassName}>concierge@geagems.com</a> with a description of the issue, the relief requested, and any supporting information.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Binding arbitration</LegalSubheading>
        <LegalParagraph>
          Except for claims that qualify for small claims court or claims seeking injunctive relief for intellectual property misuse, unauthorized access, theft, fraud, or non-return of GEA property, any dispute, claim, or controversy arising out of or relating to these Terms, your membership, your account, or your use of GEA&apos;s services will be resolved by binding arbitration rather than in court.
        </LegalParagraph>
        <LegalParagraph>
          The arbitration will take place in Miami-Dade County, Florida, unless the parties agree otherwise. The arbitration will be conducted on an individual basis and not as a class, collective, consolidated, or representative action.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Class action waiver</LegalSubheading>
        <LegalParagraph>
          You and GEA agree that each party may bring claims against the other only in an individual capacity and not as a plaintiff, class member, or representative in any class, collective, consolidated, private attorney general, or representative proceeding.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Court proceedings</LegalSubheading>
        <LegalParagraph>
          If a dispute is not subject to arbitration, or if a court determines that the arbitration agreement is unenforceable as to a specific claim, the dispute will be resolved exclusively in the state or federal courts located in Miami-Dade County, Florida.
        </LegalParagraph>
        <LegalParagraph>
          You and GEA consent to the personal jurisdiction and venue of those courts.
        </LegalParagraph>
      </LegalSection>

      <LegalSection
        number="12"
        title="General Provisions"
        className="border-b border-border"
      >
        <LegalSubheading>Governing law</LegalSubheading>
        <LegalParagraph>
          These Terms are governed by the laws of the State of Florida, without
          regard to conflict of law provisions.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Modifications</LegalSubheading>
        <LegalParagraph>
          We may update these Terms from time to time. Material changes will be
          communicated via email to your registered address or through your account.
        </LegalParagraph>
        <LegalParagraph>
          Continued use of GEA after changes become effective constitutes acceptance of the updated Terms.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Severability</LegalSubheading>
        <LegalParagraph>
          If any provision of these Terms is found unenforceable, the remaining provisions will continue in full effect.
        </LegalParagraph>
        <LegalParagraph>
          If any part of the arbitration or class action waiver provisions is found unenforceable, the enforceability of the remaining dispute resolution terms will be determined by the applicable arbitrator or court.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Assignment</LegalSubheading>
        <LegalParagraph>
          You may not assign or transfer your rights or obligations under these Terms without GEA&apos;s prior written consent.
        </LegalParagraph>
        <LegalParagraph>
          GEA may assign or transfer these Terms in connection with a merger, acquisition, reorganization, sale of assets, financing, or other business transaction.
        </LegalParagraph>

        <LegalSubheading className="mt-8">No waiver</LegalSubheading>
        <LegalParagraph>
          GEA&apos;s failure to enforce any provision of these Terms does not waive its right to enforce that provision later.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Entire agreement</LegalSubheading>
        <LegalParagraph>
          These Terms, together with our Privacy Policy and any membership terms displayed at checkout, constitute the entire agreement between you and GEA regarding your use of our services.
        </LegalParagraph>

        <LegalSubheading className="mt-8">Contact</LegalSubheading>
        <LegalParagraph>
          For questions about these Terms, email:{" "}
          <a
            href="mailto:concierge@geagems.com"
            className={inlineLinkClassName}
          >
            concierge@geagems.com
          </a>
        </LegalParagraph>
      </LegalSection>
    </LegalDocument>
  );
};

export default Terms;
