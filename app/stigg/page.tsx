import { ThemeToggle } from "../ThemeToggle";

const highlights = [
  ["0 to 1 design system", "Built the design system from scratch to improve consistency and development speed."],
  ["Impact at scale", "Defined the feature roadmap for high-growth customers and owned design-to-spec accuracy."],
  ["Technical alignment", "Worked closely with engineering to make complex backend pricing logic feasible and understandable."],
  ["Platform evolution", "Helped scale the platform from fundamental entitlements to more advanced workflows."],
];

function Placeholder({ label }: { label: string }) {
  return <div className="casePlaceholder"><span>{label}</span><small>Visual placeholder</small></div>;
}

export default function StiggPage() {
  return (
    <main className="caseShell">
      <nav className="caseNav">
        <a className="caseBack" href="/">← Back</a>
        <span className="caseBreadcrumb"><a href="/">Guy Magen</a><i>/</i><strong>Stigg</strong></span>
        <ThemeToggle />
      </nav>

      <header className="caseHero">
        <p className="sectionLabel">Stigg · 2023 to 2026</p>
        <h1>Designing the model behind modern SaaS pricing</h1>
        <p className="caseDek">A monetization and entitlements platform that helps SaaS companies manage pricing, packaging and customer access with flexibility and scale.</p>
        <dl className="caseMeta">
          <div><dt>Role</dt><dd>Lead Product Designer</dd></div>
          <div><dt>Focus</dt><dd>Product design, UX research, systems</dd></div>
          <div><dt>Platform</dt><dd>Web app</dd></div>
        </dl>
      </header>

      <section className="caseIntro caseTwoCol">
        <p className="sectionLabel">The work</p>
        <div>
          <h2>From access rules to what customers actually see</h2>
          <p>This case study follows one part of my work at Stigg. It starts with the platform’s core access model, moves through reusable Feature Groups built for scale, and ends with the embeddable widgets where that model becomes a customer-facing experience.</p>
          <p>I joined as a freelance product designer in March 2023 and quickly took ownership of the product design function. I later moved into a full-time role, owning the end-to-end product design strategy.</p>
        </div>
      </section>

      <section className="caseHighlights">
        <p className="sectionLabel">My journey at Stigg</p>
        <div className="highlightGrid">
          {highlights.map(([title, copy], index) => <article key={title}><small>0{index + 1}</small><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">01 · Modeling access</p><h2>Entitlements are enforced. Features organize them.</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">One of the fundamental challenges was defining how access actually works.</p>
          <div><p>I designed a structure where Features describe a capability and Entitlements define its rules. This gave teams a clearer way to control who gets what, when and why across pricing and packaging.</p><p>Different capabilities needed different rule types, including boolean access, metered usage, numeric limits and configuration values.</p></div>
        </div>
        <Placeholder label="Entitlement model and examples" />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">02 · Creating features</p><h2>A setup that adapts to the feature, not the other way around</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Metered, boolean and list-based features each need their own settings.</p>
          <p>The creation flow reveals only what is relevant to the selected feature type. That keeps a technical model manageable without hiding the decisions teams need to make.</p>
        </div>
        <Placeholder label="Feature creation flow" />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">03 · Scaling the model</p><h2>Feature Groups turned repeated setup into reusable infrastructure</h2></div>
        <div className="caseStory">
          <article><small>The problem</small><p>Sales needed flexible custom plans to close enterprise deals, while R&amp;D was dealing with growing duplication. Without abstraction, teams could end up recreating more than 100 features for each customer.</p></article>
          <article><small>The response</small><p>I led discovery across Sales and Engineering, mapped where the model was drifting, and helped shape Feature Groups as a reusable layer for bundling complex entitlement logic.</p></article>
          <article><small>The outcome</small><p>Teams could reuse shared configurations across plans and add-ons. Guardrails made global changes safer and more predictable for large customers.</p></article>
        </div>
        <Placeholder label="Feature Groups before and after" />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">04 · Where the model meets the user</p><h2>Turning entitlement configuration into on-brand widgets</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">The model only matters when it becomes a clear experience for the end user.</p>
          <div><p>I designed the no-code editor behind Stigg’s embeddable widget library, including pricing tables, checkout and customer portals.</p><p>Plans, features and add-ons flow directly from the entitlement configuration, so the interface stays aligned with what is actually enforced. Style and code modes let teams customize the result, while a live preview shows exactly what users will see.</p></div>
        </div>
        <Placeholder label="Widget editor and live preview" />
      </section>

      <footer className="caseFooter">
        <p>All work shown is the property of Stigg. Information is publicly documented, abstracted or anonymized and is included for portfolio purposes only.</p>
        <a href="/">Back to portfolio ↑</a>
      </footer>
    </main>
  );
}
