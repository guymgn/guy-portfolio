import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MonitorSmartphone } from "lucide-react";
import { FloatingNav } from "../FloatingNav";
import { ContactFooter } from "../ContactFooter";
import { BackToTop } from "../BackToTop";
import { ResearchSequenceCanvas } from "./ResearchFlowCanvas";
import { MegaBillCanvas } from "./MegaBillCanvas";
import { AnomalyDetectionCanvas } from "./AnomalyDetectionCanvas";
import { VirtualTagsCanvas } from "./VirtualTagsCanvas";

const description = "How I helped Finout turn fragmented cloud-cost data into clear, accountable product workflows.";

export const metadata: Metadata = {
  title: "Finout case study",
  description,
  alternates: { canonical: "/finout" },
  openGraph: { title: "Finout case study | Guy Magen", description, url: "/finout", images: [] },
  twitter: { card: "summary", title: "Finout case study | Guy Magen", description, images: [] },
};

const scope = [
  "Core product workflows",
  "Customer and stakeholder research",
  "Product marketing and visual assets",
  "Early design-system foundations and Storybook implementation",
];

export default function FinoutPage() {
  return (
    <main className="caseShell finoutTheme" data-analytics-case-study="Finout">
      <div className="finoutMobileBlock">
        <p className="sectionLabel">Finout case study</p>
        <MonitorSmartphone className="mobileCaseStudyIcon" aria-hidden="true" />
        <h1>Go to desktop to view this case study</h1>
        <p>The case study uses detailed product visuals designed for a larger screen.</p>
        <Link href="/" data-analytics-event="Portfolio Home Opened" data-analytics-source="mobile case study" data-analytics-project="Finout">Back to portfolio</Link>
      </div>
      <FloatingNav projectName="Finout" />
      <BackToTop />

      <header className="caseHero">
        <p className="sectionLabel">Finout · 2022 to 2023</p>
        <h1>Turning cloud cost chaos into one clear picture</h1>
        <p className="caseDek">A cloud cost management platform that helps FinOps, engineering and finance understand spend from the same source of truth.</p>
        <dl className="caseMeta">
          <div className="caseMetaBadge caseMetaLogo"><dt className="srOnly">Company</dt><dd><Image src="/company-logos/finout.svg" width={201} height={55} alt="Finout" /></dd></div>
          <div className="caseMetaFocus"><dt>Focus</dt><dd>Product design, UX research, visual design</dd></div>
          <div className="caseMetaScope"><dt>Design scope</dt><dd>{scope.map((item) => <span key={item}>{item}</span>)}</dd></div>
        </dl>
      </header>

      <section className="caseChapter caseChapterInternalEnd">
        <div className="caseChapterHead"><p className="sectionLabel">Research and framing</p><h2>The problem was not a lack of data. It was the work required to understand it.</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Teams moved between provider dashboards, exports and spreadsheets before they could answer a basic cost question.</p>
          <p>I mapped that fragmented workflow and connected it to four recurring needs: visibility, alignment, efficiency and accuracy. That reframed the opportunity from another dashboard into one investigation model: understand the spend, detect meaningful change and establish who owns it.</p>
        </div>
        <ResearchSequenceCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">MegaBill</p><h2>One view across every cloud, service and team</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Research showed that teams needed one shared overview, but still had to trace every number back to its source.</p>
          <p>That made the path into detail as important as the overview itself. I designed MegaBill as a cross-provider starting point with flexible grouping and a consistent route from total spend to the resource behind a change.</p>
        </div>
        <MegaBillCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Anomaly Detection</p><h2>A feed for the cost changes that needed attention</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">A unified bill improved visibility, but teams still had to actively search for the cost changes that deserved attention.</p>
          <p>This led to a chronological anomaly feed rather than another dashboard. I gave every item its expected and actual spend, affected cost context and compact trend, with a direct route into MegaBill for investigation.</p>
        </div>
        <AnomalyDetectionCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Virtual Tags</p><h2>Turning untagged cost into accountable spend</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The research separated visibility from accountability: seeing a cost did not explain which product, environment or owner was responsible for it.</p>
          <p>Incomplete provider metadata made that gap unavoidable. I shaped Virtual Tags as an ordered rule model for matched and unmatched costs, then extended it through Split Cost so shared costs could be distributed without making the allocation harder to understand or validate.</p>
        </div>
        <VirtualTagsCanvas />
      </section>

      <section className="caseChapter caseChapterInternalEnd finoutImpact">
        <div className="caseChapterHead"><p className="sectionLabel">What the system enables</p><h2>One path from fragmented cost data to accountable spend</h2></div>
        <div className="caseStory">
          <article><small>See the whole picture</small><p>FinOps, engineering and finance could begin with the same cross-provider view instead of reconciling separate dashboards and exports.</p></article>
          <article><small>Catch meaningful change</small><p>Anomaly Detection surfaced unexpected spend with its context intact, then opened the relevant MegaBill investigation directly.</p></article>
          <article><small>Assign clear ownership</small><p>Virtual Tags let FinOps teams convert existing metadata into business context and define what should happen when that context was missing.</p></article>
        </div>
      </section>

      <section className="caseChapter finoutReflection">
        <div className="caseChapterHead"><p className="sectionLabel">Reflection</p><h2>Clarity came from preserving the path through the data</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Cloud cost data became useful when people could understand how a number was constructed and who was responsible for it.</p>
          <p>Across these workflows, I used progressive disclosure as the organizing principle: begin with one clear picture, preserve context through every level, then turn what people discovered into accountable action.</p>
        </div>
      </section>

      <footer className="caseFooter"><p>All work shown is the property of Finout. The interactive walkthroughs began as Figma designs from my original product work and were reconstructed in code for this portfolio, with information abstracted, anonymized and adapted for presentation.</p></footer>
      <ContactFooter />
    </main>
  );
}
