import { createPrivateKey, sign } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const required = [
  "APP_STORE_CONNECT_ISSUER_ID",
  "APP_STORE_CONNECT_KEY_ID",
  "APP_STORE_CONNECT_PRIVATE_KEY_PATH",
  "TEARA_BUNDLE_ID",
];

for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing ${name} in .env.local`);
}

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const header = encode({ alg: "ES256", kid: process.env.APP_STORE_CONNECT_KEY_ID, typ: "JWT" });
const payload = encode({
  iss: process.env.APP_STORE_CONNECT_ISSUER_ID,
  iat: now,
  exp: now + 15 * 60,
  aud: "appstoreconnect-v1",
});
const unsignedToken = `${header}.${payload}`;
const privateKey = createPrivateKey(await readFile(process.env.APP_STORE_CONNECT_PRIVATE_KEY_PATH, "utf8"));
const signature = sign("sha256", Buffer.from(unsignedToken), { key: privateKey, dsaEncoding: "ieee-p1363" }).toString("base64url");
const token = `${unsignedToken}.${signature}`;

async function apple(path) {
  const response = await fetch(`https://api.appstoreconnect.apple.com${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`App Store Connect returned ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.json();
}

const apps = await apple(`/v1/apps?filter%5BbundleId%5D=${encodeURIComponent(process.env.TEARA_BUNDLE_ID)}&limit=1`);
const app = apps.data?.[0];
if (!app) throw new Error(`No app found for bundle ID ${process.env.TEARA_BUNDLE_ID}`);

const [builds, versions] = await Promise.all([
  apple(`/v1/builds?filter%5Bapp%5D=${app.id}&sort=-uploadedDate&limit=1`),
  apple(`/v1/apps/${app.id}/appStoreVersions?filter%5Bplatform%5D=IOS&limit=10`),
]);

const lookupResponse = await fetch(`https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(process.env.TEARA_BUNDLE_ID)}&country=us`);
if (!lookupResponse.ok) throw new Error(`Public App Store lookup returned ${lookupResponse.status}`);
const publicListing = (await lookupResponse.json()).results?.[0] ?? null;

const build = builds.data?.[0]?.attributes;
const version = [...(versions.data ?? [])]
  .sort((a, b) => new Date(b.attributes.createdDate ?? 0) - new Date(a.attributes.createdDate ?? 0))[0]?.attributes;

const labels = {
  READY_FOR_SALE: "Available on the App Store",
  READY_FOR_DISTRIBUTION: "Available on the App Store",
  WAITING_FOR_REVIEW: "Waiting for App Review",
  IN_REVIEW: "In App Review",
  PENDING_DEVELOPER_RELEASE: "Approved, awaiting release",
  PREPARE_FOR_SUBMISSION: "In development",
  DEVELOPER_REJECTED: "Preparing another build",
  REJECTED: "Preparing another build",
  PROCESSING: "Processing a new build",
  VALID: "Testing in TestFlight",
  INVALID: "Build needs attention",
};

const rawState = version?.appStoreState ?? build?.processingState ?? "VALID";
const publicVersion = publicListing?.version ?? null;
const hasPendingUpdate = Boolean(version?.versionString)
  && (version.versionString !== publicVersion || !["READY_FOR_SALE", "READY_FOR_DISTRIBUTION"].includes(rawState));
const output = {
  app: app.attributes?.name ?? "Teara",
  version: publicVersion,
  build: null,
  status: publicListing ? "Live on the App Store" : labels[rawState] ?? rawState.toLowerCase().replaceAll("_", " "),
  appStoreUrl: publicListing?.trackViewUrl ?? null,
  nextUpdate: hasPendingUpdate ? {
    version: version?.versionString ?? null,
    build: build?.version ?? null,
    status: labels[rawState] ?? rawState.toLowerCase().replaceAll("_", " "),
  } : null,
  updatedAt: build?.uploadedDate ?? new Date().toISOString(),
};

await writeFile(resolve("public/teara-status.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Teara status synced: ${output.status}${output.version ? ` · v${output.version}` : ""}${output.nextUpdate ? ` · Next: v${output.nextUpdate.version} ${output.nextUpdate.status}` : ""}`);
