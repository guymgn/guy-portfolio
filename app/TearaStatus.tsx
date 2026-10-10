"use client";

import { useEffect, useState } from "react";
import { loadTearaStatus, type TearaStatusData } from "../lib/teara-status";

export function TearaStatus() {
  const [status, setStatus] = useState<TearaStatusData | null>(null);

  useEffect(() => {
    loadTearaStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  if (!status) return null;
  const details = [status.version ? `v${status.version}` : null, status.build ? `Build ${status.build}` : null, status.status].filter(Boolean).join(" · ");
  const nextDetails = status.nextUpdate
    ? [status.nextUpdate.version ? `v${status.nextUpdate.version}` : null, status.nextUpdate.build ? `Build ${status.nextUpdate.build}` : null, status.nextUpdate.status].filter(Boolean).join(" · ")
    : null;

  return <span className="tearaLiveStatus"><span>Production: {details}{nextDetails ? <small> · Pending: {nextDetails}</small> : null}</span></span>;
}
