// 폰트 서브셋 — 덱에 실제로 쓰인 글자만 남겨 woff2 로 굽는다.
// 실행: node subset-fonts.mjs   (gen.mjs 를 먼저 돌린 뒤)
// 필요: pip install fonttools brotli
//
// 한글 폰트는 통으로 넣으면 4~8MB다. 쓰는 글자만 남기면 300KB 아래로 떨어져서
// 인터넷 없이도 붓글씨 폰트가 그대로 나온다. 글자를 고칠 때마다 다시 돌려야 한다.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const TMP = os.tmpdir();
const py = (...a) => execFileSync('python', a, { stdio: ['ignore', 'ignore', 'pipe'] });

// 1) 아트보드에서 실제로 쓰인 글자를 모은다 (발표자 노트 + 덱 UI 문구 포함)
let text = '';
for (const f of fs.readdirSync('.').filter((x) => x.endsWith('.dc.html'))) {
  let s = fs.readFileSync(f, 'utf8')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<!--note:([\s\S]*?)-->/g, ' $1 ');
  text += s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
}
text += '발표자 노트 전체 보기 닫기 이 장에는 노트가 없습니다 발표 단축키 슬라이드 이동 처음과 마지막 전체 화면 패널 닫기';

// 강의 대본(script.mjs)도 같은 폰트로 인쇄하므로 글자를 합친다
try {
  const { SCRIPT } = await import('./script.mjs');
  text += ' 강의 대본 질문개 회색 상자는 청중에게 던지는 질문입니다 슬라이드 번호는 오른쪽에 있습니다 ';
  for (const sec of SCRIPT) {
    text += sec.part + sec.title + sec.s;
    for (const b of sec.body) text += (typeof b === 'string' ? b : b.q);
  }
} catch { /* 대본이 없으면 건너뛴다 */ }

const chars = [...new Set(text.split(''))].filter((c) => c.trim() && c.charCodeAt(0) > 31).sort();
fs.writeFileSync('fonts/charset.txt', chars.join(''));

// 2) 가변 폰트를 고정 웨이트로 뽑고 → 서브셋 → woff2
const FACES = [
  ['fonts/NotoSansKR.ttf',  400, 'fonts/NotoSansKR-400.woff2'],
  ['fonts/NotoSansKR.ttf',  700, 'fonts/NotoSansKR-700.woff2'],
  ['fonts/NotoSerifKR.ttf', 600, 'fonts/NotoSerifKR-600.woff2'],
  ['fonts/EastSeaDokdo.ttf', null, 'fonts/EastSeaDokdo.woff2'],   // 붓글씨 — 웨이트 축 없음
];

for (const [src, wght, out] of FACES) {
  let input = src;
  if (wght !== null) {
    input = path.join(TMP, `dk-${wght}-${path.basename(src)}`);
    py('-m', 'fontTools.varLib.instancer', src, `wght=${wght}`, '-o', input);
  }
  py('-m', 'fontTools.subset', input,
    '--text-file=fonts/charset.txt', '--flavor=woff2', '--no-hinting', `--output-file=${out}`);
}

const total = FACES.reduce((n, [, , f]) => n + fs.statSync(f).size, 0);
console.log(`${chars.length}자 / 폰트 4종 ${(total / 1024).toFixed(0)}KB`);
