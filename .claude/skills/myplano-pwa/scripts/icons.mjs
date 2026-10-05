// Rasterizza public/favicon.svg in PNG con Chrome headless (metodo: skill AI-hub app-icon-generation).
// - any (192/512): riquadro arrotondato, angoli TRASPARENTI (rasterizzato su fondo trasparente: niente alone nero).
// - maskable 512: gradiente a TUTTO CAMPO, nessuna trasparenza; glifo al 90% (circa 62% del lato, cerchio di
//   ingombro ~64% di diametro: dentro la zona sicura dell'80% di Android, non viene tagliato da nessuna maschera).
// - apple-touch 180: opaca a tutto campo (iOS arrotonda da solo e riempie di nero la trasparenza).
import { launch } from "../../headless-chrome-cdp/scripts/cdp.mjs";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
const pub = fileURLToPath(new URL("../../../../public/", import.meta.url));
const src = readFileSync(pub + "favicon.svg", "utf8");
const defs = src.match(/<defs>[\s\S]*?<\/defs>/)[0];
const fill = src.match(/<rect[^>]*fill="([^"]+)"/)[1];
const glyph = src.match(/<g [\s\S]*<\/g>/)[0];
// rx = raggio degli angoli nel viewBox 64 (0 = a tutto campo), k = scala del glifo attorno al centro.
const compose = (rx, k) => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${defs}`
  + `<rect width="64" height="64" rx="${rx}" fill="${fill}"/><g transform="translate(32 32) scale(${k}) translate(-32 -32)">${glyph}</g></svg>`;
const jobs = [
  ["pwa-192.png", 192, 15, 1], ["pwa-512.png", 512, 15, 1],
  ["pwa-maskable-512.png", 512, 0, 0.9], ["apple-touch-icon-180.png", 180, 0, 0.9],
];
const browser = await launch({ port: 19526 });
const page = await browser.openPage("about:blank");
for (const [name, size, rx, k] of jobs) {
  await page.send("Emulation.setDeviceMetricsOverride", { width: size, height: size, deviceScaleFactor: 1, mobile: false });
  await page.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  const b64 = Buffer.from(compose(rx, k)).toString("base64");
  const html = `<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${b64}" width="${size}" height="${size}" style="display:block"></body></html>`;
  await page.navigate("data:text/html;base64," + Buffer.from(html).toString("base64"), "document.images[0].complete");
  const r = await page.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(pub + name, Buffer.from((r.result || r).data, "base64"));
  console.log(name, size, rx ? "angoli trasparenti" : "a tutto campo");
}
await browser.close();
