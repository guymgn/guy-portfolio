import { LocalTime } from "./LocalTime";
import { GridField } from "./GridField";
import { FloatingNav } from "./FloatingNav";

const work = [
  {
    company: "Stigg",
    role: "Lead Product Designer",
    description: "Pricing, packaging and entitlements for modern SaaS teams.",
    period: "2023 to 2026",
    href: "/stigg",
  },
  {
    company: "Finout",
    role: "Senior Product Designer",
    description: "Cloud cost management made clearer and easier to act on.",
    period: "2022 to 2023",
    href: "https://www.figma.com/slides/Uv4ebbkIVfmdblK58TaueW",
  },
];

const building = [
  { name: "Teara", description: "A personal iOS app that turns travel bookings into one clear itinerary", href: "https://www.teara.io" },
  { name: "Mentoring", description: "Mentoring designers through the “Startup Designers” Israeli community", href: "https://adplist.org/mentors/guy-magen" },
  { name: "Side projects", description: "Building small tools for myself, learning 3D printing, and following ideas to see where they go. Always learning something new." },
];

const contactTitle = "Let’s build together!";

export default function Home() {
  return (
    <main className="siteShell">
      <FloatingNav />

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
        <div className="status"><span className="availability"><i /> Based in Israel · Available for the right team</span></div>
      </section>

      <section className="windowSection" id="work">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>Selected projects</span><small>2 projects</small></div>
          <div className="windowBody rows">
            {work.map((item) => (
              <a className="row" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} key={item.company}>
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
          <p>For the past 12+ years, I’ve designed SaaS platforms, AI tools, and mobile apps. I’m drawn to complex systems and enjoy turning them into products that feel clear, useful, and easy to understand. These days, I also use AI and code to move beyond prototypes and build working products myself.</p>
          <div className="toolsList">
            <span>Tools I reach for</span>
            <dl>
              <div><dt>Product design</dt><dd>Figma, Rive, Lottie</dd></div>
              <div><dt>AI / Dev</dt><dd>Xcode, VS Code, Codex / ChatGPT, Claude, Gemini</dd></div>
              <div><dt>3D</dt><dd>Blender, Spline</dd></div>
              <div><dt>Content</dt><dd>Obsidian, Notion</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <footer className="contactFooter" id="contact">
        <div className="contactMain">
          <h2 className="contactWordmark" aria-label={contactTitle}>
            {contactTitle.split(" ").map((word, wordIndex) => (
              <span className="contactWord" aria-hidden="true" key={word}>
                {word.split("").map((letter, letterIndex) => (
                  <span className="contactLetter" key={`${letter}-${letterIndex}`} style={{ animationDelay: `-${(wordIndex * 0.7 + letterIndex * 0.22).toFixed(2)}s` }}>{letter}</span>
                ))}
              </span>
            ))}
          </h2>
          <div className="contactLinks"><a href="mailto:hi@guymagen.com">email ↗</a><a href="https://wa.me/972547734245" target="_blank" rel="noreferrer">whatsapp ↗</a><a href="https://www.linkedin.com/in/guymagen/" target="_blank" rel="noreferrer">linkedin ↗</a><a href="https://github.com/guymgn" target="_blank" rel="noreferrer">github ↗</a></div>
        </div>
        <div className="footerMeta">
          <LocalTime />
          <p className="madeIn">Made with ❤️ in Israel</p>
        </div>
      </footer>
    </main>
  );
}
