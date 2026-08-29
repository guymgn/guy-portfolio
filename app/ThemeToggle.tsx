"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: light)");
    const applyPreference = () => {
      const next = preference.matches ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      setTheme(next);
      window.dispatchEvent(new Event("themechange"));
    };
    const syncTheme = () => setTheme(document.documentElement.dataset.theme as Theme);

    window.localStorage.removeItem("theme");
    applyPreference();
    preference.addEventListener("change", applyPreference);
    window.addEventListener("themechange", syncTheme);

    return () => {
      preference.removeEventListener("change", applyPreference);
      window.removeEventListener("themechange", syncTheme);
    };
  }, []);

  function toggleTheme() {
    const current = document.documentElement.dataset.theme as Theme;
    const next = current === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <button
      className="themeToggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <i aria-hidden="true" />
    </button>
  );
}
