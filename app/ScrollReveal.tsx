"use client";

import { ReactNode, useEffect, useRef } from "react";

export function ScrollReveal({ children, earliestReveal = 0 }: { children: ReactNode; earliestReveal?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const mountedAt = performance.now();
    let revealTimer: number | undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("isVisible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const remainingDelay = Math.max(0, earliestReveal - (performance.now() - mountedAt));
          revealTimer = window.setTimeout(() => element.classList.add("isVisible"), remainingDelay);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (revealTimer !== undefined) window.clearTimeout(revealTimer);
    };
  }, [earliestReveal]);

  return <div className="revealSection" ref={ref}>{children}</div>;
}
