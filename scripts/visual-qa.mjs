import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const outputRoot = path.resolve("qa-artifacts");
const screenshotDir = path.join(outputRoot, "screenshots");
await mkdir(screenshotDir, { recursive: true });

const viewports = [
  { name: "desktop-1920x1080", width: 1920, height: 1080 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "desktop-1366x768", width: 1366, height: 768 },
  { name: "desktop-1280x800", width: 1280, height: 800 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "tablet-834x1194", width: 834, height: 1194 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "mobile-430x932", width: 430, height: 932, touch: true },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
  { name: "mobile-375x812", width: 375, height: 812, touch: true },
  { name: "mobile-360x800", width: 360, height: 800, touch: true },
  { name: "mobile-320x568", width: 320, height: 568, touch: true },
  { name: "mobile-landscape-844x390", width: 844, height: 390, touch: true },
  { name: "short-laptop-1366x650", width: 1366, height: 650 }
];

const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  baseURL,
  browser: "Chromium via Playwright",
  viewports: [],
  zoom: [],
  reducedMotion: [],
  keyboard: null,
  interaction: null,
  axe: [],
  performance: null
};

async function preparePage(context) {
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || "unknown" }));
  await page.addInitScript(() => {
    window.__warQa = { lcp: 0, cls: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) window.__warQa.lcp = last.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__warQa.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      window.__warQa.longTasks.push(...list.getEntries().map((entry) => ({ startTime: entry.startTime, duration: entry.duration })));
    }).observe({ type: "longtask", buffered: true });
  });
  await page.goto(baseURL, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1200);
  return { page, consoleErrors, pageErrors, failedRequests };
}

async function collectLayout(page, config) {
  return page.evaluate(({ width, height }) => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        top: box.top,
        bottom: box.bottom,
        display: style.display,
        visibility: style.visibility,
        opacity: Number(style.opacity)
      };
    };
    const visible = (selector) => {
      const value = rect(selector);
      return Boolean(value && value.width > 0 && value.height > 0 && value.visibility !== "hidden" && value.display !== "none" && value.opacity > 0);
    };
    const interactive = [...document.querySelectorAll(".war-table a, .war-table button, .war-table select, .war-table input, .war-table textarea")].map((element) => {
      const box = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        text: (element.textContent || element.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 100),
        width: box.width,
        height: box.height,
        disabled: element.matches(":disabled")
      };
    });
    const smallTargets = interactive.filter((item) => !item.disabled && (item.width < 44 || item.height < 44));
    const smallText = [...document.querySelectorAll(".war-table *")]
      .filter((element) => element.children.length === 0 && (element.textContent || "").trim())
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100),
        size: parseFloat(getComputedStyle(element).fontSize)
      }))
      .filter((item) => item.size < 12);
    const bodyCopy = [...document.querySelectorAll(".war-table p")].map((element) => ({
      text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
      size: parseFloat(getComputedStyle(element).fontSize),
      lineHeight: getComputedStyle(element).lineHeight,
      width: element.getBoundingClientRect().width
    }));
    const images = [...document.images].map((image) => ({
      src: image.currentSrc || image.src,
      alt: image.alt,
      loading: image.loading,
      fetchPriority: image.fetchPriority,
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      renderedWidth: image.getBoundingClientRect().width,
      renderedHeight: image.getBoundingClientRect().height
    }));
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((heading) => ({
      level: Number(heading.tagName.slice(1)),
      text: (heading.textContent || "").trim().replace(/\s+/g, " "),
      rect: heading.getBoundingClientRect().toJSON()
    }));
    const controls = [...document.querySelectorAll(".war-table select")].map((control) => ({
      name: control.closest("label")?.querySelector("span")?.textContent?.trim() || "",
      value: control.value,
      labelText: control.closest("label")?.textContent?.trim().replace(/\s+/g, " ") || "",
      rect: control.getBoundingClientRect().toJSON()
    }));
    const hero = rect(".war-hero");
    const header = rect("header");
    const primary = rect('.war-hero a[href="/pricing"]');
    const secondary = rect('.war-hero a[href="/services"]');
    const route = rect(".war-hero .war-route-preview");
    const trust = rect(".war-trust");
    const footer = rect("footer");
    return {
      viewport: { width, height },
      document: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      },
      hero,
      header,
      primary,
      secondary,
      route,
      trust,
      footer,
      primaryInFirstViewport: Boolean(primary && primary.top >= 0 && primary.top < height && primary.bottom <= height),
      h1Count: document.querySelectorAll("h1").length,
      h1Text: document.querySelector("h1")?.textContent?.trim() || null,
      mainCount: document.querySelectorAll("main").length,
      routeVisible: visible(".war-hero .war-route-preview"),
      smallTargets,
      smallText,
      bodyCopy,
      images,
      headings,
      controls
    };
  }, config);
}

for (const config of viewports) {
  const context = await browser.newContext({
    viewport: { width: config.width, height: config.height },
    deviceScaleFactor: 1,
    hasTouch: Boolean(config.touch),
    isMobile: Boolean(config.touch),
    reducedMotion: "no-preference"
  });
  const { page, consoleErrors, pageErrors, failedRequests } = await preparePage(context);
  const layout = await collectLayout(page, config);
  await page.screenshot({ path: path.join(screenshotDir, `${config.name}-viewport.png`), fullPage: false });
  await page.screenshot({ path: path.join(screenshotDir, `${config.name}-full.jpg`), fullPage: true, type: "jpeg", quality: 72 });
  report.viewports.push({ name: config.name, ...layout, consoleErrors, pageErrors, failedRequests });
  await context.close();
}

for (const zoomConfig of [
  { name: "zoom-125", width: 1440, height: 900, zoom: "1.25" },
  { name: "zoom-150", width: 1440, height: 900, zoom: "1.5" },
  { name: "text-zoom-200-tablet", width: 1024, height: 768, textZoom: "200%" },
  { name: "text-zoom-200-mobile", width: 390, height: 844, textZoom: "200%", touch: true }
]) {
  const context = await browser.newContext({
    viewport: { width: zoomConfig.width, height: zoomConfig.height },
    hasTouch: Boolean(zoomConfig.touch),
    isMobile: Boolean(zoomConfig.touch)
  });
  const { page, consoleErrors, pageErrors, failedRequests } = await preparePage(context);
  if (zoomConfig.zoom) await page.evaluate((value) => { document.documentElement.style.zoom = value; }, zoomConfig.zoom);
  if (zoomConfig.textZoom) await page.evaluate((value) => { document.documentElement.style.fontSize = value; }, zoomConfig.textZoom);
  await page.waitForTimeout(300);
  const layout = await collectLayout(page, zoomConfig);
  await page.screenshot({ path: path.join(screenshotDir, `${zoomConfig.name}.png`), fullPage: false });
  report.zoom.push({ ...zoomConfig, ...layout, consoleErrors, pageErrors, failedRequests, method: zoomConfig.zoom ? "CSS page zoom" : "root font-size text zoom" });
  await context.close();
}

for (const config of [
  { name: "reduced-motion-desktop", width: 1440, height: 900 },
  { name: "reduced-motion-mobile", width: 390, height: 844, touch: true }
]) {
  const context = await browser.newContext({
    viewport: { width: config.width, height: config.height },
    hasTouch: Boolean(config.touch),
    isMobile: Boolean(config.touch),
    reducedMotion: "reduce"
  });
  const { page, consoleErrors, pageErrors, failedRequests } = await preparePage(context);
  const state = await page.evaluate(() => {
    const reveal = document.querySelector("[data-home-reveal]");
    const route = document.querySelector(".war-route-track__active");
    return {
      prefersReducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      revealOpacity: reveal ? getComputedStyle(reveal).opacity : null,
      routeAnimation: route ? getComputedStyle(route).animationName : null,
      routeTransition: route ? getComputedStyle(route).transitionDuration : null
    };
  });
  await page.screenshot({ path: path.join(screenshotDir, `${config.name}.png`), fullPage: false });
  report.reducedMotion.push({ ...config, state, consoleErrors, pageErrors, failedRequests });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const { page, consoleErrors, pageErrors, failedRequests } = await preparePage(context);
  const focusTrail = [];
  for (let index = 0; index < 28; index += 1) {
    await page.keyboard.press("Tab");
    focusTrail.push(await page.evaluate(() => {
      const element = document.activeElement;
      if (!(element instanceof HTMLElement)) return null;
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        text: (element.textContent || element.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 100),
        href: element.getAttribute("href"),
        outline: `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}`,
        boxShadow: style.boxShadow
      };
    }));
  }
  const skip = page.locator('a[href="#main-content"]').first();
  let skipResult = null;
  if (await skip.count()) {
    await skip.focus();
    await page.keyboard.press("Enter");
    skipResult = await page.evaluate(() => ({ hash: location.hash, activeId: document.activeElement?.id || null }));
  }
  await page.screenshot({ path: path.join(screenshotDir, "keyboard-focus.png"), fullPage: false });
  report.keyboard = { focusTrail, skipResult, consoleErrors, pageErrors, failedRequests };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const { page, consoleErrors, pageErrors, failedRequests } = await preparePage(context);
  const selects = page.locator(".war-route-controls select");
  const before = await page.evaluate(() => {
    const preview = document.querySelector(".war-route-preview");
    const marker = document.querySelector(".war-route-track__marker");
    return {
      height: preview?.getBoundingClientRect().height || 0,
      markerLeft: marker?.getBoundingClientRect().left || 0,
      values: [...document.querySelectorAll(".war-route-controls select")].map((select) => select.value)
    };
  });
  await selects.nth(0).focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Tab");
  await selects.nth(2).selectOption({ label: "North America" });
  await selects.nth(3).selectOption({ label: "Carry" });
  await selects.nth(4).selectOption({ label: "Duo Queue" });
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => {
    const preview = document.querySelector(".war-route-preview");
    const marker = document.querySelector(".war-route-track__marker");
    const current = document.querySelectorAll(".war-route-controls select")[0];
    const target = document.querySelectorAll(".war-route-controls select")[1];
    return {
      height: preview?.getBoundingClientRect().height || 0,
      markerLeft: marker?.getBoundingClientRect().left || 0,
      values: [...document.querySelectorAll(".war-route-controls select")].map((select) => select.value),
      targetFirstOption: target?.options[0]?.value || null,
      currentValue: current?.value || null,
      pricingHref: document.querySelector('.war-table a[href="/pricing"]')?.getAttribute("href") || null
    };
  });
  await page.screenshot({ path: path.join(screenshotDir, "route-interaction.png"), fullPage: false });
  report.interaction = {
    before,
    after,
    heightShift: Math.abs(after.height - before.height),
    markerMoved: Math.abs(after.markerLeft - before.markerLeft) > 0.5,
    consoleErrors,
    pageErrors,
    failedRequests
  };
  await context.close();
}

for (const config of [
  { name: "axe-desktop", width: 1440, height: 900 },
  { name: "axe-mobile", width: 390, height: 844, touch: true }
]) {
  const context = await browser.newContext({
    viewport: { width: config.width, height: config.height },
    hasTouch: Boolean(config.touch),
    isMobile: Boolean(config.touch),
    reducedMotion: "reduce"
  });
  const { page } = await preparePage(context);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  report.axe.push({
    ...config,
    violations: results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      nodes: violation.nodes.map((node) => ({ target: node.target, failureSummary: node.failureSummary, html: node.html }))
    }))
  });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const { page } = await preparePage(context);
  await page.locator(".war-route-controls select").first().selectOption({ index: 2 });
  await page.waitForTimeout(600);
  report.performance = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource").map((entry) => ({
      name: entry.name,
      initiatorType: entry.initiatorType,
      transferSize: entry.transferSize,
      decodedBodySize: entry.decodedBodySize,
      duration: entry.duration
    }));
    return {
      navigation: performance.getEntriesByType("navigation")[0]?.toJSON?.() || null,
      paint: performance.getEntriesByType("paint").map((entry) => entry.toJSON()),
      lcp: window.__warQa?.lcp || 0,
      cls: window.__warQa?.cls || 0,
      longTasks: window.__warQa?.longTasks || [],
      resourceSummary: {
        totalRequests: resources.length,
        imageRequests: resources.filter((entry) => entry.initiatorType === "img").length,
        fontRequests: resources.filter((entry) => entry.initiatorType === "css" && /font|woff/i.test(entry.name)).length,
        scriptRequests: resources.filter((entry) => entry.initiatorType === "script").length,
        totalTransferSize: resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
        imageTransferSize: resources.filter((entry) => entry.initiatorType === "img").reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
        scriptTransferSize: resources.filter((entry) => entry.initiatorType === "script").reduce((sum, entry) => sum + (entry.transferSize || 0), 0)
      },
      largestResources: resources.sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0)).slice(0, 20)
    };
  });
  await context.close();
}

await writeFile(path.join(outputRoot, "visual-qa-report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log(`Visual QA report written to ${outputRoot}`);
