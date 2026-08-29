"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

function NavContents({ projectName, showMark = true }: { projectName?: string; showMark?: boolean }) {
  return (
    <>
      {projectName ? (
        <span className="caseBreadcrumb"><a href="/">Guy Magen</a><i>/</i><strong>{projectName}</strong></span>
      ) : (
        <>
          {showMark && <a className="home" href="#top" aria-label="Guy Magen, back to top"><span className="navWordmark">GM</span></a>}
          <div className="navLinks"><a href="#work">work</a><a href="#building">building</a><a href="#about">about</a></div>
        </>
      )}
      <div className="navActions">{showMark && <button className="navCv" type="button">Download CV <span aria-hidden="true">↓</span></button>}<ThemeToggle /></div>
    </>
  );
}

export function FloatingNav({ projectName }: { projectName?: string }) {
  const [navState, setNavState] = useState<"hidden" | "visible" | "leaving">("hidden");
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
        exitTimer = window.setTimeout(() => setNavState("hidden"), 560);
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

  return (
    <>
      <nav className={`topNav ${projectName ? "caseNav" : "homeNav"}`}><NavContents projectName={projectName} showMark={false} /></nav>
      <nav className={`floatingNav ${projectName ? "caseNav" : "homeNav"} nav${navState[0].toUpperCase()}${navState.slice(1)}`} aria-hidden={navState !== "visible"}><NavContents projectName={projectName} /></nav>
    </>
  );
}
