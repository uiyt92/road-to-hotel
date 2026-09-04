// ── 덱 디자인 시스템 ── 색·타이포·19종 슬라이드 템플릿
// 직접 실행하지 않는다. gen.mjs 가 불러 쓴다. 내용은 deck.mjs.
import fs from 'node:fs';

export let TOTAL = 0;
export const setTotal = (n) => { TOTAL = n; };
export let CHROME = 'DECK';
export const setChrome = (t) => { CHROME = t; };
const FONTS = "@import url('https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&family=Noto+Serif+KR:wght@400;600&family=Noto+Sans+KR:wght@400;500;700&display=swap');";
const INK = '#f3eee4', MUTED = '#b9b2a3', DIM = '#8f887a', GOLD = '#d9a441', RED = '#d8412f', BG = '#050403';
const SANS = "font-family: 'Noto Sans KR', sans-serif;";
const BRUSH = "font-family: 'East Sea Dokdo', cursive; font-weight: 400;";

const grain = (op = 0.16) => `<svg style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: ${op}; mix-blend-mode: overlay; pointer-events: none;"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter><rect width="100%" height="100%" filter="url(#grain)"></rect></svg>`;
const chrome = (s, n) => `
  <div style="position: absolute; left: 44px; top: 34px; font-size: 22px; font-weight: 600;">${CHROME}</div>
  <div style="position: absolute; right: 44px; top: 38px; font-size: 14px; letter-spacing: 0.3em; color: ${s.img ? INK : MUTED};">${s.top || ''}</div>
  <div style="position: absolute; left: 44px; bottom: 30px; font-size: 11px; letter-spacing: 0.08em; color: ${DIM}; ${SANS}">${s.tag || ''}</div>
  <div style="position: absolute; right: 44px; bottom: 30px; font-size: 11px; letter-spacing: 0.08em; color: ${DIM}; ${SANS}">${String(n).padStart(2, '0')} / ${TOTAL}</div>`;
const bracket = (inner, w, h, fs = 24) => `<div style="position: relative; width: ${w}px; height: ${h}px; display: grid; place-items: center; ${SANS} font-size: ${fs}px; font-weight: 700; color: ${INK}; text-align: center; line-height: 1.4;"><div style="position: absolute; left: 0; top: 0; width: 18px; height: 18px; border-top: 2px solid ${INK}; border-left: 2px solid ${INK};"></div><div style="position: absolute; right: 0; top: 0; width: 18px; height: 18px; border-top: 2px solid ${INK}; border-right: 2px solid ${INK};"></div><div style="position: absolute; left: 0; bottom: 0; width: 18px; height: 18px; border-bottom: 2px solid ${INK}; border-left: 2px solid ${INK};"></div><div style="position: absolute; right: 0; bottom: 0; width: 18px; height: 18px; border-bottom: 2px solid ${INK}; border-right: 2px solid ${INK};"></div><span>${inner}</span></div>`;
const concl = (t, center = true) => t ? `<p style="position: absolute; ${center ? 'left: 0; right: 0; text-align: center;' : 'left: 96px; right: 96px;'} bottom: 84px; margin: 0; font-size: 22px; color: #e6dfd0; ${SANS} font-weight: 500;">${t}<span style="color: ${RED};">.</span></p>` : '';
const optionsRow = (opts, bottom = 100, gap = 70) => opts ? `<div style="position: absolute; left: 96px; right: 96px; bottom: ${bottom}px; display: flex; justify-content: center; gap: ${gap}px; ${SANS}">${opts.map((o, i) => `<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; max-width: 360px; text-align: center;"><span style="font-size: 13px; letter-spacing: 0.3em; color: ${GOLD};">${o.k || String(i + 1).padStart(2, '0')}</span><strong style="font-size: 26px; font-weight: 700;">${o.t}</strong><span style="font-size: 14px; color: #c9c1b0; line-height: 1.5;">${o.d || ''}</span></div>`).join('')}</div>` : '';

const wrap = (body) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
    ${FONTS}
    body { margin: 0; background: ${BG}; }
    a { color: ${GOLD}; } a:hover { color: #f0c96a; }
  </style>
</helmet>
<div style="position: relative; width: 1600px; height: 900px; overflow: hidden; background: ${BG}; color: ${INK}; font-family: 'Noto Serif KR', serif;">
${body}
</div>
</x-dc>
</body>
</html>
`;

// ---------- templates ----------
const T = {};

T.img = (s, n) => {
  const pos = s.pos || '50% 30%';
  const flt = s.flt || 'saturate(0.85) contrast(1.05)';
  let shade = '';
  if (s.align === 'right') shade = `linear-gradient(to left, rgba(5,4,3,0.86) 0%, rgba(5,4,3,0.6) 40%, rgba(5,4,3,0.1) 75%, rgba(5,4,3,0.05) 100%)`;
  else if (s.align === 'center') shade = `rgba(5,4,3,0.45)`;
  else shade = `linear-gradient(to right, rgba(5,4,3,0.86) 0%, rgba(5,4,3,0.62) 38%, rgba(5,4,3,0.12) 72%, rgba(5,4,3,0.05) 100%)`;
  const top = s.align === 'center' ? `<div style="position: absolute; left: 0; right: 0; top: 0; height: 420px; background: linear-gradient(to bottom, rgba(5,4,3,0.8), rgba(5,4,3,0));"></div>` : '';
  let text = '';
  if (s.align === 'center') {
    text = `<h1 style="position: absolute; left: 80px; right: 80px; top: ${s.hTop || 120}px; margin: 0; ${BRUSH} font-size: ${s.hSize || 124}px; line-height: 1.05; text-align: center; color: ${INK};">${s.h}</h1>` + (s.sub ? `<div style="position: absolute; left: 0; right: 0; top: ${(s.hTop || 120) + (s.hSize || 124) * 1.2 + 10}px; text-align: center; font-size: 18px; color: #d8d0c0;">${s.sub}</div>` : '');
  } else {
    const side = s.align === 'right' ? 'right: 96px; align-items: flex-end; text-align: right;' : 'left: 96px;';
    text = `<div style="position: absolute; ${side} top: ${s.hTop || 230}px; width: ${s.w || 900}px; display: flex; flex-direction: column; gap: 18px;">${s.kicker ? `<span style="font-size: 14px; letter-spacing: 0.4em; color: ${GOLD}; ${SANS}">${s.kicker}</span>` : ''}<h1 style="margin: 0; ${BRUSH} font-size: ${s.hSize || 160}px; line-height: 1.02; color: ${INK};">${s.h}</h1>${s.sub ? `<span style="font-size: 20px; line-height: 1.6; color: #d8d0c0;">${s.sub}</span>` : ''}</div>`;
  }
  return wrap(`
  <img src="${s.img}" style="position: absolute; left: 0; top: 0; width: 1600px; height: 900px; object-fit: cover; object-position: ${pos}; filter: ${flt};">
  <div style="position: absolute; inset: 0; background: ${shade};"></div>
  ${top}
  <div style="position: absolute; left: 0; right: 0; bottom: 0; height: ${s.options ? 380 : 260}px; background: linear-gradient(to top, rgba(5,4,3,0.9), rgba(5,4,3,0));"></div>
  ${grain(0.22)}
  ${chrome(s, n)}
  ${text}
  ${optionsRow(s.options, s.concl ? 150 : 110)}
  ${concl(s.concl)}`);
};

T.chapter = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  <div style="position: absolute; left: 96px; top: 210px; display: flex; flex-direction: column; gap: 18px;">
    <span style="font-size: 14px; letter-spacing: 0.4em; color: ${GOLD}; ${SANS}">${s.kicker || ''}</span>
    <h1 style="margin: 0; ${BRUSH} font-size: 240px; line-height: 1; color: ${INK};">${s.h}</h1>
    <span style="font-size: 22px; line-height: 1.6; color: #d8d0c0;">${s.sub || ''}</span>
  </div>`);

T.theory = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  <div style="position: absolute; left: 96px; top: 140px; width: 1400px; display: flex; flex-direction: column; gap: 12px;">
    <h1 style="margin: 0; ${BRUSH} font-size: ${s.hSize || 112}px; line-height: 1.02; color: ${INK};">${s.h}</h1>
    ${s.sub ? `<span style="font-size: 20px; color: ${MUTED}; ${SANS}">${s.sub}</span>` : ''}
  </div>
  <div style="position: absolute; left: 96px; top: ${s.listTop || 410}px; width: ${s.callout ? 880 : 1400}px; display: flex; flex-direction: column; gap: ${s.items.length > 3 ? 20 : 30}px; ${SANS}">
    ${s.items.map((it, i) => `<div style="display: flex; gap: 26px; align-items: baseline;"><span style="font-size: 13px; letter-spacing: 0.2em; color: ${GOLD}; width: 30px; flex: none;">${String(i + 1).padStart(2, '0')}</span><strong style="font-size: 25px; font-weight: 700; width: 300px; flex: none; white-space: nowrap;">${it.t}</strong><span style="font-size: 16px; line-height: 1.6; color: ${MUTED};">${it.d || ''}</span></div>`).join('')}
  </div>
  ${s.callout ? `<div style="position: absolute; left: 1060px; top: ${s.listTop ? s.listTop + 20 : 430}px;">${bracket(s.callout, 440, 120, 22)}</div>` : ''}
  ${concl(s.concl)}`);

const connector = (up) => `<svg width="90" height="46" viewBox="0 0 90 46" style="flex: none; overflow: visible;"><path d="M2 ${up ? 34 : 12} Q 45 ${up ? 2 : 44} 88 ${up ? 20 : 26}" stroke="${DIM}" stroke-width="1.6" fill="none" stroke-dasharray="1 7" stroke-linecap="round"></path><path d="M${up ? '80 12 L88 20 L79 26' : '80 34 L88 26 L79 20'}" stroke="${DIM}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
const node = (st) => `<div style="flex: 1; display: flex; justify-content: center;"><div style="position: relative; width: 46px; height: 46px;"><div style="position: absolute; inset: 0; border-radius: 50%; border: 2px solid ${st.red ? RED : GOLD};"></div><div style="position: absolute; inset: 7px; border-radius: 50%; border: 1px solid ${st.red ? RED : GOLD}; opacity: 0.45;"></div></div></div>`;

T.flow = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  <h1 style="position: absolute; left: 96px; top: 140px; margin: 0; width: 1400px; ${BRUSH} font-size: ${s.hSize || 104}px; line-height: 1.02; color: ${INK};">${s.h}</h1>
  <div style="position: absolute; left: 96px; right: 96px; top: ${s.rowTop || 380}px; display: flex; align-items: center; ${SANS}">
    ${s.steps.map((st, i) => (i ? connector(i % 2 === 1) : '') + node(st)).join('')}
  </div>
  <div style="position: absolute; left: 96px; right: 96px; top: ${(s.rowTop || 380) + 66}px; display: flex; align-items: flex-start; ${SANS}">
    ${s.steps.map((st, i) => `${i ? `<div style="flex: none; width: 90px;"></div>` : ''}<div style="flex: 1; display: flex; flex-direction: column; gap: 10px; padding: 0 ${i ? 24 : 0}px 0 ${i < s.steps.length - 1 ? 24 : 0}px; text-align: center;"><span style="font-size: 13px; letter-spacing: 0.24em; color: ${st.red ? RED : GOLD};">${st.k || ''}</span><strong style="font-size: 28px; font-weight: 700; line-height: 1.25;">${st.t}</strong><span style="font-size: 15px; line-height: 1.6; color: ${MUTED};">${st.d || ''}</span></div>`).join('')}
  </div>
  ${concl(s.concl)}`);

T.columns = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  <div style="position: absolute; left: 96px; top: 140px; width: 1400px; display: flex; flex-direction: column; gap: 12px;">
    <h1 style="margin: 0; ${BRUSH} font-size: ${s.hSize || 104}px; line-height: 1.02; color: ${INK};">${s.h}</h1>
    ${s.sub ? `<span style="font-size: 18px; color: ${MUTED}; ${SANS} line-height: 1.6;">${s.sub}</span>` : ''}
  </div>
  <div style="position: absolute; left: 96px; right: 96px; top: ${s.rowTop || 400}px; display: grid; grid-template-columns: repeat(${s.cols.length}, minmax(0, 1fr)); gap: ${s.cols.length > 3 ? 36 : 60}px; ${SANS}">
    ${s.cols.map((c, i) => `<div style="display: flex; flex-direction: column; gap: 12px; padding-top: 22px; border-top: 1px solid #3a3323;"><span style="font-size: 13px; letter-spacing: 0.24em; color: ${c.red ? RED : GOLD};">${c.k ?? String(i + 1).padStart(2, '0')}</span><strong style="font-size: ${s.cols.length > 3 ? 26 : 30}px; font-weight: 700; line-height: 1.25;">${c.t}</strong><span style="font-size: 16px; line-height: 1.65; color: ${MUTED};">${c.d || ''}</span></div>`).join('')}
  </div>
  ${concl(s.concl)}`);

// 전열 다이어그램 — 좌표(1280×260 뷰박스, left:160 offset)
const FX = [70, 470, 810, 1210], FY_INTRO = [178, 132, 108, 62], FY_ROLES = [150, 128, 128, 106];
const fNode = (x, y, r, big) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="2"></circle><circle cx="${x}" cy="${y}" r="${r - 7}" fill="none" stroke="${INK}" stroke-width="1" opacity="0.45"></circle>`;
const smooth = (pts) => { let d = `M ${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const mx = (x0 + x1) / 2; d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`; } return d; };
const diagramLabels = (caps, y) => caps.map((c, i) => `<div style="position: absolute; left: ${160 + FX[i]}px; top: ${y}px; width: 220px; margin-left: -110px; text-align: center; ${SANS} font-size: 14px; color: ${DIM}; line-height: 1.4;">${c}</div>`).join('');

T.diagram = (s, n) => {
  const intro = s.variant !== 'roles';
  const FY = intro ? FY_INTRO : FY_ROLES;
  const pts = FX.map((x, i) => [x, FY[i]]);
  let svgExtra = '';
  if (intro) {
    svgExtra = `<path d="${smooth([pts[3], [1280, FY[3] - 30]])}" stroke="${RED}" stroke-width="2" fill="none" stroke-dasharray="2 8" stroke-linecap="round"></path><path d="M1258 ${FY[3] - 56} L1280 ${FY[3] - 30} L1250 ${FY[3] - 22}" stroke="${RED}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path><text x="1288" y="${FY[3] - 34}" fill="${RED}" font-size="15" letter-spacing="2" font-family="'Noto Sans KR',sans-serif">목적지</text>`;
  } else {
    svgExtra = `
      <path d="M 1360 40 Q 1290 90 ${FX[3] + 26} ${FY[3] - 14}" stroke="${RED}" stroke-width="2" fill="none" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M${FX[3] + 44} ${FY[3] - 34} L${FX[3] + 26} ${FY[3] - 14} L${FX[3] + 52} ${FY[3] - 6}" stroke="${RED}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="${smooth([[FX[0], FY[0] + 26], [FX[1] - 40, FY[0] + 60], [FX[2] - 20, FY[2] + 40], [FX[3] - 30, FY[3] + 22]])}" stroke="${GOLD}" stroke-width="2" fill="none" stroke-dasharray="2 8" stroke-linecap="round"></path>
      <path d="M${FX[3] - 50} ${FY[3] + 6} L${FX[3] - 30} ${FY[3] + 22} L${FX[3] - 52} ${FY[3] + 30}" stroke="${GOLD}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>`;
  }
  return wrap(`
  ${grain()}
  ${chrome(s, n)}
  <h1 style="position: absolute; left: 96px; top: 140px; margin: 0; ${BRUSH} font-size: 104px; line-height: 1.02; color: ${INK};">${s.h}</h1>
  <svg style="position: absolute; left: 160px; top: 430px; width: 1360px; height: 260px; overflow: visible;" viewBox="0 0 1360 260">
    <path d="${smooth(pts)}" stroke="${INK}" stroke-width="1.6" fill="none" opacity="0.7"></path>
    ${pts.map((p, i) => fNode(p[0], p[1], i === 3 ? 15 : 12)).join('')}
    ${svgExtra}
  </svg>
  ${diagramLabels(s.caps, 430 + Math.max(...FY) + 34)}
  ${s.notes ? `<div style="position: absolute; left: 160px; right: 160px; top: 400px; display: flex; justify-content: space-between; ${SANS} font-size: 15px; color: ${MUTED};"><span>${s.notes[0]}</span><span>${s.notes[1]}</span></div>` : ''}
  ${concl(s.concl)}`);
};

T.workshop = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  <div style="position: absolute; left: 96px; top: 150px; display: flex; align-items: flex-end; gap: 40px;">
    <span style="${BRUSH} font-size: 260px; line-height: 0.8; color: ${GOLD};">${s.big}</span>
    <div style="display: flex; flex-direction: column; gap: 10px; padding-bottom: 14px;"><span style="font-size: 14px; letter-spacing: 0.3em; color: ${MUTED}; ${SANS}">${s.unit}</span><h1 style="margin: 0; ${BRUSH} font-size: 96px; line-height: 1; color: ${INK};">${s.h}</h1></div>
  </div>
  <div style="position: absolute; left: 96px; right: 96px; top: 470px; display: grid; grid-template-columns: repeat(${s.cols.length}, minmax(0, 1fr)); gap: 60px; ${SANS}">
    ${s.cols.map((c, i) => `<div style="display: flex; flex-direction: column; gap: 12px; padding-top: 22px; border-top: 1px solid #3a3323;"><span style="font-size: 13px; letter-spacing: 0.2em; color: ${GOLD};">${String(i + 1).padStart(2, '0')}</span><strong style="font-size: 28px; font-weight: 700;">${c.t}</strong><span style="font-size: 16px; line-height: 1.6; color: ${MUTED};">${c.d}</span></div>`).join('')}
  </div>
  ${concl(s.concl)}`);

T.rail = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  <h1 style="position: absolute; left: 96px; top: 140px; margin: 0; ${BRUSH} font-size: 104px; line-height: 1.02; color: ${INK};">${s.h}</h1>
  <div style="position: absolute; left: 96px; right: 96px; top: 330px; display: flex; flex-direction: column; ${SANS}">
    ${s.rows.map(r => `<div style="display: grid; grid-template-columns: 60px 200px 1fr 200px; align-items: center; padding: 16px 0; border-top: 1px solid #3a3323; ${r.dim ? 'opacity: 0.5;' : ''}"><span style="font-size: 13px; letter-spacing: 0.2em; color: ${GOLD};">${r.n}</span><strong style="font-size: 24px; font-weight: 700;">${r.t}</strong><span style="font-size: 16px; color: ${MUTED};">${r.d}</span><span style="font-size: 14px; letter-spacing: 0.3em; color: ${r.dim ? RED : INK}; text-align: right;">${r.s}</span></div>`).join('')}
  </div>
  ${concl(s.concl)}`);

// ---------- 도식 라이브러리 ----------
const ring2 = (x, y, r = 13, c = INK) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="2"></circle><circle cx="${x}" cy="${y}" r="${r - 6}" fill="none" stroke="${c}" stroke-width="1" opacity="0.45"></circle>`;
const dsh = (d, c = DIM, w = 1.6) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-dasharray="2 8" stroke-linecap="round"></path>`;
const sld = (d, c = INK, w = 2) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"></path>`;
const head = (x, y, ang, c = DIM, s = 9) => `<path d="M${-s} ${-s} L0 0 L${-s} ${s}" transform="translate(${x},${y}) rotate(${ang})" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>`;
const blk = (k, t, d, kc = GOLD, ts = 25) => `${k ? `<span style="display: block; font-size: 13px; letter-spacing: 0.24em; color: ${kc};">${k}</span>` : ''}<strong style="display: block; font-size: ${ts}px; font-weight: 700; line-height: 1.25; margin-top: ${k ? 9 : 0}px;">${t}</strong>${d ? `<span style="display: block; font-size: 15px; line-height: 1.55; color: ${MUTED}; margin-top: 9px;">${d}</span>` : ''}`;
const dhead = (s) => `<div style="position: absolute; left: 96px; top: 140px; width: 1400px; display: flex; flex-direction: column; gap: 12px;"><h1 style="margin: 0; ${BRUSH} font-size: ${s.hSize || 104}px; line-height: 1.02; color: ${INK};">${s.h}</h1>${s.sub ? `<span style="font-size: 18px; color: ${MUTED}; ${SANS} line-height: 1.6;">${s.sub}</span>` : ''}</div>`;
const frame = (s, n, top, h, svg, labels) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  ${dhead(s)}
  <svg style="position: absolute; left: 96px; top: ${top}px; width: 1408px; height: ${h}px; overflow: visible;" viewBox="0 0 1408 ${h}">${svg}</svg>
  ${labels}
  ${concl(s.concl)}`);
const L = (top) => (x, y, w, html, al = 'center') => `<div style="position: absolute; left: ${96 + x - (al === 'center' ? w / 2 : al === 'right' ? w : 0)}px; top: ${top + y}px; width: ${w}px; text-align: ${al}; ${SANS}">${html}</div>`;

// 방사형 — 하나의 반응에서 네 군데를 본다
T.hub = (s, n) => { const T0 = 380, l = L(T0), C = [704, 176], P = [[250, 34], [1158, 34], [250, 300], [1158, 300]];
  return frame(s, n, T0, 380,
    P.map(p => dsh(`M ${C[0] + (p[0] < 700 ? -80 : 80)} ${C[1] + (p[1] < 170 ? -34 : 34)} L ${p[0] + (p[0] < 700 ? 110 : -110)} ${p[1] + (p[1] < 170 ? 26 : -6)}`)).join('') +
    `<circle cx="${C[0]}" cy="${C[1]}" r="82" fill="${GOLD}"></circle>` + P.map(p => ring2(p[0], p[1])).join(''),
    l(C[0], C[1] - 26, 220, `<span style="display: block; font-size: 24px; font-weight: 700; color: #17140d; line-height: 1.3;">${s.center}</span>`) +
    P.map((p, i) => l(p[0], p[1] + 30, 320, blk(String(i + 1).padStart(2, '0'), s.items[i].t, s.items[i].d, GOLD, 24))).join('')); };

// 눈금 — 낮음·목표·높음
T.gauge = (s, n) => { const T0 = 430, l = L(T0), y = 70, X = [40, 470, 940, 1368];
  return frame(s, n, T0, 220,
    sld(`M ${X[0]} ${y} L ${X[1]} ${y}`, DIM, 3) + sld(`M ${X[1]} ${y} L ${X[2]} ${y}`, GOLD, 8) + sld(`M ${X[2]} ${y} L ${X[3]} ${y}`, RED, 3) +
    [X[1], X[2]].map(x => sld(`M ${x} ${y - 16} L ${x} ${y + 16}`, DIM, 1.4)).join('') +
    `<circle cx="${(X[0] + X[1]) / 2}" cy="${y}" r="9" fill="${DIM}"></circle><circle cx="${(X[1] + X[2]) / 2}" cy="${y}" r="13" fill="${GOLD}"></circle><circle cx="${(X[2] + X[3]) / 2}" cy="${y}" r="9" fill="${RED}"></circle>`,
    l((X[1] + X[2]) / 2, y - 62, 300, `<span style="font-size: 13px; letter-spacing: 0.3em; color: ${GOLD};">여기가 목표</span>`) +
    s.zones.map((z, i) => l((X[i] + X[i + 1]) / 2, y + 36, 380, blk('', z.t, z.d, GOLD, 28))).join('')); };

// 갈림길 — 하나에서 셋으로
T.branch = (s, n) => { const T0 = 400, l = L(T0), Y = [46, 158, 270], C = [120, 158];
  return frame(s, n, T0, 320,
    ring2(C[0], C[1], 16, GOLD) + Y.map((y, i) => dsh(`M ${C[0] + 34} ${C[1]} C 420 ${C[1]}, 500 ${y}, 830 ${y}`, [GOLD, INK, RED][i]) + head(846, y, 0, [GOLD, INK, RED][i])).join(''),
    l(C[0], C[1] + 40, 220, `<span style="font-size: 14px; letter-spacing: 0.24em; color: ${GOLD};">${s.source}</span>`) +
    s.items.map((it, i) => l(900, Y[i] - 34, 500, blk(it.k, it.t, it.d, [GOLD, INK, RED][i], 27), 'left')).join('')); };

// 계단 — 아래에서 위로
T.stairs = (s, n) => { const T0 = 400, l = L(T0), W = 332, X = [40, 372, 704, 1036], Y = [270, 208, 146, 84], C = [RED, DIM, INK, GOLD];
  return frame(s, n, T0, 320,
    X.map((x, i) => sld(`M ${x} ${Y[i]} L ${x + W} ${Y[i]}`, C[i], 3) + (i ? sld(`M ${x} ${Y[i - 1]} L ${x} ${Y[i]}`, DIM, 1.4) : '') + `<circle cx="${x + 22}" cy="${Y[i]}" r="8" fill="${C[i]}"></circle>`).join(''),
    s.steps.map((st, i) => l(X[i] + W / 2, Y[i] - 96, 330, blk(st.k, st.t, st.d, C[i] === DIM ? GOLD : C[i], 26))).join('')); };

// 곱셈식
T.formula = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  ${dhead(s)}
  <div style="position: absolute; left: 96px; right: 96px; top: 430px; display: flex; align-items: flex-start; justify-content: center; gap: 24px; ${SANS}">
    ${s.terms.map((t, i) => `${i ? `<span style="font-size: 40px; color: ${GOLD}; line-height: 1; padding-top: 14px; flex: none;">×</span>` : ''}<div style="flex: 1; max-width: 300px; text-align: center;">${blk('', t.t, t.d, GOLD, 27)}</div>`).join('')}
  </div>
  <div style="position: absolute; left: 0; right: 0; top: 660px; text-align: center; ${SANS}"><span style="font-size: 15px; letter-spacing: 0.3em; color: ${MUTED};">= </span><span style="font-size: 15px; letter-spacing: 0.3em; color: ${GOLD};">${s.result}</span></div>
  ${concl(s.concl)}`);

// 순환 — 올렸다가 되돌린다
T.loop = (s, n) => { const T0 = 390, l = L(T0), y = 200, X = [150, 520, 890, 1258];
  return frame(s, n, T0, 340,
    X.map((x, i) => ring2(x, y, 14, i === 3 ? RED : GOLD) + (i < 3 ? dsh(`M ${x + 30} ${y} L ${X[i + 1] - 44} ${y}`, GOLD) + head(X[i + 1] - 32, y, 0, GOLD) : '')).join('') +
    dsh(`M ${X[3]} ${y + 32} C ${X[3] - 200} ${y + 130}, ${X[0] + 200} ${y + 130}, ${X[0]} ${y + 32}`, RED) + head(X[0], y + 34, -110, RED),
    s.items.map((it, i) => l(X[i], 8, 330, blk(String(i + 1).padStart(2, '0'), it.t, it.d, i === 3 ? RED : GOLD, 25))).join('') +
    l(704, y + 118, 620, `<span style="font-size: 15px; letter-spacing: 0.16em; color: ${RED};">${s.back}</span>`)); };

// 부채꼴 — 하나에서 여럿으로
T.fan = (s, n) => { const T0 = 400, l = L(T0), C = [160, 160], Y = [30, 110, 195, 275];
  return frame(s, n, T0, 330,
    `<circle cx="${C[0]}" cy="${C[1]}" r="64" fill="${GOLD}"></circle>` +
    Y.map(y => dsh(`M ${C[0] + 74} ${C[1]} C 400 ${C[1]}, 440 ${y}, 660 ${y}`, GOLD) + head(674, y, 0, GOLD)).join(''),
    l(C[0], C[1] - 16, 180, `<span style="font-size: 25px; font-weight: 700; color: #17140d;">${s.source}</span>`) +
    s.items.map((it, i) => l(716, Y[i] - 26, 660, blk('', it.t, it.d, GOLD, 25), 'left')).join('')); };

// 삼각 — 세 축
T.axes = (s, n) => { const T0 = 396, l = L(T0), V = [[420, 46], [988, 46], [704, 214]], C = [704, 102];
  return frame(s, n, T0, 300,
    sld(`M ${V[0][0]} ${V[0][1]} L ${V[1][0]} ${V[1][1]} L ${V[2][0]} ${V[2][1]} Z`, INK, 1.4) +
    V.map(v => dsh(`M ${C[0]} ${C[1]} L ${v[0]} ${v[1]}`)).join('') + V.map(v => `<circle cx="${v[0]}" cy="${v[1]}" r="9" fill="${GOLD}"></circle>`).join('') +
    `<circle cx="${C[0]}" cy="${C[1]}" r="6" fill="${INK}"></circle>`,
    l(C[0] + 24, C[1] - 11, 120, `<span style="font-size: 14px; letter-spacing: 0.3em; color: ${MUTED};">${s.center}</span>`, 'left') +
    l(V[0][0] - 46, V[0][1] - 78, 340, blk('01', s.vertices[0].t, s.vertices[0].d, GOLD, 28), 'right') +
    l(V[1][0] + 46, V[1][1] - 78, 340, blk('02', s.vertices[1].t, s.vertices[1].d, GOLD, 28), 'left') +
    l(V[2][0], V[2][1] + 28, 400, blk('03', s.vertices[2].t, s.vertices[2].d, GOLD, 28))); };

// 여정 — 5개 정거장, 주차 구분
T.roadmap = (s, n) => { const T0 = 430, l = L(T0), y = 76, X = [140, 420, 700, 980, 1268], D = 1124;
  return frame(s, n, T0, 230,
    sld(`M 40 ${y} L ${D} ${y}`, DIM, 1.4) + dsh(`M ${D} ${y} L 1368 ${y}`, RED) + dsh(`M ${D} ${y - 44} L ${D} ${y + 30}`, DIM, 1.2) +
    X.map((x, i) => i < 4 ? ring2(x, y, 14, GOLD) : ring2(x, y, 14, RED)).join(''),
    l(D - 90, y - 74, 160, `<span style="font-size: 13px; letter-spacing: 0.3em; color: ${GOLD};">1주차</span>`, 'right') +
    l(D + 90, y - 74, 160, `<span style="font-size: 13px; letter-spacing: 0.3em; color: ${RED};">2주차</span>`, 'left') +
    s.stations.map((st, i) => l(X[i], y + 34, 250, blk(String(i + 1).padStart(2, '0'), st.t, st.d, i < 4 ? GOLD : RED, 26))).join('')); };

// 대비 — 둘을 가른다
T.versus = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  ${dhead(s)}
  <div style="position: absolute; left: 96px; right: 96px; top: 420px; display: flex; align-items: stretch; ${SANS}">
    <div style="flex: 1; padding-right: 60px; opacity: 0.82;">${blk(s.left.k, s.left.t, s.left.d, RED, 34)}</div>
    <div style="flex: none; width: 1px; background: linear-gradient(to bottom, transparent, #4a4130 30%, #4a4130 70%, transparent); position: relative;"><span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: ${BG}; padding: 8px 0; font-size: 13px; letter-spacing: 0.2em; color: ${DIM};">↔</span></div>
    <div style="flex: 1; padding-left: 60px;">${blk(s.right.k, s.right.t, s.right.d, GOLD, 34)}</div>
  </div>
  ${concl(s.concl)}`);

// 대사 — 실전에서 그대로 말하는 문장
T.script = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  <div style="position: absolute; left: 96px; top: 132px; width: 1400px; display: flex; flex-direction: column; gap: 12px;">
    <h1 style="margin: 0; ${BRUSH} font-size: ${s.hSize || 104}px; line-height: 1.02; color: ${INK};">${s.h}</h1>
    ${s.sub ? `<span style="font-size: 18px; color: ${MUTED}; ${SANS} line-height: 1.6;">${s.sub}</span>` : ''}
  </div>
  <div style="position: absolute; left: 96px; right: 96px; top: ${s.rowTop || 380}px; display: flex; flex-direction: column;">
    ${s.lines.map((t, i) => `<div style="display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 22px; align-items: start; padding: ${s.pad || 18}px 0; border-top: 1px solid #332d20;"><span style="${SANS} font-size: 13px; letter-spacing: 0.2em; color: ${GOLD}; padding-top: 7px;">${String(i + 1).padStart(2, '0')}</span><span style="font-size: ${s.lineSize || 21}px; line-height: 1.6; color: #e6dfd0;">${t}</span></div>`).join('')}
  </div>
  ${concl(s.concl)}`);

// ---------- 56장 명세 ----------
export { T, wrap, grain, chrome, concl, bracket, blk, dhead, frame, L, INK, MUTED, DIM, GOLD, RED, BG, SANS, BRUSH };
