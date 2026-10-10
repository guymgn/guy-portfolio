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
