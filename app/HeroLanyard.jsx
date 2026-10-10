"use client";

import { useSyncExternalStore } from "react";
import Lanyard from "@/components/Lanyard";
import { trackEvent } from "./Analytics";

const trackBadgeInteraction = ({ action, ...properties }) => {
  try {
    trackEvent(action === "drag" ? "Badge Dragged" : "Badges Flipped", {
      ...properties,
      surface: "homepage hero"
    });
  } catch {
    // Analytics must never interrupt the badge interaction.
  }
};

const themeQuery = "(prefers-color-scheme: dark)";
const subscribe = (onChange) => {
  const media = window.matchMedia(themeQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getSnapshot = () => window.matchMedia(themeQuery).matches;
const getServerSnapshot = () => null;

export function HeroLanyard() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="heroLanyard">
      {dark !== null && (
        <Lanyard
          secondCard
          onInteraction={trackBadgeInteraction}
          frontImage="/card-front.png"
          backImage="/card-back.png"
          cardColor={dark ? "#333333" : "#7776FF"}
          cardGradientEnd={dark ? "#505050" : "#6261D9"}
          finish="matte"
          cornerRadius={0.5}
          size={0.47}
          strapColor="#4544aa"
          strapWidth={0.7}
          gravity={1.2}
          damping={0.6}
          elasticity={0.2}
        />
      )}
    </div>
  );
}
