import Image from "next/image";
import { GridField } from "./GridField";
import { FloatingNav } from "./FloatingNav";
import { ScrollReveal } from "./ScrollReveal";
import { TearaStatus } from "./TearaStatus";
import { ContactFooter } from "./ContactFooter";

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
    description: "A monetization and entitlements platform connecting pricing, billing, and product access.",
    period: "2023 to 2026",
    href: "/stigg",
    badge: "stigg",
  },
  {
    company: "Finout",
    role: "Senior Product Designer",
    description: "A cloud-cost platform turning fragmented infrastructure data into understandable operational decisions.",
    period: "2022 to 2023",
    href: "/finout",
    badge: "finout",
  },
];

const building = [
  { name: "Teara", description: "A personal iOS app that turns travel bookings into one clear itinerary.", note: "Teara has a tiny team. There’s me, Jarvis on marketing, and Friday on R&D. The latter two happen to be AI agents. 🤖", href: "https://www.teara.io" },
  { name: "Mentoring", description: "Mentoring designers through the “Startup Designers” Israeli community", href: "https://adplist.org/mentors/guy-magen", badge: "mentoring" },
  { name: "Side quests", description: "Where I let curiosity take the lead. I build small tools for everyday problems, use AI and code to see how far an idea can go, and learn 3D printing through objects that rarely come out right the first time. Away from the screen, I’m usually searching for the next vinyl record, comic book, new artist, or cup of coffee worth getting excited about. 💻🎧☕🍔" },
];

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
        <p className="lede">12+ years designing complex B2B products where infrastructure, business rules and user <span className="noWrap">decisions meet.</span><br />Turning complexity into <span className="ahaWrap"><button className="ahaTerm" type="button" aria-describedby="aha-tooltip">A-ha!</button><span className="ahaTooltip" id="aha-tooltip" role="tooltip">That moment when the product clicks and everything makes sense.</span></span> moments.</p>
        <div className="heroActions">
          <button className="cvButton" type="button">Download my CV <span aria-hidden="true">↓</span></button>
        </div>
        <div className="status"><span className="availability"><i /> Based in Israel · Available for the right team</span></div>
      </section>

      <ScrollReveal><section className="windowSection" id="work">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>Complex products, made clear</span></div>
          <div className="windowBody rows">
            <div className="expertiseRow workExpertise" aria-label="Areas of expertise"><span>Complex B2B platforms</span><span>Agentic product experiences</span><span>Entitlements &amp; access</span><span>Data-heavy workflows</span><span>Design systems</span></div>
            {work.map((item) => item.href ? (
              <a className="row" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} key={item.company}>
                <div><strong>{item.company}</strong></div><div className="workDescription"><span>{item.role}</span><p>{item.description}</p></div><span className="period">{item.period}</span><span className="arrow">↗</span>
                {item.badge && <span className="projectBadgeTooltip" aria-hidden="true"><span className="companyBadgeCrop"><Image src={`/company-badges/${item.badge}.png`} width={540} height={440} alt="" /></span></span>}
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
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>What I’m building</span></div>
          <div className="windowBody">
            <p className="sectionCopy">A mix of products, people, and ideas I care about.</p>
            <div className="plainList">
              {building.map((item) => item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" key={item.name}>
                  <strong>{item.name}</strong><p>{item.description}{item.note && <span className="tearaTeamNote">{item.note}</span>}{item.name === "Teara" && <TearaStatus />}</p><span className="buildingArrow">↗</span>
                  {item.badge && <span className="projectBadgeTooltip buildingBadgeTooltip" aria-hidden="true"><span className="companyBadgeCrop"><Image src={`/company-badges/${item.badge}.png`} width={540} height={440} alt="" /></span></span>}
                </a>
              ) : (
                <div key={item.name}><strong>{item.name}</strong><p>{item.description}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal><section id="about">
        <div className="aboutGrid">
          <div className="aboutCopy">
            <p className="sectionLabel">A little about me</p>
            <p>I’ve been designing products for more than 12 years, often in complex B2B spaces where technical systems, data and business rules need to become clear decisions. Lately, I’ve also been using AI and code to take ideas beyond Figma and turn them into real, working products.</p>
          </div>
          <div className="toolsList">
            <span className="sectionLabel">Tools I reach for</span>
            <dl>
              <div><dt>Product design</dt><dd>Figma, Rive, Lottie</dd></div>
              <div><dt>AI / Dev</dt><dd>Xcode, VS Code, Super.Engineering, Codex / ChatGPT, Claude, Gemini</dd></div>
              <div><dt>3D</dt><dd>Blender, Spline</dd></div>
              <div><dt>Content</dt><dd>Obsidian, Notion</dd></div>
            </dl>
          </div>
        </div>
      </section></ScrollReveal>

      <ContactFooter />
    </main>
  );
}
