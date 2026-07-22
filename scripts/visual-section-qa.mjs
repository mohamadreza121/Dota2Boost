import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const outputRoot = path.resolve("qa-artifacts");
const screenshotDir = path.join(outputRoot, "sections");
await mkdir(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = [];
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
  { name: "mobile-320x568", width: 320, height: 568, touch: true }
];
const sections = [
  ["hero", ".war-hero"],
  ["conditions", ".war-conditions"],
  ["objective", ".war-objective"],
  ["contracts", ".war-contracts"],
  ["protocol", ".war-protocol"],
  ["roster", ".war-roster"],
  ["record", ".war-record"],
  ["final", ".war-final"],
  ["footer", "footer"]
];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
    isMobile: Boolean(viewport.touch),
    reducedMotion: "no-preference"
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseURL, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1000);

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageHeight; y += Math.max(280, Math.floor(viewport.height * 0.68))) {
    await page.evaluate((nextY) => window.scrollTo({ top: nextY, behavior: "instant" }), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(250);

  await page.screenshot({
    path: path.join(screenshotDir, `${viewport.name}-revealed-full.jpg`),
    fullPage: true,
    type: "jpeg",
    quality: 78
  });

  const sectionResults = [];
  for (const [name, selector] of sections) {
    const locator = page.locator(selector).first();
    if (!(await locator.count())) continue;
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(180);
    const box = await locator.boundingBox();
    const visibleState = await locator.evaluate((element) => {
      const style = getComputedStyle(element);
      const hiddenReveals = [...element.querySelectorAll("[data-war-reveal]")].filter((child) => {
        const childStyle = getComputedStyle(child);
        return Number(childStyle.opacity) < 0.99 || childStyle.visibility === "hidden";
      }).length;
      return {
        opacity: style.opacity,
        visibility: style.visibility,
        hiddenReveals,
        textLength: (element.textContent || "").trim().length
      };
    });
    await locator.screenshot({
      path: path.join(screenshotDir, `${viewport.name}-${name}.png`),
      animations: "disabled"
    });
    sectionResults.push({ name, selector, box, visibleState });
  }

  report.push({ ...viewport, pageHeight, consoleErrors, pageErrors, sections: sectionResults });
  await context.close();
}

await writeFile(path.join(outputRoot, "section-qa-report.json"), JSON.stringify(report, null, 2));
await browser.close();
