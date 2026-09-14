"use client";

import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = "0aa1a4333ae3ecea0e5dda5f90ba6c9d";
const ANALYTICS_HOSTNAMES = new Set(["www.guymagen.com", "guymagen.com"]);
let initialized = false;

function initialize() {
  if (initialized) return true;
  if (typeof window === "undefined" || !ANALYTICS_HOSTNAMES.has(window.location.hostname)) return false;

  mixpanel.init(MIXPANEL_TOKEN, {
    api_host: "https://api-eu.mixpanel.com",
    persistence: "localStorage",
    secure_cookie: true,
    ignore_dnt: false,
    ip: false,
    autocapture: {
      pageview: "url-with-path",
      click: true,
      dead_click: true,
      rage_click: { interactive_elements_only: true },
      scroll: true,
      scroll_capture_all: false,
      scroll_depth_percent_checkpoints: [25, 50, 75, 100],
      input: false,
      submit: false,
      capture_text_content: false,
    },
    record_sessions_percent: 100,
    record_mask_all_inputs: true,
    record_mask_all_text: false,
    record_block_selector: ".portfolioAgentTranscript, .portfolioAgent form, img, video, audio",
    record_console: false,
    record_network: false,
  });

  mixpanel.register({
    site_domain: window.location.hostname,
    site_environment: window.location.hostname === "localhost" ? "development" : "production",
  });

  initialized = true;
  return true;
}

export function trackEvent(name: string, properties?: Record<string, string | number | boolean>) {
  if (!initialize()) return;
  mixpanel.track(name, properties);
}

export function Analytics() {
  useEffect(() => {
    initialize();
    const trackDeclarativeEvent = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const element = target?.closest<HTMLElement>("[data-analytics-event]");
      if (element) {
        const { analyticsEvent, analyticsProject, analyticsChannel, analyticsSource, analyticsSection, analyticsDestination, analyticsSurface } = element.dataset;
        if (!analyticsEvent) return;
        trackEvent(analyticsEvent, {
          ...(analyticsProject ? { project: analyticsProject } : {}),
          ...(analyticsChannel ? { channel: analyticsChannel } : {}),
          ...(analyticsSource ? { source: analyticsSource } : {}),
          ...(analyticsSection ? { section: analyticsSection } : {}),
          ...(analyticsDestination ? { destination: analyticsDestination } : {}),
          ...(analyticsSurface ? { surface: analyticsSurface } : {}),
        });
        return;
      }

      const control = target?.closest<HTMLElement>("button, input, select, [role='tab'], [tabindex]");
      const caseStudy = target?.closest<HTMLElement>("[data-analytics-case-study]");
      if (!control || !caseStudy || control.closest("[data-analytics-ignore]")) return;
      trackEvent("Case Study Interaction", {
        project: caseStudy.dataset.analyticsCaseStudy ?? "unknown",
        control: control.getAttribute("aria-label") ?? control.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) ?? control.tagName.toLowerCase(),
        control_type: control.getAttribute("role") ?? control.tagName.toLowerCase(),
      });
    };
    document.addEventListener("click", trackDeclarativeEvent);
    return () => document.removeEventListener("click", trackDeclarativeEvent);
  }, []);
  return null;
}
