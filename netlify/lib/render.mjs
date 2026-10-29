import ICONS from './icons.mjs';
export const e = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl = (s) => e(s).replace(/\n/g, '<br>');
const tel = (p) => e(String(p).replace(/\s/g, ''));
const digits = (p) => String(p).replace(/\D/g, '');
const ic = (k, c = 'ic') => `<svg class="${e(c)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${e(ICONS[k] || ICONS.construction)}"/></svg>`;
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const wa = (c, msg) => `https://wa.me/${digits(c.settings.wa)}?text=${encodeURIComponent(msg)}`;
const dom = (c) => c.settings.domain.replace(/\/+$/, '');

function head(c, { title, desc, path, extra = '', preview }) {
  const s = c.settings, q = preview ? '?preview=1' : '', u = `${dom(c)}/${path}`;
  let o = `<!DOCTYPE html><html lang="en-ZA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${e(title)}</title><meta name="description" content="${e(desc)}"><meta name="robots" content="${preview ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}"><link rel="canonical" href="${e(u)}"><meta name="geo.region" content="ZA-FS"><meta name="geo.placename" content="Winburg"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="${e(u)}"><meta property="og:locale" content="en_ZA"><meta name="theme-color" content="#b5001a"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23b5001a'/%3E%3Cpath d='M18 78V44l32-24 32 24v34' fill='none' stroke='%23c9a227' stroke-width='7'/%3E%3C/svg%3E"><link rel="stylesheet" href="/css/style.css">${extra}</head><body>`;
  if (preview) o += `<div style="background:#c9a227;color:#222;text-align:center;padding:8px;font-weight:700;position:relative;z-index:40">PREVIEW of unpublished draft. Visitors do not see this. <a href="/admin/" style="text-decoration:underline">Back to admin</a></div>`;
  o += `<header><div class="w"><a href="/${q}" class="logo">${e(s.name)}<small>PTY LTD · WINBURG</small></a><button id="mb" aria-label="Menu"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button><nav id="nv">`;
  for (const [k, v] of [['about', 'About'], ['services', 'Services'], ['projects', 'Projects'], ['accred', 'Accreditations'], ['contact', 'Contact']]) o += `<a href="/${q}#${k}">${v}</a>`;
  if ((c.gallery || []).length) o = o.replace('<a href="/' + q + '#accred">', `<a href="/gallery.html${q}">Gallery</a><a href="/${q}#accred">`);
  return o + '</nav></div></header>';
}
function foot(c, { preview }) {
  const s = c.settings, q = preview ? '?preview=1' : '';
  return `<footer><div class="w"><p><b>${e(s.legal)}</b> · Reg. ${e(s.reg)}</p><p>${e(s.address)} · <a href="tel:${tel(s.phone)}">${e(s.phone)}</a> · <a href="mailto:${e(s.email)}">${e(s.email)}</a></p><p class="fl">${c.services.map((v) => `<a href="/services/${e(v.slug)}.html${q}">${e(v.name)}</a>`).join(' · ')}</p><p style="margin-top:8px">© <span id="yr">${new Date().getFullYear()}</span> ${e(s.legal)}. All rights reserved.</p></div></footer><a id="wa" href="${e(wa(c, `Hello ${s.legal}, I would like a quote.`))}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11 19.800L3 29l6.400-2A13 13 0 1 0 16 3zm7.500 18.300c-.3.900-1.800 1.700-2.500 1.800-.6.100-1.400.1-2.300-.1-.5-.2-1.200-.4-2-.8-3.600-1.600-5.900-5.200-6.100-5.400-.2-.2-1.400-1.900-1.400-3.600s.9-2.500 1.200-2.900c.3-.3.700-.4.900-.4h.7c.2 0 .5-.1.800.6l1.100 2.700c.1.200.1.400 0 .6l-.4.600-.5.600c-.2.200-.3.400-.1.700.2.300.9 1.500 2 2.400 1.400 1.200 2.500 1.600 2.900 1.800.3.200.5.100.7-.1l.9-1.100c.2-.3.500-.2.800-.1l2.500 1.200c.3.200.5.200.6.400.1.100.1.800-.2 1.600z"/></svg></a><script src="/js/main.js"></script></body></html>`;
}
function orgLd(c) {
  const s = c.settings, d = dom(c);
  return ld({ '@context': 'https://schema.org', '@type': ['GeneralContractor', 'LocalBusiness'], name: s.legal, url: d, telephone: s.phone, email: s.email,
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: 'Winburg', postalCode: '9420', addressRegion: 'Free State', addressCountry: 'ZA' },
    areaServed: s.areas.replace(/ and /g, ', ').split(',').map((x) => x.trim()).filter(Boolean),
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: c.services.map((v) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: v.name, url: `${d}/services/${v.slug}.html` } })) } });
}
export function renderHome(c, { preview = false } = {}) {
  const s = c.settings, q = preview ? '?preview=1' : '';
  return head(c, { title: s.metaTitle, desc: s.metaDesc, path: '', extra: orgLd(c), preview }) + `
<main id="top"><div class="hero"><i class="sh s1"></i><i class="sh s2"></i><i class="sh s3"></i><div class="w"><span class="tag">${e(s.tagline)}</span><h1>${e(s.heroTitle)}</h1><p>${nl(s.heroText)}</p>
<div class="b"><a class="btn" href="#contact">Get a Free Quote</a><a class="btn o" href="tel:${tel(s.phone)}">${ic('phone', 'ic ico')} ${e(s.phone)}</a></div></div></div>
<div class="stats"><div class="w">${c.stats.map((t) => `<div class="rv"><b data-n="${e(t.n)}">${e(t.n)}</b><span>${e(t.l)}</span></div>`).join('')}</div></div>
<section id="about"><div class="w two"><div class="rv"><h2>About ${e(s.legal)}</h2><p>${nl(s.about)}</p><p style="margin-top:10px"><b>Reg. No:</b> ${e(s.reg)}</p></div><div class="eq rv"><h3>${ic('cog', 'ic ico')} Our Equipment</h3><p style="margin-top:8px">${nl(s.equip)}</p></div></div></section>
<section id="services" class="alt"><div class="w"><h2>Our Services</h2><p class="sub">Select a service to learn more.</p><div class="g">${c.services.map((v) => `<a class="c rv" href="/services/${e(v.slug)}.html${q}"><div class="i">${ic(v.icon)}</div><h3>${e(v.name)}</h3><p>${e(v.short)}</p></a>`).join('')}</div></div></section>
<section id="projects"><div class="w"><h2>Completed Projects</h2><p class="sub">Trusted by municipalities, government departments and private clients.</p><ul class="pl rv">${c.projects.map((p) => `<li><b>${e(p.t)}</b><span>${e(p.w)}</span></li>`).join('')}</ul></div></section>
${galleryPreview(c, q)}
<section id="accred" class="alt"><div class="w"><h2>Accreditations</h2><p class="sub">Registered, compliant and tender ready.</p><div class="g">${c.accreds.map((a) => `<div class="c rv"><div class="i">${ic('check')}</div><h3>${e(a.t)}</h3><p>${e(a.d)}</p></div>`).join('')}</div></div></section>
<section id="areas"><div class="w"><h2>Areas We Serve</h2><p class="sub">${e(s.areas)}.</p></div></section>
<section id="contact" class="alt"><div class="w two"><div class="rv"><h2>Contact Us</h2><p>${ic('pin', 'ic ico')} ${e(s.address)}</p><p>${ic('phone', 'ic ico')} <a href="tel:${tel(s.phone)}">${e(s.phone)}</a></p><p>${ic('mail', 'ic ico')} <a href="mailto:${e(s.email)}">${e(s.email)}</a></p><p style="margin-top:14px"><a class="btn r" href="${e(wa(c, `Hello ${s.legal}, I would like a quote.`))}" target="_blank" rel="noopener">Chat on WhatsApp</a></p></div>
<form id="qf" class="rv" data-wa="${digits(s.wa)}" data-name="${e(s.legal)}"><input id="qn" placeholder="Your name" required><input id="qp" placeholder="Phone number" required><select id="qs">${c.services.map((v) => `<option>${e(v.name)}</option>`).join('')}</select><textarea id="qm" rows="4" placeholder="Tell us about your project"></textarea><button class="btn r">Send Request via WhatsApp</button></form></div></section></main>` + foot(c, { preview });
}
export function renderService(c, slug, { preview = false } = {}) {
  const v = c.services.find((x) => x.slug === slug); if (!v) return null;
  const s = c.settings, q = preview ? '?preview=1' : '', d = dom(c);
  const extra = orgLd(c)
    + ld({ '@context': 'https://schema.org', '@type': 'Service', name: v.name, serviceType: v.name, description: v.short, provider: { '@type': 'LocalBusiness', name: s.legal, telephone: s.phone }, areaServed: 'Free State, South Africa' })
    + ld({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: v.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })
    + ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: d + '/' }, { '@type': 'ListItem', position: 2, name: v.name, item: `${d}/services/${v.slug}.html` }] });
  return head(c, { title: `${v.h1 || v.name} | ${s.legal}`, desc: v.metaDesc || v.short, path: `services/${v.slug}.html`, extra, preview }) + `
<main><div class="hero small"><i class="sh s1"></i><i class="sh s2"></i><div class="w"><nav class="bc"><a href="/${q}">Home</a> › ${e(v.name)}</nav><h1>${e(v.h1 || v.name)}</h1><p>${e(v.short)}</p><a class="btn" href="${e(wa(c, `Hello ${s.legal}, I need a quote for ${v.name}.`))}" target="_blank" rel="noopener">Get a Quote on WhatsApp</a></div></div>
<section><div class="w two"><div class="rv"><h2>${e(v.name)}</h2><p>${nl(v.intro)}</p><h3 style="margin:18px 0 6px">What we offer</h3><ul class="ck">${v.bullets.map((b) => `<li>${e(b)}</li>`).join('')}</ul></div>
<div class="eq rv"><h3>Why choose ${e(s.legal)}?</h3><ul class="ck"><li>NHBRC registered home builder</li><li>CSD registered and B-BBEE Level 1</li><li>Proven government and municipal work</li><li>Competitive pricing and fast delivery</li></ul><p style="margin-top:14px"><b>Areas served:</b> ${e(s.areas)}.</p></div></div></section>
<section class="alt"><div class="w"><h2>Frequently Asked Questions</h2>${v.faq.map((f) => `<details class="rv"><summary>${e(f.q)}</summary><p>${e(f.a)}</p></details>`).join('')}</div></section>
<section><div class="w"><h2>Our Other Services</h2><div class="g">${c.services.filter((o) => o.slug !== v.slug).map((o) => `<a class="c" href="/services/${e(o.slug)}.html${q}"><div class="i">${ic(o.icon)}</div><h3>${e(o.name)}</h3></a>`).join('')}</div></div></section></main>` + foot(c, { preview });
}
const imgs = (list, lim) => list.slice(0, lim).map((g) => `<a href="${e(g.url)}" data-full="${e(g.url)}" data-cap="${e(g.caption)}" data-tag="${e(g.tag)}"><img src="${e(g.url)}" alt="${e(g.alt || g.caption || 'Tumza Bonny project photo')}" loading="lazy" decoding="async" referrerpolicy="no-referrer">${g.caption ? `<span>${e(g.caption)}</span>` : ''}</a>`).join('');
function galleryPreview(c, q) {
  const g = c.gallery || []; if (!g.length) return '';
  return `<section id="gallery"><div class="w"><h2>Project Gallery</h2><p class="sub">A look at our recent work across the Free State.</p><div class="gal rv">${imgs(g, 6)}</div><p style="margin-top:18px"><a class="btn r" href="/gallery.html${q}">View all ${g.length} photos</a></p></div></section>`;
}
export function renderGallery(c, { preview = false } = {}) {
  const s = c.settings, g = c.gallery || [], q = preview ? '?preview=1' : '', d = dom(c);
  const tags = [...new Set(g.map((x) => x.tag).filter(Boolean))];
  const extra = ld({ '@context': 'https://schema.org', '@type': 'ImageGallery', name: `Project gallery | ${s.legal}`, url: `${d}/gallery.html`, image: g.slice(0, 30).map((x) => ({ '@type': 'ImageObject', contentUrl: x.url, name: x.caption || undefined, description: x.alt || undefined })) });
  return head(c, { title: `Project Gallery | ${s.legal}, Winburg Free State`, desc: `Photos of construction, plumbing, painting, roofing and paving projects completed by ${s.legal} across the Free State.`, path: 'gallery.html', extra, preview }) + `
<main><div class="hero small"><i class="sh s1"></i><i class="sh s2"></i><div class="w"><nav class="bc"><a href="/${q}">Home</a> › Gallery</nav><h1>Project Gallery</h1><p>Real photos from our completed projects across the Free State.</p></div></div>
<section><div class="w">${g.length ? `${tags.length ? `<div class="flt"><button class="on" data-tag="">All</button>${tags.map((t) => `<button data-tag="${e(t)}">${e(t)}</button>`).join('')}</div>` : ''}<div class="gal">${imgs(g, 200)}</div>` : '<p class="sub">Photos coming soon.</p>'}</div></section></main>` + foot(c, { preview });
}
export function renderNotFound(c) {
  return head(c, { title: 'Page not found', desc: 'Page not found', path: '', preview: true }) + '<main><section><div class="w"><h2>Page not found</h2><p class="sub"><a href="/">Back to home</a></p></div></section></main>' + foot(c, { preview: false });
}
export function renderSitemap(c) {
  const d = dom(c), u = (p, pr) => `<url><loc>${e(d + p)}</loc><changefreq>monthly</changefreq><priority>${pr}</priority></url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${u('/', '1.0')}\n${c.services.map((v) => u(`/services/${v.slug}.html`, '0.8')).join('\n')}${(c.gallery || []).length ? '\n' + u('/gallery.html', '0.6') : ''}\n</urlset>`;
}
export const renderRobots = (c) => `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${dom(c)}/sitemap.xml\n`;
