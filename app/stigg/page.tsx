import Image from "next/image";
import { FloatingNav } from "../FloatingNav";
import { ContactFooter } from "../ContactFooter";
import { BackToTop } from "../BackToTop";
import { ModelingAccessCanvas } from "./ModelingAccessCanvas";
import { FeatureGroupCanvas } from "./FeatureGroupCanvas";
import { SubscriptionCanvas } from "./SubscriptionCanvas";
import { WidgetCanvas } from "./WidgetCanvas";

export default function StiggPage() {
  return (
    <main className="caseShell stiggTheme">
      <div className="stiggMobileBlock">
        <p className="sectionLabel">Stigg case study</p>
        <h1>Go to desktop to view this case study</h1>
        <p>The case study includes detailed interactive product canvases designed for a larger screen.</p>
        <a href="/">Back to portfolio</a>
      </div>
      <FloatingNav projectName="Stigg" />
      <BackToTop />

      <header className="caseHero">
        <p className="sectionLabel">Stigg · 2023 to 2026</p>
        <h1>Designing the model behind modern SaaS pricing</h1>
        <p className="caseDek">Three years shaping the core product experience of a monetization and entitlements platform, from pricing models and subscription management to customer-facing experiences.</p>
        <dl className="caseMeta">
          <div className="caseMetaBadge"><dt className="srOnly">Role</dt><dd><span className="companyBadgeCrop"><Image src="/company-badges/stigg.png" width={540} height={440} alt="Product Designer at Stigg" /></span></dd></div>
          <div className="caseMetaFocus"><dt>Focus</dt><dd>Product design, UX research, design systems</dd></div>
          <div className="caseMetaScope"><dt>Design scope</dt><dd><span>Core platform workflows</span><span>Customer and stakeholder research</span><span>Billing and entitlement interaction models</span><span>Design system established for the platform</span></dd></div>
        </dl>
      </header>

      <section className="caseChapter caseChapterInternalEnd">
        <div className="caseChapterHead"><p className="sectionLabel">What Stigg solves</p><h2>Pricing decisions have to become product behavior</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">A plan may begin in a spreadsheet, but the product still has to know what every customer can access.</p>
          <div><p>As SaaS companies grow, pricing decisions spread across billing providers, application code, sales agreements and customer-facing experiences. Every change creates another place that can drift out of sync.</p><p>Stigg gives teams a shared model for pricing and packaging, subscriptions and entitlements, so commercial decisions can become reliable product behavior.</p></div>
        </div>
        <div className="stiggSystemMap" aria-label="How Stigg connects pricing decisions to operational systems">
          <article><small>Business input</small><strong>Pricing strategy</strong><span>Plans · Packaging</span></article>
          <i>→</i>
          <article className="isCore"><small>Shared model</small><strong>Stigg</strong><span>Product Catalog · Subscriptions · Entitlements</span></article>
          <i>→</i>
          <div><article><small>Money</small><strong>Billing</strong></article><article><small>Behavior</small><strong>Product access</strong></article><article><small>Experience</small><strong>Customer UI</strong></article></div>
        </div>
      </section>

      <section className="caseChapter caseChapterInternalEnd">
        <div className="caseChapterHead"><p className="sectionLabel">Research and framing</p><h2>The tools were capable. The mental model was fragmented.</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The research approached the problem from both sides: how teams described pricing decisions and how existing products represented them.</p>
          <p>Customer and stakeholder conversations were considered alongside a market review of Stripe, Chargebee, Maxio, Metronome and Orb. The recurring gap was not capability, but coherence: each experience often began with one part of the system rather than the complete relationship between packaging, billing and access.</p>
        </div>
        <div className="stiggResearchGrid">
          <article><small>Billing-first</small><strong>Stripe · Chargebee · Maxio</strong><p>Strong subscription and payment primitives, with product access often managed somewhere else.</p></article>
          <article><small>Usage-first</small><strong>Metronome · Orb</strong><p>Powerful metering and calculation models that could expose technical complexity to operators.</p></article>
          <article className="isOpportunity"><small>Stigg’s opportunity</small><strong>One operational model</strong><p>Connect packaging, subscriptions, billing and entitlements without forcing users to think like the underlying infrastructure.</p></article>
        </div>
        <div className="stiggFindings">
          <span>01</span><p><strong>People think in customers and plans.</strong> The system still needs products, charges, features and entitlement values.</p>
          <span>02</span><p><strong>B2B agreements need exceptions.</strong> Flexible configuration cannot make the default path feel unsafe or unpredictable.</p>
          <span>03</span><p><strong>The result must stay visible.</strong> Users need to understand the subscription they are assembling before they create it.</p>
        </div>
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Creating a subscription</p><h2>One workflow, many interconnected decisions</h2></div>
        <div className="caseTwoCol caseCopy hasDecisionSupport">
          <p className="caseLead">The challenge was preserving flexibility without making a high-impact workflow feel unpredictable.</p>
          <p>The subscription flow connects a customer to a product and plan, then keeps charges, schedule and billing decisions in context while a persistent preview makes the result understandable before creation. The recreation below is based on the shipped experience; some interface details have evolved since this work was completed.</p>
        </div>
        <p className="stiggRationale"><strong>Design rationale</strong><span>Group related decisions, keep their combined effect visible and allow the subscription to be reviewed before creation.</span></p>
        <SubscriptionCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Modeling access</p><h2>The mechanism beneath the subscription</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The challenge was giving teams flexibility without exposing the complexity of the underlying authorization model.</p>
          <div><p>The resulting structure separates capabilities into Features and their rules into Entitlements. This gives teams a clearer way to control who gets what, when and why across pricing and packaging.</p><p>Different capabilities use different rule types, including boolean access, metered usage, numeric limits and configuration values, while retaining a consistent interaction model.</p></div>
        </div>
        <ModelingAccessCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Feature Groups</p><h2>One capability, different levels of access</h2></div>
        <div className="caseTwoCol caseCopy hasDecisionSupport">
          <p className="caseLead">The challenge was preserving one shared capability while allowing it to mean something different in every plan.</p>
          <p>Individual features can represent access, limits or configuration values, but companies often sell them as one recognizable capability. Feature Groups create that commercial layer: related features can be packaged together and reused across plans, while each tier retains its own entitlement values.</p>
        </div>
        <p className="stiggRationale"><strong>Design rationale</strong><span>Keep the capability shared while allowing each plan to define its own entitlement values.</span></p>
        <FeatureGroupCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Widget themes</p><h2>One brand system, rendered with a company’s product data</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The challenge was separating presentation from data without making either side feel disconnected.</p>
          <div><p>A reusable theme controls the shared visual language across the widget library: Checkout, Pricing Table, Customer Portal and Power-up Badge.</p><p>Plans, features and add-ons come directly from a company’s Stigg configuration. The theme shapes how that product and pricing data is presented, while the live preview makes the result visible before publishing.</p></div>
        </div>
        <WidgetCanvas />
      </section>

      <section className="caseChapter stiggReflection">
        <div className="caseChapterHead"><p className="sectionLabel">Reflection</p><h2>From individual workflows to a connected product language</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Across three years, the work expanded from solving individual workflows to establishing shared models and reusable patterns across the platform.</p>
          <div><p>The same principles carried through each feature: make complex configuration understandable, keep consequences visible and allow flexibility without weakening the default path.</p><p>Together, the subscription workflow, entitlement model, Feature Groups, design system and widget themes show one consistent approach to UX: translate infrastructure-level complexity into decisions that people can understand and trust.</p></div>
        </div>
        <div className="stiggPracticePath">
          <p className="sectionLabel">How the practice evolved</p>
          <div className="stiggPracticeNarrative">
            <h3>From Figma to the implemented system</h3>
            <p>During the final year, the role expanded beyond designing workflows in Figma. Recurring decisions were translated into tokens and implementation-ready specifications, followed by direct work in Storybook to review components with the development team and refine their states, behavior and consistency.</p>
            <p><strong>After launch:</strong> FullStory sessions provided an ongoing view into how shipped workflows were used, helping guide follow-up investigation and incremental refinements.</p>
          </div>
        </div>
      </section>

      <footer className="caseFooter">
        <p>All work shown is the property of Stigg. Information is publicly documented, abstracted or anonymized and is included for portfolio purposes only.</p>
      </footer>
      <ContactFooter />
    </main>
  );
}
