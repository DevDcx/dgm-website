// Builds the static site from the design source files in src/.
// Usage (from the repo root): node tools/render.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
// While the site is a draft, keep search engines out. Set to false on launch day.
const DRAFT = true;

// Design source file -> published page, plus its SEO title and description
const pages = {
  'Main.dc.html': {
    out: 'index.html', depth: 0,
    title: 'How to Increase Retail Sales and Profit Across Every Store | Drive Growth Management',
    description: 'See how your stores compare on the 8 Profit Drivers behind sales and margin. Get your free Profit Growth Score, the 3 leaks costing you most, and a 90-day growth plan.',
  },
  'Score.dc.html': {
    out: 'profit-growth-score/index.html', depth: 1,
    title: 'Get Your Profit Growth Score | Free 8 Profit Drivers Assessment | Drive Growth Management',
    description: 'A free 10-minute assessment for multi-unit pharmacy, retail and restaurant chains. Get your Profit Growth Score, a breakdown of all 8 profit drivers, and your 3 biggest profit leaks.',
  },
  'Clients.dc.html': {
    out: 'our-clients/index.html', depth: 1,
    title: 'Our Clients | Pharmacy and Restaurant Case Studies | Drive Growth Management',
    description: 'Results and case studies from multi-unit pharmacy and restaurant chains using the 8 Profit Drivers.',
  },
  'ClientsPharmacy.dc.html': {
    out: 'our-clients/pharmacy/index.html', depth: 2,
    title: "Pharmacy Case Studies | Murphy's Pharmacies | Drive Growth Management",
    description: "How Murphy's Pharmacies used a 25% comment card response rate to find what was costing them customers, and lifted NPS 150% across a 7-store pilot.",
  },
  'ClientsRestaurants.dc.html': {
    out: 'our-clients/restaurants/index.html', depth: 2,
    title: "Restaurant Case Studies | Romers' Burger Bar and Kelly Gordon Interview | Drive Growth Management",
    description: "How Romers' Burger Bar turned one week of customer feedback into $85,000 in projected annual revenue, plus an interview with CEO Kelly Gordon.",
  },
  'Growth.dc.html': {
    out: 'growth-framework/index.html', depth: 1,
    title: 'The G.R.O.W.T.H Framework from Radical Retail Growth | Drive Growth Management',
    description: 'The 6 principles behind the 8 Profit Drivers, from the book Radical Retail Growth by Dale Dubberley. Learn the framework and buy the book.',
  },
};

// Uploaded design images -> files in images/
const blobs = {
  '040850abb18a406d4deb8022376b1a60': 'dgm-logo-mark.png',
  'cb445564c037dc315830ca6a90b4771d': 'rrg-standing-trim.jpg',
  'a43647dbc8d12d0627de166138198808': 'rrg-books.jpg',
  '2f3118ce031bdcd7ba8ef5ee2cf1d96b': 'growth-flywheel-v3.png',
  '5d4b0e33104ad2650d016289542c8ea1': 'coach-screen.jpg',
  '0beb9ac97a75c7c36654ae2399419b45': 'jane-headshot.jpg',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const get = (scope, p) => p.trim().split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);

function render(t, scope) {
  t = t.replace(/<sc-for list="\{\{\s*([\w.]+)\s*\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (_, list, as, inner) =>
    (get(scope, list) || []).map((item, i) => render(inner, Object.assign({}, scope, { [as]: item, $index: i }))).join(''));
  t = t.replace(/<sc-if value="\{\{\s*([\w.]+)\s*\}\}"[^>]*>([\s\S]*?)<\/sc-if>/g, (_, v, inner) => (get(scope, v) ? render(inner, scope) : ''));
  return t.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_, p) => { const v = get(scope, p); return v == null ? '' : esc(v); });
}

for (const [srcName, cfg] of Object.entries(pages)) {
  const html = fs.readFileSync(path.join(root, 'src', srcName), 'utf8');
  const script = html.match(/<script type="text\/x-dc" data-dc-script[^>]*>([\s\S]*?)<\/script>/)[1];
  const Klass = new Function('DCLogic', script + '\nreturn Component;')(class { constructor() { this.props = {}; this.state = {}; } });
  const data = new Klass().renderVals();
  const body = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1];
  const helmet = (body.match(/<helmet>([\s\S]*?)<\/helmet>/) || ['', ''])[1];
  let page = render(body.replace(/<helmet>[\s\S]*?<\/helmet>/, ''), data);

  const up = '../'.repeat(cfg.depth);
  page = page.replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => (blobs[id] ? up + 'images/' + blobs[id] : m));
  // Links between design pages -> published paths, relative so the GitHub preview address works too
  page = page.replace(/href="([\w-]+\.dc\.html)(#[\w-]*)?"/g, (m, f, hash) => {
    const target = pages[f];
    if (!target) return m;
    const dir = target.out.replace(/index\.html$/, '');
    return `href="${(up + dir) || './'}${hash || ''}"`;
  });
  page = page.replace(/href="#top"/g, `href="${up || './'}"`);

  const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${cfg.title}</title>
<meta name="description" content="${cfg.description}">
${DRAFT ? '<meta name="robots" content="noindex, nofollow">' : ''}
<link rel="icon" href="${up}images/dgm-logo-mark.png">
${helmet.trim()}
<style>html{scroll-behavior:smooth}*{box-sizing:border-box}img{max-width:100%}@media (max-width:900px){nav[aria-label="Main"]{display:none!important}}</style>
</head>
<body>
${page.trim()}
</body>
</html>
`;
  const outPath = path.join(root, cfg.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, doc);
  const left = (doc.match(/\{\{|\/_blob\/|\.dc\.html|<sc-/g) || []).length;
  console.log(cfg.out, (doc.length / 1024).toFixed(0) + ' KB', left ? `WARNING: ${left} unrendered bits` : 'ok');
}
