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
    description: 'A free 10-minute assessment for multi-unit pharmacy, retail and restaurant chains. Get your Profit Growth Score, a breakdown of all 8 Profit Drivers, and your 3 biggest profit leaks.',
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
  'Leaks.dc.html': {
    out: '15-profit-leaks/index.html', depth: 1,
    title: 'How to Increase Retail Profits: 15 Hidden Profit Leaks and How to Fix Them | Free Guide',
    description: 'How to increase retail profits: a free 18-page guide to the 15 most common hidden profit leaks in multi-unit retail, pharmacy and restaurant chains, with the fix for each and where AI helps.',
  },
  'How.dc.html': {
    out: 'how-we-work/index.html', depth: 1,
    title: 'How We Work | From Free Profit Growth Score to More Efficient Operations in 90 Days | Drive Growth Management',
    description: 'How Drive Growth Management works with multi-unit pharmacy, retail and restaurant chains: free Profit Growth Score, Profit Opportunity Review, Blueprint and a guaranteed 90-day plan.',
  },
  'AI.dc.html': {
    out: 'how-ai-helps/index.html', depth: 1,
    title: 'How AI Helps Retail Chains | AI Agents and Jane, Your AI Growth Coach | Drive Growth Management',
    description: 'AI agents for customer service, HR and marketing, plus Jane, your AI Growth Coach, who watches your 8 Profit Drivers every week and recommends actions to grow sales and profit.',
  },
  'Values.dc.html': {
    out: 'what-we-stand-for/index.html', depth: 1,
    title: 'What We Stand For | Our Values, Our Approach to AI and Our 2% Climate Commitment | Drive Growth Management',
    description: 'Drive Growth Management gives 2% of top-line revenue to organizations cleaning up the oceans and fighting climate change, and uses AI to strengthen the human connections that grow your business.',
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
  'b064922752817aa4f79edea3d0f440a8': 'leaks-cover.jpg',
  'b45174fe8b0c5fb1269f882a7f1085be': 'leaks-sample.jpg',
  'b1bc5805a4e4b0f8eb99a0dae737310c': '../downloads/15-retail-profit-leaks.pdf',
  'b7c8aa4e72fa67cdfdff947c0a7f954b': '8-drivers-guide-cover.jpg',
  '8e70b2d0b03c234e377077b5b3e4afe7': '8-drivers-wheel.jpg',
  'f65ff879913bf5af01ba338a6d136d80': '8-profit-drivers-infographic.jpg',
  '78b2d99e88b2eb016eb61a5aba4b3ec7': '../downloads/8-drivers-of-profitable-growth.pdf',
  '9838b05243b9b42731ea582acdf82580': '../downloads/8-profit-drivers-cards.pdf',
  '29adda388536e44d808ec4f084d8aa43': '../downloads/8-profit-drivers-one-page.png',
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

  // Mobile menu: a menu button and drop-down panel that replace the main nav under 1180px
  page = page.replace(/(<nav aria-label="Main"[^>]*>)([\s\S]*?)(<\/nav>)/, (m, open, links, close) => {
    const items = links.trim().split('\n').map(l => l.replace(/ style="[^"]*"/, '')).join('\n');
    return `${m}
<button type="button" class="dgm-burger" aria-label="Open menu" aria-expanded="false" aria-controls="dgm-mnav"><span></span><span></span><span></span></button>
<nav id="dgm-mnav" class="dgm-mnav" aria-label="Mobile" hidden>
${items}
<a class="dgm-mnav-cta" href="${up}profit-growth-score/">Get your Profit Growth Score &rarr;</a>
</nav>`;
  });

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
<style>html{scroll-behavior:smooth}*{box-sizing:border-box}img{max-width:100%}@media (max-width:1179px){nav[aria-label="Main"]{display:none!important}}
.dgm-burger{display:none;flex-direction:column;justify-content:center;gap:5px;width:46px;height:46px;padding:0 11px;margin-left:auto;background:none;border:1px solid #E1E6EB;border-radius:8px;cursor:pointer}
.dgm-burger span{display:block;height:2px;background:#2A4252;border-radius:2px;transition:transform .2s,opacity .2s}
.dgm-burger[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.dgm-burger[aria-expanded="true"] span:nth-child(2){opacity:0}
.dgm-burger[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.dgm-mnav{flex-basis:100%;display:flex;flex-direction:column;border-top:1px solid #E1E6EB;padding-top:6px;font-family:'Montserrat',sans-serif}
.dgm-mnav[hidden]{display:none}
.dgm-mnav a{display:block;padding:14px 2px;font-size:17px;font-weight:600;color:#2A4252;text-decoration:none;border-bottom:1px solid #EEF1F4}
.dgm-mnav a.dgm-mnav-cta{margin:16px 0 8px;padding:15px 18px;border:0;border-radius:8px;background:#FFC873;color:#1F3550;text-align:center}
@media (max-width:1179px){.dgm-burger{display:flex}}
@media (min-width:1180px){.dgm-mnav{display:none!important}}
</style>
<script>document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector('.dgm-burger'),n=document.getElementById('dgm-mnav');if(!b||!n)return;function set(o){n.hidden=!o;b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu')}b.addEventListener('click',function(){set(n.hidden)});n.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)})});</script>
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
