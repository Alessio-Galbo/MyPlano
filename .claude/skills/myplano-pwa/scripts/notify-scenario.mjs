// Notifiche di sistema (vedi SKILL.md): build in OUT/dist, preview :18528 (/MyPlano/), CDP 19528.
// Permessi via CDP, notifica all'avvio, non ripetuta, mute, mirror IDB dopo modifica UI, periodicsync simulato;
// poi notify-scenario-ui.mjs: click -> centro notifiche, card Impostazioni (screenshot), app "installata", permesso negato.
import { launch, sleep } from "../../headless-chrome-cdp/scripts/cdp.mjs";
import { OUT, ORIGIN, URL0, result, ok, startPreview, stopPreview, seedExpenses } from "./notify-scenario-lib.mjs";
import { idbGet, idbClearLog, notifs, closeAll, ready, clickTab } from "./notify-scenario-lib.mjs";
import { runUiSteps } from "./notify-scenario-ui.mjs";
let browser;
process.on("exit", () => console.log(result.fails ? `FAILED (${result.fails})` : "ALL OK"));
setTimeout(() => { console.log("GLOBAL TIMEOUT"); result.fails++; process.exit(1); }, 300000).unref();
try {
  await startPreview();
  browser = await launch({ port: 19528 });
  const g = await browser.send("Browser.grantPermissions", { origin: ORIGIN, permissions: ["notifications", "periodicBackgroundSync"] });
  ok(!g.error, "permessi concessi via CDP (notifications, periodicBackgroundSync) " + (g.error?.message || ""));
  const page = await browser.openPage("about:blank");
  await page.navigate(URL0, ready);
  await page.waitFor("!!navigator.serviceWorker.controller", 15000); await sleep(1000);
  await seedExpenses(page);
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
  await runUiSteps(browser, page);
} catch (e) { console.log("ERROR", e.message); result.fails++; }
finally { await browser?.close(); stopPreview(); process.exit(result.fails ? 1 : 0); }
