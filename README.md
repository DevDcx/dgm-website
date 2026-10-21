# drivegrowthmanagement.com

The Drive Growth Management website, published with GitHub Pages.

## What's here

| Path | What it is |
|---|---|
| `index.html` | Homepage |
| `profit-growth-score/index.html` | Profit Growth Score landing page |
| `images/` | Logo, flywheel, book and coach images |
| `src/` | Design source files from the Claude canvas (edit these, then rebuild) |
| `tools/render.js` | Rebuilds the HTML pages from `src/` |

## Updating a page

1. Make the change in the canvas, or in the matching file in `src/`.
2. From the repo root, run `node tools/render.js`.
3. Commit and push. GitHub Pages republishes in about a minute.

## Going live on drivegrowthmanagement.com

Do this only after the pages look right on the GitHub preview address (`https://<account>.github.io/dgm-website/`).

1. In the repo, go to **Settings → Pages → Custom domain**, enter `drivegrowthmanagement.com` and save. GitHub adds a `CNAME` file.
2. Where the domain is registered, remove the forwarding to drivecx.com and add these DNS records:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www`: `<account>.github.io`
3. Wait for DNS to update (minutes to a few hours), then tick **Enforce HTTPS** in Settings → Pages.

Note: GitHub Pages on a **private** repo needs a paid GitHub plan. On the free plan, the repo must be public.

## Links still pointing to drivecx.com

Update these as the new pages are built.

| Link | Where it appears | Points to now |
|---|---|---|
| Start your free assessment | Score page (hero, close) | drivecx.com/get-your-growth-score |
| How we work | Top menu | drivecx.com/revenue-growth-management-services |
| Radical Retail Growth, Get the book | Top menu, GROWTH section | drivecx.com/get-radical-retail-growth |
| Roundtables, Ask about the next Roundtable | Top menu, GROWTH section | drivecx.com/ai-profitability-roundtable |
| Blog | Top menu | drivecx.com/blog |
| Or book a Profit Opportunity Review | Homepage close | drivecx.com/growth-consultation |
| Resources | Footer | drivecx.com/rgm-resources |
| Dale Dubberley, About | Author band, footer | drivecx.com/communicate-collaborate-innovate |
| Privacy, Terms | Footer | drivecx.com/privacy, drivecx.com/terms |
| Learn more (Brand Growth Strategy) | Flywheel section | drivecx.com/brand-growth-strategy |
| Login | Footer | console.drivecx.com |
| Get help | Footer | support@drivecx.com |
