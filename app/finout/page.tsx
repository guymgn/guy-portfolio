import { FloatingNav } from "../FloatingNav";
import { ContactFooter } from "../ContactFooter";

const highlights = [
  ["One shared view", "Brought AWS, GCP, Kubernetes, Snowflake and SaaS costs into one readable workspace."],
  ["Faster investigation", "Helped teams move from totals to accounts, services and individual resources without stitching spreadsheets."],
  ["Clearer ownership", "Connected spend to the teams, services and customers responsible for it."],
  ["A scalable foundation", "Built a Tailwind-based design system so product and engineering could move faster without losing consistency."],
];

function Placeholder({ label }: { label: string }) {
  return <div className="casePlaceholder"><span>{label}</span><small>Visual placeholder</small></div>;
}

export default function FinoutPage() {
  return (
    <main className="caseShell">
      <FloatingNav projectName="Finout" />

      <header className="caseHero">
        <p className="sectionLabel">Finout · 2022 to 2023</p>
        <h1>Turning cloud cost chaos into one clear picture</h1>
        <p className="caseDek">A cloud cost management platform that gives FinOps, engineering and finance teams a shared source of truth for spend.</p>
        <dl className="caseMeta">
          <div><dt>Role</dt><dd>Senior Product Designer</dd></div>
          <div><dt>Focus</dt><dd>Product design, UX research, design systems</dd></div>
          <div><dt>Platform</dt><dd>Web app</dd></div>
        </dl>
      </header>

      <section className="caseIntro caseTwoCol">
        <p className="sectionLabel">The work</p>
        <div>
          <h2>Making complicated billing data useful for real decisions</h2>
          <p>I led the design for cloud cost observability at scale. My work focused on MegaBill, which brought fragmented multi-cloud spend into one view, and Virtual Tagging, a no-code way to allocate costs without changing infrastructure.</p>
          <p>As the sole designer, I owned the product from discovery through final QA. I worked across technical telemetry and financial workflows, translating complex logic into tools that engineers and finance leaders could understand together.</p>
        </div>
      </section>

      <section className="caseHighlights">
        <p className="sectionLabel">What I focused on</p>
        <div className="highlightGrid">
          {highlights.map(([title, copy], index) => <article key={title}><small>0{index + 1}</small><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">01 · Understanding the problem</p><h2>Every provider told a different version of the same story</h2></div>
        <div className="caseStory">
          <article><small>Fragmented visibility</small><p>Each vendor had its own dashboard, terminology and format. Teams could see individual bills, but not the full picture.</p></article>
          <article><small>Manual reconciliation</small><p>FinOps and finance teams exported data and stitched spreadsheets together every week, creating delays and avoidable errors.</p></article>
          <article><small>Unclear ownership</small><p>Finance and engineering often worked from different numbers, making it difficult to understand what drove spend and who could act on it.</p></article>
        </div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Early conversations kept returning to four needs: visibility, alignment, efficiency and accuracy.</p>
          <p>Teams were using five or more dashboards to track spend. Simple questions took hours to answer, manual formulas broke easily, and reporting cycles slowed down planning. The opportunity was bigger than aggregation. The product needed to make cost data readable, trustworthy and ready for action.</p>
        </div>
        <Placeholder label="Research themes and customer signals" />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">02 · MegaBill</p><h2>One bill for every cloud, service and team</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The competitive audit showed that most tools solved only part of the problem.</p>
          <div><p>Some products unified vendors but stopped short of resource-level investigation. Others required heavy setup, lacked SaaS costs, or made ownership difficult to understand.</p><p>MegaBill combined a bill-like structure with a unified view across providers, daily cost visibility and flexible grouping. Teams could start with the big picture, then follow a cost all the way down to the resource behind it.</p></div>
        </div>
        <Placeholder label="MegaBill unified cost view" />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">03 · Investigation</p><h2>Moving from a surprising number to something a team can act on</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">A total is only useful if people can understand what changed and why.</p>
          <div><p>I designed the investigation flow to move naturally from totals to accounts, services and individual resources. Selecting a resource revealed what was driving the cost and where inefficiencies might be hiding.</p><p>The goal was not another reporting dashboard. It was a workspace where a cost question could become a concrete next step for finance, FinOps or engineering.</p></div>
        </div>
        <Placeholder label="Cost drill-down and resource investigation" />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">04 · Virtual Tagging</p><h2>Cost allocation without waiting for engineering</h2></div>
        <div className="caseStory">
          <article><small>The problem</small><p>Native cloud tags were patchy, inconsistent and difficult to apply retroactively. Untagged costs left FinOps teams without reliable ownership.</p></article>
          <article><small>The insight</small><p>Existing tools were either too heavy, too generic or not designed for the reality of cloud cost attribution.</p></article>
          <article><small>The direction</small><p>A familiar no-code rule builder could turn complex allocation into simple conditions that finance and FinOps teams could manage themselves.</p></article>
        </div>
        <Placeholder label="Virtual Tagging rule builder" />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">05 · One shared truth</p><h2>No code, full visibility</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Virtual Tags made every dollar easier to connect to an owner, service or customer.</p>
          <div><p>Teams could create rules across AWS, GCP, Kubernetes and other providers without touching infrastructure. The same tags could cascade into Cost Centers, so finance, engineering and FinOps all worked from the same definitions.</p><p>Questions that once required spreadsheet work and long Slack threads could be answered in minutes.</p></div>
        </div>
        <Placeholder label="Virtual Tags applied across cost centers" />
      </section>

      <footer className="caseFooter">
        <p>All work shown is the property of Finout. Information is publicly documented, abstracted or anonymized and is included for portfolio purposes only.</p>
        <a href="/">Back to portfolio ↑</a>
      </footer>
      <ContactFooter />
    </main>
  );
}
