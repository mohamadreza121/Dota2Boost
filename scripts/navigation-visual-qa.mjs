import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const output = "navigation-qa";
await mkdir(`${output}/screenshots`, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = { assertions: [], errors: [] };

function check(name, pass, detail = "") {
  report.assertions.push({ name, pass, detail });
  if (!pass) process.exitCode = 1;
}

async function pageAt(width, height, reducedMotion = "no-preference") {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") report.errors.push(message.text()); });
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  return { context, page };
}

async function audit(page, key) {
  const result = await page.evaluate(() => {
    const controls = Array.from(document.querySelectorAll(".hg-header a, .hg-header button"));
    const smallTargets = controls.filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return style.display !== "none" && rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    }).map((element) => element.textContent?.trim().slice(0, 50));
    const text = Array.from(document.querySelectorAll(".hg-header small, .hg-header em, .hg-header .hg-nav__chapter, .hg-header .hg-panel-kicker"));
    const smallText = text.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && Number.parseFloat(getComputedStyle(element).fontSize) < 12;
    }).map((element) => `${element.textContent?.trim()}:${getComputedStyle(element).fontSize}`);
    return { smallTargets, smallText, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  check(`${key}: targets`, result.smallTargets.length === 0, JSON.stringify(result.smallTargets));
  check(`${key}: text floor`, result.smallText.length === 0, JSON.stringify(result.smallText));
  check(`${key}: no overflow`, result.overflow <= 1, String(result.overflow));
}

{
  const { context, page } = await pageAt(1440, 900);
  const header = page.locator(".hg-header");
  const before = await header.evaluate((node) => node.getBoundingClientRect().height);
  await page.screenshot({ path: `${output}/screenshots/desktop-1440-closed.png` });
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(250);
  const after = await header.evaluate((node) => node.getBoundingClientRect().height);
  check("desktop: stable header height", Math.abs(before - after) < 0.5, `${before}/${after}`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(100);
  await page.getByRole("button", { name: /Services/i }).click();
  const panel = page.locator("#hg-services-panel");
  const box = await panel.boundingBox();
  check("desktop: service panel fits", Boolean(box && box.x >= 0 && box.x + box.width <= 1440 && box.y + box.height <= 900), JSON.stringify(box));
  await page.screenshot({ path: `${output}/screenshots/desktop-1440-services.png` });
  await audit(page, "desktop services");
  await page.keyboard.press("Escape");
  check("desktop: Escape closes services", !(await panel.isVisible()));
  check("desktop: focus returns", await page.evaluate(() => document.activeElement?.textContent?.includes("Services") === true));
  await context.close();
}

{
  const { context, page } = await pageAt(1100, 800);
  check("compact: More visible", await page.getByRole("button", { name: /More/i }).isVisible());
  await page.getByRole("button", { name: /More/i }).click();
  await page.screenshot({ path: `${output}/screenshots/desktop-1100-more.png` });
  await audit(page, "compact More");
  await context.close();
}

for (const [name, width, height] of [["tablet-834", 834, 1194], ["mobile-430", 430, 932], ["mobile-390", 390, 844], ["mobile-320", 320, 568], ["landscape-844", 844, 390]]) {
  const { context, page } = await pageAt(width, height);
  await page.getByRole("button", { name: "Open navigation" }).click();
  check(`${name}: campaign action`, await page.locator(".hg-mobile-campaign").isVisible());
  await page.screenshot({ path: `${output}/screenshots/${name}-menu.png` });
  await audit(page, `${name} menu`);
  if (name === "mobile-390") {
    await page.getByRole("button", { name: /Campaign contracts/i }).click();
    check("mobile: grouped services", await page.getByText("Account and development", { exact: true }).isVisible());
    await page.screenshot({ path: `${output}/screenshots/mobile-390-services.png` });
    await page.keyboard.press("Escape");
    check("mobile: Escape closes menu", !(await page.locator("#hg-mobile-menu").isVisible()));
  }
  await context.close();
}

{
  const { context, page } = await pageAt(390, 844);
  await page.evaluate(() => { document.documentElement.style.fontSize = "32px"; });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.screenshot({ path: `${output}/screenshots/mobile-390-text-200.png` });
  await audit(page, "mobile text 200");
  await context.close();
}

{
  const { context, page } = await pageAt(390, 844, "reduce");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const animation = await page.locator(".hg-mobile-menu__drawer").evaluate((node) => getComputedStyle(node).animationName);
  check("reduced motion: no drawer animation", animation === "none", animation);
  await context.close();
}

check("browser: no console errors", report.errors.length === 0, JSON.stringify(report.errors));
await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
await browser.close();
