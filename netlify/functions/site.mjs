import DEFAULT from '../lib/default-content.mjs';
import { renderGallery, renderHome, renderService, renderNotFound, renderSitemap, renderRobots } from '../lib/render.mjs';
import { isAuthed } from '../lib/auth.mjs';

export async function handle(req, store) {
  const url = new URL(req.url), path = url.pathname.replace(/\/+$/, '') || '/';
  const preview = url.searchParams.has('preview') && isAuthed(req);
  let c = null;
  try { c = (preview && (await store.get('draft', { type: 'json' }))) || (await store.get('content', { type: 'json' })); } catch (_) {}
  c = c || DEFAULT; c.gallery = c.gallery || [];
  const cache = preview ? 'no-store' : 'public, max-age=0, must-revalidate';
  const cdn = preview ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300';
  const send = (body, type, status = 200) => new Response(body, { status, headers: { 'Content-Type': type, 'Cache-Control': cache, 'Netlify-CDN-Cache-Control': cdn } });
  const H = 'text/html; charset=utf-8';
  if (path === '/sitemap.xml') return send(renderSitemap(c), 'application/xml; charset=utf-8');
  if (path === '/robots.txt') return send(renderRobots(c), 'text/plain; charset=utf-8');
  if (path === '/gallery' || path === '/gallery.html') return send(renderGallery(c, { preview }), H);
  if (path === '/') return send(renderHome(c, { preview }), H);
  const m = /^\/services\/([a-z0-9-]+)(?:\.html)?$/.exec(path);
  const page = m && renderService(c, m[1], { preview });
  return page ? send(page, H) : send(renderNotFound(c), H, 404);
}
export default async (req) => {
  const { getStore } = await import('@netlify/blobs');
  return handle(req, getStore({ name: 'tumza', consistency: 'strong' }));
};
export const config = { path: ['/', '/gallery', '/gallery.html', '/services/*', '/sitemap.xml', '/robots.txt'] };
