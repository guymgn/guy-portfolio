import Image from "next/image";
import { FloatingNav } from "../FloatingNav";
import { ContactFooter } from "../ContactFooter";
import { BackToTop } from "../BackToTop";
import { ResearchSequenceCanvas } from "./ResearchFlowCanvas";
import { MegaBillCanvas } from "./MegaBillCanvas";

const scope = [
  "Core product workflows",
  "Customer and stakeholder research",
  "Product marketing and visual assets",
  "Early design-system foundations and Storybook implementation",
];

function FinoutVisual({ slide, alt, caption, priority = false }: { slide: number; alt: string; caption?: string; priority?: boolean }) {
  return (
    <figure className="finoutVisual">
      <Image src={`/finout/slide-${slide}.png`} width={1200} height={675} alt={alt} priority={priority} sizes="(max-width: 900px) 100vw, 1200px" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export default function FinoutPage() {
  return (
    <main className="caseShell finoutTheme">
      <div className="finoutMobileBlock">
        <p className="sectionLabel">Finout case study</p>
        <h1>Go to desktop to view this case study</h1>
        <p>The case study uses detailed product visuals designed for a larger screen.</p>
        <a href="/">Back to portfolio</a>
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
          <p>The research connected an observed workflow breakdown to four recurring needs: visibility, alignment, efficiency and accuracy. Together, they reframed the opportunity from another dashboard to one investigation model.</p>
        </div>
        <ResearchSequenceCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">MegaBill</p><h2>One bill for every cloud, service and team</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">A useful overview had to preserve the path into the details without flattening every provider into a generic dashboard.</p>
          <p>MegaBill created one cross-provider starting point with flexible grouping and a consistent route from total spend to the resource behind a change.</p>
        </div>
        <MegaBillCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">Virtual Tags</p><h2>Cost allocation without waiting for engineering</h2></div>
        <div className="caseStory">
          <article><small>The constraint</small><p>Native cloud tags were patchy, inconsistently maintained and difficult to apply retroactively.</p></article>
          <article><small>The insight</small><p>Ownership broke down when every correction depended on engineering or spreadsheets.</p></article>
          <article><small>The direction</small><p>Use familiar rule logic to classify spend from metadata that already existed.</p></article>
        </div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The design moved cost classification from an infrastructure task to a self-serve product workflow.</p>
          <p>Simple “where/then” rules let FinOps teams translate provider metadata into business dimensions such as team, product, environment or customer.</p>
        </div>
        <div className="finoutVisualStack">
          <FinoutVisual slide={19} alt="Untagged cloud costs creating gaps in spend ownership" />
          <FinoutVisual slide={21} alt="Competitor analysis that informed a no-code approach to cloud cost allocation" />
        </div>
        <div className="finoutDemoSlot" aria-label="Planned Virtual Tags interactive reconstruction">
          <div><small>Interactive reconstruction</small><h3>Virtual Tags rule builder</h3><p>Originally designed in Figma. This portfolio recreation will focus on rule priority, matching feedback and allocation coverage.</p></div>
          <ol><li><span>01</span>Find unallocated cost</li><li><span>02</span>Define where</li><li><span>03</span>Assign a value</li><li><span>04</span>Preview coverage</li></ol>
        </div>
      </section>

      <section className="caseChapter finoutReflection">
        <div className="caseChapterHead"><p className="sectionLabel">Reflection</p><h2>Complex B2B tools become useful when different experts can reason together</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The strongest design decisions did more than simplify an interface. They created a shared language for cost.</p>
          <p>MegaBill connected overview to investigation; Virtual Tags connected that investigation to ownership. Together, they turned fragmented infrastructure data into a workflow finance, engineering and FinOps could reason through together.</p>
        </div>
      </section>

      <footer className="caseFooter"><p>All work shown is the property of Finout. Information is publicly documented, abstracted or anonymized and is included for portfolio purposes only.</p></footer>
      <ContactFooter />
    </main>
  );
}
