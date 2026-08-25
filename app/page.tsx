import { ThemeToggle } from "./ThemeToggle";
import { LocalTime } from "./LocalTime";
import { GridField } from "./GridField";

const work = [
  {
    company: "Stigg",
    role: "Lead Product Designer",
    description: "Pricing, packaging and entitlements for modern SaaS teams.",
    period: "2023 to 2026",
  },
  {
    company: "Finout",
    role: "Senior Product Designer",
    description: "Cloud cost management made clearer and easier to act on.",
    period: "2022 to 2023",
  },
];

export default function Home() {
  return (
    <main className="siteShell">
      <nav>
        <a className="home" href="#top">Guy Magen</a>
        <div className="navLinks"><a href="#work">work</a><a href="#building">building</a><a href="#about">about</a></div>
        <div className="navActions"><ThemeToggle /><a href="mailto:hi@guymagen.com">contact</a></div>
      </nav>

      <section className="intro" id="top">
        <GridField />
        <p className="sectionLabel">Hey there, I’m</p>
        <div>
          <h1>Guy Magen</h1>
          <p className="role">Senior Product Designer &amp; Builder</p>
        </div>
        <p className="lede">12+ years of turning complex systems and mobile apps into A-ha! moments</p>
        <div className="status"><span><i /> Based in Israel</span><span>Available for the right team</span></div>
      </section>

      <section className="windowSection" id="work">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>Selected work</span><small>2 projects</small></div>
          <div className="windowBody rows">
            {work.map((item) => (
              <a className="row" href="https://www.figma.com/deck/Uv4ebbkIVfmdblK58TaueW" target="_blank" rel="noreferrer" key={item.company}>
                <div><strong>{item.company}</strong><span>{item.role}</span></div>
                <p>{item.description}</p>
                <span className="period">{item.period}</span>
                <span className="arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="windowSection" id="building">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>Building Teara</span><small>Personal iOS project</small></div>
          <div className="tearaIntro">
            <div className="tearaCopy">
              <span className="tearaEyebrow">Teara · The path</span>
              <h2>Every trip,<br />one path.</h2>
              <p>Teara turns scattered travel bookings into one clear itinerary. Forward a confirmation and it finds the right trip, parsed privately on your iPhone.</p>
              <small>A personal project, currently in progress.</small>
            </div>
          </div>
        </div>
      </section>

      <section id="about">
        <p className="sectionLabel">A little about me</p>
        <div className="aboutGrid">
          <p>I like messy problems, thoughtful products and people who care about their craft. Outside of product work, I mentor designers, experiment with new tools and keep finding reasons to make things.</p>
          <div><span>Good at</span><p>Product strategy<br />Systems thinking<br />Interaction design<br />Prototyping<br />Design systems</p></div>
          <div><span>Also into</span><p>AI tools<br />Motion<br />3D<br />Front-end<br />Good coffee</p></div>
        </div>
      </section>

      <section className="contact">
        <p className="sectionLabel">Let’s talk</p>
        <h2>Have an interesting problem?</h2>
        <p>Tell me about it.</p>
        <div className="contactLinks"><a href="mailto:hi@guymagen.com">email ↗</a><a href="https://www.linkedin.com/in/guymagen/" target="_blank" rel="noreferrer">linkedin ↗</a><a href="https://github.com/guymgn" target="_blank" rel="noreferrer">github ↗</a></div>
      </section>

      <footer>
        <div className="footerIdentity"><strong>Guy Magen</strong><span>Senior Product Designer &amp; Builder</span></div>
        <p className="madeIn">Made with ❤️ in Israel</p>
        <LocalTime />
      </footer>
    </main>
  );
}
