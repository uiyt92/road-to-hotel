# 거시적인 전략론 5 Points PPT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 120분 외부 강의용 28장 본문과 2장 부록을 갖춘 한국어 PowerPoint 파일을 생성하고 시각·내용 검증을 완료한다.

**Architecture:** 콘텐츠와 출처는 데이터 파일로 분리하고, 공통 테마와 도식 도우미를 통해 PptxGenJS로 슬라이드를 생성한다. 생성된 PPTX는 텍스트 추출과 PDF·JPEG 렌더링으로 검증하며, 시각 검토에서 발견된 문제를 수정한 뒤 전체를 다시 렌더링한다.

**Tech Stack:** Node.js, PptxGenJS, PowerPoint/LibreOffice headless rendering, Python, MarkItDown, Poppler

---

## 파일 구조

- `work/ppt/theme.js` — 색상, 글꼴, 여백, 공통 텍스트 스타일
- `work/ppt/content.js` — 30개 슬라이드의 제목, 본문, 강사 노트, 출처
- `work/ppt/visuals.js` — 지도, 관계도, 계기판, 경로, 역할 카드 도식
- `work/ppt/build.js` — 덱 조립과 PPTX 저장
- `work/ppt/validate.py` — 슬라이드 수, 제목 순서, 필수 용어, 금지 표현 검증
- `work/ppt/rendered/` — 렌더링한 PDF와 JPEG
- `outputs/5points_macro_strategy_lecture.pptx` — 최종 PPTX
- `outputs/5points_macro_strategy_lecture.pdf` — 검토·공유용 PDF

### Task 1: 제작 환경과 한글 글꼴 확정

**Files:**
- Create: `work/ppt/theme.js`

- [ ] **Step 1: 설치된 한글 글꼴 확인**

Run:

```powershell
Get-ChildItem C:\Windows\Fonts | Where-Object { $_.Name -match 'Pretendard|맑은|Malgun|NotoSansKR' } | Select-Object Name
```

Expected: Pretendard가 있으면 사용하고, 없으면 `Malgun Gothic`을 사용한다.

- [ ] **Step 2: 테마 상수 작성**

`theme.js`는 다음 인터페이스를 내보낸다.

```js
export const THEME = {
  fontHead: "Malgun Gothic",
  fontBody: "Malgun Gothic",
  colors: {
    charcoal: "101217",
    dark: "171A20",
    ivory: "F3EFE6",
    amber: "FFB24A",
    magenta: "E45F8E",
    teal: "2D9B83",
    red: "D4515F",
    forest: "20372F",
    muted: "7B7E84",
  },
  margin: 0.55,
};
```

- [ ] **Step 3: Node에서 PptxGenJS 로드 확인**

Run:

```powershell
node -e "const pptxgen=require('pptxgenjs'); console.log(typeof pptxgen)"
```

Expected: `function`

### Task 2: 30장 콘텐츠와 출처 데이터 작성

**Files:**
- Create: `work/ppt/content.js`

- [ ] **Step 1: 메인 슬라이드 28장 데이터 작성**

각 항목은 다음 구조를 사용한다.

```js
{
  number: 1,
  section: "도입",
  title: "할 말이 없으면 판부터 봐라",
  kicker: "거시적인 전략론 · 5 Points",
  body: ["상황을 읽고 역할을 정하면 필요한 말은 그다음에 나온다."],
  visual: "cover-map",
  notes: ["수강생에게 최근 메이드 자리에서 말이 막힌 순간을 떠올리게 한다."],
  sources: [],
}
```

- [ ] **Step 2: 부록 2장 데이터 작성**

부록 A1에는 연구 및 해외 트렌드 링크를, A2에는 역할극 안전 규칙을 넣는다.

- [ ] **Step 3: 콘텐츠 수 검증**

Run:

```powershell
node -e "import('./work/ppt/content.js').then(m=>console.log(m.slides.length))"
```

Expected: `30`

### Task 3: 공통 시각 도우미 작성

**Files:**
- Create: `work/ppt/visuals.js`

- [ ] **Step 1: 공통 프레임 함수 작성**

다음 함수를 구현한다.

```js
export function addHeader(slide, pptx, { number, section, title, dark = false }) {}
export function addFooter(slide, { sourceText = "", page }) {}
export function addCard(slide, { x, y, w, h, title, body, accent, fill }) {}
```

- [ ] **Step 2: 핵심 도식 함수 작성**

```js
export function drawFivePointRoute(slide, pptx, activeIndex = -1) {}
export function drawPowerGauges(slide, pptx, values) {}
export function drawEmotionWave(slide, pptx, { alive }) {}
export function drawDecisionBranches(slide, pptx) {}
export function drawFrameDial(slide, pptx, value) {}
export function drawFourPersonRoles(slide, pptx) {}
export function drawThreeAxisProposal(slide, pptx) {}
```

- [ ] **Step 3: 모든 도식 함수의 인자 검증 추가**

잘못된 좌표 또는 필수 값 누락 시 명확한 오류를 던진다.

### Task 4: 본문 슬라이드 1–19 생성

**Files:**
- Create: `work/ppt/build.js`

- [ ] **Step 1: 프레젠테이션 기본 설정**

```js
const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.subject = "거시적인 전략론 5 Points";
pptx.title = "거시적인 전략론 5 Points";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: THEME.fontHead,
  bodyFontFace: THEME.fontBody,
  lang: "ko-KR",
};
```

- [ ] **Step 2: 도입 1–4장 생성**

도입은 어두운 표지와 밝은 문제 제기 슬라이드를 번갈아 배치한다.

- [ ] **Step 3: 마인드셋·상황 읽기 5–10장 생성**

상황 읽기 7–10장은 Behavioral Science Lab의 밝은 카드 스타일을 사용한다.

- [ ] **Step 4: Frame Control 11–13장 생성**

친구–연인 프레임 다이얼과 섹슈얼 토크 단계 도식을 포함한다.

- [ ] **Step 5: Team Playing 14–16장 생성**

리더·밸런서 관계도와 윙의 해야 할 일·하지 말아야 할 일을 도식화한다.

- [ ] **Step 6: 협상력·화술 17–19장 생성**

세 질문, 명분–구장–기세, 제안 문장 구조를 각각 한 장에 표현한다.

### Task 5: 사례·워크숍·부록 생성

**Files:**
- Modify: `work/ppt/build.js`

- [ ] **Step 1: 사례 20–23장 생성**

같은 2:2 장면이 시간순으로 이어지도록 인물 색상과 좌석 배치를 고정한다.

- [ ] **Step 2: 실습 24–28장 생성**

역할극 지시문은 16pt 이상, 타이머·역할·성공 조건을 분리한다.

- [ ] **Step 3: 부록 A1–A2 생성**

출처는 클릭 가능한 링크와 짧은 서지로 정리하고, 안전 규칙은 5개 이내로 제한한다.

- [ ] **Step 4: 강사 노트 추가**

각 슬라이드에 1–3개의 말하기 포인트를 `slide.addNotes()`로 저장한다.

- [ ] **Step 5: PPTX 저장**

Run:

```powershell
node work/ppt/build.js
```

Expected: `outputs/5points_macro_strategy_lecture.pptx` 생성, 슬라이드 30장.

### Task 6: 자동 내용 검증

**Files:**
- Create: `work/ppt/validate.py`

- [ ] **Step 1: 검증 규칙 구현**

검증기는 다음을 확인한다.

```python
required_terms = [
    "마인드셋", "상황 읽기", "FRAME CONTROL", "TEAM PLAYING",
    "협상력", "권력의 흐름", "텐션", "명분", "구장", "기세",
]
forbidden_terms = ["TBD", "TODO", "Lorem ipsum", "placeholder"]
expected_slide_count = 30
```

- [ ] **Step 2: PPTX 텍스트 추출**

Run:

```powershell
python -m markitdown outputs/5points_macro_strategy_lecture.pptx > work/ppt/extracted.md
```

Expected: 오류 없이 30개 슬라이드의 텍스트가 추출된다.

- [ ] **Step 3: 검증기 실행**

Run:

```powershell
python work/ppt/validate.py work/ppt/extracted.md
```

Expected: `PASS: 30 slides, all required terms present, no forbidden text`.

### Task 7: 시각 렌더링과 수정

**Files:**
- Create: `work/ppt/rendered/`
- Modify: `work/ppt/build.js`

- [ ] **Step 1: PDF로 변환**

Run:

```powershell
python C:\Users\SuperNatural1\.agents\skills\pptx\scripts\office\soffice.py --headless --convert-to pdf outputs/5points_macro_strategy_lecture.pptx
```

Expected: `outputs/5points_macro_strategy_lecture.pdf` 생성.

- [ ] **Step 2: 전체 슬라이드를 JPEG로 변환**

Run:

```powershell
pdftoppm -jpeg -r 150 outputs/5points_macro_strategy_lecture.pdf work/ppt/rendered/slide
```

Expected: `slide-01.jpg`부터 `slide-30.jpg`까지 생성.

- [ ] **Step 3: 신선한 시각 검토 수행**

PPTX skill의 검토 프롬프트로 모든 슬라이드의 겹침, 잘림, 대비, 여백, 출처 충돌을 확인한다.

- [ ] **Step 4: 발견한 문제 수정**

문제가 있는 슬라이드의 좌표, 글자 크기, 줄바꿈, 대비를 `build.js`에서 수정한다.

- [ ] **Step 5: 전체 재생성·재검증**

Run:

```powershell
node work/ppt/build.js
python -m markitdown outputs/5points_macro_strategy_lecture.pptx > work/ppt/extracted-final.md
python work/ppt/validate.py work/ppt/extracted-final.md
```

Expected: 내용 검증 PASS, 수정된 PDF와 JPEG에서 새 문제가 발견되지 않는다.

### Task 8: 최종 산출물 확인

**Files:**
- Verify: `outputs/5points_macro_strategy_lecture.pptx`
- Verify: `outputs/5points_macro_strategy_lecture.pdf`

- [ ] **Step 1: 파일 크기와 수정 시각 확인**

Run:

```powershell
Get-Item outputs\5points_macro_strategy_lecture.pptx,outputs\5points_macro_strategy_lecture.pdf | Select-Object Name,Length,LastWriteTime
```

Expected: 두 파일 모두 0바이트보다 크고 최종 검증 이후 시각으로 기록된다.

- [ ] **Step 2: 최종 전달**

PPTX와 PDF를 outputs 경로의 클릭 가능한 링크로 제공하고, 현재 버전이 첫 초안이며 세부 워딩은 후속 검토에서 수정 가능하다고 안내한다.
