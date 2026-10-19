const puppeteer = require("puppeteer-core");
const fs = require("node:fs");
fs.mkdirSync("C:/rani/driveph-rentals/qa", { recursive: true });

const BASE = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 140)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 140));
  });

  const setDate = async (name, value) => {
    await page.evaluate(
      (fieldName, fieldValue) => {
        const el = document.querySelector(`input[name="${fieldName}"]`);
        if (!el) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(el, fieldValue);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      },
      name,
      value
    );
    await sleep(150);
  };

  const clickText = async (label) => {
    await page.evaluate((text) => {
      const button = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent.trim() === text
      );
      if (button) button.click();
    }, label);
    await sleep(500);
  };

  const fill = async (name, value) => {
    const el = await page.$(`[name="${name}"]`);
    if (el) await el.type(value);
  };

  await page.setViewport({ width: 1440, height: 900 });

  // Fleet filters
  await page.goto(BASE + "/cars", { waitUntil: "networkidle0", timeout: 90000 });
  await sleep(1000);
  const count = () => page.evaluate(() => document.querySelectorAll("main article").length);
  console.log("initial cars:", await count());

  await page.evaluate(() => {
    const chip = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim() === "Sports");
    if (chip) chip.click();
  });
  await sleep(700);
  console.log("Sports filter:", await count());

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const clear = buttons.find((b) => b.textContent.trim() === "Clear all filters");
    if (clear) clear.click();
  });
  await sleep(500);
  await page.evaluate(() => {
    const select = Array.from(document.querySelectorAll("select")).find((s) =>
      Array.from(s.options).some((o) => o.value === "Siargao")
    );
    if (select) {
      select.value = "Siargao";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await sleep(700);
  console.log("Siargao filter:", await count());

  // Booking validation on Vios
  await page.goto(BASE + "/cars/fiat-500", { waitUntil: "networkidle0" });
  await sleep(900);
  await clickText("Reserve this car");
  console.log("empty booking blocked:", await page.evaluate(() => document.body.innerText.includes("Please enter your full name.")));

  await setDate("pickupDate", "2026-10-01");
  await setDate("returnDate", "2026-10-03");
  await clickText("Reserve this car");
  console.log("past date blocked:", await page.evaluate(() => document.body.innerText.includes("Pickup date cannot be in the past.")));

  await setDate("pickupDate", "2026-11-20");
  await setDate("returnDate", "2026-11-22");
  await fill("customerName", "Camille Reyes");
  await fill("customerEmail", "client@driveph.ph");
  await fill("customerPhone", "+63 917 555 0142");
  await fill("licenseNumber", "N01-23-456789");
  await page.evaluate(() => {
    const checks = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    const consent = checks[checks.length - 1];
    if (consent && !consent.checked) consent.click();
  });
  await clickText("Reserve this car");
  console.log("blocked range caught:", await page.evaluate(() => document.body.innerText.includes("already booked for those dates")));

  await setDate("pickupDate", "2026-11-25");
  await setDate("returnDate", "2026-11-27");
  await clickText("Reserve this car");
  await sleep(1200);
  const created = await page.evaluate(() => {
    const raw = window.localStorage.getItem("driveph.bookings.v1");
    const list = raw ? JSON.parse(raw) : [];
    return list.find((b) => b.customerEmail === "client@driveph.ph" && b.pickupDate === "2026-11-25");
  });
  console.log("booking created:", created ? created.ref : null, "| total:", created ? created.total : null);
  const bookingRef = created ? created.ref : null;

  // Client dashboard via login
  await page.goto(BASE + "/login", { waitUntil: "networkidle0" });
  await sleep(700);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("client@driveph.ph")
    );
    if (button) button.click();
  });
  await sleep(300);
  await clickText("Sign in");
  await sleep(1200);
  console.log("client dashboard:", page.url().includes("/dashboard"));
  console.log("booking visible:", await page.evaluate(() => document.body.innerText.includes("DP-")));

  // Cancel the new booking (two-step)
  await page.evaluate((ref) => {
    const cards = Array.from(document.querySelectorAll("div"));
    const card = cards.find((c) => c.textContent.includes(ref) && c.querySelector("button"));
    if (!card) return;
    const button = Array.from(card.querySelectorAll("button")).find((b) => b.textContent.trim() === "Cancel");
    if (button) button.click();
  }, bookingRef);
  await sleep(400);
  await clickText("Confirm cancel");
  await sleep(500);
  const cancelled = await page.evaluate((ref) => {
    const raw = window.localStorage.getItem("driveph.bookings.v1");
    const list = raw ? JSON.parse(raw) : [];
    return list.find((b) => b.ref === ref)?.status;
  }, bookingRef);
  console.log("cancelled status:", cancelled);

  // Sign out then admin login
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim() === "Sign out");
    if (button) button.click();
  });
  await sleep(700);
  await page.goto(BASE + "/login", { waitUntil: "networkidle0" });
  await sleep(600);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("admin@driveph.ph")
    );
    if (button) button.click();
  });
  await sleep(300);
  await clickText("Sign in");
  await sleep(1200);
  console.log("admin dashboard:", page.url().includes("/admin"));

  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim() === "Confirm");
    if (button) button.click();
  });
  await sleep(600);
  const confirmed = await page.evaluate(() => {
    const raw = window.localStorage.getItem("driveph.bookings.v1");
    const list = raw ? JSON.parse(raw) : [];
    return list.filter((b) => b.status === "confirmed").length;
  });
  console.log("confirmed bookings after admin action:", confirmed);

  // Protected redirect after logout
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim() === "Sign out");
    if (button) button.click();
  });
  await sleep(600);
  await page.goto(BASE + "/dashboard", { waitUntil: "networkidle0" });
  await sleep(1200);
  console.log("protected redirect:", page.url().includes("/login"));

  // Contact inquiry
  await page.goto(BASE + "/contact", { waitUntil: "networkidle0" });
  await sleep(1500);
  console.log("contact url:", page.url());
  await clickText("Send message");
  console.log("empty inquiry blocked:", await page.evaluate(() => document.body.innerText.includes("Please enter your name.")));
  const setField = async (name, value) => {
    await page.evaluate(
      (fieldName, fieldValue) => {
        const el = document.querySelector(
          `input[name="${fieldName}"], textarea[name="${fieldName}"]`
        );
        if (!el) return;
        const proto =
          el instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
        setter.call(el, fieldValue);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      },
      name,
      value
    );
    await sleep(150);
  };

  await setField("name", "Rani Rubillos");
  await setField("email", "rani@example.com");
  await setField("phone", "+63 917 555 0142");
  await setField("subject", "Island trip");
  await setField("message", "We need a van for six days in Bohol next month.");
  console.log(
    "contact values:",
    JSON.stringify(
      await page.evaluate(() =>
        Array.from(document.querySelectorAll("main input, main textarea")).map((el) => ({
          name: el.getAttribute("name"),
          value: el.value,
        }))
      )
    )
  );
  await clickText("Send message");
  await sleep(1100);
  console.log("inquiry success:", await page.evaluate(() => Boolean(document.querySelector('[role="status"]'))));
  console.log(
    "inquiry debug:",
    await page.evaluate(() => ({
      alerts: Array.from(document.querySelectorAll('[role="alert"]')).map((el) => el.textContent).slice(0, 6),
      received: document.body.innerText.includes("Message received"),
      buttonText: Array.from(document.querySelectorAll("button")).map((b) => b.textContent.trim()).filter((t) => t.includes("Send")),
    }))
  );

  // Mobile filters
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE + "/cars", { waitUntil: "networkidle0" });
  await sleep(900);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim().startsWith("Filters"));
    if (button) button.click();
  });
  await sleep(600);
  console.log("mobile drawer:", await page.evaluate(() => Boolean(document.querySelector('[role="dialog"][aria-label="Filters"]'))));
  await page.screenshot({ path: "C:/rani/driveph-rentals/qa/mobile-fleet.jpg" });

  console.log("errors:", errors.length);
  errors.slice(0, 8).forEach((e) => console.log(" -", e));
  await browser.close();
})();
