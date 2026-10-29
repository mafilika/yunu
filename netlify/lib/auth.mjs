import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
const pw = () => process.env.ADMIN_PASSWORD || '';
const secret = () => createHash('sha256').update('tumza-session:' + pw()).digest();
const b64 = (s) => Buffer.from(s).toString('base64url');
const sig = (p) => createHmac('sha256', secret()).update(p).digest('base64url');
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
export const configured = () => pw().length >= 10;
export function passwordOk(input) {
  if (!configured()) return false;
  const h = (s) => createHash('sha256').update(String(s)).digest();
  return timingSafeEqual(h(input), h(pw()));
}
export function makeToken() { const p = b64(JSON.stringify({ exp: Date.now() + 8 * 3600e3 })); return p + '.' + sig(p); }
export function isAuthed(req) {
  if (!configured()) return false;
  const m = /(?:^|;\s*)tb_session=([^;]+)/.exec(req.headers.get('cookie') || '');
  if (!m) return false;
  const [p, s] = m[1].split('.');
  if (!p || !s || !same(s, sig(p))) return false;
  try { return JSON.parse(Buffer.from(p, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
export const cookie = (v, age) => `tb_session=${v}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
