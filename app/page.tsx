import Image from "next/image";
import { GridField } from "./GridField";
import { FloatingNav } from "./FloatingNav";
import { ScrollReveal } from "./ScrollReveal";
import { TearaStatus } from "./TearaStatus";
import { ContactFooter } from "./ContactFooter";
import { PortfolioAgent } from "./PortfolioAgent";

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
    tooltip: "stigg-v2",
  },
  {
    company: "Finout",
    role: "Senior Product Designer",
    description: "A cloud-cost platform turning fragmented infrastructure data into understandable operational decisions.",
    period: "2022 to 2023",
    href: "/finout",
    tooltip: "finout-v2",
  },
];

const building = [
  { name: "Teara", description: "Turn scattered bookings and travel plans to a clear day-by-day itinerary.", note: "Organize every reservation and plan as a Trip block, so the details stay easy to review and find.", team: "Teara has a tiny team: me, Jarvis on marketing, and Friday on R&D. The latter two are AI agents. 🤖", href: "https://www.teara.io", tooltip: "teara-v2" },
  { name: "Mentoring", description: "Mentoring designers through the “Startup Designers” Israeli community", href: "https://adplist.org/mentors/guy-magen", tooltip: "startup-designers-v2" },
  { name: "Side quests", description: "Vinyl records, comic books, new artists, ambitious coffee stops, a growing collection of imperfect 3D prints, and planning the next trip overseas. 🎧📚☕🍔" },
];

export default function Home() {
  return (
    <main className="siteShell">
      <FloatingNav />

      <section className="intro" id="top">
        <GridField />
        <p className="sectionLabel">Hey there, I’m</p>
        <div className="heroIdentity">
          <Image className="heroPortrait heroPortraitLight" src="/guymagen.svg" width={58} height={58} alt="" aria-hidden="true" priority />
          <Image className="heroPortrait heroPortraitDark" src="/guymagen-dark.svg" width={58} height={58} alt="" aria-hidden="true" priority />
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
        <p className="lede">12+ years designing complex B2B products where<br className="desktopHeroBreak" /> <span className="heroConstraintLine">infrastructure, business rules and user decisions meet.</span><br />Turning complexity into <span className="ahaWrap"><button className="ahaTerm" type="button" aria-describedby="aha-tooltip" data-analytics-event="A-ha Tooltip Opened">A-ha!</button><span className="ahaTooltip" id="aha-tooltip" role="tooltip">That moment when the product clicks and everything makes sense.</span></span> moments.</p>
        <a className="cvButton mobileCvButton" href="/Guy-Magen-CV.pdf" download data-analytics-event="CV Downloaded" data-analytics-source="mobile hero">Download my CV <span aria-hidden="true">↓</span></a>
        <PortfolioAgent />
      </section>

      <ScrollReveal earliestReveal={1450}><section className="windowSection" id="work">
        <div className="browserWindow">
          <div className="windowBar"><div className="windowDots" aria-hidden="true"><i /><i /><i /></div><span>Complex products, made clear</span></div>
          <div className="windowBody rows">
            <div className="expertiseRow workExpertise" aria-label="Areas of expertise"><span>Complex B2B platforms</span><span>Agentic product experiences</span><span>Entitlements &amp; access</span><span>Data-heavy workflows</span><span>Design systems</span></div>
            {work.map((item) => item.href ? (
              <a className="row" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} data-analytics-event="Project Opened" data-analytics-project={item.company} key={item.company}>
                <div><strong>{item.company}</strong></div><div className="workDescription"><span>{item.role}</span><p>{item.description}</p></div><span className="period">{item.period}</span><span className="arrow">↗</span>
                {item.tooltip && <span className="projectBadgeTooltip" aria-hidden="true"><Image src={`/tooltip-images/${item.tooltip}.png`} width={540} height={440} alt="" /></span>}
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
                <a href={item.href} target="_blank" rel="noreferrer" key={item.name} data-analytics-event="External Project Opened" data-analytics-project={item.name} data-analytics-section="building" data-analytics-destination={item.href}>
                  <strong>{item.name}</strong><p>{item.description}{item.note && <span className="tearaTeamNote">{item.note}</span>}{item.team && <span className="tearaTeamNote">{item.team}</span>}{item.name === "Teara" && <TearaStatus />}</p><span className="buildingArrow">↗</span>
                  {item.tooltip && <span className="projectBadgeTooltip buildingBadgeTooltip" aria-hidden="true"><Image src={`/tooltip-images/${item.tooltip}.png`} width={540} height={440} alt="" /></span>}
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
              <div><dt>Product design</dt><dd>Figma, Sketch</dd></div>
              <div><dt>AI / Dev</dt><dd>ChatGPT + Codex, Claude + Code, Xcode, Super.Engineering</dd></div>
              <div><dt>Content &amp; code management</dt><dd>Notion, GitHub, Netlify</dd></div>
            </dl>
          </div>
        </div>
      </section></ScrollReveal>

      <ContactFooter />
    </main>
  );
}
