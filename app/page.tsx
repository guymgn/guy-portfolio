const projects = [
  { company: "Stigg", title: "Making complex pricing systems feel simple", detail: "Product strategy, design systems and platform UX", accent: "green" },
  { company: "Finout", title: "Turning cloud costs into clear decisions", detail: "Product design, data visualization and workflows", accent: "blue" },
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="Guy Magen, home"><span>GM</span></a>
        <div className="navLinks"><a href="#work">Work</a><a href="#build">Things I build</a><a href="#about">About</a></div>
        <a className="sayHi" href="mailto:hi@guymagen.com">Say hi</a>
      </nav>
      <section className="hero shell" id="top">
        <div className="eyebrow"><i /> Senior Product Designer &amp; Builder</div>
        <h1>I design complex products and build what comes next.</h1>
        <div className="heroFoot">
          <p>I’m Guy. I turn technical systems into products that feel clear, useful and genuinely good to use.</p>
          <a className="workLink" href="#work">See selected work <span>↘</span></a>
        </div>
        <div className="signal" aria-hidden="true">
          <div className="signalTrack"><span /><span /><span /><span /><span /><span /><span /></div>
          <b>Ideas</b><b>Systems</b><b>Products</b>
        </div>
      </section>
      <section className="work shell" id="work">
        <header className="sectionHead"><span>01 / Selected work</span><p>A few problems I’ve helped untangle.</p></header>
        <div className="projectGrid">
          {projects.map((project, index) => (
            <a className={`project ${project.accent}`} key={project.company} href="https://www.figma.com/deck/Uv4ebbkIVfmdblK58TaueW" target="_blank" rel="noreferrer">
              <div className="projectTop"><span>0{index + 1}</span><span>Case study ↗</span></div>
              <div className="projectVisual">
                <div className="miniWindow"><div className="dots"><i /><i /><i /></div><div className="windowContent"><span className="line long" /><span className="line" /><div className="blocks"><i /><i /><i /></div></div></div>
              </div>
              <div className="projectCopy"><span>{project.company}</span><h2>{project.title}</h2><p>{project.detail}</p></div>
            </a>
          ))}
        </div>
      </section>
      <section className="build shell" id="build">
        <div><span className="sectionLabel">02 / Things I build</span><h2>Curiosity usually turns into something.</h2></div>
        <div className="buildCard"><span className="prompt">guy@studio ~ %</span><p>Prototypes, tiny tools, motion studies and experiments with AI.</p><a href="https://github.com/guymgn" target="_blank" rel="noreferrer">Open the workshop ↗</a></div>
      </section>
      <section className="about shell" id="about">
        <div className="aboutIntro">
          <span className="sectionLabel">03 / A little about me</span>
          <p>I’ve spent more than 12 years making complicated things easier to understand. I like getting close to the details, asking a lot of questions and building enough of the idea to know if it actually works.</p>
        </div>
        <div className="capabilities">
          <div><span>Design</span><p>Product strategy<br />Complex systems<br />Interaction design<br />Design systems</p></div>
          <div><span>Build</span><p>Working prototypes<br />Front-end experiments<br />Motion and 3D<br />AI-assisted products</p></div>
          <div><span>Share</span><p>Team leadership<br />Design mentoring<br />Clear storytelling<br />Good playlists</p></div>
        </div>
      </section>
      <section className="proof shell">
        <p>Previously designing at</p>
        <div><b>Stigg</b><b>Finout</b><b>Startup Designers</b></div>
        <span>Mentoring designers since 2019</span>
      </section>
      <footer>
        <div className="footerInner shell">
          <span>Have a good problem?</span>
          <h2>Let’s make something useful.</h2>
          <div className="footerLinks">
            <a href="mailto:hi@guymagen.com">hi@guymagen.com ↗</a>
            <a href="https://www.linkedin.com/in/guymagen/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href="https://github.com/guymgn" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
          <div className="footerBottom"><span>Guy Magen © 2026</span><span>Designed and built with curiosity in Israel</span></div>
        </div>
      </footer>
    </main>
  );
}
