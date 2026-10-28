# drivegrowthmanagement.com

The Drive Growth Management website, published with GitHub Pages.

## What's here

| Path | What it is |
|---|---|
| `index.html` | Homepage |
| `profit-growth-score/index.html` | Profit Growth Score landing page |
| `brand-growth-strategy/index.html` | Brand Growth Strategy MasterClass page (replaces drivecx.com/brand-growth-strategy) |
| `free-resources/index.html` | Free Growth Resources hub: SCALE steps + 4 tiles (Blogs, Videos, Profit Growth Resources, Academy). Landing page for the book QR (drivecx.com/xm-resources.com redirects here) |
| `free-resources/toolkit/index.html` | Profit Growth Resources: free tools by SCALE step (replaces drivecx.com/rgm-tools) |
| `academy/index.html` | DGM Profit Growth Academy, members only (replaces drivecx.com/academy). Gate with Cloudflare Access on `/academy/*` |
| `FreeResources/` | Alias that forwards to `free-resources/` |
| `blog/` | Blog index and one folder per post, built from `posts/` |
| `posts/` | One file per blog post. Add a post by copying a file, changing the top lines (title, date, topic, dek, hero, heroAlt) and writing the post under the `---` line. Topics: strategy, customers, teams, marketing, ai |
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
| How we work | Top menu | drivecx.com/revenue-growth-management-services |
| Radical Retail Growth, Get the book | Top menu, GROWTH section | drivecx.com/get-radical-retail-growth |
| Roundtables, Ask about the next Roundtable | Top menu, GROWTH section | drivecx.com/ai-profitability-roundtable |
| Blog images | Blog page and posts | static.wixstatic.com (copy into images/ before Wix is cancelled) |
| Book a Profit Opportunity Review | Blog posts | drivecx.com/growth-consultation |
| Or book a Profit Opportunity Review | Homepage close | drivecx.com/growth-consultation |
| Dale Dubberley, About | Author band, footer | drivecx.com/communicate-collaborate-innovate |
| Privacy, Terms | Footer | drivecx.com/privacy, drivecx.com/terms |
| Login | Footer | console.drivecx.com |
| Get help | Footer | support@drivecx.com |

## Forms and Keap

All four site forms post to one Zapier workflow, **DGM Website Forms to Keap** (https://zapier.com/workflow/01a18045-eb32-768f-b544-c51e6ca0a572). It creates or updates the Keap contact by email, saves the form details, sets Lead Source, and applies the tag.

| Form | Page | `form` value | Keap tag |
|---|---|---|---|
| 15 Profit Leaks download gate | `15-profit-leaks/` | `leaks` | 962 15 Profit Leaks Download |
| 8 Profit Drivers download gate | `profit-growth-score/` | `drivers` | 964 8 Profit Drivers Download |
| Roundtable waitlist pop-up | `roundtables/` | `roundtable` | 968 Executive Roundtable Waitlist |
| MasterClass application | `brand-growth-strategy/` | `masterclass` | 876 Brand Growth Session Waitlist |

Field mapping: name / first and last name, email, phone, company (Company + custom Company Name), title or role (Job Title, Role), industry, stores (Locations), topics and seat format (Challenges/Goals), UTM source/medium/campaign.

To add a new form: post to `DGM_FORMS_HOOK` with a new `form` value, then add that value and its tag ID to the `FORMS` table in the workflow.

## DGM Profit Growth Academy login

The Academy page is plain HTML, so the login comes from Cloudflare Access (Zero Trust, free up to 50 users), not from the page.
Members get a one-time code by email. To add a member, add their email to the Access policy for `drivegrowthmanagement.com/academy`.
To add lessons, edit the `lessons` lists in `src/Academy.dc.html` and rebuild.
Note: while this repo is public, the Academy page source is visible on GitHub. Make the repo private once the site is deployed from Cloudflare Pages.
