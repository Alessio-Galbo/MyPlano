// Scroll orizzontale su telefono: build + preview (/MyPlano/, porta OVERFLOW_PORT o 18530, CDP +10000), touch, 360x780 e
// 390x844 (OVERFLOW_SIZES="360x780,390x844"; OVERFLOW_OUT, OVERFLOW_NO_BUILD=1 riusa la build); visita tab e modali con dati demo, "tutti i profili" e 0 profili.
// Per ogni stato: scrollWidth di html/body/dialog, elementi tagliati a destra, contenitori con scroll orizzontale.
// Uso: node .claude/skills/myplano-pwa/scripts/mobile-overflow.mjs [filtro-regex]  → tabella, exit 1 se c'è overflow.
// Scroll orizzontale voluto (es. tabella dati con indicatore): classe `hscroll-ok` sul contenitore. Screenshot in OUT/shots.
import { mkdirSync, writeFileSync } from "node:fs";
import { OUT, PORT, serve, unserve, phone, load, run, upload, MEASURE, sleep } from "./mobile-overflow-lib.mjs";
const LONG = "Alessandra Maria Bianchi-Rossi Della Valle";
const STEPS = [
  ["Bilancio", "demo", ["tab:0"]],
  ["Bilancio torta", "demo", ["tab:0", "text:^Grafico a Torta"]],
  ["Versa quota", "demo", ["tab:0", "text:^Versa"]],
  ["Dettaglio scadenza", "demo", ["tab:0", "css:.upcoming-item-row"]],
  ["Bilancio tutti", "all", ["tab:0"]],
  ["Versa collettivo", "all", ["tab:0", "text:^Versa"]],
  ["Bilancio Casa", "p2", ["tab:0"]],
  ["Spese Casa per categoria", "p2", ["tab:2", "text:^Per Categoria"]],
  ["Documenti", "demo", ["tab:1"]],
  ["Nuovo documento", "demo", ["tab:1", "text:^Nuovo Documento"]],
  ["Rinnovo documento", "demo", ["tab:1", "aria:^Rinnova"]],
  ["Modifica documento", "demo", ["tab:1", "aria:^Modifica:"]],
  ["Elimina documento", "demo", ["tab:1", "aria:^Elimina:"]],
  ["Spese", "demo", ["tab:2"]],
  ["Spese per categoria", "demo", ["tab:2", "text:^Per Categoria"]],
  ["Nuova spesa", "demo", ["tab:2", "text:^Nuova Spesa"]],
  ["Modifica spesa", "demo", ["tab:2", "aria:^Modifica$"]],
  ["Elimina spesa", "demo", ["tab:2", "aria:^Elimina$"]],
  ["Segna pagato", "demo", ["tab:2", "aria:^Segna come pagato"]],
  ["Hub storico", "demo", ["tab:2", "aria:^Storico"]],
  ["Hub elenco spese", "demo", ["tab:2", "aria:^Storico", "css:.mobile-col-back-btn"]],
  ["Hub allegati rata", "demo", ["tab:2", "aria:^Storico", "css:.installment-att-trigger"]],
  ["Hub rata extra", "demo", ["tab:2", "aria:^Storico", "css:.fixed-extra-add-btn"]],
  ["Hub modifica data rata", "demo", ["tab:2", "aria:^Storico", "css:.installment-date-edit-btn"]],
  ["Hub prossimo rinnovo", "demo", ["tab:2", "aria:^Storico", "css:.fixed-next-due-edit-btn"]],
  ["Hub stato rata", "demo", ["tab:2", "aria:^Storico", "css:.btn-status-icon"]],
  ["Hub bollette", "p2", ["tab:2", "css:[id^=exp-card-exp-10-] [title^=Storico]"]],
  ["Hub nuovo contratto", "p2", ["tab:2", "css:[id^=exp-card-exp-10-] [title^=Storico]", "css:.contract-status-bar button"]],
  ["Impostazioni", "demo", ["tab:3"]],
  ["Nuovo profilo", "demo", ["css:.nav-profile-pill", "text:^Nuovo profilo$"]],
  ["Nuovo profilo nome lungo", "demo", ["css:.nav-profile-pill", "text:^Nuovo profilo$", `type:|[role=dialog] input|${LONG}`]],
  ["Gestione profili", "demo", ["css:.nav-profile-pill"]],
  ["Modifica profilo", "demo", ["css:.nav-profile-pill", "aria:^Modifica profilo"]],
  ["Elimina profilo", "demo", ["css:.nav-profile-pill", "aria:^Elimina profilo"]],
  ["Pill profilo navbar", "demo", ["css:.nav-profile-pill"]],
  ["Menu campanella", "demo", ["css:.nav-notifications-btn"]],
  ["Centro notifiche", "demo", ["css:.nav-notifications-btn", "css:.nav-notif-manage-btn"]],
  ["Import backup", "demo", ["tab:3", "upload"]],
  ["Conferma reset", "demo", ["tab:3", "text:^Cancella tutto"]],
  ["Conferma esempi", "demo", ["tab:3", "text:^Ricarica i dati di esempio"]],
  ["Inizia con i miei dati", "demo", ["text:^Inizia con i miei dati"]],
  ["0p Bilancio", "zero", ["tab:0"]],
  ["0p Documenti", "zero", ["tab:1"]],
  ["0p Spese", "zero", ["tab:2"]],
  ["0p Impostazioni", "zero", ["tab:3"]],
  ["0p Nuovo profilo", "zero", ["event:myplano:open-add-profile"]],
  ["0p Menu campanella", "zero", ["css:.nav-notifications-btn"]],
];
const filter = new RegExp(process.argv[2] || ".", "i");
const sizes = (process.env.OVERFLOW_SIZES || "360x780,390x844").split(",").map((s) => s.split("x").map(Number));
mkdirSync(OUT + "/shots", { recursive: true });
const backup = OUT + "/backup.json";
writeFileSync(backup, JSON.stringify({ version: 3, exportedAt: "2026-01-01T00:00:00.000Z", data: {
  myplano_profiles: [{ id: "bk1", name: LONG, color: "#7c5dfa" }], myplano_expenses: [], myplano_documents: [] } }));
let browser, bad = 0;
const rows = [];
setTimeout(() => { console.log("GLOBAL TIMEOUT"); unserve(); process.exit(1); }, 900000).unref();
try {
  await serve();
  const ph = await phone(PORT + 10000); browser = ph.browser; const page = ph.page;
  for (const [w, h] of sizes) for (const [name, data, steps] of STEPS.filter((s) => filter.test(s[0]))) {
    let m, err = "";
    try {
      await load(page, data, w, h);
      for (const s of steps) if (s === "upload") await upload(page, "input[type=file]", backup); else await run(page, [s]);
      await sleep(300); m = await page.eval(MEASURE);
    } catch (e) { err = e.message.slice(0, 90); }
    await page.screenshot(`${OUT}/shots/${w}-${name.replace(/\W+/g, "_")}.png`).catch(() => {});
    const errs = page.drainErrors();
    const fail = err || !m || m.bad || errs.length;
    if (fail) bad++;
    rows.push([fail ? "FAIL" : "ok", `${w}x${h}`, name, m ? `${m.doc}/${m.body}` : "-", m?.dialog ?? "-",
      err || [...(m?.sticking || []).slice(0, 4).map((s) => "taglio " + s), ...(m?.hscroll || []).slice(0, 3).map((s) => "scroll " + s), ...errs.slice(0, 1)].join("; ")]);
  }
} catch (e) { console.log("ERROR", e.message); bad++; }
finally {
  const pad = [4, 7, 26, 9, 9];
  console.log(["", "size", "stato", "html/body", "dialog", "problemi"].map((c, i) => c.padEnd(pad[i] ?? 0)).join(" "));
  for (const r of rows) console.log(r.map((c, i) => String(c).padEnd(pad[i] ?? 0)).join(" "));
  console.log(bad ? `OVERFLOW/ERRORI: ${bad} stati (screenshot in ${OUT}/shots)` : `NESSUN OVERFLOW (${rows.length} stati)`);
  await browser?.close(); unserve(); process.exit(bad ? 1 : 0);
}
