"use client";

import { useEffect, useState } from "react";

type Status = {
  version: string | null;
  build: string | null;
  status: string;
};

export function TearaStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/teara-status.json", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  if (!status) return null;
  const details = [status.version ? `v${status.version}` : null, status.build ? `Build ${status.build}` : null].filter(Boolean).join(" · ");

  return <span className="tearaLiveStatus"><i aria-hidden="true" />{status.status}{details ? ` · ${details}` : ""}</span>;
}
