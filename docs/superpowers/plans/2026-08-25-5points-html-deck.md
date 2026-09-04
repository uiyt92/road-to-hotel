# 5 Points HTML Lecture Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, offline, single-file 30-slide HTML lecture deck from the approved 5 Points curriculum.

**Architecture:** One standalone HTML file contains semantic slide sections, inline CSS, inline SVG, speaker-note data, and a small presentation controller. A Node validation script checks structure and content; a Playwright script exercises navigation, overlays, responsive sizing, printing, and network independence.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, inline SVG, Node.js, Playwright

---

## File Map

- Create: `outputs/5points_macro_strategy_lecture.html` — final offline lecture deck
- Create: `work/html-deck/validate-deck.mjs` — static structure and content validation
- Create: `work/html-deck/qa-deck.mjs` — browser interaction, viewport, print, and screenshot QA
- Create: `work/html-deck/screenshots/` — QA screenshots and overview contact sheet
- Read: `work/ppt/build.js` — exact 30-slide content and speaker-note source
- Read: `docs/superpowers/specs/2026-08-25-5points-html-deck-design.md` — approved requirements

### Task 1: Static validation gate

**Files:**
- Create: `work/html-deck/validate-deck.mjs`
- Test: `outputs/5points_macro_strategy_lecture.html`

- [ ] **Step 1: Create a validator that fails before the HTML exists**

```js
import fs from 'node:fs';

const file = 'outputs/5points_macro_strategy_lecture.html';
if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
const html = fs.readFileSync(file, 'utf8');
const count = pattern => [...html.matchAll(pattern)].length;
const errors = [];

if (count(/<section\b[^>]*class="[^"]*\bslide\b/g) !== 30) errors.push('slide count must be 30');
if (count(/<template\b[^>]*class="speaker-note"/g) !== 30) errors.push('speaker note count must be 30');
for (const token of ['마인드셋','상황 읽기','FRAME CONTROL','TEAM PLAYING','협상력','권력','텐션','명분','동선','기세','분노 ≠ 목표']) {
  if (!html.includes(token)) errors.push(`missing ${token}`);
}
if (/https?:\/\//i.test(html)) errors.push('external URL found');
if (!html.includes('@media print')) errors.push('print CSS missing');
if (!html.includes('prefers-reduced-motion')) errors.push('reduced motion support missing');
if (!html.includes('id="notes-panel"')) errors.push('notes panel missing');
if (!html.includes('id="overview"')) errors.push('overview missing');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('static_qa=PASS slides=30 notes=30 external_requests=0');
```

- [ ] **Step 2: Run the validator and confirm the missing-file failure**

Run:

```powershell
& $node work\html-deck\validate-deck.mjs
```

Expected: exit 1 with `Missing outputs/5points_macro_strategy_lecture.html`.

### Task 2: Standalone deck shell and visual system

**Files:**
- Create: `outputs/5points_macro_strategy_lecture.html`
- Test: `work/html-deck/validate-deck.mjs`

- [ ] **Step 1: Create the document shell**

Use this exact document structure:

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>할 말이 없으면 판부터 봐라</title>
  <style>/* complete inline design system */</style>
</head>
<body>
  <main id="deck" aria-live="polite">/* 30 slide sections */</main>
  <div id="chrome">/* slide number, progress, minimal controls */</div>
  <aside id="notes-panel" aria-hidden="true">/* current notes */</aside>
  <div id="overview" aria-hidden="true">/* generated thumbnails */</div>
  <div id="help" aria-hidden="true">/* keyboard guide */</div>
  <script>/* presentation controller */</script>
</body>
</html>
```

- [ ] **Step 2: Define the visual tokens and 16:9 stage**

```css
:root {
  --ink:#14161b; --paper:#f4f0e7; --cream:#fff9ee;
  --amber:#f3a712; --teal:#0ea5a3; --pink:#dd3e78;
  --red:#e55454; --gray:#a7adb8; --muted:#757064;
  --stage-w:1600; --stage-h:900;
}
#deck { position:fixed; inset:0; overflow:hidden; background:var(--ink); }
.slide {
  position:absolute; left:50%; top:50%; width:1600px; height:900px;
  transform:translate(-50%,-50%) scale(var(--deck-scale));
  transform-origin:center; opacity:0; pointer-events:none;
}
.slide.active { opacity:1; pointer-events:auto; }
@media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation:none!important; transition:none!important; } }
@media print { .slide { position:relative; opacity:1; break-after:page; transform:none; } }
```

- [ ] **Step 3: Add reusable visual primitives**

Implement `.dark`, `.light`, `.kicker`, `.title`, `.pill`, `.card`, `.node`, `.route`, `.matrix`, `.timeline`, `.quote`, `.score`, and `.source`. Use CSS custom properties for color; use inline SVG only where a curved route or plotted line is materially clearer than CSS shapes.

### Task 3: Populate all 30 slides and notes

**Files:**
- Modify: `outputs/5points_macro_strategy_lecture.html`
- Read: `work/ppt/build.js`
- Test: `work/html-deck/validate-deck.mjs`

- [ ] **Step 1: Add the approved 30-slide sequence**

Create sections with stable IDs `s01` through `s30` and this exact title order:

```text
01 할 말이 없으면 판부터 봐라
02 잘 놀았는데, 왜 매번 술자리로 끝날까?
03 멘트가 부족한 게 아니다. 다음 수를 못 본 것이다.
04 판을 움직이는 순서는 다섯 가지다
05 반응 하나에 흔들리면 판 전체를 놓친다
06 본 것과 지어낸 이야기를 구분하라
07 판을 읽을 때는 네 가지만 보면 된다
08 지금 누가 더 원하는가
09 감정이 살아 있어야 대화가 앞으로 간다
10 밀어붙일 때, 풀어줄 때, 끝낼 때
11 이 자리가 어떤 자리인지 먼저 정해라
12 친구로 풀 것인가, 남녀 구도로 올릴 것인가
13 섹스 이야기도 타이밍이 전부다
14 네 명이 앉는 순간 역할은 이미 생긴다
15 아버지는 앞으로 가고, 어머니는 뒤에서 판을 지킨다
16 윙이 나서야 할 때, 빠져야 할 때
17 멘트보다 먼저 세 가지를 정리하라
18 명분이 서고, 동선이 맞고, 기세가 있어야 한다
19 제안은 분명하게, 거절은 편하게
20 이태원 11시 30분, 첫 10분부터 판이 기울었다
21 남자 둘만 열심히 하고 있었다
22 더 잘 보이려는 걸 멈추자 대화가 살아났다
23 잠자리가 아니라, 감정적 의미를 남겼는가
24 90초 안에 나와 내 윙을 설명하라
25 여자 쪽으로 기운 판을 되돌려라
26 느낌 말고 다섯 가지로 피드백하라
27 분위기는 좋은데 다음 단계가 애매하다
28 할 말이 없으면, 판부터 다시 봐라
29 이 강의가 반영한 최신 흐름과 연구
30 롤플레이 안전 규칙
```

- [ ] **Step 2: Add one note template per slide**

```html
<template class="speaker-note">
  <p>발표자가 실제로 말할 핵심 해설.</p>
  <p>청중에게 던질 질문 또는 진행상 주의점.</p>
</template>
```

Copy the exact notes from `work/ppt/build.js`. Keep citations on slides 9, 13, 14, 19, 27, and 29 as visible small source labels.

- [ ] **Step 3: Run the static validator**

Expected: `static_qa=PASS slides=30 notes=30 external_requests=0`.

### Task 4: Presentation controller

**Files:**
- Modify: `outputs/5points_macro_strategy_lecture.html`
- Create: `work/html-deck/qa-deck.mjs`

- [ ] **Step 1: Write browser interaction assertions**

```js
import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ viewport:{ width:1366, height:768 } });
const requests = [];
page.on('request', r => requests.push(r.url()));
await page.goto(pathToFileURL(path.resolve('outputs/5points_macro_strategy_lecture.html')).href);
await page.keyboard.press('ArrowRight');
if (!(await page.locator('#s02').evaluate(el => el.classList.contains('active')))) throw new Error('ArrowRight failed');
await page.keyboard.press('n');
if ((await page.locator('#notes-panel').getAttribute('aria-hidden')) !== 'false') throw new Error('notes failed');
await page.keyboard.press('Escape');
await page.keyboard.press('o');
if ((await page.locator('#overview').getAttribute('aria-hidden')) !== 'false') throw new Error('overview failed');
await page.locator('[data-goto="23"]').click();
if (!page.url().endsWith('#23')) throw new Error('overview navigation failed');
await page.reload();
if (!(await page.locator('#s23').evaluate(el => el.classList.contains('active')))) throw new Error('hash restore failed');
if (requests.some(url => /^https?:/i.test(url))) throw new Error('external request made');
await browser.close();
console.log('interaction_qa=PASS');
```

- [ ] **Step 2: Run the browser test and confirm it fails before controller completion**

Expected: exit 1 at the first missing navigation behavior.

- [ ] **Step 3: Implement controller state and navigation**

```js
const slides = [...document.querySelectorAll('.slide')];
let index = Math.max(0, Math.min(slides.length - 1, Number(location.hash.slice(1) || 1) - 1));
function show(next, push=true) {
  index = Math.max(0, Math.min(slides.length - 1, next));
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  document.documentElement.style.setProperty('--progress', `${((index + 1) / slides.length) * 100}%`);
  document.querySelector('#slide-number').textContent = `${String(index + 1).padStart(2,'0')} / 30`;
  if (push) history.replaceState(null,'',`#${index + 1}`);
  renderNotes();
}
```

Map ArrowRight, Space, PageDown, ArrowLeft, PageUp, Home, End, `n`, `o`, `f`, `?`, and Escape. Ignore navigation keystrokes when focus is inside a button or link. Add click zones and a 45-pixel horizontal swipe threshold.

- [ ] **Step 4: Implement scale, notes, overview, help, and fullscreen**

Set `--deck-scale` to `Math.min(innerWidth/1600, innerHeight/900)`. Generate overview cards from each slide title. Use `document.documentElement.requestFullscreen()` and `document.exitFullscreen()` with capability checks.

- [ ] **Step 5: Run the interaction test**

Expected: `interaction_qa=PASS`.

### Task 5: Responsive, visual, and print QA

**Files:**
- Modify: `work/html-deck/qa-deck.mjs`
- Modify: `outputs/5points_macro_strategy_lecture.html`
- Create: `work/html-deck/screenshots/deck-1366.png`
- Create: `work/html-deck/screenshots/deck-1920.png`
- Create: `work/html-deck/screenshots/deck-mobile.png`
- Create: `work/html-deck/screenshots/deck-print.pdf`

- [ ] **Step 1: Add viewport overflow checks**

For each slide at 1366×768 and 1920×1080, activate it and assert that every visible `.bounded` element stays inside the 1600×900 stage with a 24-pixel tolerance. Report the slide ID and selector on failure.

- [ ] **Step 2: Capture representative screenshots**

Capture slides 1, 4, 8, 9, 14, 18, 20, 23, 25, 27, and 30. Generate a contact sheet for visual inspection.

- [ ] **Step 3: Verify mobile controls**

Use a 390×844 viewport. Assert the active slide is fully scaled into the viewport, click zones remain reachable, and a synthetic swipe changes slides.

- [ ] **Step 4: Verify print output**

Emulate print media and generate `deck-print.pdf`. Use `pypdf` to assert the page count is 30.

- [ ] **Step 5: Fix every reported clipping, overlap, contrast, or wrapping problem and rerun QA**

Expected final outputs:

```text
static_qa=PASS slides=30 notes=30 external_requests=0
interaction_qa=PASS
viewport_qa=PASS 1366x768,1920x1080,390x844
print_qa=PASS pages=30
```

### Task 6: Final delivery verification

**Files:**
- Verify: `outputs/5points_macro_strategy_lecture.html`
- Verify: `outputs/5points_macro_strategy_lecture.pdf`
- Verify: `outputs/5points_macro_strategy_lecture.pptx`

- [ ] **Step 1: Run all static and browser validations from a clean page load**

- [ ] **Step 2: Open the HTML from the filesystem and through the local preview server**

- [ ] **Step 3: Confirm final file sizes and modified timestamps**

- [ ] **Step 4: Deliver the HTML as the primary file and retain PDF/PPTX as backups**

