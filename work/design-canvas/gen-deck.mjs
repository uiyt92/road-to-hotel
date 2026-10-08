// 5 POINTS 덱 — 56장 명세 → S01..S56.dc.html + canvas.json(page-5) 생성
// 실행: node gen-deck.mjs   (design-canvas 폴더에서)
import fs from 'node:fs';
import { NOTES } from './notes.mjs';

const TOTAL = 68;
const FONTS = "@import url('https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&family=Noto+Serif+KR:wght@400;600&family=Noto+Sans+KR:wght@400;500;700&display=swap');";
const INK = '#f3eee4', MUTED = '#b9b2a3', DIM = '#8f887a', GOLD = '#d9a441', RED = '#d8412f', BG = '#050403';
const SANS = "font-family: 'Noto Sans KR', sans-serif;";
const BRUSH = "font-family: 'East Sea Dokdo', cursive; font-weight: 400;";

const grain = (op = 0.16) => `<svg style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: ${op}; mix-blend-mode: overlay; pointer-events: none;"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter><rect width="100%" height="100%" filter="url(#grain)"></rect></svg>`;
const chrome = (s, n) => `
  <div style="position: absolute; left: 44px; top: 34px; font-size: 22px; font-weight: 600;">5 POINTS</div>
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
    body { margin: 0; background: ${BG}; word-break: keep-all; }
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

// 사다리 — 같은 상황에서 갈리는 두 갈래를 나란히 내려 비교한다
const rung = (r, kc) => `<div style="border: 1px solid ${kc === RED ? 'rgba(216,65,47,0.34)' : 'rgba(217,164,65,0.34)'}; background: ${kc === RED ? 'rgba(216,65,47,0.07)' : 'rgba(217,164,65,0.07)'}; padding: 10px 20px; text-align: center;">
  <strong style="display: block; font-size: 23px; font-weight: 700; line-height: 1.3; color: ${r.hi ? kc : INK};">${r.t}</strong>
  ${r.d ? `<span style="display: block; margin-top: 4px; font-size: 15px; line-height: 1.45; color: ${MUTED};">${r.d}</span>` : ''}</div>`;
const drop = () => `<svg width="14" height="22" viewBox="0 0 14 22" style="display: block; margin: 3px auto;"><path d="M7 0 V16 M2 11 L7 17 L12 11" stroke="${DIM}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
const rail2 = (c, kc) => `<div style="flex: 1;">
  <div style="text-align: center; padding-bottom: 9px; border-bottom: 1px solid #3a3323; margin-bottom: 11px;"><span style="font-size: 14px; letter-spacing: 0.22em; color: ${kc};">${c.k}</span></div>
  ${c.rows.map((r, i) => (i ? drop() : '') + rung(r, kc)).join('')}</div>`;
T.ladder = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  ${dhead(s)}
  <div style="position: absolute; left: 96px; right: 96px; top: ${s.rowTop || 358}px; display: flex; gap: 72px; ${SANS}">
    ${rail2(s.left, RED)}${rail2(s.right, GOLD)}
  </div>
  ${concl(s.concl)}`);

// 깔때기 — 두 전제가 세 갈래로 퍼졌다가 하나의 판단으로 모인다
const band = (b, big) => `<div style="border: 1px solid #3a3323; background: rgba(217,164,65,0.05); padding: ${big ? 9 : 7}px 24px; text-align: center;">
  ${b.k ? `<span style="display: block; font-size: 13px; letter-spacing: 0.24em; color: ${GOLD};">${b.k}</span>` : ''}
  <strong style="display: block; margin-top: 3px; font-size: ${big ? 26 : 23}px; font-weight: 700; color: ${INK};">${b.t}</strong>
  ${b.d ? `<span style="display: block; margin-top: 3px; font-size: 15px; color: ${MUTED};">${b.d}</span>` : ''}</div>`;
T.funnel = (s, n) => wrap(`
  ${grain()}
  ${chrome(s, n)}
  ${dhead(s)}
  <div style="position: absolute; left: 240px; right: 240px; top: ${s.rowTop || 342}px; ${SANS}">
    ${band(s.top1)}${drop()}${band(s.top2)}${drop()}
    <div style="display: flex; gap: 22px;">${s.axes.map((a) => `<div style="flex: 1; border: 1px solid #3a3323; padding: 8px 12px; text-align: center;">
      <strong style="display: block; ${BRUSH} font-size: 32px; color: ${INK}; line-height: 1;">${a.t}</strong>
      <span style="display: block; margin-top: 6px; font-size: 16px; font-weight: 700; color: ${INK};">${a.d}</span>
      <span style="display: block; margin-top: 2px; font-size: 14px; color: ${MUTED};">${a.s}</span></div>`).join('')}</div>
    ${drop()}${band(s.out, true)}
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
const S = [
 { type:'img', img:'t_woman_bar.jpg', pos:'70% 0%', top:'MACRO STRATEGY', tag:'표지', h:'Road to Hotel', hSize:168, w:1150, sub:'성공적인 메이드를 위한 거시 전략론 · 5 POINTS<br>CNA NIGHT / PREDIC&amp;NOVA · 第一週 · 120분' },
 { type:'img', img:'s02_empty_glasses.jpg', align:'left', top:'도입', tag:'대부분의 메이드 흐름', h:'메이드를 했는데,<br>왜 결과가 없을까?', hSize:107, options:[{t:'대화는 되는데',d:'호감이 안 나온다'},{t:'다음 스텝으로 넘어가야 되는데',d:'뭘 해야 할지 모르겠다'},{t:'그러다 보니',d:'윙이랑 합이 안 맞는다'},{t:'그렇게 되다 보니',d:'메이드 자리가 애매하게 끝난다'}], concl:'대화가 문제가 아니라 구조의 문제다' },
 { type:'theory', top:'흐름 01', tag:'대부분의 메이드 흐름', h:'대화는 되는데<br>호감이 안 나온다', hSize:74, sub:'농담도 통하고 분위기도 나쁘지 않다. 그런데 그 이상의 감정은 안 생긴다.', items:[{t:'겉으로 보이는 것',d:'웃음이 오가고 질문도 몇 개 나온다. 자리는 편해 보인다.'},{t:'속으로 하는 생각',d:'“잘 되고 있다.” 분위기가 좋으니 이대로만 가면 된다고 믿는다.'},{t:'실제로 벌어지는 일',d:'편한 것과 끌리는 것은 다르다. 감정은 아직 안 움직였다.'}], callout:'분위기가 좋은 것과<br>텐션이 살아 있는 것은 다르다' },
 { type:'theory', top:'흐름 02', tag:'대부분의 메이드 흐름', h:'다음 스텝으로 넘어가야 되는데<br>뭘 해야 할지 모르겠다', hSize:64, sub:'수위 있는 얘기나 다음 동선 앞에서 말이 멈춘다.', items:[{t:'겉으로 보이는 것',d:'같은 주제를 돌고, 질문이 점점 형식적으로 바뀐다.'},{t:'속으로 하는 생각',d:'“멘트가 부족하다.” 더 재밌는 말을 찾으려고 머리를 굴린다.'},{t:'실제로 벌어지는 일',d:'말이 막힌 게 아니라 다음 판단이 안 선 것이다.'}], callout:'할 말이 없는 게 아니다<br>뭘 할지 정하지 못한 것이다' },
 { type:'theory', top:'흐름 03', tag:'대부분의 메이드 흐름', h:'그러다 보니<br>윙이랑 합이 안 맞는다', hSize:74, sub:'한 명은 밀고 한 명은 브레이크를 건다.', items:[{t:'겉으로 보이는 것',d:'한쪽이 수위를 올리면 다른 쪽이 화제를 돌린다.'},{t:'속으로 하는 생각',d:'“쟤가 분위기를 깬다.” 윙 탓을 하기 시작한다.'},{t:'실제로 벌어지는 일',d:'둘이 지금 흐름을 다르게 읽고 있다. 역할을 안 맞춘 것이다.'}], callout:'윙이 못하는 게 아니라<br>같은 그림을 안 맞춘 것이다' },
 { type:'img', img:'s06_cleared_table.jpg', align:'left', top:'흐름 04', tag:'대부분의 메이드 흐름', h:'그렇게 되다 보니<br>메이드 자리가<br>애매하게 끝난다', hSize:88, sub:'“재밌었다”만 남고 관계는 제자리다', options:[{t:'겉으로 보이는 것',d:'인사하고 헤어진다. 연락처는 있어도 다음이 없다'},{t:'속으로 하는 생각',d:'“오늘은 애들이 별로였다.” 자리 탓, 상대 탓으로 정리한다'},{t:'실제로 벌어지는 일',d:'상대에게 아무 감정도 안 남았다. 제일 나쁜 결과다'}], concl:'최악은 차이는 게 아니다. 아무것도 안 남는 것이다' },
 { type:'img', img:'s07_over_shoulder.jpg', align:'center', top:'체크인 01', tag:'질문 회수 · 3분', h:'“ 당신은 어느 단계에서 멈추나? ”', hSize:90, options:[{t:'대화까지는 된다',d:'자리는 편한데 그 다음이 안 나온다'},{t:'둘이 엇갈린다',d:'윙이랑 속도가 안 맞은 적이 있다'},{t:'그대로 끝난다',d:'“재밌었다”만 남고 끝났다'}], concl:'대부분 이 중 하나에서 막힌다. 오늘은 그 지점을 넘긴다' },
 { type:'flow', top:'도입', tag:'왜 막히는가', h:'대화를 못한 게 아니라<br>잘못된 흐름을 만든 것이다.', hSize:96, steps:[{k:'A · 말이 막힘',t:'할 말을 찾는다',d:'질문, 농담, 루틴을 더 꺼내지만 흐름은 그대로다.'},{k:'B · 흐름을 잘못 읽음',t:'더 잘 보이려고 한다',d:'여자 쪽으로 흐름이 더 기울고, 소외된 사람은 더 멀어진다.',red:true},{k:'C · 풀리는 지점',t:'흐름을 읽고 역할을 바꾼다',d:'판단과 역할이 정해지면, 할 말은 그 다음에 나온다.'}], concl:'A에서 C로 가려면, B에서 왜 잘못됐는지 알아야 한다' },
 { type:'roadmap', top:'전체 지도', tag:'전체 구조', h:'거시 전략, 이 5개를 알아야 한다', hSize:94, stations:[{t:'심법',d:'흔들리지 않는 마음'},{t:'수읽기',d:'메이드의 흐름'},{t:'78수',d:'불리한 흐름에서 역전하는 법'},{t:'협공',d:'윙과의 역할 분담'},{t:'기보',d:'상대가 받을 수 있는 제안'}], concl:'1주차는 1~4번을 완성한다. 기보는 2주차에서 다룬다' },
 { type:'img', img:'s10_profile.jpg', align:'left', top:'第一論', tag:'1주차 · 파트', kicker:'POINT 01', h:'심법', hSize:240, sub:'반응에 끌려가지 않아야 흐름 전체를 볼 수 있다' },
 { type:'theory', top:'심법 · 一', tag:'심법 01', h:'주인 의식', hSize:150, sub:'자리의 주인이 된 것처럼 행동하라 — 상대 비위를 맞추는 게 아니라, 네 명이 더 편하게 놀 수 있는 자리를 만드는 것이다', items:[{t:'먼저 본다',d:'물컵, 자리, 말의 온도처럼 지금 불편한 데가 없는지 살핀다.'},{t:'가볍게 챙긴다',d:'챙겨준 뒤 대가를 바라지 않는다. 바라는 순간 거래가 된다.'},{t:'흐름을 넓힌다',d:'내 팟만 챙기지 말고, 빠진 사람까지 다시 대화 안으로 넣는다.'}], callout:'주인은 을이 아니라<br>흐름을 관리하는 사람' },
 { type:'theory', top:'심법 · 二', tag:'심법 02', h:'One for All,<br>Not All for One', hSize:104, listTop:470, sub:'내 팟보다 흐름 전체를 본다 — 한 명만 달리면 나머지 한 명이 빠지고, 한 명이 빠지면 흐름은 오래 못 간다', items:[{t:'윙을 올려준다',d:'내 윙이 좋게 보일 이유를 대신 만들어주면 팀 전체 체급이 올라간다.'},{t:'쏠림을 푼다',d:'한 사람에게 질문과 관심이 몰리면 자리나 질문을 섞어 균형을 만든다.'},{t:'경쟁하지 않는다',d:'내 파트너 싸움으로 만들지 말고, 네 명이 같이 살아 있는지를 본다.'}], callout:'내가 돋보이는 것보다<br>네 명의 흐름이 살아 있는 게 먼저' },
 { type:'theory', top:'심법 · 三', tag:'심법 03', h:'자기 확신', hSize:150, sub:'우리는 누구보다 잘나고 매력적인 남성이다 — 상대 반응에 나까지 흔들리면 흐름을 읽는 게 아니라 끌려다니게 된다', items:[{t:'리액션에 안 끌려간다',d:'웃음 하나, 무표정 하나로 바로 결론 내리지 않는다.'},{t:'어필을 줄인다',d:'잘 보이려고 말이 많아질수록 흐름은 더 기운다.'},{t:'여유를 남긴다',d:'상대가 선택할 공간을 남겨야 긴장 대신 호기심이 생긴다.'}], callout:'상대를 깎는 태도가 아니라<br>내가 흔들리지 않는 태도' },
  { type:'flow', top:'심법 · 三', tag:'심법 03 · 구조', h:'자기 확신이 없으면<br>흐름은 여기서부터 어긋난다', hSize:92, steps:[{k:'원인',t:'자기 확신의 부재',d:'상대방이 나보다 훨씬 매력적이라고 느끼면서 위축된다.'},{k:'1차 영향',t:'상황 해석의 왜곡',d:'중립적인 반응도 거절로 받아들이고, 작은 호의에는 과한 의미를 붙인다.'},{k:'2차 영향',t:'행동의 변화',d:'과하게 잘 보이려 하거나, 필요 이상으로 소극적으로 움직인다.',red:true},{k:'결과',t:'관계의 흐름에 악영향',d:'자연스럽게 생겼을 호감과 다음 단계를, 스스로 줄인다.',red:true}], concl:'흔들린 건 마음 하나인데, 무너지는 건 흐름 전체다' },
 { type:'img', img:'s15_hand_glass.jpg', align:'center', top:'체크인 02', tag:'질문 회수 · 3분', h:'“ 셋 중 뭐가 제일 안 되나? ”', hSize:90, options:[{t:'주인 의식',d:'흐름보다 내 팟만 챙긴다'},{t:'팀 우선',d:'내가 돋보이려고 한다'},{t:'자기 확신',d:'반응 하나에 흔들린다'}], concl:'제일 많이 나온 하나를 오늘 실습에서 각자 목표로 잡는다' },
 { type:'img', img:'t_go.jpg', align:'left', pos:'60% 50%', flt:'saturate(0.6) contrast(1.08) brightness(0.72)', top:'第二論', tag:'1주차 · 파트', kicker:'POINT 02', h:'수읽기', hSize:240, sub:'권력·텐션·의미를 보면 다음 한 수가 보인다' },
 { type:'axes', top:'수읽기', tag:'수읽기', h:'흐름을 읽을 때는<br>세 가지만 보면 된다', hSize:92, center:'흐름', vertices:[{t:'권력',d:'누가 이 자리에서 주도권을 갖고 있나'},{t:'텐션',d:'감정의 높낮이가 있느냐'},{t:'의미',d:'서로 이 자리를 뭐라고 생각하나'}], concl:'권력, 텐션, 의미. 이 세 축이 흐름의 방향을 정한다' },
 { type:'flow', top:'권력', tag:'수읽기', h:'권력이 여자 쪽으로 넘어갔을 때', hSize:95, steps:[{k:'01 · 관찰',t:'남자 둘만 애쓴다',d:'질문도 남자 쪽에서만 나옴 · 여자는 짧게 답하고 웃기만 함 · 이 자리에 별 의미를 못 느낌'},{k:'02 · 판단',t:'지금 여자가 내가 가치 있다고 생각하지 않는구나',d:'잘 보이려고 할수록 여자는 권력을 더 갖게 되고, 남자가 원하는 방향으로 흘러가지 않게 된다.',red:true},{k:'03 · 행동',t:'친구 프레임으로 전환한다',d:'어필을 멈추고 네 명이 같이 말할 주제로 돌린다.'}], concl:'여자 쪽으로 권력이 흐를 땐, 프레임을 이동시켜야 한다' },
 { type:'gauge', top:'텐션', tag:'수읽기', h:'감정이 살아 있어야<br>자리는 유지된다', hSize:96, zones:[{t:'무감정',d:'제일 의미가 없는 상태. 화장실 핑계로 빠지는 것도 여기서 나온다.'},{t:'몰입',d:'농담, 반박, 자기공개가 오간다. 감정의 높낮이가 생긴다.'},{t:'과열',d:'화가 나도 따지려고 남을 수 있다. 낮춰야 할 신호다.'}], concl:'무감정은 끝난 흐름이다. 감정이 있어야 자리가 유지된다' },
  { type:'columns', top:'텐션', tag:'수읽기 · 구조', h:'감정은 높낮이가 있어야<br>자리가 움직인다', hSize:92, sub:'감정이 일정하다고 지루한 것도, 변동이 크다고 좋은 것도 아니다. 높낮이는 결과가 아니라 기회를 만든다.', cols:[{k:'첫째',t:'익숙해지면 안 느껴진다',d:'같은 자극이 반복되면 사람은 익숙해진다. 처음엔 재미있던 농담도 계속되면 새로움이 줄어든다.'},{k:'둘째',t:'다른 면이 드러난다',d:'농담만 하면 재미있는 사람으로 남는다. 분위기가 바뀌어야 진지함, 배려, 자신감, 가치관이 보인다.'},{k:'셋째',t:'자리의 의미가 바뀐다',d:'같이 노는 사람에서, 서로를 이성으로 알아가는 자리로 넘어갈 여지가 생긴다.',red:true}], concl:'높낮이가 관계를 만드는 게 아니라, 의미가 달라질 기회를 만든다' },
 { type:'img', img:'s22_two_backs.jpg', align:'center', top:'체크인 03', tag:'질문 회수 · 3분', h:'“ 최근 그 자리, 어느 상태였나? ”', hSize:90, options:[{t:'무감정',d:'웃긴 웃는데 아무것도 안 움직였다'},{t:'몰입',d:'농담과 반박이 오갔다'},{t:'과열',d:'분위기가 날카로워졌다'}], concl:'무감정에 제일 많이 손이 올라간다. 문제는 거기서 뭘 하느냐다' },
 { type:'fan', top:'중반 도구', tag:'수읽기', h:'술게임은 목적이 아니라<br>메이드를 진행하기 위한 도구다', hSize:88, source:'술게임', items:[{t:'텐션 환기',d:'루즈해진 자리에 리듬을 다시 만든다.'},{t:'말거리 만들기',d:'지목과 이유 설명으로 대화 소재가 생긴다.'},{t:'호감의 방향',d:'누가 누구에게 반응하는지 자연스럽게 드러난다.'},{t:'팀 구도',d:'나와 내 팟, 윙과 윙 팟이 자연스럽게 한 편이 된다.'}], concl:'술을 먹이기 위해서가 아니라, 감정과 리액션을 만들기 위해서다' },
 { type:'flow', top:'게임 타이밍', tag:'수읽기', h:'게임에 들어가도 되는 타이밍', steps:[{k:'01 · 조건',t:'최소한의 호감',d:'여자 둘 다 자리에 남아 있고, 질문이 오가거나 웃고 받아치는 장면이 있다.'},{k:'02 · 금지',t:'무감정 상태에서 꺼내지 않는다',d:'아무 감정도 없는데 게임을 꺼내면 재미가 아니라 부담이 된다.',red:true},{k:'03 · 사용',t:'루즈해지기 전에 리듬을 바꾼다',d:'한쪽이 빠지면 먼저 다시 끌어오고, 네 명이 같이 할 수 있을 때 들어간다.'}], concl:'게임은 죽은 흐름을 살리는 주문이 아니다. 살아 있는 흐름의 리듬을 바꾸는 도구다' },
 { type:'branch', top:'판단', tag:'수읽기', h:'밀어붙일 때, 풀어줄 때, 끝낼 때', hSize:96, source:'지금 흐름', items:[{k:'계속 간다',t:'다음 소재나 작은 제안',d:'서로 질문하고 네 명이 다 끼어든다.'},{k:'한 번 풀어준다',t:'친구 모드 · 주제 전환 · 역할 교대',d:'반응이 엇갈리고 한 명이 빠진다.'},{k:'여기서 접는다',t:'설득을 멈추고 편하게 접는다',d:'거절이 반복되거나 취기가 위험하다.'}], concl:'성공이냐 실패냐보다, 지금 뭘 해야 하는지가 먼저다' },
 { type:'columns', top:'의미 부여', tag:'수읽기', h:'이 자리가 어떤 자리인지<br>먼저 정해라', hSize:96, cols:[{t:'그냥 합석',d:'서로 탐색하는 자리. 부담은 낮게 간다.'},{t:'친해지는 자리',d:'네 명의 공통점을 찾고 질문을 주고받는다.'},{t:'화해하는 자리',d:'긴장을 풀고 관계를 다진다.'},{t:'호감 확인 자리',d:'남녀 구도로 가도 되는지 가볍게 확인한다.'}], concl:'한 명쯤은 “우리가 지금 왜 같이 있는지” 말해줘야 한다' },
 { type:'img', img:'s27_tilted_glass.jpg', align:'left', top:'第三論', tag:'1주차 · 파트', kicker:'POINT 03', h:'78수', hSize:240, sub:'관계와 자리의 의미를 다시 정의한다' },
 { type:'flow', top:'78수', tag:'78수', h:'친구로 풀 것인가,<br>남녀 구도로 올릴 것인가', hSize:92, steps:[{k:'친구 모드',t:'부담을 낮춘다',d:'한쪽만 애쓰거나 한 명이 빠지면, 네 명이 같이 웃을 수 있는 얘기로 돌아간다.'},{k:'반응 체크',t:'서로 반응하는지 본다',d:'질문, 농담, 자기 얘기가 양쪽에서 나오는지 본다.'},{k:'남녀 구도',t:'남녀 구도를 연다',d:'호감이나 남녀 차이를 가볍게 꺼낸다. 반응이 엇갈리면 바로 낮춘다.',red:true}], concl:'프레임 컨트롤은 같은 흐름을 보게 만드는 일이다' },
 { type:'versus', top:'78수', tag:'78수 · 구도', h:'왜 친구 구도부터 가는가', hSize:100, sub:'구도를 정한다는 건, 상대가 이 자리에 어떤 마음으로 앉아 있게 할지를 정하는 일이다', left:{k:'연인 구도부터 열면', t:'상대가 마스크를 쓴다', d:'호감 신호는 부담이 된다. 불쾌해지거나, 웃는 얼굴만 남겨두고 속으로는 언제 자리를 뜰지 계산하기 시작한다.'}, right:{k:'친구 구도부터 열면', t:'상대가 편해진다', d:'부담 없는 선에서 즐거우니 상대도 나도 편하다. 편해진 자리에서 속 이야기와 단서가 나온다.'}, concl:'거기서 얻은 단서로 남녀 대화로 엮거나, 내 이야기를 꺼낼 자리를 만든다' },
  { type:'ladder', top:'78수', tag:'78수 · 구도', h:'잘 보이려 할수록<br>내가 할 수 있는 행동은 줄어든다', hSize:76, rowTop:330, sub:'같은 상황, 같은 상대. 갈리는 건 자기 확신 하나다.', left:{k:'자기 확신이 없을 때', rows:[{t:'잘 보여야 한다',hi:true},{t:'여자 중심 사고',d:'상대의 평가에 매달린다'},{t:'자기 검열이 늘어난다',d:'눈치 · 불안 · 소극적인 행동'},{t:'행동의 자유가 줄어든다',d:'주도권이 상대 쪽으로 기운다',hi:true}]}, right:{k:'자기 확신이 있을 때', rows:[{t:'서로 알아가는 자리',hi:true},{t:'친구 프레임',d:'평가의 부담을 먼저 내려놓는다'},{t:'행동이 자연스러워진다',d:'표현 · 여유 · 장난'},{t:'행동의 자유가 커진다',d:'대등한 주도권을 가진다',hi:true}]}, concl:'자기 확신이 높아질수록 행동의 자유가 커진다' },
  { type:'funnel', top:'78수', tag:'78수 · 구도', h:'친구 프레임은 포기가 아니라<br>판단할 자리를 여는 수다', hSize:78, rowTop:306, top1:{k:'심법',t:'자기 확신',d:'상대의 평가에 흔들리지 않는다'}, top2:{k:'프레임 전환',t:'친구처럼 편한 상태',d:'잘 보여야 한다는 압박을 내려놓는다'}, axes:[{t:'권력',d:'행동의 자유',s:'자연스러운 표현'},{t:'텐션',d:'감정의 변화',s:'흥미와 교감'},{t:'의미',d:'관계의 인식',s:'이성적 관심 확인'}], out:{t:'상황에 맞는 판단',d:'상대의 반응을 확인하고 다음 수를 고른다'}, concl:'편해져야 세 가지가 보이고, 보여야 다음 수를 고를 수 있다' },
 { type:'loop', top:'너스레', tag:'78수', h:'수위를 올리는 방식은 너스레다', hSize:97, items:[{t:'가볍게 시작',d:'처음부터 노골적으로 꺼내지 않는다.'},{t:'장난처럼',d:'정색하고 밀지 말고 웃기면서 연다.'},{t:'반응 확인',d:'웃음·질문·받아침이 나오는지 본다.'},{t:'바로 낮춤',d:'불편하거나 무감정이면 평범한 대화로 뺀다.'}], back:'불편해지면 여기서 다시 처음으로 돌아간다', concl:'수위는 한 번에 올리는 게 아니라, 반응을 보며 한 단계씩 올리는 것이다' },
 { type:'img', img:'s30_distance.jpg', align:'center', top:'체크인 04', tag:'질문 회수 · 3분', h:'“ 수위를 올리려다 식은 적 있나? ”', hSize:90, options:[{t:'정색하고 밀었다',d:'진지하게 꺼냈다가 분위기가 굳었다'},{t:'타이밍이 빨랐다',d:'아직 반응이 없는데 먼저 열었다'},{t:'못 낮췄다',d:'불편해진 걸 보고도 계속 갔다'}], concl:'하나 고르고, 그때 어떻게 낮췄어야 했는지 한 문장으로 말한다' },
 { type:'img', img:'s31_four_stools.jpg', align:'left', top:'第四論', tag:'1주차 · 파트', kicker:'POINT 04', h:'협공', hSize:240, sub:'전위는 길을 열고, 후위는 대열을 지킨다' },
 { type:'diagram', top:'협공 · 一', tag:'협공 01', h:'네 명이 앉는 순간<br>하나의 전열이 생긴다', caps:['대열 유지','중간 대열','중간 대열','목적지로 전진'], concl:'2:2는 따로 노는 1:1 두 개가 아니라, 네 명이 같이 만드는 한 흐름이다' },
 { type:'diagram', variant:'roles', top:'협공 · 二', tag:'아버지 / 어머니 전열', h:'아버지는 전위,<br>어머니는 후위', caps:['뒤처짐 챙김 · 보호','속도와 부담 신호','속도와 부담 신호','앞에서 길 열기'], notes:['뒤처지는 사람을 챙기고, 아버지가 공격당하면 보호한다','반발은 앞에서 먼저 맞는다'], concl:'아버지는 방향을 버리지 않고 전진한다. 어머니는 대열을 지킨다' },
 { type:'columns', top:'윙 운영', tag:'협공', h:'윙은 경쟁하지 않고 흐름을 살린다', hSize:89, cols:[{t:'윙 올려주기',d:'내 윙이 좋게 보일 이유를 대신 만들어준다.'},{t:'윙 살리기',d:'공격이 몰리면 말을 풀어주고 숨 쉴 틈을 준다.'},{t:'자리 바꾸기',d:'한 사람에게 쏠리면 대열을 섞어 균형을 만든다.'},{t:'경쟁 금지',d:'내 파트너 싸움으로 만들지 말고 흐름 전체의 승률을 본다.',red:true}], concl:'윙은 상대를 뺏는 사람이 아니라, 네 명의 흐름을 유지하는 사람이다' },
 { type:'img', img:'s35_two_men.jpg', align:'center', top:'체크인 05', tag:'질문 회수 · 3분', h:'“ 윙이랑 어긋난 순간은 언제였나? ”', hSize:90, options:[{t:'둘 다 밀었다',d:'아무도 후위를 안 봤다'},{t:'둘 다 뺐다',d:'서로 눈치만 보다 끝났다'},{t:'한 명이 빠졌다',d:'내 팟만 챙기다 흐름이 반으로 갈렸다'}], concl:'옆 사람과 둘씩, 다음 자리에서 누가 전위를 잡을지 정하고 온다' },
 { type:'flow', top:'사례 01 · 흐름 읽기', tag:'사례', h:'남자 둘만 열심히 하고 있었다', steps:[{k:'01 · 관찰',t:'질문은 남자 쪽, 대답은 여자 쪽',d:'여성 B는 말수가 줄고 두 남자는 빈칸을 계속 채웠다.'},{k:'02 · 헛다리',t:'“더 재미있게 해줘야 한다”',d:'어필과 농담을 늘려 애쓰는 정도의 차이를 더 키웠다.',red:true},{k:'03 · 다시 보기',t:'여자 쪽 권력 ↑, 여성 B 소외',d:'친구 프레임과 후위의 회수가 필요했다.'}], concl:'사실을 잘못 읽으면 노력할수록 흐름은 더 나빠진다' },
 { type:'flow', top:'사례 01 · 움직임', tag:'사례', h:'더 잘 보이려는 걸 멈추자<br>대화가 살아났다', hSize:92, steps:[{k:'처음',t:'전위와 후위가 동시에 어필',d:'여성 A에게만 질문 집중 · 여성 B는 구경만 하게 됨',red:true},{k:'바꾼 것',t:'역할과 부담을 다시 나눔',d:'아버지: 공통 소재로 전환 · 어머니: 여성 B를 다시 포함 · 호감 어필을 멈추고 숨 쉴 틈 만들기'},{k:'이후',t:'여성 B가 질문을 시작',d:'네 명의 발언량이 균형 · 남녀 구도를 다시 열 여지가 생김'}], concl:'흐름을 살린 것은 더 좋은 멘트가 아니라 역할과 부담을 다시 나눈 것이었다' },
 { type:'stairs', top:'성과 기준', tag:'성과', h:'감정적 의미는 네 단계로 본다', steps:[{k:'00 · 최악',t:'무가치',d:'아무 감정도 없고 기억할 이유도 없다.'},{k:'01 · 1차 기준',t:'반응이 생김',d:'호감·분노·경계 등 감정이 움직였다.'},{k:'02 · 목표',t:'좋은 의미',d:'재미·호감·신뢰로 자리가 기억된다.'},{k:'03 · 마지막 목표',t:'다음 가능성',d:'연락·다음 약속이 자연스럽게 이어진다.'}], concl:'분노는 목표가 아니다. 반응이 생겼다는 신호일 뿐이다. 불편해하면 바로 낮춘다' },
 { type:'workshop', top:'실습 01', tag:'1주차 실습', big:'90', unit:'초 안에', h:'사실과 해석을 분리하라', cols:[{t:'실제로 본 것',d:'표정·질문·몸의 방향·발언량처럼 관찰 가능한 사실만 말한다'},{t:'내가 붙인 의미',d:'“날 싫어한다”처럼 사실 위에 붙인 해석을 분리한다'},{t:'다음 한 수',d:'계속·안정·종료 중 하나를 고르고 확인 행동을 말한다'}], concl:'좋은 판단은 확신이 아니라 순서에서 나온다' },
 { type:'flow', top:'롤플레이 A', tag:'실습 · 8분 롤플레이 · 5분 피드백', h:'여자 쪽으로 기운 흐름을 되돌려라', hSize:89, steps:[{k:'상황',t:'여자 쪽 권력 ↑, 여성 B 소외',d:'남자 둘의 호감은 높고 상대 질문은 없다.',red:true},{k:'역할',t:'아버지: 부담 낮춤 · 어머니: 후위 회수',d:'경쟁하지 않고 서로 다른 일을 한다.'},{k:'성공 신호',t:'상대가 질문함 · 네 명 발언 균형',d:'없으면 무리하게 살리지 않고 종료를 판단한다.'}], concl:'어떤 신호에서 역할을 바꿨는지 기록하라' },
 { type:'rail', top:'피드백 기준', tag:'1주차 실습', h:'1주차는 네 가지로 피드백하라', rows:[{n:'1',t:'심법',d:'관찰과 해석을 분리했는가',s:'0 · 1 · 2'},{n:'2',t:'수읽기',d:'권력·텐션·의미를 함께 읽었는가',s:'0 · 1 · 2'},{n:'3',t:'78수',d:'자리에 맞는 관계와 의미를 잡았는가',s:'0 · 1 · 2'},{n:'4',t:'협공',d:'전위와 후위가 서로 다른 일을 했는가',s:'0 · 1 · 2'},{n:'5',t:'기보',d:'제안을 설계하고 선택권을 만드는 기술',s:'2주차 평가',dim:true}], concl:'0 놓침 · 1 시도 · 2 상황에 맞게 함' },
 { type:'columns', top:'롤플레이 B', tag:'1주차 실습', h:'전위가 막히면 역할을 바꿔라', cols:[{k:'상황',t:'아버지 집중 공격',d:'반박이 한 사람에게 몰리고 여성 B는 대화에서 이탈한다. 전위가 밀고 나갈 힘을 잃는다.',red:true},{k:'후위',t:'어머니가 대열 회수',d:'공격처럼 보이는 말을 풀어주고 여성 B에게 질문을 돌린다. 전위가 숨을 고를 공간을 만든다.'},{k:'교대',t:'역할을 바꿔 전진',d:'기존 전위는 후위에서 안정시키고 새 전위가 오늘 자리의 목적을 다시 세운다.'}], concl:'역할은 성격이 아니라 기능이다. 흐름이 요구하면 바로 바꾼다' },
 { type:'img', img:'s44_hand_stone.jpg', align:'left', top:'정리', tag:'1주차 정리', h:'할 말이 없으면,<br>판부터 다시 봐라', hSize:114, options:[{k:'01',t:'심법',d:'흔들리지 않는 마음'},{k:'02',t:'수읽기',d:'메이드의 흐름'},{k:'03',t:'78수',d:'불리한 흐름에서 역전하는 법'},{k:'04',t:'협공',d:'윙과의 역할 분담'}], concl:'1주차는 관찰하고, 판단하고, 프레임과 역할을 맞추는 데까지다' },
 { type:'img', img:'s45_facing_silhouettes.jpg', align:'left', top:'第五論 · 2주차', tag:'다음 강의 예고', kicker:'POINT 05 · 2주차에서 계속', h:'기보', hSize:240, sub:'말을 잘하는 것보다, 상대가 받을 수 있는 제안을 만드는 게 먼저다' },
 { type:'columns', top:'부록 · 게임 흐름', tag:'부록', h:'부록: 술게임 운영 예시', cols:[{k:'초중반',t:'이미지게임',d:'지목하고 이유를 말하게 해서 대화가 열리게 만든다.'},{k:'완충',t:'루팡게임',d:'늘어진 분위기를 가볍게 바꾼다.'},{k:'확인',t:'손병호 · 귓속말',d:'호감 방향과 반응을 간접적으로 확인한다.'},{k:'후반',t:'이구동성 · 공약',d:'팀 구도와 둘씩 나뉠 명분을 무리 없이 만든다.'}], concl:'게임명보다 중요한 건 질문 → 리액션 → 대화 확장 → 팀 구도 형성의 흐름이다' },
 { type:'columns', top:'부록 · 안전', tag:'부록', h:'롤플레이 안전 규칙', cols:[{k:'멈춤',t:'바로 멈춤',d:'누구든 이유를 설명하지 않고 바로 멈출 수 있다.'},{k:'스킵',t:'불편한 소재는 넘긴다',d:'불편하면 설명 없이 넘긴다.'},{k:'역할',t:'역할과 개인 분리',d:'역할에서 나온 거절을 개인 공격으로 받지 않는다.'},{k:'체크',t:'끝나고 확인',d:'실습이 끝나면 성과보다 불편함부터 묻는다.'}], concl:'진행자: “불편하면 언제든 스킵하거나 멈춰도 됩니다”' },
 { type:'chapter', top:'番外 · 著者論', tag:'표현력 훈련 · 자의식 해체', kicker:'번외 · 표현력 훈련', h:'저자론', sub:'매력은 정답률이 아니라 저자성에서 나온다' },
 { type:'columns', top:'著者論 · 一', tag:'저자론 01', h:'대화가 아니라 시험을 보고 있다', hSize:95, sub:'좋은 사람인 척하는 남자가 매력 없는 이유는 착하거나 맞는 말을 해서가 아니다. 자기 말을 계속 상대에게 채점받으려 하기 때문이다', cols:[{t:'“이 말 하면 좋아하겠지?”',d:''},{t:'“지금 이 멘트는 몇 점이지?”',d:''},{t:'“여자가 원하는 답이 뭘까?”',d:''}], concl:'말 하나하나는 맞아도, 그 사람 자체는 보이지 않는다' },
 { type:'versus', top:'著者論 · 二', tag:'저자론 02', h:'정답을 제출하는 남자,<br>세계를 펼치는 남자', hSize:92, sub:'에머슨 — 내 안에서 진실이라고 느낀 것이 만인에게도 진실일 수 있다고 믿는 것, 그게 천재성이다', left:{k:'모범생형',t:'정답을 제출한다',d:'내 반응에 맞춰 답을 내주는 기계처럼 느껴진다. 한 명의 인격과 부딪히는 느낌이 없다.'}, right:{k:'스타성',t:'세계를 펼친다',d:'“나는 세상을 이렇게 본다. 너는 어떻게 보는데?” 상대를 보되 기준을 외주 주지 않는다.'}, concl:'피드백은 받되, 허락은 구하지 않는다' },
 { type:'formula', top:'著者論 · 三', tag:'저자론 03', h:'스타성은 곱셈이다', sub:'하나가 0이면 전체가 0이다', result:'스타성', terms:[{t:'자기규정성',d:'남이 아니라 내가 나를 정의한다.'},{t:'일관성',d:'말투·취향·행동·선택에서 같은 색깔이 반복된다.'},{t:'비용 감수',d:'싫어하는 사람이 생기더라도 자기 입장을 표현한다.'},{t:'보편적 공명',d:'완전히 개인적인 얘긴데도 “나도 그 생각 했는데”가 나온다.'}], concl:'혼자 특이하기만 하면 괴짜로 끝난다' },
 { type:'theory', top:'著者論 · 四', tag:'저자론 04', h:'“저 새끼는 저럴 줄 알았어”', sub:'욕처럼 들리지만 브랜딩에서는 최고의 칭찬이다 — 타인에게 예측 가능한 고유성이 생겼다는 뜻이니까', items:[{t:'선명한 반복',d:'한 번 튀는 말이 아니라, 모든 선택에서 같은 세계관이 보인다.'},{t:'예측 가능한 고유성',d:'주변 사람 머릿속에 “저 사람은 저럴 것”이라는 문장이 생긴다.'},{t:'모두에게 사랑받지 않는다',d:'색깔이 선명할수록 누군가는 강하게 좋아하고 누군가는 싫어한다.'}], callout:'아무도 안 싫어하는 사람은<br>아무도 강하게 원하지 않는다' },
 { type:'versus', top:'著者論 · 五', tag:'저자론 05', h:'독선과 스타성은 다르다', left:{k:'독선',t:'현실을 보지 않는다',d:'피드백도 안 받고 흐름도 안 읽는다. 자기 말만 한다.'}, right:{k:'스타성',t:'현실을 보되 판단권은 내가 쥔다',d:'피드백은 받지만 허락은 구하지 않는다. 자기 생각·취향·욕망의 출처가 분명하다.'}, concl:'그 남자의 세계가 선명해야 여자도 그 세계에 들어가 보고 싶어진다. 이제 이걸 몸으로 해본다' },
 { type:'theory', top:'著者論 · 六', tag:'저자론 06', h:'내 가치를 증명할 줄 알아야 한다', hSize:93, sub:'메이드는 내가 하고 싶다는 욕망에서 출발한다', items:[{t:'내 욕망에서 시작한다',d:'왜 저 사람이었는지, 내 이야기에 빗대어 감정으로 말한다.'},{t:'상대의 기회비용을 안다',d:'나와 노느라 상대가 포기하는 것들을 정확히 알고 있다.'},{t:'그보다 크다고 말한다',d:'포기한 것과 비교해서, 나와 노는 게 얼마나 더 가치 있는지 이야기한다.'}], callout:'사실 그 기회비용은<br>허상이다' },
 { type:'columns', top:'著者論 · 七', tag:'저자론 07', h:'말은 같아도<br>전해지는 건 다르다', hSize:92, sub:'서브텍스트 — 굳이 말하지 않아도 상대가 느끼는 것. 문장 앞에 생략된 감정이 진짜 메시지다', rowTop:440, cols:[{k:'분노', t:'“(짜증나) 너 뭐 불만 있어?”', d:'화가 깔려 있으면 같은 문장이 시비가 된다.', red:true},{k:'눈치', t:'“(혹시…) 너 뭐 불만 있어?”', d:'불안이 깔려 있으면 같은 문장이 확인이 된다.'},{k:'장난', t:'“(귀엽네) 너 뭐 불만 있니~?”', d:'여유가 깔려 있으면 같은 문장이 놀림이 된다.'}], concl:'상대는 내 문장이 아니라, 내가 생략한 감정을 읽는다' },
 { type:'columns', top:'著者論 · 八', tag:'저자론 08', h:'밤에는 비언어가 먼저 말한다', hSize:96, sub:'같은 제안도, 내가 나를 어떻게 보고 있느냐에 따라 전혀 다르게 들린다', rowTop:440, cols:[{k:'성적 자신감', t:'“나랑 나갈래?”', d:'속에 “나 잘한다”가 깔려 있으면 같은 제안이 초대가 된다.'},{k:'찐따 바이브', t:'“나랑 나갈래?”', d:'속에 “나 자신 없는데”가 깔려 있으면 같은 제안이 눈치보기가 된다.', red:true},{k:'음침함', t:'“나랑 나갈래?”', d:'속에 “일단 질러본다”가 깔려 있으면 같은 제안이 부담이 된다.', red:true}], concl:'멘트를 바꾸는 게 아니라, 멘트 앞에 서 있는 나를 바꾸는 것이다' },
 { type:'columns', top:'著者論 · 九', tag:'저자론 09', h:'그래서 훈련하는 건<br>정체성이다', hSize:92, sub:'서브텍스트는 타고나는 게 아니라 바꿀 수 있다. 실전에서 훈련하는 건 이 두 가지다', rowTop:430, cols:[{k:'당위성 훈련', t:'왜 그래도 되는지를 만든다', d:'내가 이 말을 해도 되는 이유를 스스로 세운다. 이유가 분명하면 눈치가 사라지고, 눈치가 사라지면 앞에 깔리는 감정이 바뀐다.'},{k:'짧은 호흡의 설득', t:'길게 설명하지 않는다', d:'한 호흡에 끝내고 상대에게 넘긴다. 길어질수록 설득이 아니라 변명으로 들린다.'}], concl:'같은 말을 다르게 들리게 하려면, 문장이 아니라 내가 바뀌어야 한다' },
 { type:'img', img:'s48_alone_spotlight.jpg', align:'center', top:'마무리 실습 01', tag:'자의식 해체 · 2분', h:'자기소개', hSize:170, hTop:140, options:[{t:'강점',d:'내가 자신 있는 것 하나를 말한다'},{t:'메타인지',d:'남이 봤을 때 나는 어떨지 스스로 짚는다'},{t:'어필',d:'왜 나와 윙이 되어야 하는지 한 문장으로 말한다'}], concl:'말이 끝나면 전원이 투표한다. 오늘 표현력에서 누가 제일 살아 있었는지가 기준이다' },
 { type:'flow', top:'마무리 실습 02', tag:'자의식 해체', h:'매칭', hSize:150, rowTop:400, steps:[{k:'01 · 어필',t:'왜 당신이어야 하는가',d:'인기남과 매칭돼야 하는 이유를 직접 말한다.'},{k:'02 · 해소',t:'상대가 걱정하는 지점을 없앤다',d:'“노잼일 것 같다” 같은 걱정을 먼저 짚고 풀어준다.',red:true}] },
 { type:'img', img:'s50_three_silhouettes.jpg', align:'center', top:'마무리 실습 03', tag:'자의식 해체', h:'매칭된 둘이<br>트레이너를 상대로 유혹한다', hSize:110, hTop:110, options:[{k:'상황',t:'트레이너가 타겟 역할',d:'오늘 배운 걸 전부 써야 하는 자리다'},{k:'역할',t:'이긴 사람이 전위, 진 사람이 후위',d:'매칭 결과를 그대로 팀플레이 역할로 가져간다'}], concl:'오늘 배운 심법·수읽기·78수·협공을 한 번에 써보는 자리다' },
 { type:'img', img:'t_itaewon_neon.jpg', align:'right', pos:'42% 45%', top:'實戰', tag:'루틴 플레이 예시', kicker:'CASE · 이태원', h:'루틴 플레이', hSize:150, w:1200, sub:'오늘 배운 걸 한 자리에서 어떻게 쓰는지, 실제 대사로 본다' },
 { type:'script', top:'實戰 · 오프닝', tag:'루틴 플레이 · 01', h:'나의 서사와 나의 니즈', hSize:98, sub:'왜 하필 지금 저 사람인지를, 내 이야기에 얹어서 말한다', rowTop:340, lines:['이태원이 요즘 핫하다길래 이태원이 핫한지 내가 더 핫한지 비교하러 왔는데, 그쪽 때문에 그건 진 것 같다','뻔한 말 같지만 너무 내 스타일이라, 친구랑 심사숙고해서 대화라도 해보자고 온 거다','저 안쪽은 시끄럽고 사람도 많아서 알아가기엔 부적합 판정 내렸다. 잠깐 앉을 데로 대피하고 싶은데, 이왕이면 한눈에 들어온 그쪽이랑 한잔하면서 쉬고 싶다'], concl:'욕망을 숨기지 않는다. 대신 내 이야기 위에 얹어서 말한다' },
 { type:'columns', top:'實戰 · 계산', tag:'루틴 플레이 · 02', h:'상대가 나를 골랐을 때<br>버리는 것들', hSize:88, sub:'내가 무엇을 이겨야 하는지 정확히 알아야 다음 말이 나온다', rowTop:440, cols:[{t:'공짜 술', d:'앉아만 있어도 누가 사주는 자리를 포기한다.'},{t:'더 나은 남자 선택지', d:'오늘 밤 만날 수도 있었던 다른 사람들을 포기한다.'},{t:'춤추면서 노는 즐거움', d:'원래 하러 온 것 자체를 포기한다.'}], concl:'이걸 모르면 “나랑 놀자”는 말은 그냥 부탁이 된다' },
 { type:'script', top:'實戰 · 제안', tag:'루틴 플레이 · 03', h:'그걸 포기하고도<br>나랑 놀아야 하는 이유', hSize:82, sub:'버리는 것 하나하나에 대응시켜서, 그보다 크다고 말한다', rowTop:420, lineSize:20, lines:['내가 볼 땐 여기서 우리가 제일 괜찮다. 더 나은 남자라는 건 조건 말고도 상대를 어떤 태도로 대하느냐까지 포함이다','오늘 카드 한도 50까지 걸어놨다. 이 근처 참이슬 맛집을 안다. 쓰리 바틀 쏘겠다','시끄러운 음악 들으면서 춤추는 것보다 더 높은 도파민을 주겠다. 일주일 전부터 코미디빅리그 정주행했으니 걱정 마라','저 안에서 손목 잡아당기는 사람들처럼 부담스럽게 안 한다. 일석이조 아니냐'], concl:'사실 그 기회비용은 허상이다. 그걸 증명하는 게 이 자리다' },
 { type:'script', top:'實戰 · 거절 01', tag:'나를 발판으로 써라', h:'“춤추러 왔어요”', hSize:104, sub:'거절을 꺾지 않는다. 상대가 하려던 걸 더 잘하게 만드는 자리로 나를 놓는다', rowTop:390, lines:['사실 거절하실 줄 알았다. 시간 내서 나오신 김에 최선의 선택 하시려는 거 이해한다','근데 춤을 추더라도 취기가 좀 있어야 더 흥나고 무브먼트도 자연스럽게 나오지 않겠나','일단 앉아서 예열하고, 체력 아끼고, 살짝 취기 올려서 라운지 가서 추셔라'], concl:'거절을 부정하지 않는다. 그 목적을 더 잘 이루는 경로에 나를 넣는다' },
 { type:'script', top:'實戰 · 거절 02', tag:'나를 발판으로 써라', h:'“제 스타일 아니에요”', hSize:100, sub:'무너진 티는 내되, 판단은 계속 내가 쥔다', rowTop:380, lines:['첫눈에 맘에 들 거라는 놀부심보는 없었지만 면전에서 들으니 마음이 무너진다. 근데 애석하게도 난 내 마음 무너뜨리는 여자가 이상형이다','본인 스타일 남자를 만나셔도 어느 정도 취기가 있어야 용기도 내고 대화도 하지 않겠나. 지금처럼 얼굴 근육 굳으신 채로는 그쪽 이상형도 관심 없나 보다 하고 떠난다','내가 딱 20%의 용기 정도는 얻어 가시게 해드리겠다'], concl:'거절당한 감정은 인정하고, 다음 한 수는 내가 고른다' },
 { type:'script', top:'實戰 · 거절 03', tag:'나를 발판으로 써라', h:'“곧 집에 가야 해요”', hSize:100, sub:'시간을 더 달라고 하지 않는다. 남는 게 뭔지를 바꾼다', rowTop:370, lineSize:20, lines:['오히려 좋다. 저희도 내일 아침에 헬스 가기로 해서 오래 못 있는다','지금 연락처만 주고 헤어지면 저는 그냥 “이태원에서 번따한 남자 1”로 남는다. 30분이라도 오늘 노고를 덜어내면서 얘기하면 “나름 괜찮은 남자 1”로 승격되지 않겠나','지금 택시도 안 잡힐 게 뻔한데, 앉아서 택시 잡는단 생각으로 자리만 하자','흉흉한 데 연약한 분을 길에 세워두는 것도 마음이 아프다'], concl:'남는 시간을 늘리는 게 아니라, 남는 기억을 바꾸는 것이다' },
];

if (S.length !== TOTAL) { console.error('spec count', S.length); process.exit(1); }
const noNote = [...Array(TOTAL)].map((_,i)=>i+1).filter(n=>!NOTES[n]);
if (noNote.length) console.warn('노트 없는 장:', noNote.join(', '));

// ---------- emit ----------
// 01번은 Main.dc.html(진입 아트보드), 나머지는 S02..S56
const files = [];
S.forEach((s, i) => {
  const n = i + 1;
  const name = n === 1 ? 'Main' : `S${String(n).padStart(2, '0')}`;
  let html = T[s.type](s, n);
  const note = NOTES[n];
  if (note) html = html.replace('</x-dc>', `<!--note:${note}-->
</x-dc>`);
  fs.writeFileSync(`${name}.dc.html`, html);
  files.push({ name, title: `${String(n).padStart(2, '0')} · ${s.h.replace(/<br>/g, ' ').replace(/[“”]/g, '')}`, img: s.img || null });
});

// canvas.json — 완성 덱 56장 한 페이지
fs.writeFileSync('canvas.json', JSON.stringify({
  artboards: files.map((f, i) => ({ file: `${f.name}.dc.html`, title: f.title, x: (i % 4) * 1700, y: Math.floor(i / 4) * 1080, w: 1600, h: 900 })),
  launch: { view: 'canvas' },
}, null, 2));

const imgs = [...new Set(files.map(f => f.img).filter(Boolean))];
console.log(`emitted ${files.length} artboards; images used: ${imgs.length}`);
console.log(imgs.join(' '));
