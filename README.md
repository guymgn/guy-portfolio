# guymagen.com

The source behind [guymagen.com](https://www.guymagen.com), the portfolio of Guy Magen, a Senior Product Designer and builder with 12+ years of experience designing complex B2B products across SaaS, fintech, cloud cost management and AI tools.

I designed and built the site myself, with AI coding tools as part of the workflow. It is meant to show the work, and also how I work: taking a messy, complex product problem, finding the model underneath it, and turning that into something people can understand and use.

**[View the live site →](https://www.guymagen.com)**

## What's inside

**Case studies**

- **Stigg** · Designing the model behind modern SaaS pricing. How plans, features and entitlements fit together, told through interactive pieces of the product rather than static screenshots.
- **Finout** · Turning cloud cost chaos into one clear picture. Virtual tags, anomaly detection and the "MegaBill" view, rebuilt as small working demos.
- **AI governance** · Exploring clearer controls for Shadow AI and sensitive access. An anonymized design assignment, starting from a detected AI model and showing where it lives, so teams can act on it precisely or block it globally.

**Details worth poking at**

- **Hanging badges in the hero.** Two ID badges on a lanyard, rendered in 3D with their own physics. Drag them, swing them, click to flip both. While the artwork loads they appear pixelated and sharpen once it arrives.
- **Ask about Guy.** A small assistant that answers questions about my work, process and tools, grounded in what is actually on the site.
- **Teara.** A live status card for Teara, the iOS travel app I designed and built independently. It shows the current App Store release from a single source of truth, so every mention on the site stays in sync.

## How it's built

- React and TypeScript, on [vinext](https://github.com/cloudflare/vinext) (Vite)
- Three.js for the badge scene, with a custom physics step for the strap, clip and card collisions
- Hosted on Netlify. Every change goes to a staging preview first and reaches production only after review.
- The portfolio assistant runs as a separate Cloudflare Worker (`portfolio-agent/`)

## Running it locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build (as Netlify runs it):

```bash
NITRO_PRESET=netlify npm run build
```

Focused tests for the badge physics, analytics and Teara status:

```bash
node --test tests/lanyard-analytics.test.mjs tests/lanyard-physics.test.mjs tests/teara-status.test.mjs
```

## Contact

[guymagen.com](https://www.guymagen.com) · [hi@guymagen.com](mailto:hi@guymagen.com)

Case study content, artwork and photos belong to Guy Magen and are not licensed for reuse. Company names belong to their respective owners. DM Sans is used under the SIL Open Font License (see `public/fonts/`).
