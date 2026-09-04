// 아트보드 생성 — deck.mjs 의 명세를 읽어 Main.dc.html / S02..Sxx.dc.html + canvas.json 을 만든다
// 실행: node gen.mjs
import fs from 'node:fs';
import { T, setTotal, setChrome } from './system.mjs';
import { meta, slides } from './deck.mjs';
import { NOTES } from './notes.mjs';

setTotal(slides.length);
setChrome(meta.chrome);

const files = [];
slides.forEach((s, i) => {
  const n = i + 1;
  const name = n === 1 ? 'Main' : `S${String(n).padStart(2, '0')}`;
  let html = T[s.type](s, n);
  const note = NOTES[n];
  if (note) html = html.replace('</x-dc>', `<!--note:${note}-->\n</x-dc>`);
  fs.writeFileSync(`${name}.dc.html`, html);
  files.push({ name, title: `${String(n).padStart(2, '0')} · ${s.h.replace(/<br>/g, ' ').replace(/[“”]/g, '')}` });
});

fs.writeFileSync('canvas.json', JSON.stringify({
  artboards: files.map((f, i) => ({
    file: `${f.name}.dc.html`, title: f.title,
    x: (i % 4) * 1700, y: Math.floor(i / 4) * 1080, w: 1600, h: 900,
  })),
  launch: { view: 'canvas' },
}, null, 2));

const noNote = slides.map((_, i) => i + 1).filter((n) => !NOTES[n]);
if (noNote.length) console.warn('노트 없는 장:', noNote.join(', '));
console.log(`${meta.title} — ${slides.length}장 생성`);
console.log('이미지:', [...new Set(slides.map((s) => s.img).filter(Boolean))].join(' ') || '없음');
