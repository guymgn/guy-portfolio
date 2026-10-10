export type TearaRelease = { version: string | null; build: string | null; status: string };
export type TearaStatusData = TearaRelease & { nextUpdate?: TearaRelease | null; updatedAt?: string };

export async function loadTearaStatus(url = "/teara-status.json"): Promise<TearaStatusData> {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error("Teara status is unavailable");
  const data = await response.json() as TearaStatusData;
  const valid = (v: TearaRelease) => v && typeof v.status === "string" && v.status.length < 150
    && (v.version === null || typeof v.version === "string" && v.version.length < 30)
    && (v.build === null || typeof v.build === "string" && v.build.length < 30);
  if (!valid(data) || data.nextUpdate != null && !valid(data.nextUpdate)) throw new Error("Invalid Teara status");
  return data;
}

export function tearaReleaseAnswer(status: TearaStatusData): string {
  const release = (value: TearaRelease) => [value.version ? `version ${value.version}` : null,
    value.build ? `build ${value.build}` : null, value.status].filter(Boolean).join(" · ");
  return `Teara’s production release: ${release(status)}. ${status.nextUpdate
    ? `Pending update: ${release(status.nextUpdate)}.`
    : "No pending update is listed in the latest portfolio status."} Guy designed and built the iPhone app to turn scattered travel bookings into one clear, day-by-day itinerary.`;
}

export function isTearaStatusQuestion(question: string, history: { content: string }[], guide: string): boolean {
  const hasContext = guide === "jarvis" || /\bteara\b/i.test(question) || history.some(m => /\bteara\b/i.test(m.content));
  return hasContext && /\b(progress|development|developing|latest|update|status|roadmap|happening|live|released?|launch|available|app store|version|pending|review|testflight|beta)\b|\bv?\d+\.\d+/i.test(question);
}
