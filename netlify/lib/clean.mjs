import ICONS from './icons.mjs';
export const ICON_KEYS = Object.keys(ICONS).filter((k) => !['check', 'phone', 'pin', 'mail'].includes(k));
const s = (v, max = 2000) => (typeof v === 'string' || typeof v === 'number' ? String(v).trim().slice(0, max) : '');
const lines = (v, n = 30) => (Array.isArray(v) ? v : []).map((x) => s(x, 300)).filter(Boolean).slice(0, n);
const slugify = (t) => s(t, 80).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export function clean(c) {
  c = c || {}; const st = c.settings || {};
  const o = { settings: {}, stats: [], services: [], projects: [], accreds: [], gallery: [] };
  for (const k of ['domain', 'name', 'legal', 'reg', 'tagline', 'heroTitle', 'heroText', 'phone', 'wa', 'email', 'address', 'about', 'equip', 'areas', 'metaTitle', 'metaDesc'])
    o.settings[k] = s(st[k], ['about', 'equip', 'heroText', 'metaDesc'].includes(k) ? 4000 : 400);
  if (!/^https?:\/\/[^\s"<>]+$/.test(o.settings.domain)) o.settings.domain = 'https://www.tumzabonny.co.za';
  for (const t of (Array.isArray(c.stats) ? c.stats : []).slice(0, 8)) o.stats.push({ n: s(t.n, 30), l: s(t.l, 80) });
  const seen = new Set();
  for (const v of (Array.isArray(c.services) ? c.services : []).slice(0, 40)) {
    const slug = slugify(v.slug) || slugify(v.name);
    if (!slug || seen.has(slug)) continue; seen.add(slug);
    const faq = []; for (const f of (Array.isArray(v.faq) ? v.faq : []).slice(0, 12)) { const q = s(f.q, 300); if (q) faq.push({ q, a: s(f.a, 1500) }); }
    o.services.push({ slug, icon: ICON_KEYS.includes(v.icon) ? v.icon : 'construction', name: s(v.name, 120), h1: s(v.h1, 200), short: s(v.short, 400), intro: s(v.intro, 4000), bullets: lines(v.bullets), faq, metaDesc: s(v.metaDesc, 320) });
  }
  for (const p of (Array.isArray(c.projects) ? c.projects : []).slice(0, 60)) { const t = s(p.t, 200); if (t) o.projects.push({ t, w: s(p.w, 300) }); }
  for (const p of (Array.isArray(c.accreds) ? c.accreds : []).slice(0, 30)) { const t = s(p.t, 200); if (t) o.accreds.push({ t, d: s(p.d, 300) }); }
  for (const g of (Array.isArray(c.gallery) ? c.gallery : []).slice(0, 200)) { const url = s(g.url, 1000); if (/^https?:\/\/[^\s"<>]+$/i.test(url)) o.gallery.push({ url, caption: s(g.caption, 120), alt: s(g.alt, 200), tag: s(g.tag, 40) }); }
  return o;
}
