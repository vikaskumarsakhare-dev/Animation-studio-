/* Pixy live updater (service worker).
   The app's script files are refreshed from GitHub by themselves, so the APK does not have to be
   downloaded again for every change. Works offline too: if GitHub cannot be reached, the files
   already inside the app are used.
   ONE-TIME SETUP: put your GitHub folder address in BASE (it must end with /), for example
   const BASE = 'https://raw.githubusercontent.com/YOURNAME/YOURREPO/main/';
   The repository must be public. BASE must point to the folder that holds editor.js and files.json. */
const BASE = '';

const CACHE = 'pixy-live';
const TYPES = { js: 'text/javascript;charset=utf-8', css: 'text/css;charset=utf-8', json: 'application/json;charset=utf-8' };
const ext = f => (f.split('.').pop() || '').toLowerCase();
const okName = n => /^[\w.-]+$/.test(n) && TYPES[ext(n)]; // html is never cached: the app's own page keeps its phone connection
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h); };

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const n = u.pathname.replace(/^\//, '');
  if (!okName(n)) return;
  e.respondWith(caches.open(CACHE).then(c => c.match('/' + n)).then(m => m || fetch(e.request)));
});

let busy = false;
async function check() {
  if (!BASE || busy) return 'off';
  busy = true;
  try {
    const c = await caches.open(CACHE);
    // a newly installed APK brings newer files: forget the old downloaded ones
    let sig = '';
    try { sig = hash(await (await fetch('/editor.js', { cache: 'no-store' })).text()); } catch (e) { }
    const old = await c.match('/__sig');
    if (sig && (!old || await old.text() !== sig)) {
      for (const k of await c.keys()) await c.delete(k);
      await c.put('/__sig', new Response(sig));
    }
    const ts = '?ts=' + Date.now();
    const list = await (await fetch(BASE + 'files.json' + ts, { cache: 'no-store' })).json();
    const got = [];
    for (const n of list) {
      if (!okName(n)) continue;
      const r = await fetch(BASE + n + ts, { cache: 'no-store' });
      if (!r.ok) return 'failed';
      got.push([n, await r.text()]);
    }
    const changed = [];
    for (const [n, text] of got) {
      const m = await c.match('/' + n);
      if (m && await m.text() === text) continue;
      await c.put('/' + n, new Response(text, { headers: { 'Content-Type': TYPES[ext(n)] } }));
      changed.push(n);
    }
    if (changed.length) (await self.clients.matchAll()).forEach(x => x.postMessage({ type: 'updated', files: changed }));
    return changed.length ? 'updated' : 'same';
  } catch (e) { return 'offline'; }
  finally { busy = false; }
}

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'check') e.waitUntil(check());
  if (d.type === 'reset') e.waitUntil(caches.delete(CACHE).then(() => e.source && e.source.postMessage({ type: 'reset-done' })));
});
