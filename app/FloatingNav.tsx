"use client";

import { useEffect, useState } from "react";
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
      <div className="navActions"><ThemeToggle /></div>
    </>
  );
}

export function FloatingNav({ projectName }: { projectName?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 96);
    updateVisibility();
    requestAnimationFrame(updateVisibility);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <>
      <nav className={`topNav ${projectName ? "caseNav" : "homeNav"}`}><NavContents projectName={projectName} showMark={false} /></nav>
      <nav className={`floatingNav ${projectName ? "caseNav" : "homeNav"} ${visible ? "navVisible" : "navHidden"}`} aria-hidden={!visible}><NavContents projectName={projectName} /></nav>
    </>
  );
}
