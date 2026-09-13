import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MonitorSmartphone } from "lucide-react";
import { FloatingNav } from "../FloatingNav";
import { ContactFooter } from "../ContactFooter";
import { BackToTop } from "../BackToTop";
import { ModelingAccessCanvas } from "./ModelingAccessCanvas";
import { FeatureGroupCanvas } from "./FeatureGroupCanvas";
import { SubscriptionCanvas } from "./SubscriptionCanvas";
import { WidgetCanvas } from "./WidgetCanvas";

const description = "How I shaped Stigg’s monetization and entitlements platform across pricing models, subscriptions, and customer-facing experiences.";

export const metadata: Metadata = {
  title: "Stigg case study",
  description,
  alternates: { canonical: "/stigg" },
  openGraph: { title: "Stigg case study | Guy Magen", description, url: "/stigg", images: [] },
  twitter: { card: "summary", title: "Stigg case study | Guy Magen", description, images: [] },
};

export default function StiggPage() {
  return (
    <main className="caseShell stiggTheme" data-analytics-case-study="Stigg">
      <div className="stiggMobileBlock">
        <p className="sectionLabel">Stigg case study</p>
        <MonitorSmartphone className="mobileCaseStudyIcon" aria-hidden="true" />
        <h1>Go to desktop to view this case study</h1>
        <p>The case study includes detailed interactive product canvases designed for a larger screen.</p>
        <Link href="/" data-analytics-event="Portfolio Home Opened" data-analytics-source="mobile case study" data-analytics-project="Stigg">Back to portfolio</Link>
      </div>
      <FloatingNav projectName="Stigg" />
      <BackToTop />

      <header className="caseHero">
        <p className="sectionLabel">Stigg · 2023 to 2026</p>
        <h1>Designing the model behind modern SaaS pricing</h1>
        <p className="caseDek">Three years shaping a monetization and entitlements platform, from pricing models and subscriptions to customer-facing experiences.</p>
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
          <p>As SaaS companies grow, pricing decisions spread across billing, application code, sales agreements and customer experiences. Stigg creates one shared model so those decisions become reliable product behavior.</p>
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
          <p className="caseLead">As part of my research, I studied how teams described pricing decisions and how competing products represented them.</p>
          <p>I combined customer and stakeholder conversations with a review of Stripe, Chargebee, Maxio, Metronome and Orb. The opportunity was one coherent model for packaging, billing and access.</p>
        </div>
        <p className="stiggFindingsLabel">What the research established</p>
        <div className="stiggFindings">
          <article><span>01</span><p><strong>People think in customers and plans.</strong><small>The system still needs products, charges, features and entitlement values.</small></p></article>
          <article><span>02</span><p><strong>B2B agreements need exceptions.</strong><small>Flexible configuration cannot make the default path feel unsafe or unpredictable.</small></p></article>
          <article><span>03</span><p><strong>The result must stay visible.</strong><small>Users need to understand the subscription they are assembling before they create it.</small></p></article>
        </div>
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Modeling access</p><h2>The model behind product access</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The challenge was giving teams flexibility without exposing the complexity of the underlying authorization model.</p>
          <p>I separated capabilities into Features and their rules into Entitlements, creating one interaction model for boolean access, metered usage, numeric limits and configuration values.</p>
        </div>
        <ModelingAccessCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Feature Groups</p><h2>One capability, different levels of access</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The challenge was preserving one shared capability while allowing it to mean something different in every plan.</p>
          <p>Feature Groups create the commercial layer: related features can be packaged and reused across plans while each tier retains its own entitlement values.</p>
        </div>
        <FeatureGroupCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Creating a subscription</p><h2>Turning a plan into a customer subscription</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The challenge was preserving flexibility without making a high-impact workflow feel unpredictable.</p>
          <p>I connected the customer, product and plan in one flow, keeping charges, schedule and billing decisions in context while a persistent preview made the result clear before creation.</p>
        </div>
        <SubscriptionCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Widget themes</p><h2>One brand system, rendered with a company’s product data</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The challenge was separating presentation from data without making either side feel disconnected.</p>
          <p>I separated presentation from Product Catalog data through reusable themes for Checkout, Pricing Table, Customer Portal and Power-up Badge, with a live preview showing the result before publishing.</p>
        </div>
        <WidgetCanvas />
      </section>

      <section className="caseChapter caseChapterInternalEnd stiggImpact">
        <div className="caseChapterHead"><p className="sectionLabel">What the system enables</p><h2>One product language, carried from customer decisions into delivery</h2></div>
        <div className="caseStory">
          <article><small>Customer understanding</small><p>Configuration and its consequences stayed visible in the same workflow, helping complex subscription decisions remain understandable before creation.</p></article>
          <article><small>Product coherence</small><p>Features, Entitlements and Feature Groups established a shared language for representing access across plans, subscriptions and customer experiences.</p></article>
          <article><small>Design and engineering</small><p>Recurring decisions became tokens, implementation-ready specifications and Storybook components that could be reviewed and refined with engineering.</p></article>
        </div>
      </section>

      <section className="caseChapter stiggReflection">
        <div className="caseChapterHead"><p className="sectionLabel">Reflection</p><h2>Complexity becomes useful when consequences stay visible</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Complex systems do not need to feel simple, but the decisions within them must remain understandable.</p>
          <p>Across each workflow, clarity came from showing relationships, keeping consequences in context and giving flexible paths a dependable default.</p>
        </div>
        <div className="stiggPracticePath">
          <p className="sectionLabel">How the practice evolved</p>
          <div className="stiggPracticeNarrative">
            <p>In the final year, recurring decisions became tokens, implementation-ready specifications and Storybook components reviewed directly with engineering.</p>
            <p><strong>After launch:</strong> FullStory sessions helped identify hesitation and guide follow-up refinements.</p>
          </div>
        </div>
      </section>

      <footer className="caseFooter">
        <p>All work shown is the property of Stigg. The interactive walkthroughs began as Figma designs from my original product work and were reconstructed in code for this portfolio, with information abstracted, anonymized and adapted for presentation.</p>
      </footer>
      <ContactFooter />
    </main>
  );
}
