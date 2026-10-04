// Notifiche di sistema (vedi SKILL.md): build in OUT/dist, preview :18528 (/MyPlano/), CDP 19528.
// Permessi via CDP, notifica all'avvio, non ripetuta, mute, mirror IDB dopo modifica UI, periodicsync simulato,
// click -> centro notifiche, card Impostazioni (screenshot), app "installata" -> periodicSync registrato, permesso negato.
import { launch, sleep } from "../../headless-chrome-cdp/scripts/cdp.mjs";
import { fileURLToPath } from "node:url";
import { spawn, execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
const slash = (p) => p.split(String.fromCharCode(92)).join("/").replace(/\/$/, "");
const REPO = slash(fileURLToPath(new URL("../../../../", import.meta.url)));
const OUT = slash(process.env.NOTIFY_OUT || tmpdir() + "/myplano-notify-test");
mkdirSync(OUT, { recursive: true });
const ORIGIN = "http://localhost:18528", URL0 = ORIGIN + "/MyPlano/";
let server, browser, fails = 0;
const ok = (c, m) => { console.log((c ? "OK   " : "FAIL ") + m); if (!c) fails++; };
process.on("exit", () => console.log(fails ? `FAILED (${fails})` : "ALL OK"));
setTimeout(() => { console.log("GLOBAL TIMEOUT"); fails++; process.exit(1); }, 300000).unref();
const stop = () => { if (server) try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} };
const idbGet = (k) => `new Promise((res, rej) => { const r = indexedDB.open('myplano_notify', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => { const db = r.result; const g = db.transaction('kv').objectStore('kv').get('${k}'); g.onsuccess = () => { res(g.result); db.close(); }; g.onerror = () => rej(g.error); }; })`;
const idbClearLog = `new Promise((res) => { const r = indexedDB.open('myplano_notify', 1); r.onsuccess = () => { const db = r.result; const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put({}, 'log'); tx.oncomplete = () => { db.close(); res(true); }; }; })`;
const notifs = "navigator.serviceWorker.ready.then(r => r.getNotifications()).then(ns => ns.map(n => ({ title: n.title, body: n.body, tag: n.tag })))";
const closeAll = "navigator.serviceWorker.ready.then(r => r.getNotifications()).then(ns => { ns.forEach(n => n.close()); return true; })";
const ready = "document.querySelectorAll('#root *').length > 20";
const clickTab = (re) => `(() => { const b = [...document.querySelectorAll('.nav-tab, nav button')].find(x => ${re}.test(x.textContent)); b.click(); return true; })()`;
try {
  execSync(`npx vite build --outDir "${OUT}/dist" --emptyOutDir`, { cwd: REPO, stdio: "pipe" });
  server = spawn(`npx vite preview --port 18528 --strictPort --outDir "${OUT}/dist"`, { cwd: REPO, shell: true });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(URL0)).ok) break; } catch {} await sleep(250); }
  browser = await launch({ port: 19528 });
  const g = await browser.send("Browser.grantPermissions", { origin: ORIGIN, permissions: ["notifications", "periodicBackgroundSync"] });
  ok(!g.error, "permessi concessi via CDP (notifications, periodicBackgroundSync) " + (g.error?.message || ""));
  let page = await browser.openPage("about:blank");
  await page.navigate(URL0, ready);
  await page.waitFor("!!navigator.serviceWorker.controller", 15000); await sleep(1000);
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
  await page.eval(idbClearLog);
  // 1) notification at startup
  await page.navigate(URL0, ready);
  const n1 = await page.waitFor(`${notifs}.then(l => l.length ? l : null)`, 15000).catch(() => []);
  ok(n1.length === 1 && n1[0].title === "MyPlano · 3 scadenze", "all'apertura: una notifica riassuntiva " + JSON.stringify(n1));
  ok(/Gas in ritardo di 3 gg, Affitto oggi, Luce tra 2 gg/.test(n1[0]?.body || "") && !/Silenziosa/.test(n1[0]?.body || ""), "corpo: ritardi/oggi/preavviso, enableAlert off esclusa");
  const log = await page.eval(idbGet("log"));
  ok(Object.keys(log || {}).length === 3, "registro 'già notificato' in IDB: " + Object.keys(log || {}).join(" "));
  // 2) second start same day: nothing new
  await page.eval(closeAll); await page.navigate(URL0, ready); await sleep(4000);
  ok((await page.eval(notifs)).length === 0, "secondo avvio nello stesso giorno: nessuna notifica");
  // 3) global mute
  await page.eval(`localStorage.setItem('myplano_notifications_muted', 'true')`); await page.eval(idbClearLog);
  await page.navigate(URL0, ready); await sleep(4000);
  ok((await page.eval(notifs)).length === 0 && (await page.eval(idbGet("mirror"))).muted === true, "silenzia tutto: nessuna notifica (mirror.muted = true)");
  await page.eval(`localStorage.setItem('myplano_notifications_muted', 'false')`); await page.eval(idbClearLog);
  await page.navigate(URL0, ready); await page.waitFor(`${notifs}.then(l => l.length > 0)`, 10000); await page.eval(closeAll);
  ok(!page.drainErrors().length, "console pulita (avvio)");
  // 4) UI change of an expense -> mirror updated
  const before = (await page.eval(idbGet("mirror"))).items.map((i) => i.id);
  await page.eval(clickTab("/Spese/"), { gesture: true });
  const found = await page.waitFor(`!!document.querySelector('[id^="exp-alert-tA-"]')`, 8000).catch(async () => { console.log("     ids:", await page.eval("[...document.querySelectorAll('[id^=exp-alert]')].map(e => e.id).join(' ') + ' | tab: ' + document.querySelector('.nav-tab.active')?.textContent")); await page.screenshot(OUT + "/debug.png"); return false; });
  if (found) await page.eval(`(() => { document.querySelector('[id^="exp-alert-tA-"]').click(); return true; })()`, { gesture: true });
  const t0 = Date.now();
  const after = await page.waitFor(`${idbGet("mirror")}.then(m => m.items.some(i => i.id.startsWith('exp-tA@')) ? null : m.items.map(i => i.id))`, 15000).catch(() => null);
  const ms = Date.now() - t0;
  ok(before.some((i) => i.startsWith("exp-tA@")) && after && ms < 3000, `modifica spesa (avviso Affitto spento) -> mirror aggiornato subito (${ms} ms, evento, niente polling): ${JSON.stringify(after)}`);
  // 5) periodicsync dispatched by CDP -> notification from the SW
  await page.eval(idbClearLog); await page.eval(closeAll);
  const regs = []; browser.on((m) => { if (m.method === "ServiceWorker.workerRegistrationUpdated") regs.push(...m.params.registrations); });
  await page.send("ServiceWorker.enable"); await sleep(800);
  const reg = regs.find((r) => r.scopeURL === URL0 && !r.isDeleted);
  const d = await page.send("ServiceWorker.dispatchPeriodicSyncEvent", { origin: ORIGIN, registrationId: reg?.registrationId, tag: "myplano-deadlines" });
  const n5 = await page.waitFor(`${notifs}.then(l => l.length ? l : null)`, 10000).catch(() => []);
  ok(!d.error && n5[0]?.title === "MyPlano · 2 scadenze", "evento periodicsync (CDP) -> notifica dal SW " + JSON.stringify(n5) + (d.error?.message || ""));
  // 6) click -> notification center (SW message path and ?notifications=open path)
  const sw = (await browser.targets()).find((x) => x.type === "service_worker" && x.url.startsWith(URL0));
  const swp = await browser.attach(sw.targetId);
  await swp.eval("clients.matchAll({ type: 'window' }).then(l => { l.forEach(c => c.postMessage({ type: 'myplano-open-notifications' })); return l.length; })");
  ok(await page.waitFor("!!document.querySelector('.notif-center-body')", 8000).catch(() => false), "click notifica (messaggio dal SW) -> centro notifiche aperto");
  await page.navigate(URL0 + "?notifications=open", ready);
  ok(await page.waitFor("!!document.querySelector('.notif-center-body') && !location.search", 8000).catch(() => false), "app aperta da notifica (?notifications=open) -> centro notifiche, parametro rimosso");
  await page.screenshot(OUT + "/center.png");
  // 7) settings card
  await page.navigate(URL0, ready); await page.eval(closeAll);
  await page.eval(clickTab("/Impostazioni/"), { gesture: true });
  await page.waitFor("!!document.querySelector('[data-system-notifications]')", 8000);
  const cap = await page.eval("document.querySelector('[data-capability]').dataset.capability + ' / ' + document.querySelector('[data-system-notifications]').dataset.systemNotifications");
  ok(cap === "installForBackground / active", "card: stato e riga dispositivo (scheda browser) " + cap);
  await page.click(".sysnotif-test-btn");
  ok(await page.waitFor(`${notifs}.then(l => l.some(n => n.tag === 'myplano-test'))`, 5000).catch(() => false), "notifica di prova");
  const muteToggle = "(() => { const row = [...document.querySelectorAll('.settings-row')].find(r => /Silenzia/.test(r.textContent)); row.querySelector('input').click(); return true; })()";
  await page.eval(muteToggle, { gesture: true }); const tm = Date.now();
  const mutedNow = await page.waitFor(`${idbGet("mirror")}.then(m => m.muted === true)`, 3000).catch(() => false);
  ok(mutedNow, `silenzia da Impostazioni -> mirror.muted subito (${Date.now() - tm} ms)`);
  await page.eval(muteToggle, { gesture: true });
  ok(await page.waitFor(`${idbGet("mirror")}.then(m => m.muted === false)`, 3000).catch(() => false), "riattiva -> mirror.muted = false");
  await page.eval("(() => { document.querySelector('[data-system-notifications]').scrollIntoView({ block: 'start' }); window.scrollBy(0, -220); return true; })()");
  await sleep(400); await page.screenshot(OUT + "/card-desktop.png");
  await page.mobile(390, 844, 2); await sleep(500);
  await page.eval("(() => { document.querySelector('[data-system-notifications]').scrollIntoView({ block: 'start' }); window.scrollBy(0, -220); return true; })()");
  await sleep(400); await page.screenshot(OUT + "/card-mobile.png"); await page.desktop();
  ok(!page.drainErrors().length, "console pulita (impostazioni)");
  // 8) installed app (display-mode emulated via matchMedia) -> periodic sync registered
  await page.send("Page.addScriptToEvaluateOnNewDocument", { source: "const mm = window.matchMedia.bind(window); window.matchMedia = (q) => /display-mode: standalone/.test(q) ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : mm(q);" });
  await page.navigate(URL0, ready);
  const tags = await page.waitFor("navigator.serviceWorker.ready.then(r => r.periodicSync.getTags()).then(t => t.length ? t : null)", 10000).catch(() => []);
  ok(tags.includes("myplano-deadlines"), "app installata: periodicSync registrato " + JSON.stringify(tags));
  await page.eval(clickTab("/Impostazioni/"), { gesture: true });
  await page.waitFor("document.querySelector('[data-capability]')?.dataset.capability === 'background'", 8000).catch(() => {});
  ok(await page.eval("document.querySelector('[data-capability]').dataset.capability") === "background", "card installata: 'anche ad app chiusa'");
  await page.mobile(390, 844, 2); await sleep(300);
  await page.eval("(() => { document.querySelector('[data-system-notifications]').scrollIntoView({ block: 'start' }); window.scrollBy(0, -220); return true; })()");
  await sleep(400); await page.screenshot(OUT + "/card-mobile-installed.png"); await page.desktop();
  // 9) switch off -> unregistered, mirror disabled
  await page.click("#system-notifications-toggle");
  await page.waitFor("navigator.serviceWorker.ready.then(r => r.periodicSync.getTags()).then(t => t.length === 0)", 8000).catch(() => {});
  ok((await page.eval("navigator.serviceWorker.ready.then(r => r.periodicSync.getTags())")).length === 0 && (await page.eval(idbGet("mirror"))).enabled === false, "spento: periodicSync rimosso, mirror.enabled = false");
  await browser.send("Browser.setPermission", { origin: ORIGIN, permission: { name: "notifications" }, setting: "denied" });
  await page.navigate(URL0, ready); await page.eval(clickTab("/Impostazioni/"), { gesture: true });
  ok(await page.waitFor("document.querySelector('[data-system-notifications]')?.dataset.systemNotifications === 'denied' && !!document.querySelector('.sysnotif-warning')", 8000).catch(() => false), "permesso negato: stato 'Bloccate dal browser' + istruzioni");
  await page.mobile(390, 844, 2); await sleep(300);
  await page.eval("(() => { document.querySelector('[data-system-notifications]').scrollIntoView({ block: 'start' }); window.scrollBy(0, -220); return true; })()");
  await sleep(400); await page.screenshot(OUT + "/card-mobile-denied.png"); await page.desktop();
  ok(!page.drainErrors().length, "console pulita (fine)");
} catch (e) { console.log("ERROR", e.message); fails++; }
finally { await browser?.close(); stop(); process.exit(fails ? 1 : 0); }
