# Portfolio workflow

## Staging first, production only on approval

Every change or update goes to staging first. Nothing reaches production until Guy explicitly approves deploying it.

- Production: the `main` branch. Netlify auto-publishes every push to `main` to https://www.guymagen.com, so pushing or merging to `main` is a production deploy.
- Staging: the `staging` branch. Netlify builds every push to it at https://staging--guy-magen-portfolio.netlify.app.

Workflow:

1. Commit all changes to `staging` (or to a short-lived branch merged into `staging`). Never commit or push directly to `main`.
2. Build and run the relevant checks before pushing to `staging`.
3. After Netlify finishes the staging build, verify it on the staging URL and send Guy that link with a short summary of what changed.
4. Batch related updates on `staging` so they can be reviewed and released together.
5. Deploy to production only when Guy explicitly approves (for example "approve", "deploy", "publish", "ship it"). A request to edit, update, fix, preview, or review is staging-only, even when it is urgent.
6. On approval, merge `staging` into `main` and push. Then verify the live domain: pages load, the changed behavior is live, and nothing else regressed.
7. Keep `staging` in sync with `main` after each release.

Never use `netlify deploy --prod`, the Netlify "Publish deploy" button, or any other path that skips this flow, unless Guy explicitly asks for that specific action. Do not change live-domain or Netlify configuration without explicit approval.

## Build

- Production build command: `NITRO_PRESET=netlify npm run build` (set in `netlify.toml`, publish dir `dist`). Netlify uses `NODE_VERSION=22`.
- The build needs no secrets. `.env.local` holds App Store Connect credentials for `scripts/sync-teara-status.mjs` only; never commit them or add them to Netlify.

## Working with Guy

- Be direct and concise. Lead completion messages with what changed and where Guy can see it (staging link or live URL).
- Always state whether work is local, on staging, or live. Never say "published" when only committed, "verified" when only built, or "synced" while a public surface is stale.
- Apply exact measurements, colors, copy and assets as given. Short follow-ups like "a bit more" or "revert that" refer to the immediately preceding adjustment.
- Ask only when the target, branch or authorization is materially ambiguous. Handle Git and staging setup yourself; don't ask Guy to switch branches.
- Preserve unrelated changes; never bundle them into a commit or release.
- Approval is scoped: approving a portfolio release doesn't authorize Worker deploys, account changes or anything else.
- No em dashes or en dashes in copy.

## Project map

- Homepage layout: `app/page.tsx`, shared styles `app/globals.css`, shell `app/layout.tsx`.
- Navigation and case breadcrumbs: `app/FloatingNav.tsx`. Back to top: `app/BackToTop.tsx`.
- Case studies: `app/stigg/`, `app/finout/`, `app/ai-governance/`.
- Hero badges: wrapper `app/HeroLanyard.jsx`, renderer and physics `components/Lanyard.jsx`.
- Teara promo card: `app/TearaVideoPromo.tsx`. Project status: `app/TearaStatus.tsx`.
- Teara release status: logic `lib/teara-status.ts`, data `public/teara-status.json` (canonical; never hardcode versions or builds).
- Portfolio chat UI: `app/PortfolioAgent.tsx`. Analytics: `app/Analytics.tsx`.
- `portfolio-agent/` is a separately deployed Cloudflare Worker (`guy-portfolio-agent`). It is not part of the Netlify release and is not the same as `teara-jarvis`. Deploy it only with explicit approval.
- Stack: React 19, vinext on Vite, TypeScript, Three. Next-style imports don't mean a standard Next.js deployment. `npm run dev` serves on port 3000. `README.md` is starter text, not architecture.

## Approved behavior to preserve

- Two slightly overlapping badges on one strap. Each hangs from its own ring through a centered hole punch, at opposite ends of a short clip bar. Either can be dragged; clicking either flips both. Badges sit behind readable hero text.
- Desktop hero: split columns, badges left, text right. Mobile keeps its own separately approved composition; don't carry desktop changes into mobile unless asked.
- Badge artwork comes from Figma (Materials file, page 1): badge 1 is `card-front.png` (photo) and `card-back.png` (illustration on purple); badge 2 is `card-front-2.png` ("All Access") and `card-back-2.png` (white line illustration on black). Export at 1:1 from the full page, since the "All Access" subtitle text sits outside its frame. Both badges look the same in light and dark mode.
- Analytics: one "Badge Dragged" and one "Badges Flipped" event per completed interaction, never per frame.
- Case breadcrumb: `GM / Portfolio / [case study]`.
- Back to top sits at the viewport edge (desktop bottom/right 24px, mobile bottom 18px).
- Teara promo: desktop and tablet only (hidden at 680px and below), partly offscreen and angled at rest, straightens on hover to 10px inside the viewport. No "T" branding on the parked handle.
- Every place that mentions Teara's release (project section, promo, chat answers) must agree with `teara-status.json`.

## Verification

- Run focused tests for what changed: `node --test tests/lanyard-analytics.test.mjs tests/lanyard-physics.test.mjs tests/teara-status.test.mjs`. `npm test` contains obsolete starter assertions and isn't a release gate.
- Worker type check: `npx tsc -p portfolio-agent/tsconfig.json --skipLibCheck`.
- Run `git diff --check`.
- Check changed interactions in a browser, in light and dark mode and at mobile width when relevant, not only that the build passes. "Still 2 lines" or "can't drag" means the change failed; inspect the real layout.
- After a release, check `/`, `/stigg`, `/finout` and `/ai-governance` on the live domain.

## Open items

- The Teara status sync automation (Codex desktop automation, every 3 days) still has authority to publish directly. That conflicts with the staging-first rule. Ask Guy to reconcile it before relying on or replacing it.
- Audit how the sync associates a pending build with its App Store version before trusting "pending" status.
