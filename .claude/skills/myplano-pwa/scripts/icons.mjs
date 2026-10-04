// Rasterizza public/favicon.svg in PNG (any, maskable, apple-touch) con Chrome headless.
import { launch } from "../../headless-chrome-cdp/scripts/cdp.mjs";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
const pub = fileURLToPath(new URL("../../../../", import.meta.url)).split(String.fromCharCode(92)).join("/").replace(/\/$/, "") + "/public/";
const svg = readFileSync(pub + "favicon.svg", "utf8");
const b64 = Buffer.from(svg).toString("base64");
const jobs = [
  ["pwa-192.png", 192, null, 0.86], ["pwa-512.png", 512, null, 0.86],
  ["pwa-maskable-512.png", 512, "#0b0f19", 0.56], ["apple-touch-icon-180.png", 180, "#0b0f19", 0.66],
];
const browser = await launch({ port: 19526 });
const page = await browser.openPage("about:blank");
for (const [name, size, bg, scale] of jobs) {
  await page.send("Emulation.setDeviceMetricsOverride", { width: size, height: size, deviceScaleFactor: 1, mobile: false });
  await page.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  const html = `<html><body style="margin:0;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:${bg || "transparent"}"><img src="data:image/svg+xml;base64,${b64}" style="width:${Math.round(size * scale)}px;height:auto"></body></html>`;
  await page.navigate("data:text/html;base64," + Buffer.from(html).toString("base64"), "document.images[0].complete");
  const r = await page.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(pub + name, Buffer.from((r.result || r).data, "base64"));
  console.log(name, size);
}
await browser.close();
