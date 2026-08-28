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

const building = [
  { name: "Teara", description: "A personal iOS app that turns travel bookings into one clear itinerary", href: "https://www.teara.io" },
  { name: "Mentoring", description: "Mentoring designers through the “Startup Designers” Israeli community", href: "https://adplist.org/mentors/guy-magen" },
  { name: "Side projects", description: "Building small tools for myself, learning 3D printing, and following ideas to see where they go. Always learning something new." },
];

export default function Home() {
  return (
    <main className="siteShell">
      <nav>
        <a className="home" href="#top" aria-label="Guy Magen, back to top">
          <span className="logoMark" aria-hidden="true"><span className="logoInitial">G</span><span className="logoWord">Guy</span></span>
        </a>
        <div className="navLinks"><a href="#work">work</a><a href="#building">building</a><a href="#about">about</a></div>
        <div className="navActions"><ThemeToggle /><a href="mailto:hi@guymagen.com">contact</a></div>
      </nav>

      <section className="intro" id="top">
        <GridField />
        <p className="sectionLabel">Hey there, I’m</p>
        <div>
          <h1 className="heroWordmark" aria-label="Guy Magen">
            <span aria-hidden="true" style={{ animationDelay: "-0.0s" }}>G</span>
            <span aria-hidden="true" style={{ animationDelay: "-0.5s" }}>u</span>
            <span aria-hidden="true" style={{ animationDelay: "-1.0s" }}>y</span>
            <i aria-hidden="true" />
            <span aria-hidden="true" style={{ animationDelay: "-1.5s" }}>M</span>
            <span aria-hidden="true" style={{ animationDelay: "-2.0s" }}>a</span>
            <span aria-hidden="true" style={{ animationDelay: "-2.5s" }}>g</span>
            <span aria-hidden="true" style={{ animationDelay: "-3.0s" }}>e</span>
            <span aria-hidden="true" style={{ animationDelay: "-3.5s" }}>n</span>
          </h1>
          <p className="role">Senior Product Designer &amp; Builder</p>
        </div>
        <p className="lede">12+ years of turning complex systems and mobile apps into A-ha! moments</p>
        <div className="status"><span><i /> Based in Israel</span><span>Available for the right team</span></div>
      </section>

      <section className="windowSection" id="work">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>Selected projects</span><small>2 projects</small></div>
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
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>What I’m building</span><small>Updated recently</small></div>
          <div className="windowBody">
            <p className="sectionCopy">A mix of products, people, and ideas I care about.</p>
            <div className="plainList">
              {building.map((item) => item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" key={item.name}>
                  <strong>{item.name}</strong><p>{item.description}</p><span className="buildingArrow">↗</span>
                </a>
              ) : (
                <div key={item.name}><strong>{item.name}</strong><p>{item.description}</p></div>
              ))}
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

      <footer className="contactFooter" id="contact">
        <div className="contactMain">
          <p className="sectionLabel">Let’s talk</p>
          <h2>Have an interesting problem?</h2>
          <p>Tell me about it.</p>
          <div className="contactLinks"><a href="mailto:hi@guymagen.com">email ↗</a><a href="https://www.linkedin.com/in/guymagen/" target="_blank" rel="noreferrer">linkedin ↗</a><a href="https://github.com/guymgn" target="_blank" rel="noreferrer">github ↗</a></div>
        </div>
        <div className="footerMeta">
          <div className="footerIdentity"><strong>Guy Magen</strong><span>Senior Product Designer &amp; Builder</span></div>
          <p className="madeIn">Made with ❤️ in Israel</p>
          <LocalTime />
        </div>
      </footer>
    </main>
  );
}
