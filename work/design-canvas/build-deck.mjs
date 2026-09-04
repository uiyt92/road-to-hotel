// 캔버스 아트보드 56장 → 발표용 단일 HTML 덱
// 실행: node build-deck.mjs   (design-canvas 폴더에서)
// 폰트·이미지를 파일 안에 심어 인터넷 없이 동작한다.
import fs from 'node:fs';
import path from 'node:path';

const TOTAL = 64;
const OUT = path.resolve('../../outputs/5points_deck.html');
const IMGDIR = '../images/web';

// --- 폰트 (서브셋 woff2 → data URI) ---
const FACE = [
  ['East Sea Dokdo', 400, 'fonts/EastSeaDokdo.woff2'],
  ['Noto Sans KR', 400, 'fonts/NotoSansKR-400.woff2'],
  ['Noto Sans KR', 700, 'fonts/NotoSansKR-700.woff2'],
  ['Noto Serif KR', 600, 'fonts/NotoSerifKR-600.woff2'],
];
const fontCss = FACE.map(([fam, w, f]) =>
  `@font-face{font-family:"${fam}";font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(f).toString('base64')}) format("woff2")}`
).join('');

// --- 슬라이드 본문 추출 + 이미지 인라인 ---
const imgCache = new Map();
const inlineImg = (name) => {
  if (!imgCache.has(name)) {
    const p = path.join(IMGDIR, name);
    imgCache.set(name, `data:image/jpeg;base64,${fs.readFileSync(p).toString('base64')}`);
  }
  return imgCache.get(name);
};

const slides = [];
for (let i = 1; i <= TOTAL; i++) {
  const file = i === 1 ? 'Main.dc.html' : `S${String(i).padStart(2, '0')}.dc.html`;
  const raw = fs.readFileSync(file, 'utf8');
  let body = raw.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1];
  body = body.replace(/<helmet>[\s\S]*?<\/helmet>/, '');           // 구글 폰트 @import 제거
  body = body.replace(/src="([^"]+\.jpg)"/g, (_, n) => `src="${inlineImg(n)}"`);
  body = body.replace(/id="grain"/g, `id="grain${i}"`).replace(/url\(#grain\)/g, `url(#grain${i})`);
  const title = (raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').trim();
  const note = (raw.match(/<!--note:([\s\S]*?)-->/) || [, ''])[1].trim();
  slides.push(`<section class="slide" data-n="${i}" data-title="${title.replace(/"/g, '&quot;')}">${body.trim()}${note ? `<template class="speaker-note">${note}</template>` : ''}</section>`);
}

const css = `${fontCss}
*{box-sizing:border-box}
html,body{margin:0;height:100%;overflow:hidden;background:#000;font-family:"Noto Sans KR",system-ui,sans-serif}
#deck{position:fixed;inset:0;overflow:hidden}
.slide{position:absolute;left:50%;top:50%;width:1600px;height:900px;transform:translate(-50%,-50%) scale(var(--k,1));transform-origin:center;opacity:0;pointer-events:none;transition:opacity .22s ease}
.slide.on{opacity:1;pointer-events:auto;z-index:2}
.bar{position:fixed;left:0;bottom:0;height:3px;background:#d9a441;width:var(--p,0%);z-index:30;transition:width .22s ease}
.zone{position:fixed;top:10%;bottom:10%;width:12%;z-index:8;border:0;background:transparent;cursor:pointer}
.zone.l{left:0}.zone.r{right:0}
.ui{position:fixed;left:16px;bottom:14px;display:flex;gap:7px;align-items:center;z-index:31;opacity:0;transition:opacity .2s}
body.wake .ui,.ui:focus-within{opacity:1}
.ui button{border:0;background:#1c1a16;color:#f3eee4;width:36px;height:36px;border-radius:8px;cursor:pointer;font:inherit;font-size:13px}
.ui span{color:#8f887a;font-size:11px;letter-spacing:.1em;min-width:58px}
.ov{position:fixed;inset:0;z-index:40;display:none;overflow:auto;background:rgba(5,4,3,.97);color:#f3eee4;padding:38px}
.ov.on{display:block}
.ov h2{margin:0;font-size:24px;font-weight:700}
.ovh{display:flex;justify-content:space-between;align-items:center;max-width:1500px;margin:0 auto}
.ovh button{border:0;background:#26231c;color:#f3eee4;padding:9px 14px;border-radius:8px;cursor:pointer;font:inherit}
.grid{display:grid;grid-template-columns:repeat(6,1fr);gap:9px;max-width:1500px;margin:22px auto 0}
.grid button{min-height:74px;padding:11px;background:#141311;color:#f3eee4;border:1px solid #2e2a20;text-align:left;cursor:pointer;font:inherit}
.grid b{display:block;color:#d9a441;font-size:11px;letter-spacing:.1em;margin-bottom:6px}
.grid span{font-size:12px;line-height:1.35;color:#b9b2a3}
.nb{max-width:880px;margin:26px auto 0;background:#141311;padding:26px;font-size:18px;line-height:1.75;color:#e6dfd0}
.hg{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;max-width:900px;margin:26px auto 0}
.hi{background:#141311;padding:17px}.hi b{color:#d9a441;font-size:17px}.hi span{display:block;color:#b9b2a3;margin-top:6px;font-size:13px}
@media print{@page{size:16in 9in;margin:0}html,body{overflow:visible;height:auto}#deck{position:static}.slide{position:relative;left:auto;top:auto;transform:none;opacity:1!important;page-break-after:always;break-after:page}.ui,.bar,.zone,.ov{display:none!important}}`;

const js = `(function(){
var S=[].slice.call(document.querySelectorAll('.slide')),i=0,N=S.length;
var deck=document.getElementById('deck'),num=document.getElementById('num');
function fit(){var k=Math.min(innerWidth/1600,innerHeight/900);deck.style.setProperty('--k',k)}
function go(n,push){i=Math.max(0,Math.min(N-1,n));S.forEach(function(s,x){s.classList.toggle('on',x===i)});
  num.textContent=String(i+1).padStart(2,'0')+' / '+N;
  document.querySelector('.bar').style.setProperty('--p',((i+1)/N*100)+'%');
  if(push!==false)history.replaceState(null,'','#'+(i+1));
  var t=S[i].querySelector('.speaker-note');document.getElementById('nb').innerHTML=t?t.innerHTML:'<p style="color:#8f887a">이 장에는 노트가 없습니다.</p>';}
function pane(el){var open=!el.classList.contains('on');[].forEach.call(document.querySelectorAll('.ov'),function(o){o.classList.remove('on')});if(open)el.classList.add('on')}
var wake;function awake(){document.body.classList.add('wake');clearTimeout(wake);wake=setTimeout(function(){document.body.classList.remove('wake')},2200)}
addEventListener('resize',fit);addEventListener('mousemove',awake);
addEventListener('keydown',function(e){var k=e.key.toLowerCase();
  if(['arrowright',' ','pagedown'].indexOf(k)>=0){e.preventDefault();go(i+1)}
  else if(['arrowleft','pageup'].indexOf(k)>=0){e.preventDefault();go(i-1)}
  else if(k==='home')go(0);else if(k==='end')go(N-1);
  else if(k==='n')pane(document.getElementById('notes'));
  else if(k==='o')pane(document.getElementById('over'));
  else if(k==='f'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}
  else if(k==='?')pane(document.getElementById('help'));
  else if(k==='escape'){[].forEach.call(document.querySelectorAll('.ov'),function(o){o.classList.remove('on')})}
  awake()});
document.querySelector('.zone.l').onclick=function(){go(i-1)};
document.querySelector('.zone.r').onclick=function(){go(i+1)};
document.getElementById('pv').onclick=function(){go(i-1)};
document.getElementById('nx').onclick=function(){go(i+1)};
document.getElementById('bn').onclick=function(){pane(document.getElementById('notes'))};
document.getElementById('bo').onclick=function(){pane(document.getElementById('over'))};
document.getElementById('bf').onclick=function(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()};
document.getElementById('bh').onclick=function(){pane(document.getElementById('help'))};
[].forEach.call(document.querySelectorAll('[data-close]'),function(b){b.onclick=function(){[].forEach.call(document.querySelectorAll('.ov'),function(o){o.classList.remove('on')})}});
var g=document.getElementById('grid');
S.forEach(function(s,x){var b=document.createElement('button');
  b.innerHTML='<b>'+String(x+1).padStart(2,'0')+'</b><span>'+(s.dataset.title||'')+'</span>';
  b.onclick=function(){go(x);[].forEach.call(document.querySelectorAll('.ov'),function(o){o.classList.remove('on')})};g.appendChild(b)});
addEventListener('hashchange',function(){var n=parseInt((location.hash||'').slice(1),10);if(n&&n-1!==i)go(n-1,false)});
fit();go((parseInt((location.hash||'').slice(1),10)||1)-1,false);awake();
})();`;

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Road to Hotel · 5 POINTS 거시 전략론</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23050403'/%3E%3Ccircle cx='16' cy='16' r='9' fill='none' stroke='%23d9a441' stroke-width='2.5'/%3E%3C/svg%3E">
<style>${css}</style></head>
<body><main id="deck">${slides.join('')}</main>
<button class="zone l" aria-label="이전"></button><button class="zone r" aria-label="다음"></button>
<div class="bar"></div>
<div class="ui"><button id="pv">←</button><button id="nx">→</button><span id="num">01 / ${TOTAL}</span><button id="bn">N</button><button id="bo">O</button><button id="bf">F</button><button id="bh">?</button></div>
<aside id="notes" class="ov"><div class="ovh"><h2>발표자 노트</h2><button data-close>닫기 · Esc</button></div><div class="nb" id="nb"></div></aside>
<div id="over" class="ov"><div class="ovh"><h2>${TOTAL}장 전체 보기</h2><button data-close>닫기 · Esc</button></div><div class="grid" id="grid"></div></div>
<div id="help" class="ov"><div class="ovh"><h2>발표 단축키</h2><button data-close>닫기 · Esc</button></div><div class="hg">
<div class="hi"><b>← → Space</b><span>슬라이드 이동</span></div><div class="hi"><b>Home / End</b><span>처음과 마지막</span></div>
<div class="hi"><b>N</b><span>발표자 노트</span></div><div class="hi"><b>O</b><span>전체 슬라이드</span></div>
<div class="hi"><b>F</b><span>전체 화면</span></div><div class="hi"><b>Esc</b><span>패널 닫기</span></div></div></div>
<script>${js}</script></body></html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
const ext = (html.match(/https?:\/\/(?!www\.w3\.org)[^"')\s]+/g) || []);
console.log(`build=OK slides=${TOTAL} images=${imgCache.size} fonts=${FACE.length} bytes=${Buffer.byteLength(html)} external=${ext.length}`);
if (ext.length) console.log('  외부 참조:', [...new Set(ext)].slice(0, 5).join(' '));
console.log('→', OUT);
