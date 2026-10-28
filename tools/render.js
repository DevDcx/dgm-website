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
    description: 'Drive Growth Management gives 2% of top-line revenue to organizations cleaning up the oceans and managing climate change, and uses AI to strengthen the human connections that grow your business.',
  },
  'Roundtable.dc.html': {
    out: 'roundtables/index.html', depth: 1,
    title: 'AI Profitability Growth Roundtable | Private Executive Roundtable for Retail Leaders | Drive Growth Management',
    description: 'A private, 12-seat virtual roundtable for leaders of multi-unit retail, restaurant and pharmacy chains on using AI to drive sales, keep good people and protect margins.',
  },
  'Brand.dc.html': {
    out: 'brand-growth-strategy/index.html', depth: 1,
    title: 'Brand Growth Strategy MasterClass | Compete on Customer Care, Not Price | Drive Growth Management',
    description: 'A half-day intensive for owners of multi-unit pharmacy, retail and service chains. Build your Brand Growth Strategy and compete on customer care, not price.',
  },
  'Blog.dc.html': {
    out: 'blog/index.html', depth: 1,
    title: 'Retail Growth Insights Blog | Sales, Profit and AI for Multi-Unit Chains | Drive Growth Management',
    description: 'Practical ideas for growing sales and profit across every store: customers, teams, marketing, margins and AI, for multi-unit pharmacy, retail and restaurant chains.',
  },
  'Growth.dc.html': {
    out: 'growth-framework/index.html', depth: 1,
    title: 'The G.R.O.W.T.H Framework from Radical Retail Growth | Drive Growth Management',
    description: 'The 6 principles behind the 8 Profit Drivers, from the book Radical Retail Growth by Dale Dubberley. Learn the framework and buy the book.',
  },
  'Resources.dc.html': {
    out: 'free-resources/index.html', depth: 1,
    title: 'Free Growth Resources from Radical Retail Growth | The Profit Drivers SCALE Method | Drive Growth Management',
    description: 'Free resources from the book Radical Retail Growth: the 5 steps of The Profit Drivers SCALE Method, blogs, videos, free growth tools and the DGM Profit Growth Academy.',
  },
  'Toolkit.dc.html': {
    out: 'free-resources/toolkit/index.html', depth: 2,
    title: 'Profit Growth Resources | Free Scorecards, ROI Calculators and Guides | Drive Growth Management',
    description: 'Free scorecards, ROI calculators, guides, templates and blog posts for each step of The Profit Drivers SCALE Method, for multi-unit pharmacy, retail and restaurant chains.',
  },
  'Academy.dc.html': {
    out: 'academy/index.html', depth: 1,
    title: 'DGM Profit Growth Academy | Members Training | Drive Growth Management',
    description: 'Members-only training for The Profit Drivers SCALE Method, for Drive Growth Management clients and subscribers.',
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
  '40b2a79132700729d8b230214d4baad7': 'roundtable-grid.jpg',
  '96ed7380fbc39b23895d57e7b0b45811': 'bryan-moyer.jpg',
  '19ae4b4c70e80af9e2b7eb6f8860a541': 'craig-foldes.jpg',
  '80292d16974e13a239af43fee8d8217e': 'raymone-simpkins.jpg',
  '0ef95c4ab388485dae82672ec453dc14': 'dale-dubberley.jpg',
  'e0e513773ad28d76147f21c1dbb4b26c': 'brand-growth-strategy-wheel.png',
  'facca8809cf49114d8b9ad6fa388edd3': 'paul-ziv.jpg',
  'f1e6d6b069be741d78cda9983cab3ca0': 'jeff-sutton.jpg',
  '9c0dff61a256085c15ada2f4ed2c59ab': 'step-brand-power-audit.png',
  '2779a9d6a1f32bcc111f953bc2325d81': 'step-customer-connect.png',
  '31c704c4c935ea23ab224db3af53c1ad': 'step-team-engage.png',
  '401f826202507611ff91b02da1b5df32': 'step-marketing-pro.png',
  'e4196b12c9013e3fc56715d78d4f41e2': 'step-ai-optimizer.png',
  '9610572ff4ddb4b2ba9c39f0191951e4': 'ai-joyce.jpg',
  'a12ed0e0d33c48f4f5ed01404debe3d2': 'ai-jamie.jpg',
  '286c3e1322a590b2bdcef7a9b8f84eeb': 'ai-julia.jpg',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const get = (scope, p) => p.trim().split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);

function render(t, scope) {
  t = t.replace(/<sc-for list="\{\{\s*([\w.]+)\s*\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (_, list, as, inner) =>
    (get(scope, list) || []).map((item, i) => render(inner, Object.assign({}, scope, { [as]: item, $index: i }))).join(''));
  t = t.replace(/<sc-if value="\{\{\s*([\w.]+)\s*\}\}"[^>]*>([\s\S]*?)<\/sc-if>/g, (_, v, inner) => (get(scope, v) ? render(inner, scope) : ''));
  return t.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_, p) => { const v = get(scope, p); return v == null ? '' : esc(v); });
}

// ---------- Blog posts (one file per post in posts/) ----------
// Each file starts with a few "key: value" lines (title, date, topic, dek, hero, heroAlt), then a line with ---, then the post in simple Markdown.
const topicLabels = { strategy: 'Growth strategy', customers: 'Customers', teams: 'Teams', marketing: 'Marketing', ai: 'AI and operations' };
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const niceDate = iso => { const [y, m, d] = iso.split('-').map(Number); return `${months[m - 1]} ${d}, ${y}`; };
// Wix-hosted images get resized by Wix; anything else is used as is.
const sized = (url, w, h) => {
  const m = url.match(/^(https:\/\/static\.wixstatic\.com\/media\/)([^/]+)$/);
  if (!m) return url;
  return h ? `${url}/v1/fill/w_${w},h_${h},al_c,q_85,enc_avif,quality_auto/${m[2]}` : `${url}/v1/fit/w_${w},h_${w},al_c,q_85,enc_avif,quality_auto/${m[2]}`;
};

function inlineMd(t) {
  t = esc(t);
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => `<img src="${sized(src, 1520)}" alt="${alt}" loading="lazy">`);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => `<a href="${href}">${text}</a>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  return t;
}
function mdToHtml(md) {
  return md.trim().split(/\n\s*\n/).map(block => {
    const lines = block.split('\n');
    let m;
    if ((m = block.match(/^(#{2,3}) (.+)$/))) return `<h${m[1].length}>${inlineMd(m[2])}</h${m[1].length}>`;
    if (lines.every(l => /^> /.test(l))) return `<blockquote>${inlineMd(lines.map(l => l.slice(2)).join(' '))}</blockquote>`;
    if (lines.every(l => /^- /.test(l))) return `<ul>\n${lines.map(l => `<li>${inlineMd(l.slice(2))}</li>`).join('\n')}\n</ul>`;
    if (lines.every(l => /^\d+\. /.test(l))) return `<ol>\n${lines.map(l => `<li>${inlineMd(l.replace(/^\d+\. /, ''))}</li>`).join('\n')}\n</ol>`;
    if (/^!\[[^\]]*\]\([^)]+\)$/.test(block.trim())) return inlineMd(block.trim());
    const cta = /^\[[^\]]+\]\([\w-]+\.dc\.html\)$/.test(block.trim());
    return `<p${cta ? ' class="post-cta"' : ''}>${inlineMd(lines.join(' '))}</p>`;
  }).join('\n');
}

const posts = fs.readdirSync(path.join(root, 'posts')).filter(f => f.endsWith('.md')).map(f => {
  const raw = fs.readFileSync(path.join(root, 'posts', f), 'utf8').replace(/\r\n/g, '\n');
  const cut = raw.indexOf('\n---\n');
  const meta = {};
  raw.slice(0, cut).split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
  const md = raw.slice(cut + 5);
  const words = md.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').split(/\s+/).filter(Boolean).length;
  if (!topicLabels[meta.topic]) throw new Error(`${f}: topic must be one of ${Object.keys(topicLabels).join(', ')}`);
  return {
    slug: f.replace(/\.md$/, ''), title: meta.title, dek: meta.dek, cat: meta.topic, topic: topicLabels[meta.topic],
    iso: meta.date, date: niceDate(meta.date), read: Math.max(1, Math.ceil(words / 230)),
    heroAlt: meta.heroAlt || '', hero: meta.hero, img: sized(meta.hero, 960, 640), heroLarge: sized(meta.hero, 2000), md,
  };
}).sort((a, b) => b.iso.localeCompare(a.iso));

// Extra props per design page (the blog index gets the post list)
const pageProps = {
  'Blog.dc.html': { posts: posts.map(p => Object.assign({}, p, { href: `${p.slug}/` })) },
};

function build(srcName, cfg, props, extraHead, bodyHtml) {
  const html = fs.readFileSync(path.join(root, 'src', srcName), 'utf8');
  const script = html.match(/<script type="text\/x-dc" data-dc-script[^>]*>([\s\S]*?)<\/script>/)[1];
  const Klass = new Function('DCLogic', script + '\nreturn Component;')(class { constructor() { this.props = {}; this.state = {}; } });
  const inst = new Klass();
  Object.assign(inst.props, props || {});
  const data = inst.renderVals();
  const body = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1];
  const helmet = (body.match(/<helmet>([\s\S]*?)<\/helmet>/) || ['', ''])[1];
  let page = render(body.replace(/<helmet>[\s\S]*?<\/helmet>/, ''), data);
  if (bodyHtml != null) page = page.replace('<post-body></post-body>', bodyHtml);

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
${extraHead || ''}
${helmet.trim()}
<style>html{scroll-behavior:smooth}*{box-sizing:border-box}img{max-width:100%}@media (max-width:1179px){nav[aria-label="Main"],.dgm-navcta{display:none!important}}
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

for (const [srcName, cfg] of Object.entries(pages)) build(srcName, cfg, pageProps[srcName]);

const attr = v => esc(v);
for (const post of posts) {
  const others = posts.filter(p => p !== post);
  const related = others.filter(p => p.cat === post.cat).concat(others.filter(p => p.cat !== post.cat)).slice(0, 3)
    .map(p => Object.assign({}, p, { href: `../${p.slug}/` }));
  const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.dek, image: post.heroLarge,
    datePublished: post.iso, author: { '@type': 'Person', name: 'Dale Dubberley' }, publisher: { '@type': 'Organization', name: 'Drive Growth Management' } };
  const head = `<meta property="og:type" content="article">
<meta property="og:title" content="${attr(post.title)}">
<meta property="og:description" content="${attr(post.dek)}">
<meta property="og:image" content="${attr(post.heroLarge)}">
<meta property="article:published_time" content="${post.iso}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
  build('BlogPost.dc.html', {
    out: `blog/${post.slug}/index.html`, depth: 2,
    title: `${attr(post.title)} | Drive Growth Management Blog`,
    description: attr(post.dek),
  }, { post, related }, head, mdToHtml(post.md));
}
