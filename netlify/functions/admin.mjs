import DEFAULT from '../lib/default-content.mjs';
import { clean, ICON_KEYS } from '../lib/clean.mjs';
import { isAuthed, passwordOk, makeToken, cookie, configured } from '../lib/auth.mjs';
import { createHash } from 'node:crypto';

const J = (o, status = 200, extra = {}) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });
const stamp = () => new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14).replace(/^(\d{8})/, '$1-');
async function history(store) { const r = await store.list({ prefix: 'history/' }); return r.blobs.map((b) => b.key.slice(8)).sort().reverse(); }

export async function handle(req, ip, store) {
  const a = new URL(req.url).searchParams.get('a') || '';
  const post = req.method === 'POST';
  if (post && (req.headers.get('x-tb') !== '1' || !(req.headers.get('content-type') || '').includes('application/json'))) return J({ error: 'Bad request' }, 400);
  let body = {}; if (post) { try { body = await req.json(); } catch { body = {}; } }

  if (a === 'login' && post) {
    if (!configured()) return J({ error: 'ADMIN_PASSWORD is not set in Netlify (it must be at least 10 characters).' }, 500);
    const key = 'login/' + createHash('sha1').update(String(ip)).digest('hex'), now = Date.now();
    let t = (await store.get(key, { type: 'json' }).catch(() => null)) || []; t = t.filter((x) => x > now - 900000);
    if (t.length >= 5) return J({ error: 'Too many attempts. Try again in 15 minutes.' }, 429);
    if (!passwordOk(body.password || '')) { t.push(now); await store.setJSON(key, t); return J({ error: 'Wrong password.' }, 401); }
    await store.delete(key).catch(() => {});
    return J({ ok: 1 }, 200, { 'Set-Cookie': cookie(makeToken(), 28800) });
  }
  if (a === 'logout') return J({ ok: 1 }, 200, { 'Set-Cookie': cookie('', 0) });
  if (a === 'me') return J({ in: isAuthed(req), configured: configured() });
  if (!isAuthed(req)) return J({ error: 'Not logged in' }, 401);

  const live = async () => (await store.get('content', { type: 'json' })) || DEFAULT;
  if (a === 'load') { const d = await store.get('draft', { type: 'json' }); const l = await live(); return J({ live: l, draft: d || l, hasDraft: !!d, history: await history(store), icons: ICON_KEYS }); }
  if (!post) return J({ error: 'Unknown action' }, 400);
  if (a === 'save') { const c = clean(body.content); if (!c.services.length) return J({ error: 'You need at least one service.' }, 400); await store.setJSON('draft', c); return J({ ok: 1, draft: c }); }
  if (a === 'publish') {
    const d = await store.get('draft', { type: 'json' }); if (!d) return J({ error: 'Nothing to publish. Save a draft first.' }, 400);
    const c = clean(d), old = await live();
    await store.setJSON('history/content-' + stamp(), old);
    await store.setJSON('content', c); await store.delete('draft');
    const h = await history(store); for (const x of h.slice(20)) await store.delete('history/' + x);
    return J({ ok: 1, live: c, history: h.slice(0, 20) });
  }
  if (a === 'discard') { await store.delete('draft'); return J({ ok: 1, live: await live() }); }
  if (a === 'restore') {
    const f = String(body.file || ''); if (!/^content-\d{8}-\d{6}$/.test(f)) return J({ error: 'Version not found.' }, 404);
    const o = await store.get('history/' + f, { type: 'json' }); if (!o) return J({ error: 'Version not found.' }, 404);
    const c = clean(o); await store.setJSON('draft', c); return J({ ok: 1, draft: c });
  }
  return J({ error: 'Unknown action' }, 400);
}
export default async (req, context) => {
  const { getStore } = await import('@netlify/blobs');
  return handle(req, context?.ip || 'x', getStore({ name: 'tumza', consistency: 'strong' }));
};
export const config = { path: '/api/admin' };
