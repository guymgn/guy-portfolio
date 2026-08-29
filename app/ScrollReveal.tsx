"use client";

import { ReactNode, useEffect, useRef } from "react";

export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("isVisible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("isVisible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className="revealSection" ref={ref}>{children}</div>;
}
