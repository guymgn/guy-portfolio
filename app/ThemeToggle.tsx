"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "./Analytics";

type Theme = "light" | "dark";
const THEME_KEY = "theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: light)");
    const applyPreference = () => {
      const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
      const next = stored === "light" || stored === "dark" ? stored : systemTheme();
      applyTheme(next);
      setTheme(next);
      window.dispatchEvent(new Event("themechange"));
    };
    const syncTheme = () => setTheme(document.documentElement.dataset.theme as Theme);
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY) return;
      applyPreference();
    };

    applyPreference();
    preference.addEventListener("change", applyPreference);
    window.addEventListener("themechange", syncTheme);
    window.addEventListener("storage", syncStorage);

    return () => {
      preference.removeEventListener("change", applyPreference);
      window.removeEventListener("themechange", syncTheme);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  function toggleTheme() {
    const current = document.documentElement.dataset.theme as Theme;
    const next = current === "light" ? "dark" : "light";
    trackEvent("Theme Changed", { theme: next });
    window.localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    setTheme(next);
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <button
      className="themeToggle"
      type="button"
      onClick={toggleTheme}
      data-analytics-ignore="true"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <i aria-hidden="true" />
    </button>
  );
}
