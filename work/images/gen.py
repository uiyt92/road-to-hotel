"""5points 덱 배경 이미지 생성 — gpt-image-2

사용법:
    python work/images/gen.py work/images/prompts.json [--only key1,key2]

prompts.json: {"key": {"prompt": "...", "note": "..."}, ...}
출력:
    work/images/raw/<key>.png   원본
    work/images/web/<key>.jpg   1200px 폭 JPEG (캔버스·덱 임베드용)
키는 D:/Code/CODE/video production/pipeline/.env 에서만 읽고 어디에도 출력하지 않는다.
"""
import io, json, sys, base64, argparse
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image
from openai import OpenAI

ENV = Path("D:/Code/CODE/video production/pipeline/.env")
HERE = Path(__file__).parent
RAW, WEB = HERE / "raw", HERE / "web"
MODEL = "gpt-image-2"
SIZE = "1536x1024"

STYLE_TAIL = (
    " Shot on 35mm film, underexposed, heavy shadows, most of the frame falls into near-black darkness, "
    "muted desaturated colors with warm amber highlights, visible film grain, slight lens softness, "
    "imperfect off-center framing, documentary snapshot feel, not glossy, not symmetrical, "
    "no text, no logos, no watermark, no readable signage."
)

def gen(client, prompt):
    kw = dict(model=MODEL, prompt=prompt, n=1, quality="high")
    try:
        r = client.images.generate(size=SIZE, **kw)
    except Exception as e:  # 모델이 크기 옵션을 거부하면 auto로 재시도
        print(f"  size {SIZE} rejected ({type(e).__name__}); retrying size=auto")
        r = client.images.generate(size="auto", **kw)
    return base64.b64decode(r.data[0].b64_json)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("prompts")
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    load_dotenv(ENV)
    client = OpenAI()
    RAW.mkdir(parents=True, exist_ok=True); WEB.mkdir(parents=True, exist_ok=True)
    items = json.loads(Path(a.prompts).read_text(encoding="utf-8"))
    only = {k for k in a.only.split(",") if k}
    for key, it in items.items():
        if only and key not in only: continue
        if (RAW / f"{key}.png").exists():
            print(f"skip {key} (exists)"); continue
        print(f"gen {key} …", flush=True)
        png = gen(client, it["prompt"] + it.get("tail", STYLE_TAIL))
        (RAW / f"{key}.png").write_bytes(png)
        im = Image.open(io.BytesIO(png)).convert("RGB")
        w = 1200; h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(WEB / f"{key}.jpg", "JPEG", quality=72, optimize=True)
        print(f"  ok {key}: {im.width}x{im.height} → web/{key}.jpg {(WEB / f'{key}.jpg').stat().st_size // 1024} KB")

if __name__ == "__main__":
    main()
