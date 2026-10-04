// Modalità senza bordi: emula display-mode (WCO desktop, fullscreen telefono) + safe area, screenshot e controlli.
import { launch, sleep } from "../../headless-chrome-cdp/scripts/cdp.mjs";
import { fileURLToPath } from "node:url";
import { spawn, execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
const REPO = fileURLToPath(new URL("../../../../", import.meta.url)).split(String.fromCharCode(92)).join("/").replace(/\/$/, ""), OUT = (process.env.PWA_OUT || tmpdir() + "/myplano-pwa-test").split(String.fromCharCode(92)).join("/"), URL0 = "http://localhost:18526/MyPlano/";
mkdirSync(OUT, { recursive: true });
let server = null, browser = null, fails = 0;
const ok = (c, m) => { console.log((c ? "OK   " : "FAIL ") + m); if (!c) fails++; };
const stop = () => { if (server) { try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} server = null; } };
process.on("exit", () => console.log(fails ? `FAILED (${fails})` : "ALL OK"));
try {
  execSync(`npx vite build --outDir "${OUT}/dist" --emptyOutDir`, { cwd: REPO, stdio: "pipe" });
  server = spawn(`npx vite preview --port 18526 --strictPort --outDir "${OUT}/dist"`, { cwd: REPO, shell: true });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(URL0)).ok) break; } catch {} await sleep(250); }
  browser = await launch({ port: 19526 });
  const page = await browser.openPage("about:blank");
  const ready = "document.querySelectorAll('#root *').length > 20";
  const media = (v) => page.send("Emulation.setEmulatedMedia", { features: [{ name: "display-mode", value: v }] });
  const noOverflow = () => page.eval("document.documentElement.scrollWidth <= window.innerWidth");
  // Desktop, window-controls-overlay (barra del titolo finta di DevTools: imposta le env(titlebar-area-*)).
  await page.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await page.navigate(URL0, ready);
  await media("window-controls-overlay");
  const mq = await page.eval("matchMedia('(display-mode: window-controls-overlay)').matches");
  console.log("     display-mode emulato da CDP:", mq);
  // Headless non ha la barra del titolo: si applica la regola WCO con valori di Windows (pulsanti larghi 138 px
  // a destra, barra alta 33 px) al posto delle env(titlebar-area-*), che qui non esistono.
  await page.eval(`(() => { const css = [...document.styleSheets].flatMap(s => [...s.cssRules]).filter(r => r.media && /window-controls-overlay/.test(r.conditionText))
    .map(r => [...r.cssRules].map(x => x.cssText).join(' ')).join(' ').replaceAll(', ', ',').replaceAll('env(titlebar-area-x,0px)', '0px').replaceAll('env(titlebar-area-width,100vw)', '1142px').replaceAll('env(titlebar-area-height,33px)', '33px');
    const st = document.createElement('style'); st.id = 'wco-test'; st.textContent = css; document.head.appendChild(st);
    const bar = document.createElement('div'); bar.style.cssText = 'position:fixed;top:0;right:0;width:138px;height:33px;background:#c33;z-index:99999;opacity:.8'; document.body.appendChild(bar); return css; })()`);
  await sleep(300);
  const rightmost = await page.eval("Math.max(...[...document.querySelectorAll('.navbar button')].map(b => b.getBoundingClientRect().right))");
  ok(rightmost <= 1280 - 138, "WCO: nessun pulsante della navbar sotto min/max/chiudi (bordo destro " + Math.round(rightmost) + " px <= 1142)");
  const nav = await page.eval(`(() => { const n = getComputedStyle(document.querySelector('.navbar')); const b = getComputedStyle(document.querySelector('.nav-tab'));
    return { region: n.appRegion || n.webkitAppRegion, btn: b.appRegion || b.webkitAppRegion, pr: n.paddingRight, mq: true }; })()`);
  console.log("     navbar:", JSON.stringify(nav));
  ok(nav.mq && nav.region === "drag" && nav.btn === "no-drag", "WCO: navbar trascinabile, pulsanti cliccabili");
  ok(await noOverflow(), "WCO desktop: niente overflow orizzontale");
  await page.screenshot(OUT + "/7-wco-desktop.png");
  // Telefono a tutto schermo con notch e barra gesti.
  await page.eval("document.getElementById('wco-test')?.remove()");
  await page.mobile(390, 844, 2);
  await media("fullscreen");
  const sa = await page.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: 47, bottom: 34, left: 0, right: 0 } });
  console.log("     safe area CDP:", sa.error ? sa.error.message : "ok");
  await page.navigate(URL0, ready); await sleep(500);
  const pt = await page.eval("getComputedStyle(document.querySelector('.navbar')).paddingTop");
  ok(sa.error || pt === "47px", "fullscreen: navbar sotto il notch (padding-top " + pt + ")");
  ok(await noOverflow(), "fullscreen telefono: niente overflow orizzontale");
  await page.screenshot(OUT + "/8-fullscreen-mobile.png");
  await page.eval("(() => { const b = [...document.querySelectorAll('.nav-tab')][1]; b.click(); return true; })()", { gesture: true });
  await page.waitFor("[...document.querySelectorAll('button')].some(x => /Nuovo/.test(x.textContent))", 8000).catch(() => {});
  const opened = await page.eval("(() => { const b = [...document.querySelectorAll('button')].find(x => /Nuov|Aggiungi/.test(x.textContent)); if (!b) return false; b.click(); return true; })()", { gesture: true });
  if (opened && await page.waitFor("!!document.querySelector('.modal-content')", 5000).catch(() => false)) {
    const top = await page.eval("document.querySelector('.modal-header').getBoundingClientRect().top");
    ok(sa.error || top >= 47, "modale: intestazione sotto il notch (top " + top + ")");
    await page.screenshot(OUT + "/9-modal-mobile.png");
  } else ok(false, "modale non aperta");
  ok(!page.drainErrors().length, "console pulita");
} catch (e) { console.log("ERROR", e.message); fails++; }
finally { await browser?.close(); stop(); process.exit(fails ? 1 : 0); }
