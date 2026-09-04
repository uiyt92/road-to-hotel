# 5 Points HTML Deck Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 30-slide standalone HTML lecture deck as a photo-free, modern Swiss-tactical presentation with literal diagrams and the approved father–women–mother formation.

**Architecture:** Keep the user-facing deliverable as one offline HTML file, but author it from four focused sources: CSS, slide markup, controller JavaScript, and a Node build script. The build script embeds the Korean font subset and assembles the sources into `outputs/5points_macro_strategy_lecture.html`; static and Playwright checks validate content, layout, interaction, zero network requests, and 30-page printing.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js, Playwright, Python fontTools/Brotli, pypdf.

---

## File map

- Create: `work/html-deck-redesign/deck.css` — visual system and print styles.
- Create: `work/html-deck-redesign/slides.html` — 30 slide sections and 30 speaker-note templates.
- Create: `work/html-deck-redesign/controller.js` — navigation, overlays, scaling, hash restore, and auto-hidden controls.
- Create: `work/html-deck-redesign/build.mjs` — assemble and validate the standalone output.
- Create: `work/html-deck-redesign/font-subset.woff2` — Noto Sans KR subset used by the deck.
- Modify: `outputs/5points_macro_strategy_lecture.html` — generated standalone deliverable.
- Modify: `work/html-deck/validate-deck.mjs` — redesign contract checks.
- Modify: `work/html-deck/qa-deck.mjs` — whole-deck browser, viewport, and print checks.

The workspace is not a Git repository, so each task ends with a verification checkpoint instead of a commit.

### Task 1: Lock the redesign contract with failing tests

**Files:**
- Modify: `work/html-deck/validate-deck.mjs`

- [ ] **Step 1: Add redesign assertions before changing the deck**

Add these checks after the existing slide and note counts:

```js
const requiredClasses = [
  'archetype-cover',
  'archetype-opener',
  'archetype-principle',
  'archetype-decision',
  'archetype-case',
  'archetype-workshop',
  'formation-line',
  'logic-flow',
  'outcome-track',
];
for (const className of requiredClasses) {
  assert(html.includes(className), `missing redesign class: ${className}`);
}

assert(/@font-face[\s\S]*Noto Sans KR Deck/.test(html), 'embedded deck font missing');
assert(/data:font\/woff2;base64,/.test(html), 'font is not embedded');
assert(!/<img\b/i.test(html), 'photos and raster images must not be used');
assert(!/<svg\b/i.test(html), 'legacy SVG diagrams must be removed');
assert(!/class="[^"]*card(?:\s|\")/.test(html), 'legacy card layout remains');

for (const phrase of [
  '후위 · 어머니',
  '중간 대열 · 여성 A',
  '중간 대열 · 여성 B',
  '전위 · 아버지',
  '목적지',
  '분노는 목표가 아니다',
]) assert(html.includes(phrase), `missing required phrase: ${phrase}`);
```

- [ ] **Step 2: Run the validator and confirm RED**

Run:

```powershell
& 'C:\Users\SuperNatural1\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'work\html-deck\validate-deck.mjs'
```

Expected: FAIL on `missing redesign class: archetype-cover` before any production change.

- [ ] **Step 3: Record the baseline failure**

Save the exact failure text in `work/html-deck-redesign/red-baseline.txt` using `apply_patch`; the file must contain the validator command and the first failure line.

### Task 2: Build the standalone authoring pipeline and embedded font

**Files:**
- Create: `work/html-deck-redesign/build.mjs`
- Create: `work/html-deck-redesign/deck.css`
- Create: `work/html-deck-redesign/controller.js`
- Create: `work/html-deck-redesign/font-subset.woff2`
- Create: `work/html-deck-redesign/slides.html`

- [ ] **Step 1: Generate a Korean font subset**

Extract all Korean, Latin, punctuation, and digits appearing in `slides.html` and CSS labels into `work/html-deck-redesign/glyphs.txt`, then run:

```powershell
$env:PYTHONPATH='C:\Users\SuperNatural1\.cache\codex-runtimes\codex-primary-runtime\dependencies\python'
& 'C:\Users\SuperNatural1\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m fontTools.subset 'C:\Windows\Fonts\NotoSansKR-VF.ttf' --text-file='work\html-deck-redesign\glyphs.txt' --flavor=woff2 --output-file='work\html-deck-redesign\font-subset.woff2' --layout-features='*'
```

Expected: `font-subset.woff2` exists and is smaller than 2 MB.

- [ ] **Step 2: Create the visual foundation**

Start `deck.css` with the approved tokens and fixed 1600×900 stage:

```css
:root {
  --ink: #111319;
  --paper: #f4f2ed;
  --yellow: #ffca2e;
  --teal: #00b3aa;
  --coral: #ff5138;
  --rose: #e95370;
  --muted-dark: #7d8591;
  --muted-light: #6c685f;
  --deck-scale: 1;
}

@font-face {
  font-family: "Noto Sans KR Deck";
  src: url("__FONT_DATA__") format("woff2");
  font-weight: 100 900;
  font-display: block;
}

.slide {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1600px;
  height: 900px;
  transform: translate(-50%, -50%) scale(var(--deck-scale));
  transform-origin: center;
  overflow: hidden;
  font-family: "Noto Sans KR Deck", sans-serif;
}
```

Define six archetype classes, literal arrow labels, the four-person formation, the outcome track, print rules, reduced-motion rules, and controls whose resting opacity and visibility are both zero.

- [ ] **Step 3: Create the controller**

`controller.js` must expose no global libraries and implement this behavior:

```js
const slides = [...document.querySelectorAll('.slide')];
let index = Math.max(0, Math.min(slides.length - 1, Number(location.hash.slice(1) || 1) - 1));

function scaleDeck() {
  const scale = Math.min(innerWidth / 1600, innerHeight / 900);
  document.documentElement.style.setProperty('--deck-scale', scale);
}

function show(next, updateHash = true) {
  index = Math.max(0, Math.min(slides.length - 1, next));
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  if (updateHash) history.replaceState(null, '', `#${index + 1}`);
  renderNotes();
}
```

Retain Arrow/Space/Home/End, N/O/F/?/Esc, swipe, overview, notes, print, and hash restore. Keyboard navigation must work even after a navigation button was clicked.

- [ ] **Step 4: Create the build script**

`build.mjs` reads the four source files, converts the WOFF2 bytes to base64, replaces `__FONT_DATA__`, and writes the doctype, meta tags, styles, slide markup, controls, overlays, and controller into the standalone output.

Core assembly:

```js
const fontData = fs.readFileSync(fontPath).toString('base64');
const css = fs.readFileSync(cssPath, 'utf8')
  .replace('__FONT_DATA__', `data:font/woff2;base64,${fontData}`);
const slides = fs.readFileSync(slidesPath, 'utf8');
const controller = fs.readFileSync(controllerPath, 'utf8');
const output = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>할 말이 없으면 판부터 봐라 · 5 Points</title><style>${css}</style></head>
<body><main id="deck">${slides}</main>${chromeMarkup}<script>${controller}</script></body></html>`;
fs.writeFileSync(outputPath, output);
```

- [ ] **Step 5: Run the build once with skeleton slides**

Create 30 minimal sections and notes so the build can run, then execute:

```powershell
& 'C:\Users\SuperNatural1\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'work\html-deck-redesign\build.mjs'
```

Expected: output file exists; validator still fails because required content and archetypes are incomplete.

### Task 3: Recompose slides 1–13 as literal visual explanations

**Files:**
- Modify: `work/html-deck-redesign/slides.html`
- Modify: `work/html-deck-redesign/deck.css`

- [ ] **Step 1: Implement the opening and 5 Points map**

Use this exact mapping:

| ID | Title | Archetype | Main visual |
|---|---|---|---|
| s01 | 할 말이 없으면 판부터 봐라 | cover | typographic four-position formation; no photo |
| s02 | 잘 놀았는데, 왜 매번 술자리로 끝날까? | principle | four symptoms collapsing into “다음 판단이 끊겼다” |
| s03 | 멘트가 부족한 게 아니다. 다음 수를 못 본 것이다. | decision | A 대화 막힘 → B 상황 오독 → C 역할 충돌 |
| s04 | 판을 움직이는 순서는 다섯 가지다 | opener | 01–05 horizontal command sequence |

Each slide has one `<template class="speaker-note">` copied and polished from the current deck.

- [ ] **Step 2: Implement Mindset and Situation Reading**

| ID | Title | Archetype | Main visual |
|---|---|---|---|
| s05 | 반응 하나에 흔들리면 판 전체를 놓친다 | principle | single reaction versus four-person field |
| s06 | 본 것과 지어낸 이야기를 구분하라 | decision | 관찰 → 해석 → 검증 |
| s07 | 판을 읽을 때는 네 가지만 보면 된다 | opener | 권력·텐션·의미·안전 four-beat strip |
| s08 | 권력이 여자 쪽으로 기울었을 때 | decision | 관찰 → 판단 → 친구 프레임 |
| s09 | 감정이 살아 있어야 대화가 앞으로 간다 | principle | 무감정 → 몰입 → 과열, with explicit state labels |
| s10 | 밀어붙일 때, 풀어줄 때, 끝낼 때 | decision | 계속 / 안정 / 종료, each with trigger and action |
| s11 | 이 자리가 어떤 자리인지 먼저 정해라 | principle | same table, four meanings, one highlighted transition |

- [ ] **Step 3: Implement Frame Control**

| ID | Title | Archetype | Main visual |
|---|---|---|---|
| s12 | 친구로 풀 것인가, 남녀 구도로 올릴 것인가 | decision | frame switch with entry and exit signals |
| s13 | 섹스 이야기도 타이밍이 전부다 | decision | 안전 → 상호성 → 맥락 → 허용 |

Sexual-talk escalation must show `반응이 엇갈리면 즉시 낮춘다` and `이런 이야기 괜찮아?` as literal decision labels.

- [ ] **Step 4: Build and inspect representative slides**

Run the build and capture s01, s06, s08, and s13 at 1440×900. Expected: no photo tags, no SVG tags, no legacy cards, no clipped elements.

### Task 4: Recompose slides 14–23 with the approved formation and outcome sequence

**Files:**
- Modify: `work/html-deck-redesign/slides.html`
- Modify: `work/html-deck-redesign/deck.css`

- [ ] **Step 1: Implement Team Playing**

| ID | Title | Archetype | Main visual |
|---|---|---|---|
| s14 | 네 명이 앉는 순간 하나의 전열이 생긴다 | opener | rear–middle–front formation preview |
| s15 | 아버지는 전위, 어머니는 후위 | principle | approved formation line |
| s16 | 윙이 나서야 할 때, 빠져야 할 때 | decision | attack/straggler triggers mapped to balancer actions |

s15 must read left-to-right exactly:

```text
후위 · 어머니 → 중간 대열 · 여성 A → 중간 대열 · 여성 B → 전위 · 아버지 → 목적지
```

The father annotation says `방향을 버리지 않고 전진`; the mother annotation says `뒤처지는 사람을 챙기고, 아버지가 공격당하면 보호한다`.

- [ ] **Step 2: Implement Negotiation**

| ID | Title | Archetype | Main visual |
|---|---|---|---|
| s17 | 멘트보다 먼저 세 가지를 정리하라 | opener | 장소 이해 · 나의 가치 · 상대의 이유 |
| s18 | 명분이 서고, 동선이 맞고, 기세가 있어야 한다 | principle | three axes converging into one offer |
| s19 | 제안은 분명하게, 거절은 편하게 | decision | 의도 → 구체 → 선택 → 확인 |

- [ ] **Step 3: Implement the case and outcome**

| ID | Title | Archetype | Main visual |
|---|---|---|---|
| s20 | 이태원 11시 30분, 첫 10분부터 판이 기울었다 | case | minute-by-minute four-person timeline |
| s21 | 남자 둘만 열심히 하고 있었다 | decision | observed signals → wrong diagnosis → actual diagnosis |
| s22 | 더 잘 보이려는 걸 멈추자 대화가 살아났다 | case | before / intervention / after |
| s23 | 감정적 의미는 네 단계로 본다 | principle | 무가치 → 반응 → 긍정 의미 → 다음 가능성 |

s23 includes the exact warning `분노는 목표가 아니다. 반응이 생겼다는 신호일 뿐이며, 경계가 나오면 즉시 안정시킨다.`

- [ ] **Step 4: Build and inspect representative slides**

Capture s15, s19, s20, and s23. Expected: formation order is obvious without notes; case direction reads left-to-right; outcome is a sequence, not a matrix.

### Task 5: Recompose slides 24–30 and finalize presentation behavior

**Files:**
- Modify: `work/html-deck-redesign/slides.html`
- Modify: `work/html-deck-redesign/deck.css`
- Modify: `work/html-deck-redesign/controller.js`

- [ ] **Step 1: Implement workshop and closing slides**

| ID | Title | Archetype | Main visual |
|---|---|---|---|
| s24 | 90초 안에 나와 내 윙을 설명하라 | workshop | timer + self/wing/trainer prompts |
| s25 | 여자 쪽으로 기운 판을 되돌려라 | workshop | brief → roles → success signals |
| s26 | 느낌 말고 다섯 가지로 피드백하라 | workshop | 0–2 five-point scoring rail |
| s27 | 분위기는 좋은데 다음 단계가 애매하다 | workshop | situation → 3-axis script → safety conditions |
| s28 | 할 말이 없으면, 판부터 다시 봐라 | opener | 01–05 command sequence reprise |
| s29 | 이 강의가 반영한 최신 흐름과 연구 | principle | evidence hierarchy: research / trend / field hypothesis |
| s30 | 롤플레이 안전 규칙 | workshop | STOP / SKIP / ROLE / DEBRIEF action rail |

- [ ] **Step 2: Make controls truly dormant**

Use a CSS state that removes both opacity and hit-testing until wake:

```css
.controls { opacity: 0; visibility: hidden; pointer-events: none; }
body.ui-awake .controls,
.controls:focus-within { opacity: 1; visibility: visible; pointer-events: auto; }
```

The click zones remain active but visually empty. The print stylesheet hides controls, overlays, and click zones.

- [ ] **Step 3: Build and run the static validator**

Run build, then validator. Expected:

```text
static_qa=PASS slides=30 notes=30 external_requests=0
```

If it fails, change the authoring sources and rebuild; never hand-edit only the generated output.

### Task 6: Browser, visual, and print verification

**Files:**
- Modify: `work/html-deck/qa-deck.mjs`
- Create: `work/html-deck-redesign/screenshots/*.png`
- Create: `work/html-deck-redesign/print-proof.pdf`

- [ ] **Step 1: Extend browser assertions**

Check all 30 slides at 1440×900, 1920×1080, and 390×844. For every active slide assert:

```js
const clipped = [...slide.querySelectorAll('[data-bounded]')]
  .filter((el) => el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2);
assert(clipped.length === 0, `${viewport.name} slide ${number} clipped content`);
```

Also assert there are no HTTP requests, no `img` elements, no `svg` elements, and computed font-family starts with `Noto Sans KR Deck`.

- [ ] **Step 2: Run interaction and viewport QA**

Run:

```powershell
& 'C:\Users\SuperNatural1\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'work\html-deck\qa-deck.mjs'
```

Expected:

```text
browser_qa=PASS slides=30 viewports=3 screenshots=8 external_requests=0
```

- [ ] **Step 3: Inspect the eight representative screenshots**

Inspect s01, s04, s08, s13, s15, s20, s23, and s30. Verify hierarchy, formation order, diagram legibility, Korean line breaks, color discipline, and that no slide resembles a card dashboard.

- [ ] **Step 4: Verify print output**

Create `print-proof.pdf`, then run:

```powershell
$env:PYTHONPATH='C:\Users\SuperNatural1\.cache\codex-runtimes\codex-primary-runtime\dependencies\python'
& 'C:\Users\SuperNatural1\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -c "from pypdf import PdfReader; print(len(PdfReader('work/html-deck-redesign/print-proof.pdf').pages))"
```

Expected: `30`.

- [ ] **Step 5: Deliver the standalone output**

Confirm `outputs/5points_macro_strategy_lecture.html` opens with `file://`, all navigation works, and the output contains the embedded WOFF2 but no external URLs. Preserve the existing PPTX and PDF backups unchanged.
