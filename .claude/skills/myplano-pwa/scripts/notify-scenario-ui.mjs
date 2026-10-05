// Passi 6-9 di notify-scenario.mjs: click -> centro notifiche, card Impostazioni (screenshot), app "installata", spento, permesso negato.
import { OUT, ORIGIN, URL0, ok, idbGet, notifs, closeAll, ready, clickTab, shotCard } from "./notify-scenario-lib.mjs";

export async function runUiSteps(browser, page) {
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
  await shotCard(page, "card-desktop.png");
  await shotCard(page, "card-mobile.png", 500);
  ok(!page.drainErrors().length, "console pulita (impostazioni)");
  // 8) installed app (display-mode emulated via matchMedia) -> periodic sync registered
  await page.send("Page.addScriptToEvaluateOnNewDocument", { source: "const mm = window.matchMedia.bind(window); window.matchMedia = (q) => /display-mode: standalone/.test(q) ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : mm(q);" });
  await page.navigate(URL0, ready);
  const tags = await page.waitFor("navigator.serviceWorker.ready.then(r => r.periodicSync.getTags()).then(t => t.length ? t : null)", 10000).catch(() => []);
  ok(tags.includes("myplano-deadlines"), "app installata: periodicSync registrato " + JSON.stringify(tags));
  await page.eval(clickTab("/Impostazioni/"), { gesture: true });
  await page.waitFor("document.querySelector('[data-capability]')?.dataset.capability === 'background'", 8000).catch(() => {});
  ok(await page.eval("document.querySelector('[data-capability]').dataset.capability") === "background", "card installata: 'anche ad app chiusa'");
  await shotCard(page, "card-mobile-installed.png", 300);
  // 9) switch off -> unregistered, mirror disabled
  await page.click("#system-notifications-toggle");
  await page.waitFor("navigator.serviceWorker.ready.then(r => r.periodicSync.getTags()).then(t => t.length === 0)", 8000).catch(() => {});
  ok((await page.eval("navigator.serviceWorker.ready.then(r => r.periodicSync.getTags())")).length === 0 && (await page.eval(idbGet("mirror"))).enabled === false, "spento: periodicSync rimosso, mirror.enabled = false");
  await browser.send("Browser.setPermission", { origin: ORIGIN, permission: { name: "notifications" }, setting: "denied" });
  await page.navigate(URL0, ready); await page.eval(clickTab("/Impostazioni/"), { gesture: true });
  ok(await page.waitFor("document.querySelector('[data-system-notifications]')?.dataset.systemNotifications === 'denied' && !!document.querySelector('.sysnotif-warning')", 8000).catch(() => false), "permesso negato: stato 'Bloccate dal browser' + istruzioni");
  await shotCard(page, "card-mobile-denied.png", 300);
  ok(!page.drainErrors().length, "console pulita (fine)");
}
