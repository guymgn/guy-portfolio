import Link from "next/link";
import type { Metadata } from "next";
import { MonitorSmartphone } from "lucide-react";
import { FloatingNav } from "../FloatingNav";
import { ContactFooter } from "../ContactFooter";
import { BackToTop } from "../BackToTop";
import { GovernanceArtifact } from "./GovernanceArtifact";
import { GovernanceSystemCanvas } from "./GovernanceSystemCanvas";
import { ApiKeyRotationCanvas } from "./ApiKeyRotationCanvas";

const description = "Two anonymized security workflows from an unreleased product: AI asset governance and safe API key rotation.";

export const metadata: Metadata = {
  title: "AI governance and sensitive access case study",
  description,
  alternates: { canonical: "/ai-governance" },
  openGraph: { title: "AI governance and sensitive access | Guy Magen", description, url: "/ai-governance", images: [] },
  twitter: { card: "summary", title: "AI governance and sensitive access | Guy Magen", description, images: [] },
};

export default function AiGovernancePage() {
  return (
    <main className="caseShell governanceTheme" data-analytics-case-study="AI Asset Governance">
      <div className="governanceMobileBlock">
        <p className="sectionLabel">Unreleased</p>
        <MonitorSmartphone className="mobileCaseStudyIcon" aria-hidden="true" />
        <h1>Go to desktop to view this case study</h1>
        <p>The case study includes a detailed software hierarchy and governance workflows designed for a larger screen.</p>
        <Link href="/" data-analytics-event="Portfolio Home Opened" data-analytics-source="mobile case study" data-analytics-project="AI Asset Governance">Back to portfolio</Link>
      </div>

      <FloatingNav projectName="Unreleased" />
      <BackToTop />

      <header className="caseHero governanceHero">
        <p className="sectionLabel">Unreleased product · 2026</p>
        <h1>Exploring clearer controls for Shadow AI and sensitive access</h1>
        <p className="caseDek">Two research-led workflows from the same unreleased security app: governing unmanaged AI models and rotating API keys without disruption.</p>
        <dl className="caseMeta governanceMeta">
          <div><dt>Scope</dt><dd>Two focused security workflows, explored through domain research, systems thinking and interaction design.</dd></div>
          <div><dt>Stage</dt><dd>The product was not released. Both features reached interactive prototypes.</dd></div>
        </dl>
      </header>

      <section className="caseChapter governanceContextChapter">
        <div className="caseChapterHead"><p className="sectionLabel">The context</p><h2>AI adoption can move faster than an organization’s approval process</h2></div>
        <p className="caseLead">The app explored infrastructure risks that startups are actively confronting as their systems mature. This case study begins with Shadow AI: after an unmanaged model is detected, reviewers need to understand where it is being used and decide whether it can remain.</p>
        <div className="governanceEvidenceStrip" aria-label="What informed the design direction">
          <article><small>Domain research</small><strong>Shadow AI governance</strong><p>Model provenance, security review and the risks created by unmanaged AI usage.</p></article>
          <article><small>Relevant structure</small><strong>Software ownership boundaries</strong><p>The project, repository and deployable-artifact hierarchy needed for this workflow.</p></article>
          <article><small>Scenario mapping</small><strong>Different scopes of action</strong><p>The consequences of governing one artifact versus every occurrence of a model.</p></article>
        </div>
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">The product challenge</p><h2>One flagged model can create many governance decisions</h2></div>
        <p className="caseLead">Consider <strong>vgg16_light_a</strong>: a scan finds the same model inside artifacts used across four projects. The relevant hierarchy is limited to what this workflow needs: projects contain repositories, and repositories contain deployable artifacts. Blocking only one location could leave other instances exposed. Blocking every location could interrupt production services.</p>
        <GovernanceSystemCanvas />
      </section>

      <section className="caseChapter governanceIdeationChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Ideation</p><h2>Three ways to make the model’s reach visible</h2></div>
        <p className="caseLead">I explored different ways to organize the same locations before committing to the drilldown.</p>
        <div className="governanceIdeationCanvas" aria-label="Three information models explored during ideation">
          <article>
            <div className="governanceIdeaSketch isList" aria-hidden="true"><i /><i /><i /><i /></div>
            <small>Flat inventory</small>
            <strong>Quick to scan</strong>
            <p>But it hides how each artifact relates to its repository and project.</p>
          </article>
          <article>
            <div className="governanceIdeaSketch isGraph" aria-hidden="true">
              <svg viewBox="0 0 300 112" preserveAspectRatio="none">
                <g>
                  <line x1="148" y1="58" x2="42" y2="24" /><line x1="148" y1="58" x2="67" y2="82" /><line x1="148" y1="58" x2="102" y2="19" /><line x1="148" y1="58" x2="113" y2="88" /><line x1="148" y1="58" x2="167" y2="16" /><line x1="148" y1="58" x2="194" y2="30" /><line x1="148" y1="58" x2="218" y2="70" /><line x1="148" y1="58" x2="264" y2="38" /><line x1="148" y1="58" x2="260" y2="91" />
                  <line x1="113" y1="88" x2="67" y2="82" /><line x1="113" y1="88" x2="82" y2="51" /><line x1="113" y1="88" x2="151" y2="101" /><line x1="113" y1="88" x2="194" y2="30" /><line x1="194" y1="30" x2="167" y2="16" /><line x1="194" y1="30" x2="233" y2="14" /><line x1="194" y1="30" x2="218" y2="70" /><line x1="218" y1="70" x2="260" y2="91" /><line x1="218" y1="70" x2="264" y2="38" /><line x1="82" y1="51" x2="42" y2="24" /><line x1="82" y1="51" x2="67" y2="82" />
                </g>
                <g>
                  <circle className="isHub" cx="148" cy="58" r="7" /><circle className="isHub" cx="113" cy="88" r="5" /><circle className="isHub" cx="194" cy="30" r="5" /><circle cx="42" cy="24" r="4" /><circle cx="67" cy="82" r="4" /><circle cx="82" cy="51" r="4" /><circle cx="102" cy="19" r="3" /><circle cx="151" cy="101" r="3.5" /><circle cx="167" cy="16" r="4" /><circle cx="218" cy="70" r="4.5" /><circle cx="233" cy="14" r="3.5" /><circle cx="264" cy="38" r="4" /><circle cx="260" cy="91" r="4" />
                </g>
              </svg>
            </div>
            <small>Relationship map</small>
            <strong>Shows every connection</strong>
            <p>But it becomes difficult to compare locations or act consistently at scale.</p>
          </article>
          <article className="isSelected">
            <span>Direction taken</span>
            <div className="governanceIdeaSketch isTree" aria-hidden="true">
              <div className="governanceMiniTreeRow depth0"><b data-kind="project" /><span className="governanceMiniTreeBar" /></div>
              <div className="governanceMiniTreeRow depth1"><b data-kind="repository" /><span className="governanceMiniTreeBar" /></div>
              <div className="governanceMiniTreeRow depth2"><b data-kind="artifact" /><span className="governanceMiniTreeBar" /></div>
              <div className="governanceMiniTreeRow depth2"><b data-kind="artifact" /><span className="governanceMiniTreeBar" /></div>
              <div className="governanceMiniTreeRow depth1"><b data-kind="repository" /><span className="governanceMiniTreeBar" /></div>
              <div className="governanceMiniTreeRow depth2"><b data-kind="artifact" /><span className="governanceMiniTreeBar" /></div>
            </div>
            <small>Nested inventory</small>
            <strong>Preserves ownership and scope</strong>
            <p>It mirrors project, repository and artifact boundaries while supporting decisions at each level.</p>
          </article>
        </div>
        <p className="governanceIdeationDecision">The hierarchy gave reviewers both a path to the individual artifact and a predictable way to understand broader actions.</p>
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Defining the interaction</p><h2>The hierarchy had to answer two questions</h2></div>
        <p className="caseLead">Where does this model live? And before acting, how far will the decision reach?</p>
        <div className="governanceResearchCanvas governanceResearchTrace" aria-label="How reviewer needs shaped the interaction">
          <div className="governanceResearchTraceHead"><span>What reviewers need to understand</span><span>What the experience needs to do</span></div>
          <article><strong>The same model can appear in several deployed artifacts</strong><p>Group every occurrence under its project and repository.</p></article>
          <article><strong>The artifact is the actual unit being governed</strong><p>Keep its type and location visible when a reviewer approves or blocks it.</p></article>
          <article><strong>A decision can begin at different levels of the hierarchy</strong><p>Make the chosen scope and its inherited outcomes explicit.</p></article>
          <article><strong>A broad decision can interrupt production software</strong><p>Preview every affected artifact before the reviewer confirms it.</p></article>
        </div>
      </section>

      <section className="caseChapter governanceDesignChapter">
        <div className="caseChapterHead"><p className="sectionLabel">UX and UI decisions</p><h2>Making scope visible at every step</h2></div>
        <p className="caseLead"><strong>The broader the scope of a governance action, the more explicitly the product should reveal its consequences.</strong> Row controls support focused decisions. A global block first reveals every affected artifact and asks the reviewer to document why the action is needed.</p>
        <GovernanceArtifact />
      </section>

      <section className="caseChapter governanceAdjacentChapter">
        <div className="caseChapterHead"><p className="sectionLabel">API key management</p><h2>Making API key access and change safer</h2></div>
        <p className="caseLead">Across both workflows, the design made credential risk visible at the moment of decision: permissions during creation, and potential disruption during rotation.</p>
        <ApiKeyRotationCanvas />
      </section>

      <section className="caseChapter governanceReflection">
        <div className="caseChapterHead"><p className="sectionLabel">Reflection</p><h2>The design made consequence part of the decision</h2></div>
        <p className="caseLead">Across the feature explorations, the interaction mattered only when it made the consequence of a security action visible: affected scope in AI governance, granted access during key creation, and the transition window during rotation. Because the work remained exploratory, the next step would be validating whether those consequences are understandable without explanation.</p>
        <div className="governanceValidationBlock">
          <p className="sectionLabel">What I would validate next</p>
          <div>
            <article><strong>Object clarity</strong><p>Can reviewers distinguish the detected model from each artifact that contains it?</p></article>
            <article><strong>Scope prediction</strong><p>Can they predict the reach of an artifact-, repository- or project-level action?</p></article>
            <article><strong>Proportional friction</strong><p>Does added confirmation feel appropriate as the potential blast radius grows?</p></article>
          </div>
        </div>
      </section>

      <footer className="caseFooter"><p>This case study presents two anonymized feature explorations from the same unreleased product. The work remained exploratory and reached interactive prototypes rather than production. Surrounding product context, company-specific branding, terminology and identifying details have been removed or adapted.</p></footer>
      <ContactFooter />
    </main>
  );
}
