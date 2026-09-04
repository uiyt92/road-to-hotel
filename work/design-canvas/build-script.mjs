// 강의 대본 → 인쇄용 단독 문서
// 실행: node build-script.mjs
import fs from 'node:fs';
import path from 'node:path';
import { SCRIPT } from './script.mjs';

const OUT = path.resolve('../../outputs/5points_script.html');
const FACE = [
  ['Noto Sans KR', 400, 'fonts/NotoSansKR-400.woff2'],
  ['Noto Sans KR', 700, 'fonts/NotoSansKR-700.woff2'],
];
const fontCss = FACE.map(([f, w, p]) =>
  `@font-face{font-family:"${f}";font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(p).toString('base64')}) format("woff2")}`
).join('');

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

let lastPart = null;
const body = SCRIPT.map((sec) => {
  const partHead = sec.part !== lastPart ? `<h2>${sec.part}</h2>` : '';
  lastPart = sec.part;
  const lines = sec.body.map((b) =>
    typeof b === 'string'
      ? `<p>${esc(b)}</p>`
      : `<p class="q"><span>Q</span>${esc(b.q)}</p>`
  ).join('');
  return `${partHead}<section><header><h3>${esc(sec.title)}</h3><span class="s">${sec.s}</span></header>${lines}</section>`;
}).join('');

const qCount = SCRIPT.reduce((n, s) => n + s.body.filter((b) => typeof b !== 'string').length, 0);

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>강의 대본 · Road to Hotel</title>
<style>${fontCss}
*{box-sizing:border-box}
body{margin:0;background:#f7f5f0;color:#1a1814;font-family:"Noto Sans KR",system-ui,sans-serif;line-height:1.75}
.wrap{max-width:760px;margin:0 auto;padding:56px 24px 96px}
header.top{border-bottom:2px solid #1a1814;padding-bottom:20px;margin-bottom:10px}
header.top h1{margin:0;font-size:30px;font-weight:700;letter-spacing:-.01em}
header.top p{margin:8px 0 0;color:#6b6559;font-size:14px}
h2{margin:46px 0 0;font-size:13px;font-weight:700;letter-spacing:.22em;color:#a8823a;
   border-top:1px solid #d9d3c6;padding-top:22px}
section{padding:20px 0 4px;border-bottom:1px solid #e6e1d6;break-inside:avoid}
section header{display:flex;align-items:baseline;gap:12px;margin-bottom:10px}
h3{margin:0;font-size:19px;font-weight:700;line-height:1.35}
.s{margin-left:auto;font-size:11px;letter-spacing:.1em;color:#a09889;flex:none;
   border:1px solid #ddd7c9;border-radius:3px;padding:1px 7px}
p{margin:0 0 9px;font-size:15.5px;color:#33302a}
p.q{display:grid;grid-template-columns:24px 1fr;gap:10px;align-items:start;
    font-weight:700;color:#8a5a12;background:#f2ead9;padding:10px 12px;margin:12px 0;
    border-left:3px solid #d9a441;border-radius:0 3px 3px 0}
p.q span{font-size:11px;letter-spacing:.1em;color:#a8823a;padding-top:3px}
footer{margin-top:44px;color:#8f887a;font-size:12px;text-align:center}
@media print{@page{size:A4;margin:16mm}body{background:#fff}.wrap{padding:0;max-width:none}
  h2{break-after:avoid}header.top{margin-bottom:0}p.q{background:#f0ece2}}
@media(max-width:520px){.wrap{padding:32px 16px 64px}}
</style></head><body><div class="wrap">
<header class="top"><h1>강의 대본</h1>
<p>Road to Hotel · 5 POINTS · 도입 → 심법 → 수읽기 → 78수 · 질문 ${qCount}개</p></header>
${body}
<footer>회색 상자는 청중에게 던지는 질문입니다. 슬라이드 번호는 오른쪽에 있습니다.</footer>
</div></body></html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`script=OK ${SCRIPT.length}절 / 질문 ${qCount}개 / ${(Buffer.byteLength(html) / 1024).toFixed(0)}KB → ${OUT}`);
