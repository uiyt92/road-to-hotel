# Road to Hotel · 5 POINTS

성공적인 메이드를 위한 거시 전략론 — 120분 대면 강의 덱 (64장).

푸시하면 GitHub Actions 가 덱을 빌드해서 Pages 로 올린다.

## 구조

| 경로 | 내용 |
|---|---|
| `work/design-canvas/gen-deck.mjs` | **슬라이드 명세.** 내용을 고치는 곳 |
| `work/design-canvas/notes.mjs` | 발표자 노트 (번호 → 진행 지시문) |
| `work/design-canvas/subset-fonts.mjs` | 쓰인 글자만 남겨 폰트 굽기 |
| `work/design-canvas/build-deck.mjs` | → `outputs/5points_deck.html` |
| `work/design-canvas/build-notes.mjs` | → `outputs/5points_notes.html` |
| `work/images/web/` | 배경 사진 17장 |
| `site/` | Pages 랜딩 페이지 |
| `deck-template/` | 다른 강의에 재사용하는 템플릿 ([README](deck-template/README.md)) |

## 로컬 빌드

```bash
pip install fonttools brotli
cd work/design-canvas
node gen-deck.mjs && node subset-fonts.mjs && node build-deck.mjs && node build-notes.mjs
```

폰트 원본(TTF, 36MB)은 레포에 없다. Google Fonts 에서 받는다:

```bash
cd work/design-canvas/fonts
base=https://github.com/google/fonts/raw/main/ofl
curl -fsSL -o EastSeaDokdo.ttf "$base/eastseadokdo/EastSeaDokdo-Regular.ttf"
curl -fsSL -o NotoSansKR.ttf   "$base/notosanskr/NotoSansKR%5Bwght%5D.ttf"
curl -fsSL -o NotoSerifKR.ttf  "$base/notoserifkr/NotoSerifKR%5Bwght%5D.ttf"
```

**글자를 고쳤으면 `subset-fonts.mjs` 를 다시 돌려야 한다.** 안 그러면 새 글자가 깨진다.

## 발표

`deck.html` 하나로 오프라인에서 돌아간다 (폰트·이미지 내장).

`←` `→` 이동 · `N` 발표자 노트 · `O` 전체 보기 · `F` 전체 화면 · `Esc` 닫기

## 폰트

East Sea Dokdo (제목) / Noto Sans KR (본문) / Noto Serif KR (대사) — 전부 [SIL Open Font License](https://openfontlicense.org/).
