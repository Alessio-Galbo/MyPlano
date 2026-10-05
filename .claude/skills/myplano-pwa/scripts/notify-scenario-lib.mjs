// Helper di notify-scenario.mjs: percorsi, preview :18528, esito OK/FAIL, snippet JS (IDB, notifiche, tab), dati e screenshot.
import { sleep } from "../../headless-chrome-cdp/scripts/cdp.mjs";
import { fileURLToPath } from "node:url";
import { spawn, execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
const slash = (p) => p.split(String.fromCharCode(92)).join("/").replace(/\/$/, "");
export const REPO = slash(fileURLToPath(new URL("../../../../", import.meta.url)));
export const OUT = slash(process.env.NOTIFY_OUT || tmpdir() + "/myplano-notify-test");
mkdirSync(OUT, { recursive: true });
export const ORIGIN = "http://localhost:18528", URL0 = ORIGIN + "/MyPlano/";
export const result = { fails: 0 };
export const ok = (c, m) => { console.log((c ? "OK   " : "FAIL ") + m); if (!c) result.fails++; };
let server;
export const startPreview = async () => {
  execSync(`npx vite build --outDir "${OUT}/dist" --emptyOutDir`, { cwd: REPO, stdio: "pipe" });
  server = spawn(`npx vite preview --port 18528 --strictPort --outDir "${OUT}/dist"`, { cwd: REPO, shell: true });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(URL0)).ok) break; } catch {} await sleep(250); }
};
export const stopPreview = () => { if (server) try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} };
export const idbGet = (k) => `new Promise((res, rej) => { const r = indexedDB.open('myplano_notify', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => { const db = r.result; const g = db.transaction('kv').objectStore('kv').get('${k}'); g.onsuccess = () => { res(g.result); db.close(); }; g.onerror = () => rej(g.error); }; })`;
export const idbClearLog = `new Promise((res) => { const r = indexedDB.open('myplano_notify', 1); r.onsuccess = () => { const db = r.result; const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put({}, 'log'); tx.oncomplete = () => { db.close(); res(true); }; }; })`;
export const notifs = "navigator.serviceWorker.ready.then(r => r.getNotifications()).then(ns => ns.map(n => ({ title: n.title, body: n.body, tag: n.tag })))";
export const closeAll = "navigator.serviceWorker.ready.then(r => r.getNotifications()).then(ns => { ns.forEach(n => n.close()); return true; })";
export const ready = "document.querySelectorAll('#root *').length > 20";
export const clickTab = (re) => `(() => { const b = [...document.querySelectorAll('.nav-tab, nav button')].find(x => ${re}.test(x.textContent)); b.click(); return true; })()`;

// Quattro spese di prova (oggi, tra 2 gg, 3 gg fa, avviso spento) nel profilo selezionato; notifiche attive, non silenziate.
export const seedExpenses = async (page) => {
  const today = await page.eval("(() => { const d = new Date(); const p = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); })()");
  const add = (n) => page.eval(`(() => { const [y, m, d] = '${today}'.split('-').map(Number); const x = new Date(y, m - 1, d + ${n}); const p = (k) => String(k).padStart(2, '0'); return x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate()); })()`);
  const pid = await page.eval("JSON.parse(localStorage.getItem('myplano_ui_selectedProfile') || 'null') || (JSON.parse(localStorage.getItem('myplano_profiles') || '[]')[0] || {}).id || null");
  const exps = [
    { id: "tA", title: "Affitto", amount: 500, frequency: "oneOff", nextDueDate: today, profileId: pid, category: "Casa" },
    { id: "tB", title: "Luce", amount: 50, frequency: "oneOff", nextDueDate: await add(2), profileId: pid, category: "Casa" },
    { id: "tC", title: "Gas", amount: 30, frequency: "oneOff", nextDueDate: await add(-3), profileId: pid, category: "Casa" },
    { id: "tD", title: "Silenziosa", amount: 9, frequency: "oneOff", nextDueDate: today, profileId: pid, enableAlert: false, category: "Casa" },
  ];
  await page.eval(`(() => { localStorage.setItem('myplano_expenses', ${JSON.stringify(JSON.stringify(exps))}); localStorage.setItem('myplano_documents', '[]'); localStorage.setItem('myplano_notifications_muted', 'false'); localStorage.setItem('myplano_ui_system_notifications', 'true'); localStorage.setItem('myplano_ui_selectedProfile', ${JSON.stringify(JSON.stringify(pid))}); return true; })()`);
};

// Screenshot della card Impostazioni in OUT/<name>; con `mobileSettle` (ms) passa a 390x844 e poi torna desktop.
export const shotCard = async (page, name, mobileSettle) => {
  if (mobileSettle) { await page.mobile(390, 844, 2); await sleep(mobileSettle); }
  await page.eval("(() => { document.querySelector('[data-system-notifications]').scrollIntoView({ block: 'start' }); window.scrollBy(0, -220); return true; })()");
  await sleep(400); await page.screenshot(OUT + "/" + name);
  if (mobileSettle) await page.desktop();
};
