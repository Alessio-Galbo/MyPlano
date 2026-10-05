// Helper di mobile-overflow.mjs: build+preview, pagina telefono con touch, click per testo/aria/selettore, misura overflow.
import { launch, sleep } from "../../headless-chrome-cdp/scripts/cdp.mjs";
import { fileURLToPath } from "node:url";
import { spawn, execSync } from "node:child_process";
import { tmpdir } from "node:os";
const slash = (p) => p.split(String.fromCharCode(92)).join("/").replace(/\/$/, "");
export const REPO = slash(fileURLToPath(new URL("../../../../", import.meta.url)));
export const OUT = slash(process.env.OVERFLOW_OUT || tmpdir() + "/myplano-overflow-test");
export const PORT = Number(process.env.OVERFLOW_PORT || 18530), URL0 = `http://localhost:${PORT}/MyPlano/`;
export const READY = "document.querySelectorAll('#root *').length > 20";
let server = null;
export async function serve() {
  if (!process.env.OVERFLOW_NO_BUILD) execSync(`npx vite build --outDir "${OUT}/dist" --emptyOutDir`, { cwd: REPO, stdio: "pipe" });
  server = spawn(`npx vite preview --port ${PORT} --strictPort --outDir "${OUT}/dist"`, { cwd: REPO, shell: true });
  for (let i = 0; i < 80; i++) { try { if ((await fetch(URL0)).ok) return; } catch {} await sleep(250); }
  throw new Error("preview non raggiungibile su " + URL0);
}
export const unserve = () => { if (server) try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} server = null; };
export async function phone(cdpPort) {
  const browser = await launch({ port: cdpPort });
  const page = await browser.openPage("about:blank");
  await page.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await page.send("Emulation.setEmitTouchEventsForMouse", { enabled: true, configuration: "mobile" });
  await page.send("DOM.enable");
  return { browser, page };
}
// Dati: "demo" = esempi iniziali (localStorage vuoto), "all"/"p2" = esempi con quel profilo selezionato, "zero" = nessun profilo/spesa/documento.
export async function load(page, data, w, h) {
  await page.mobile(w, h, 2);
  await page.navigate(URL0, READY);
  await page.eval(`(() => { localStorage.clear(); sessionStorage.clear(); ${/^(all|p\d)$/.test(data) ? `localStorage.setItem('myplano_ui_selectedProfile', '"${data}"');` : ""} ${data === "zero" ? "for (const k of ['profiles', 'expenses', 'documents']) localStorage.setItem('myplano_' + k, '[]');" : ""} return true; })()`);
  await page.navigate(URL0, READY); await sleep(600);
}
// Azione: "text:Regex" | "aria:Regex" | "css:selettore" | "event:nome" (CustomEvent su window, es. myplano:open-add-profile di profileActions.js) (primo elemento visibile, l'ultimo dialog aperto ha la precedenza).
export const act = (spec) => `(() => {
  const [kind, ...rest] = ${JSON.stringify(spec)}.split(':'); const q = rest.join(':');
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const dlg = [...document.querySelectorAll('[role=dialog]')].pop();
  const pick = (root) => kind === 'css' ? [...root.querySelectorAll(q)] : [...root.querySelectorAll('button, a, [role=button], [role=tab], label, .upcoming-item-row')]
    .filter((e) => new RegExp(q, 'i').test(kind === 'aria' ? (e.getAttribute('aria-label') || e.title || '') : e.textContent.trim()));
  const el = [...(dlg ? pick(dlg) : []), ...pick(document)].find(vis);
  if (!el) throw new Error('non trovato: ' + ${JSON.stringify(spec)}); el.scrollIntoView({ block: 'center' }); el.click(); return true; })()`;
export async function run(page, steps) {
  for (const s of steps) {
    if (s.startsWith("tab:")) await page.eval(`(() => { document.querySelectorAll('.nav-tab')[${s.slice(4)}].click(); return true; })()`, { gesture: true });
    else if (s.startsWith("event:")) await page.eval(`(() => { window.dispatchEvent(new CustomEvent(${JSON.stringify(s.slice(6))})); return true; })()`);
    else if (s.startsWith("type:")) { const [, sel, ...txt] = s.split("|"); await page.type(sel, txt.join("|")); }
    else await page.eval(act(s), { gesture: true });
    await sleep(s.startsWith("tab:") ? 1200 : 450);
  }
}
export async function upload(page, selector, file) {
  const doc = await page.send("DOM.getDocument", { depth: -1 });
  const node = await page.send("DOM.querySelector", { nodeId: doc.result.root.nodeId, selector });
  await page.send("DOM.setFileInputFiles", { nodeId: node.result.nodeId, files: [file] }); await sleep(700);
}
// Misura: pagina, body, dialog; elementi che escono a destra (solo il più esterno di ogni ramo) e contenitori con
// scroll orizzontale (overflow-x auto/scroll e contenuto più largo). OK_HSCROLL = scroll orizzontale voluto e segnalato.
export const MEASURE = `(() => {
  const W = innerWidth, OK_HSCROLL = /hscroll-ok/;
  const name = (e) => e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\\s+/).slice(0, 3).join('.') : '');
  // Tagliato = esce dallo schermo; ignorato solo dentro un contenitore che scorre davvero in orizzontale (lo conta hscroll).
  const inner = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) if (/auto|scroll/.test(getComputedStyle(x).overflowX) && x.scrollWidth > x.clientWidth + 1) return true; return false; };
  const out = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.right > W + 1 && r.left < W - 1 && getComputedStyle(e).visibility !== 'hidden'; };
  const dlg = [...document.querySelectorAll('[role=dialog]')].pop();
  const sticking = [...document.querySelectorAll('body *')].filter((e) => out(e) && !inner(e) && !(e.parentElement && out(e.parentElement)))
    .map((e) => name(e) + '(' + Math.round(e.getBoundingClientRect().right - W) + 'px)');
  const hscroll = [...document.querySelectorAll('body *')].filter((e) => { const s = getComputedStyle(e);
      return /auto|scroll/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 1 && e.clientHeight > 0 && !OK_HSCROLL.test(e.className); })
    .map((e) => name(e) + '[' + e.scrollWidth + '>' + e.clientWidth + ']');
  return { doc: document.documentElement.scrollWidth, body: document.body.scrollWidth, W,
    dialog: dlg ? dlg.scrollWidth + '/' + dlg.clientWidth : '-', sticking, hscroll,
    bad: document.documentElement.scrollWidth > W || document.body.scrollWidth > W || sticking.length > 0 || hscroll.length > 0 };
})()`;
export { sleep };
