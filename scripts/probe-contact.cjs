const puppeteer = require("puppeteer-core");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle0" });
  await sleep(800);

  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "Send message"
    );
    if (button) button.click();
  });
  await sleep(700);

  const fill = async (name, value) => {
    const el = await page.$(`[name="${name}"]`);
    console.log("found", name, Boolean(el));
    if (el) await el.type(value);
  };

  await fill("name", "Rani Rubillos");
  await fill("email", "rani@example.com");
  await fill("phone", "+63 917 555 0142");
  await fill("subject", "Island trip");
  await fill("message", "We need a van for six days in Bohol next month.");

  const values = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main input, main textarea")).map((el) => ({
      name: el.getAttribute("name"),
      value: el.value,
    }))
  );
  console.log("values:", JSON.stringify(values));

  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "Send message"
    );
    if (button) button.click();
  });
  await sleep(1500);

  console.log(
    "errors on page:",
    await page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="alert"]')).map((el) => el.textContent)
    )
  );
  console.log("status:", await page.evaluate(() => (document.querySelector('[role="status"]') || {}).textContent || null));
  await browser.close();
})();
