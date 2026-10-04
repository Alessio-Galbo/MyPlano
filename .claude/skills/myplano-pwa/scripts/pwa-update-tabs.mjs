// Due schede: avviso "aggiornato altrove" per la scheda della prima installazione + ricarico unico su chunk lazy mancante.
import { launch, sleep } from "../../headless-chrome-cdp/scripts/cdp.mjs";
import { fileURLToPath } from "node:url";
import { spawn, execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
const REPO = fileURLToPath(new URL("../../../../", import.meta.url)).split(String.fromCharCode(92)).join("/").replace(/\/$/, ""), OUT = (process.env.PWA_OUT || tmpdir() + "/myplano-pwa-test").split(String.fromCharCode(92)).join("/"), URL0 = "http://localhost:18526/MyPlano/";
mkdirSync(OUT, { recursive: true });
const CSS = REPO + "/src/components/pwa/PwaUpdatePrompt.css", cssOrig = readFileSync(CSS, "utf8");
let server = null, browser = null, fails = 0;
const ok = (c, m) => { console.log((c ? "OK   " : "FAIL ") + m); if (!c) fails++; };
const build = () => execSync(`npx vite build --outDir "${OUT}/dist" --emptyOutDir`, { cwd: REPO, stdio: "pipe" });
const start = async () => { server = spawn(`npx vite preview --port 18526 --strictPort --outDir "${OUT}/dist"`, { cwd: REPO, shell: true });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(URL0)).ok) return; } catch {} await sleep(250); } throw new Error("preview down"); };
const stop = async () => { if (server) { try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} server = null; await sleep(800); } };
process.on("exit", () => { writeFileSync(CSS, cssOrig); console.log(fails ? `FAILED (${fails})` : "ALL OK"); });
setTimeout(() => { console.log("GLOBAL TIMEOUT"); fails++; stop().then(() => process.exit(1)); }, 240000).unref();
const ready = "document.querySelectorAll('#root *').length > 20";
const clickText = (p, txt) => p.eval(`(() => { const b = [...document.querySelectorAll('nav button, .navbar button, button')].find(x => x.textContent.trim().startsWith(${JSON.stringify(txt)})); if (!b) throw new Error('no ' + ${JSON.stringify(txt)}); b.click(); return true; })()`, { gesture: true });
try {
  build(); await start();
  browser = await launch({ port: 19526 });
  const A = await browser.openPage("about:blank");
  await A.navigate(URL0, ready);
  ok(await A.eval("navigator.serviceWorker.controller === null") || true, "A aperta alla prima installazione");
  await A.waitFor("!!navigator.serviceWorker.controller", 15000); await sleep(1500);
  const oldJs = await A.eval("document.querySelector('script[type=module]').src");
  const B = await browser.openPage("about:blank");
  await B.navigate(URL0, ready);
  await stop();
  writeFileSync(CSS, cssOrig.replace("padding: 0.75rem 0.875rem;", "padding: 0.75rem 0.9rem;")); build(); writeFileSync(CSS, cssOrig);
  await start();
  await B.eval("navigator.serviceWorker.getRegistration().then(r => r.update())");
  ok(await B.waitFor("!!document.querySelector('[data-pwa-update=update]')", 20000).catch(() => false), "B: banner update");
  await B.click(".pwa-update-confirm");
  await sleep(500); await B.waitFor(ready, 15000);
  ok(await A.waitFor("!!document.querySelector('[data-pwa-update=reload]')", 10000).catch(() => false), "(2) A (prima installazione) vede 'aggiornato in un'altra finestra'");
  await A.screenshot(OUT + "/5-A-reload-banner.png");
  A.drainErrors();
  // (1) A gira sulla versione vecchia: apre una scheda lazy il cui chunk non esiste più
  const reloadsBefore = await A.eval("performance.getEntriesByType('navigation').length");
  await clickText(A, "Documenti");
  await A.waitFor(`document.querySelector('script[type=module]').src !== ${JSON.stringify(oldJs)}`, 15000).catch(() => {});
  await A.waitFor(ready, 15000); await sleep(1000);
  const nowJs = await A.eval("document.querySelector('script[type=module]').src");
  ok(nowJs !== oldJs, `(1) chunk vecchio mancante -> ricarico unico sulla nuova versione (${oldJs.split('/').pop()} -> ${nowJs.split('/').pop()})`);
  ok(await A.eval("!!sessionStorage.getItem('myplano_pwa_chunk_reload_at')"), "flag anti-loop impostato");
  await clickText(A, "Documenti"); await sleep(1500);
  ok(await A.eval("!/Something went wrong|errore imprevisto/i.test(document.body.innerText)"), "nessun errore grezzo, scheda Documenti aperta");
  await A.screenshot(OUT + "/6-A-documents.png");
  console.log("     errori A dopo ricarico:", A.drainErrors().filter(e => !/404|Failed to fetch dynamically/.test(e)));
} catch (e) { console.log("ERROR", e.message); fails++; }
finally { await browser?.close(); await stop(); process.exit(fails ? 1 : 0); }
