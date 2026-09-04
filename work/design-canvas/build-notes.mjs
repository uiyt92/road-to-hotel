// 발표자 노트만 뽑은 단독 문서 — 강의 전 읽기 / 인쇄 / 폰에서 보기
// 실행: node build-notes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { NOTES } from './notes.mjs';

const cv = JSON.parse(fs.readFileSync('canvas.json', 'utf8'));
const rows = cv.artboards.map((a, i) => {
  const n = i + 1;
  const f = n === 1 ? 'Main.dc.html' : `S${String(n).padStart(2, '0')}.dc.html`;
  const raw = fs.readFileSync(f, 'utf8');
  const tag = (raw.match(/bottom: 30px[^>]*>([^<]*)</) || [, ''])[1].trim();
  return { n, title: a.title.replace(/^\d+ · /, ''), tag, note: NOTES[n] || '' };
});
const OUT = path.resolve('../../outputs/5points_notes.html');

const FACE = [
  ['Noto Sans KR', 400, 'fonts/NotoSansKR-400.woff2'],
  ['Noto Sans KR', 700, 'fonts/NotoSansKR-700.woff2'],
];
const fontCss = FACE.map(([f, w, p]) =>
  `@font-face{font-family:"${f}";font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(p).toString('base64')}) format("woff2")}`
).join('');

// 파트가 바뀌는 지점에 구분선을 넣는다
const part = (tag) => {
  if (/표지$/.test(tag)) return '표지';
  if (/^흐름|^대부분/.test(tag)) return '도입';
  if (/^심법/.test(tag)) return '심법';
  if (/^수읽기/.test(tag)) return '수읽기';
  if (/^78수|^너스레/.test(tag)) return '78수';
  if (/^협공|^윙/.test(tag)) return '협공';
  if (/^사례|^성과|실습$|^1주차|^피드백/.test(tag)) return '사례 · 실습';
  if (/^부록/.test(tag)) return '부록';
  if (/^저자론|표현력/.test(tag)) return '저자론';
  if (/^자의식/.test(tag)) return '마무리 실습';
  if (/^루틴|발판/.test(tag)) return '루틴 플레이';
  return '';
};

let last = null;
const body = rows.map((r) => {
  const p = part(r.tag);
  const head = p && p !== last ? `<h2>${p}</h2>` : '';
  last = p || last;
  return `${head}<article><div class="n">${String(r.n).padStart(2, '0')}</div><div class="b"><h3>${r.title}</h3>${r.tag ? `<span class="t">${r.tag}</span>` : ''}<p>${r.note}</p></div></article>`;
}).join('');

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>발표자 노트 · Road to Hotel</title>
<style>${fontCss}
*{box-sizing:border-box}
body{margin:0;background:#f7f5f0;color:#1a1814;font-family:"Noto Sans KR",system-ui,sans-serif;line-height:1.7}
.wrap{max-width:780px;margin:0 auto;padding:56px 24px 96px}
header{border-bottom:2px solid #1a1814;padding-bottom:20px;margin-bottom:8px}
header h1{margin:0;font-size:30px;font-weight:700;letter-spacing:-.01em}
header p{margin:8px 0 0;color:#6b6559;font-size:14px}
h2{margin:44px 0 4px;font-size:13px;font-weight:700;letter-spacing:.22em;color:#a8823a;
   border-top:1px solid #d9d3c6;padding-top:22px}
article{display:grid;grid-template-columns:52px 1fr;gap:16px;padding:18px 0;border-bottom:1px solid #e6e1d6;break-inside:avoid}
.n{font-size:13px;font-weight:700;color:#a8823a;padding-top:4px;letter-spacing:.06em}
h3{margin:0;font-size:18px;font-weight:700;line-height:1.35}
.t{display:inline-block;margin-top:5px;font-size:11px;letter-spacing:.1em;color:#8f887a}
p{margin:9px 0 0;font-size:15px;color:#3a352c}
footer{margin-top:48px;color:#8f887a;font-size:12px;text-align:center}
@media print{@page{size:A4;margin:16mm}body{background:#fff}.wrap{padding:0;max-width:none}
  h2{break-after:avoid}header{margin-bottom:0}}
@media (max-width:520px){.wrap{padding:32px 16px 64px}article{grid-template-columns:38px 1fr;gap:10px}}
</style></head><body><div class="wrap">
<header><h1>발표자 노트</h1><p>Road to Hotel · 성공적인 메이드를 위한 거시 전략론 5 POINTS · 65장 · 120분</p></header>
${body}
<footer>덱에서는 <b>N</b> 키를 누르면 같은 노트가 뜹니다.</footer>
</div></body></html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`notes=OK ${rows.length}장 ${(Buffer.byteLength(html) / 1024).toFixed(0)}KB → ${OUT}`);
