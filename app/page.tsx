import { ThemeToggle } from "./ThemeToggle";
import { DotField } from "./DotField";
import { LocalTime } from "./LocalTime";

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
  ["Teara", "A thoughtful companion for better conversations"],
  ["Experiments", "Small tools built with AI, code, motion and 3D"],
  ["Mentoring", "Helping designers grow through Startup Designers"],
];

const toolGroups = [
  { label: "Product design", tools: [["Figma", "/tools/figma.svg"], ["Rive", "/tools/rive.svg"], ["Lottie", "/tools/lottie.svg"]] },
  { label: "AI / Dev", tools: [["Webflow", "/tools/webflow.svg"], ["ChatGPT", "/tools/chatgpt.svg"], ["v0", "/tools/v0.svg"], ["Cursor", "/tools/cursor.svg"]] },
  { label: "3D", tools: [["Spline", "/tools/spline.png"]] },
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
        <DotField />
        <p className="sectionLabel">Hello, I’m Guy</p>
        <div className="identity">
          <div className="profilePicture">
            <img src="/profile-art.svg" alt="Illustrated portrait of Guy Magen" />
          </div>
          <div>
            <h1>Guy Magen</h1>
            <p className="role">Senior Product Designer &amp; Builder</p>
          </div>
        </div>
        <p className="lede">I design complex products and build ideas into things people can actually use.</p>
        <p className="bio">For the past 12+ years, I’ve worked with technical teams to make complicated systems feel clear. I care about the whole thing, from understanding the problem to shaping the details and building a working version.</p>
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

      <section className="windowSection" id="tools">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>Tools I use</span><small>A small, changing stack</small></div>
          <div className="toolStrip">
            {toolGroups.map((group) => (
              <div className="toolGroup" key={group.label}>
                <div className="toolGroupLabel"><i /><span>{group.label}</span><i /></div>
                <div className="toolIcons">
                  {group.tools.map(([name, src]) => (
                    <div className="toolIcon" key={name} title={name}><img src={src} alt={name} /></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="windowSection" id="building">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>What I’m building</span><small>Updated recently</small></div>
          <div className="windowBody">
            <p className="sectionCopy">I’m happiest when an idea becomes tangible. Lately, I’ve been using Claude and Codex to turn product ideas into working software, not just prototypes.</p>
            <div className="plainList">
              {building.map(([name, description], index) => (
                <div key={name}><span>0{index + 1}</span><strong>{name}</strong><p>{description}</p></div>
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
