import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const docsImages = resolve(root, 'docs', 'images');
mkdirSync(docsImages, { recursive: true });

const baseURL = process.env.CAPTURE_URL || 'http://localhost:5173/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1600, height: 960 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});

await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30_000 });
await page.waitForSelector('h1');
await page.addStyleTag({
  content: '[data-sonner-toaster], [data-sonner-toast] { display: none !important; }',
});
await page.waitForTimeout(700);

await page.screenshot({
  path: resolve(docsImages, 'workspace-idle.png'),
  fullPage: false,
});

await page.getByRole('button', { name: 'MFA reset' }).click();
await page.getByRole('button', { name: /^Run/ }).click();
await page.getByRole('status').waitFor({ timeout: 20_000 });
await page.waitForTimeout(1600);

await page.screenshot({
  path: resolve(docsImages, 'workspace-threat.png'),
  fullPage: false,
});
await page.screenshot({
  path: resolve(root, 'dashboard.png'),
  fullPage: false,
});

await page.getByRole('button', { name: 'Sprint sync' }).click();
await page.getByRole('button', { name: /^Run/ }).click();
await page.getByRole('status').filter({ hasText: /audited safe/i }).waitFor({ timeout: 20_000 });
await page.waitForTimeout(1600);

await page.screenshot({
  path: resolve(docsImages, 'workspace-safe.png'),
  fullPage: false,
});

await browser.close();
console.log('Captured idle, threat, and safe workspace screenshots.');
