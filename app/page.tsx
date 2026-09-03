import { LocalTime } from "./LocalTime";
import { GridField } from "./GridField";
import { FloatingNav } from "./FloatingNav";
import { ScrollReveal } from "./ScrollReveal";
import { TearaStatus } from "./TearaStatus";

const work = [
  {
    company: "Consultant",
    role: "Product Designer & Builder",
    description: "Partnering with early-stage startups across product strategy, design, and building.",
    period: "2026 to present",
  },
  {
    company: "Stigg",
    role: "Product Designer",
    description: "Pricing, packaging and entitlements for modern SaaS teams.",
    period: "2023 to 2026",
    href: "/stigg",
  },
  {
    company: "Finout",
    role: "Senior Product Designer",
    description: "Cloud cost management made clearer and easier to act on.",
    period: "2022 to 2023",
    href: "/finout",
  },
];

const building = [
  { name: "Teara", description: "A personal iOS app that turns travel bookings into one clear itinerary.", note: "Teara has a tiny team. There’s me, Jarvis on marketing, and Friday on R&D. The latter two happen to be AI agents. 🤖", href: "https://www.teara.io" },
  { name: "Mentoring", description: "Mentoring designers through the “Startup Designers” Israeli community", href: "https://adplist.org/mentors/guy-magen" },
  { name: "Side quests", description: "Where I let curiosity take the lead. I build small tools for everyday problems, use AI and code to see how far an idea can go, and learn 3D printing through objects that rarely come out right the first time. Away from the screen, I’m usually searching for the next vinyl record, comic book, new artist, or cup of coffee worth getting excited about. 💻🎧☕🍔" },
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
            <span className="heroLetter" aria-hidden="true"><b style={{ animationDelay: "-0.0s" }}>G</b></span>
            <span className="heroLetter" aria-hidden="true"><b style={{ animationDelay: "-0.5s" }}>u</b></span>
            <span className="heroLetter" aria-hidden="true"><b style={{ animationDelay: "-1.0s" }}>y</b></span>
            <i aria-hidden="true" />
            <span className="heroLetter" aria-hidden="true"><b style={{ animationDelay: "-1.5s" }}>M</b></span>
            <span className="heroLetter" aria-hidden="true"><b style={{ animationDelay: "-2.0s" }}>a</b></span>
            <span className="heroLetter" aria-hidden="true"><b style={{ animationDelay: "-2.5s" }}>g</b></span>
            <span className="heroLetter" aria-hidden="true"><b style={{ animationDelay: "-3.0s" }}>e</b></span>
            <span className="heroLetter" aria-hidden="true"><b style={{ animationDelay: "-3.5s" }}>n</b></span>
          </h1>
          <p className="role">Senior Product Designer &amp; Builder</p>
        </div>
        <p className="lede">12+ years of turning complex systems<br />and mobile apps into <span className="ahaWrap"><button className="ahaTerm" type="button" aria-describedby="aha-tooltip">A-ha!</button><span className="ahaTooltip" id="aha-tooltip" role="tooltip">That moment when the product clicks and everything makes sense.</span></span> moments</p>
        <div className="heroActions">
          <button className="cvButton" type="button">Download my CV <span aria-hidden="true">↓</span></button>
        </div>
        <div className="status"><span className="availability"><i /> Based in Israel · Available for the right team</span></div>
      </section>

      <ScrollReveal><section className="windowSection" id="work">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>Selected work</span><small>3 entries</small></div>
          <div className="windowBody rows">
            {work.map((item) => item.href ? (
              <a className="row" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} key={item.company}>
                <div><strong>{item.company}</strong></div><div className="workDescription"><span>{item.role}</span><p>{item.description}</p></div><span className="period">{item.period}</span><span className="arrow">↗</span>
              </a>
            ) : (
              <div className="row rowStatic" key={item.company}>
                <div><strong>{item.company}</strong></div><div className="workDescription"><span>{item.role}</span><p>{item.description}</p></div><span className="period">{item.period}</span>
              </div>
            ))}
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal><section className="windowSection" id="building">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>What I’m building</span><small>Updated recently</small></div>
          <div className="windowBody">
            <p className="sectionCopy">A mix of products, people, and ideas I care about.</p>
            <div className="plainList">
              {building.map((item) => item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" key={item.name}>
                  <strong>{item.name}</strong><p>{item.description}{item.note && <span className="tearaTeamNote">{item.note}</span>}{item.name === "Teara" && <TearaStatus />}</p><span className="buildingArrow">↗</span>
                </a>
              ) : (
                <div key={item.name}><strong>{item.name}</strong><p>{item.description}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal><section id="about">
        <p className="sectionLabel">A little about me</p>
        <div className="aboutGrid">
          <p>For the past 12+ years, I’ve designed SaaS platforms, AI tools, and mobile apps. I’m drawn to complex systems and enjoy turning them into products that feel clear, useful, and easy to understand. These days, I also use AI and code to move beyond prototypes and build working products myself.</p>
          <div className="toolsList">
            <span>Tools I reach for</span>
            <dl>
              <div><dt>Product design</dt><dd>Figma, Rive, Lottie</dd></div>
              <div><dt>AI / Dev</dt><dd>Xcode, VS Code, Super.Engineering, Codex / ChatGPT, Claude, Gemini</dd></div>
              <div><dt>3D</dt><dd>Blender, Spline</dd></div>
              <div><dt>Content</dt><dd>Obsidian, Notion</dd></div>
            </dl>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal><footer className="contactFooter" id="contact">
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
      </footer></ScrollReveal>
    </main>
  );
}
