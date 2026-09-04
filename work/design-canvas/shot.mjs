import { chromium } from 'file:///C:/Users/SuperNatural1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const list = process.argv.slice(2);
fs.mkdirSync('shots', { recursive: true });
const b = await chromium.launch({ executablePath: 'C:/Users/SuperNatural1/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe' });
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 0.6 });
for (const n of list) {
  await p.goto(`http://127.0.0.1:8792/S${n}.html`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `shots/S${n}.png` });
  console.log('shot', n);
}
await b.close();
