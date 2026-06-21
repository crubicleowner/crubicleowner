const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "..");
const htmlPath = path.resolve(__dirname, "index.html");
const framesDir = path.resolve(__dirname, "frames");
const assetsDir = path.resolve(root, "assets");

async function main() {
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 720 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(htmlPath).href);
  await page.waitForSelector(".cover");
  await page.waitForTimeout(250);

  const clip = { x: 0, y: 0, width: 1200, height: 720 };
  const frameCount = 32;
  const frameDelayMs = 100;

  for (let index = 0; index < frameCount; index += 1) {
    if (index > 0) {
      await page.waitForTimeout(frameDelayMs);
    }
    const padded = String(index).padStart(3, "0");
    await page.screenshot({ path: path.join(framesDir, `frame-${padded}.png`), clip });
  }

  await page.screenshot({ path: path.join(assetsDir, "profile-cover.png"), clip });
  await browser.close();

  console.log(`Captured ${frameCount} frames to ${framesDir}`);
  console.log(`Wrote ${path.join(assetsDir, "profile-cover.png")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
