import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const results = {};

async function scan(name, viewport, setup) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  if (setup) await setup(page);
  const report = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  results[name] = report.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length }));
  if (report.violations.length) process.exitCode = 1;
  await context.close();
}

await scan("desktop", { width: 1440, height: 900 });
await scan("desktop-services", { width: 1440, height: 900 }, async (page) => {
  await page.getByRole("button", { name: /Services/i }).click();
});
await scan("mobile-menu", { width: 390, height: 844 }, async (page) => {
  await page.getByRole("button", { name: "Open navigation" }).click();
});

await writeFile("navigation-qa/axe.json", JSON.stringify(results, null, 2));
await browser.close();
