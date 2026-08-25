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

export default function Home() {
  return (
    <main className="siteShell">
      <nav>
        <a className="home" href="#top">~/guymagen</a>
        <div><a href="#work">work</a><a href="#building">building</a><a href="#about">about</a></div>
        <a href="mailto:hi@guymagen.com">contact</a>
      </nav>

      <section className="intro" id="top">
        <p className="command">$ whoami</p>
        <div className="identity">
          <div className="portrait" aria-hidden="true">
            <span>┌────────┐</span><span>│ GM / 08│</span><span>│ DESIGN │</span><span>│ + BUILD│</span><span>└────────┘</span>
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

      <section id="work">
        <p className="command">$ ls selected-work/</p>
        <div className="rows">
          {work.map((item) => (
            <a className="row" href="https://www.figma.com/deck/Uv4ebbkIVfmdblK58TaueW" target="_blank" rel="noreferrer" key={item.company}>
              <div><strong>{item.company}</strong><span>{item.role}</span></div>
              <p>{item.description}</p>
              <span className="period">{item.period}</span>
              <span className="arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section id="building">
        <p className="command">$ cat what-i-build.txt</p>
        <p className="sectionCopy">I’m happiest when an idea becomes tangible. That might be a coded prototype, a motion study, a tiny product or a new way to explain how something works.</p>
        <div className="plainList">
          {building.map(([name, description], index) => (
            <div key={name}><span>0{index + 1}</span><strong>{name}</strong><p>{description}</p></div>
          ))}
        </div>
      </section>

      <section id="about">
        <p className="command">$ cat about.txt</p>
        <div className="aboutGrid">
          <p>I like messy problems, thoughtful products and people who care about their craft. Outside of product work, I mentor designers, experiment with new tools and keep finding reasons to make things.</p>
          <div><span>Good at</span><p>Product strategy<br />Systems thinking<br />Interaction design<br />Prototyping<br />Design systems</p></div>
          <div><span>Also into</span><p>AI tools<br />Motion<br />3D<br />Front-end<br />Good coffee</p></div>
        </div>
      </section>

      <section className="contact">
        <p className="command">$ open contact</p>
        <h2>Have an interesting problem?</h2>
        <p>Tell me about it.</p>
        <div className="contactLinks"><a href="mailto:hi@guymagen.com">email ↗</a><a href="https://www.linkedin.com/in/guymagen/" target="_blank" rel="noreferrer">linkedin ↗</a><a href="https://github.com/guymgn" target="_blank" rel="noreferrer">github ↗</a></div>
      </section>

      <footer><span>[guy]</span><span>senior product designer &amp; builder</span><span>2026</span></footer>
    </main>
  );
}
