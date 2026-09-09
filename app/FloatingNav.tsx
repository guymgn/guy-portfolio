"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

type HomeSection = "work" | "building" | "about";

function NavContents({ projectName, showMark = true, activeSection }: { projectName?: string; showMark?: boolean; activeSection?: HomeSection }) {
  return (
    <>
      {projectName ? (
        <span className="caseBreadcrumb"><a className="caseMark" href="/" aria-label="Guy Magen, home">GM</a><i>/</i><strong>{projectName}</strong></span>
      ) : (
        <>
          {showMark && <a className="home" href="#top" aria-label="Guy Magen, back to top"><span className="navWordmark">GM</span></a>}
          <div className="navLinks">
            {(["work", "building", "about"] as HomeSection[]).map((section) => <a key={section} href={`#${section}`} className={activeSection === section ? "isActive" : undefined} aria-current={activeSection === section ? "location" : undefined}>{section}</a>)}
          </div>
        </>
      )}
      <div className="navActions">{showMark && <button className="navCv" type="button">Download CV <span aria-hidden="true">↓</span></button>}<ThemeToggle /></div>
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
      const shouldShow = window.scrollY > 96;
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
    return () => {
      window.clearTimeout(exitTimer);
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

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
      <nav className={`topNav ${projectName ? "caseNav" : "homeNav"}`}><NavContents projectName={projectName} showMark={false} activeSection={activeSection} /></nav>
      <nav className={`floatingNav ${projectName ? "caseNav" : "homeNav"} nav${navState[0].toUpperCase()}${navState.slice(1)}`} aria-hidden={navState !== "visible"}><NavContents projectName={projectName} activeSection={activeSection} /></nav>
    </>
  );
}
