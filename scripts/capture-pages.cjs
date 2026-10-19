const puppeteer = require("puppeteer-core");
const fs = require("node:fs");
fs.mkdirSync("C:/rani/driveph-rentals/qa", { recursive: true });

const BASE = "http://localhost:3000";
const OUT = "C:/rani/driveph-rentals/qa";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const [route, name] of [
    ["/", "home"],
    ["/cars", "fleet"],
    ["/cars/toyota-vios", "detail"],
    ["/login", "login"],
  ]) {
    await page.goto(BASE + route, { waitUntil: "networkidle0" });
    await sleep(1400);
    await page.screenshot({ path: `${OUT}/${name}.jpg` });
  }

  // Client dashboard
  await page.goto(BASE + "/login", { waitUntil: "networkidle0" });
  await sleep(1200);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("client@driveph.ph")
    );
    if (button) button.click();
  });
  await sleep(300);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "Sign in"
    );
    if (button) button.click();
  });
  await sleep(1500);
  await page.screenshot({ path: `${OUT}/dashboard-client.jpg` });

  // Admin dashboard
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "Sign out"
    );
    if (button) button.click();
  });
  await sleep(700);
  await page.goto(BASE + "/login", { waitUntil: "networkidle0" });
  await sleep(1200);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("admin@driveph.ph")
    );
    if (button) button.click();
  });
  await sleep(300);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "Sign in"
    );
    if (button) button.click();
  });
  await sleep(1500);
  await page.screenshot({ path: `${OUT}/dashboard-admin.jpg` });

  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await sleep(1200);
  await page.screenshot({ path: `${OUT}/home-mobile.jpg` });

  console.log("captured");
  await browser.close();
})();
