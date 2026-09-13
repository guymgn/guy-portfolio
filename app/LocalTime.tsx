"use client";

import { useEffect, useState } from "react";

const zone = "Asia/Jerusalem";

function getIsraelTime() {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);
  const offsetPart = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "shortOffset",
  }).formatToParts(now).find((part) => part.type === "timeZoneName")?.value;
  const offset = (offsetPart || "GMT+2").replace("GMT", "UTC");
  return { time, offset };
}

export function LocalTime() {
  const [clock, setClock] = useState({ time: "12:00 AM", offset: "UTC+2" });

  useEffect(() => {
    const update = () => setClock(getIsraelTime());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="localTime" aria-label={`Current time in Tel Aviv: ${clock.time}`}>
      <span>Current location</span>
      <strong>TLV</strong>
      <small>Timezone</small>
      <p>{clock.offset} <i>•</i> {clock.time}</p>
      <span className="madeIn">Made with ❤️ in Israel</span>
    </div>
  );
}
