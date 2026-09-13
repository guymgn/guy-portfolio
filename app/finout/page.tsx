import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MonitorSmartphone } from "lucide-react";
import { FloatingNav } from "../FloatingNav";
import { ContactFooter } from "../ContactFooter";
import { BackToTop } from "../BackToTop";
import { ResearchSequenceCanvas } from "./ResearchFlowCanvas";
import { MegaBillCanvas } from "./MegaBillCanvas";
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
          <div className="caseMetaBadge"><dt className="srOnly">Role</dt><dd><span className="companyBadgeCrop"><Image src="/company-badges/finout.png" width={540} height={440} alt="Senior Product Designer at Finout" /></span></dd></div>
          <div className="caseMetaFocus"><dt>Focus</dt><dd>Product design, UX research, visual design</dd></div>
          <div className="caseMetaScope"><dt>Design scope</dt><dd>{scope.map((item) => <span key={item}>{item}</span>)}</dd></div>
        </dl>
      </header>

      <section className="caseChapter caseChapterInternalEnd">
        <div className="caseChapterHead"><p className="sectionLabel">Research and framing</p><h2>The problem was not a lack of data. It was the work required to understand it.</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Teams moved between provider dashboards, exports and spreadsheets before they could answer a basic cost question.</p>
          <p>I mapped that fragmented workflow and connected it to four recurring needs: visibility, alignment, efficiency and accuracy. That reframed the opportunity from another dashboard into one investigation model, with two connected jobs: understand the spend, then establish who owns it.</p>
        </div>
        <ResearchSequenceCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">MegaBill</p><h2>One bill for every cloud, service and team</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">A useful overview had to preserve the path into the details without flattening every provider into a generic dashboard.</p>
          <p>I designed MegaBill as the first half of that model: one cross-provider starting point with flexible grouping and a consistent route from total spend to the resource behind a change.</p>
        </div>
        <MegaBillCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Virtual Tags</p><h2>Turning untagged cost into accountable spend</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">MegaBill made spend visible, but incomplete provider metadata still prevented teams from understanding ownership.</p>
          <p>My work on Virtual Tags began by turning existing metadata into business dimensions such as product, environment and owner. I shaped an ordered rule model for matched and unmatched costs, then extended it through Split Cost so shared costs could be distributed without making the allocation harder to understand or validate.</p>
        </div>
        <VirtualTagsCanvas />
      </section>

      <section className="caseChapter caseChapterInternalEnd finoutImpact">
        <div className="caseChapterHead"><p className="sectionLabel">What the system enables</p><h2>One path from fragmented cost data to accountable spend</h2></div>
        <div className="caseStory">
          <article><small>See the whole picture</small><p>FinOps, engineering and finance could begin with the same cross-provider view instead of reconciling separate dashboards and exports.</p></article>
          <article><small>Explain every number</small><p>Grouping, breadcrumbs and contextual details preserved the path from a change in spend to the resource behind it.</p></article>
          <article><small>Assign clear ownership</small><p>Virtual Tags let FinOps teams convert existing metadata into business context and define what should happen when that context was missing.</p></article>
        </div>
      </section>

      <section className="caseChapter finoutReflection">
        <div className="caseChapterHead"><p className="sectionLabel">Reflection</p><h2>Clarity came from preserving the path through the data</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Cloud cost data became useful when people could understand how a number was constructed and who was responsible for it.</p>
          <p>Across both workflows, I used progressive disclosure as the organizing principle: begin with one clear picture, preserve context through every level, then turn what people discovered into accountable action.</p>
        </div>
      </section>

      <footer className="caseFooter"><p>All work shown is the property of Finout. The interactive walkthroughs began as Figma designs from my original product work and were reconstructed in code for this portfolio, with information abstracted, anonymized and adapted for presentation.</p></footer>
      <ContactFooter />
    </main>
  );
}
