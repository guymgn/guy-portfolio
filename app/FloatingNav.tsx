"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { trackEvent } from "./Analytics";

type HomeSection = "work" | "building" | "about";

function NavContents({ projectName, showMark = true, activeSection, surface }: { projectName?: string; showMark?: boolean; activeSection?: HomeSection; surface: "top navigation" | "floating navigation" }) {
  return (
    <>
      {projectName ? (
        <span className="caseBreadcrumb"><a className="caseMark" href="/" aria-label="Guy Magen, home" data-analytics-event="Portfolio Home Opened" data-analytics-source={surface} data-analytics-project={projectName}>GM</a><i>/</i><strong>{projectName}</strong></span>
      ) : (
        <>
          {showMark && <a className="home" href="#top" aria-label="Guy Magen, back to top" data-analytics-event="Navigation Clicked" data-analytics-section="top" data-analytics-source={surface}><span className="navWordmark">GM</span></a>}
          <div className="navLinks">
            {(["work", "building", "about"] as HomeSection[]).map((section) => <a key={section} href={`#${section}`} className={activeSection === section ? "isActive" : undefined} aria-current={activeSection === section ? "location" : undefined} data-analytics-event="Navigation Clicked" data-analytics-section={section} data-analytics-source={surface}>{section}</a>)}
          </div>
        </>
      )}
      <div className="navActions">{showMark && <a className="navCv" href="/Guy-Magen-CV.pdf" download onClick={() => trackEvent("CV Downloaded", { source: "navigation" })}>Download CV <span aria-hidden="true">↓</span></a>}<ThemeToggle /></div>
    </>
  );
}

export function FloatingNav({ projectName }: { projectName?: string }) {
  const [navState, setNavState] = useState<"hidden" | "visible" | "leaving">("hidden");
  const [activeSection, setActiveSection] = useState<HomeSection>();
  const visibleRef = useRef(false);

  useEffect(() => {
    let exitTimer = 0;
    const updateVisibility = () => {
      const portfolioChat = projectName ? null : document.querySelector<HTMLElement>(".portfolioAgentDock");
      const homeVisibilityAnchor = portfolioChat?.offsetParent
        ? portfolioChat
        : document.querySelector<HTMLElement>(".intro");
      const shouldShow = homeVisibilityAnchor
        ? homeVisibilityAnchor.getBoundingClientRect().bottom <= 0
        : window.scrollY > 96;
      window.clearTimeout(exitTimer);
      if (shouldShow) {
        visibleRef.current = true;
        setNavState("visible");
      } else if (visibleRef.current) {
        visibleRef.current = false;
        setNavState("leaving");
        exitTimer = window.setTimeout(() => setNavState("hidden"), 380);
      }
    };
    updateVisibility();
    requestAnimationFrame(updateVisibility);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.clearTimeout(exitTimer);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [projectName]);

  useEffect(() => {
    if (projectName) return;
    const sections: HomeSection[] = ["work", "building", "about"];
    const updateActiveSection = () => {
      const reachedPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (reachedPageEnd) {
        setActiveSection("about");
        return;
      }
      const marker = Math.min(180, window.innerHeight * .28);
      let next: HomeSection | undefined;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= marker) next = section;
      }
      setActiveSection(next);
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [projectName]);

  return (
    <>
      <nav className={`topNav ${projectName ? "caseNav" : "homeNav"}`}><NavContents projectName={projectName} showMark={false} activeSection={activeSection} surface="top navigation" /></nav>
      <nav className={`floatingNav ${projectName ? "caseNav" : "homeNav"} nav${navState[0].toUpperCase()}${navState.slice(1)}`} aria-hidden={navState !== "visible"}><NavContents projectName={projectName} activeSection={activeSection} surface="floating navigation" /></nav>
    </>
  );
}
