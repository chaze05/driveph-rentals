import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.QA_BASE || "http://localhost:3000";
const OUT = "qa";
fs.mkdirSync(OUT, { recursive: true });

const routes = process.argv.slice(2);
if (routes.length === 0) {
  console.error("Usage: node scripts/qa.mjs <route...>");
  process.exit(2);
}

const widths = [1440, 1024, 768, 390, 320];
let failures = 0;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

for (const route of routes) {
  const page = await browser.newPage();
  const allow404 = process.env.QA_ALLOW_404 === "1";
  const errors = [];
  page.on("pageerror", (e) =>
    errors.push("pageerror: " + e.message.slice(0, 160))
  );
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if (allow404 && m.text().includes("status of 404")) return;
    errors.push("console: " + m.text().slice(0, 160));
  });
  page.on("requestfailed", (r) => {
    if (r.url().includes("_rsc=")) return;
    errors.push("reqfail: " + r.url().slice(0, 120));
  });

  for (const width of widths) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 900));

    const overflow = await page.evaluate(
      () =>
        Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        ) - window.innerWidth
    );
    const slug =
      route === "/"
        ? "home"
        : route
            .replace(/[?&=]/g, "-")
            .replace(/^\/|\/$/g, "")
            .replace(/\//g, "-")
            .replace(/[^a-z0-9-]+/gi, "-");

    await page.screenshot({ path: `${OUT}/${slug}-${width}.jpg` });

    if (overflow > 1) {
      failures++;
      console.log(`FAIL ${route} @${width}: overflow ${overflow}px`);
    } else {
      console.log(`ok   ${route} @${width}`);
    }
  }

  if (errors.length) {
    failures += errors.length;
    errors.slice(0, 8).forEach((e) => console.log("  " + e));
  }

  await page.close();
}

await browser.close();

if (failures) {
  console.log(`${failures} failure(s)`);
  process.exit(1);
}

console.log("QA passed: no overflow, no console errors.");
