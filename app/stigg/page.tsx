import { FloatingNav } from "../FloatingNav";
import { ContactFooter } from "../ContactFooter";
import { BackToTop } from "../BackToTop";
import { ModelingAccessCanvas } from "./ModelingAccessCanvas";
import { CreateFeatureCanvas } from "./CreateFeatureCanvas";
import { FeatureGroupCanvas } from "./FeatureGroupCanvas";

function VisualPlaceholder({ title, description }: { title: string; description: string }) {
  return <div className="casePlaceholder"><small>Visual to build</small><span>{title}</span><p>{description}</p></div>;
}

export default function StiggPage() {
  return (
    <main className="caseShell stiggTheme">
      <FloatingNav projectName="Stigg" />
      <BackToTop />

      <header className="caseHero">
        <p className="sectionLabel">Stigg · 2023 to 2026</p>
        <h1>Designing the model behind modern SaaS pricing</h1>
        <p className="caseDek">A monetization and entitlements platform that helps SaaS companies manage pricing, packaging and customer access with flexibility and scale.</p>
        <dl className="caseMeta">
          <div><dt>Role</dt><dd>Product Designer</dd></div>
          <div><dt>Focus</dt><dd>Product design, UX research, systems</dd></div>
          <div><dt>Platform</dt><dd>Web app</dd></div>
        </dl>
      </header>

      <section className="caseIntro caseTwoCol">
        <p className="sectionLabel">The work</p>
        <div>
          <h2>From access rules to what customers actually see</h2>
          <p>This case study follows one part of my work at Stigg. It starts with the platform’s core access model, moves through reusable Feature Groups built for scale, and ends with the embeddable widgets where that model becomes a customer-facing experience.</p>
          <p>The story starts with the platform’s basic access model, moves into reusable Feature Groups built to manage scale, and ends with the embeddable widgets where that model becomes something customers’ users can actually see.</p>
        </div>
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">01 · The ecosystem</p><h2>A product model that connects to the rest of the business</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Stigg sits between the product, its billing stack, and the systems teams already use.</p>
          <p>Integrations with billing providers, CRMs and marketplaces make the pricing model operational. The platform needs to keep product access aligned as customer and subscription data moves across those systems.</p>
        </div>
        <VisualPlaceholder title="The Stigg ecosystem" description="A visual map showing how Stigg connects product access with billing, CRM and marketplace tools." />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">02 · Modeling access</p><h2>Entitlements are enforced. Features organize them.</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">One of the fundamental challenges was defining how access actually works.</p>
          <div><p>I designed a structure where Features describe a capability and Entitlements define its rules. This gave teams a clearer way to control who gets what, when and why across pricing and packaging.</p><p>Different capabilities needed different rule types, including boolean access, metered usage, numeric limits and configuration values.</p></div>
        </div>
        <ModelingAccessCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">03 · Creating and configuring features</p><h2>A setup that adapts to every entitlement type</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Access is not always a simple on or off decision.</p>
          <p>Boolean, configuration and metered features each require different rules. The creation flow reveals only what is relevant to the selected type, keeping the technical model manageable while making each configuration decision clear.</p>
        </div>
        <CreateFeatureCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">04 · Feature Groups</p><h2>Turning repeated configuration into something reusable</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">As product catalogs grow, the same entitlement patterns start appearing across plans and add-ons.</p>
          <p>Feature Groups introduced a reusable layer: define the group and its features once, then apply it across plans. Each tier can still set its own entitlement values, such as a different support level or monthly bandwidth allowance.</p>
        </div>
        <FeatureGroupCanvas />
      </section>

      <section className="caseChapter">
        <div className="caseChapterHead"><p className="sectionLabel">05 · Widgets</p><h2>Where the model meets the user</h2></div>
        <div className="caseTwoCol caseCopy">
          <p className="caseLead">Stigg turns a team’s entitlement model into embeddable, on-brand widgets.</p>
          <div><p>I designed the no-code editor behind that surface layer, including pricing tables, checkout, customer portals and other widgets.</p><p>Plans, features and add-ons flow directly from the entitlement configuration. Style and code modes support customization, while the live preview lets teams see what their users will see before publishing.</p></div>
        </div>
        <VisualPlaceholder title="Widget editor" description="A living no-code editor where styling changes update an embeddable pricing table in real time." />
      </section>

      <footer className="caseFooter">
        <p>All work shown is the property of Stigg. Information is publicly documented, abstracted or anonymized and is included for portfolio purposes only.</p>
      </footer>
      <ContactFooter />
    </main>
  );
}
