import json
import sys
import wave
from pathlib import Path

LIB_DIR = Path(r"C:\Users\SuperNatural1\Documents\Codex\2026-08-25\3-05-5points-1-2-3\work\audio_libs")
AUDIO_PATH = Path(r"C:\Users\SuperNatural1\OneDrive\Documents\카카오톡 받은 파일\음성 260825_022013.m4a")
OUTPUT_DIR = Path(r"C:\Users\SuperNatural1\Documents\Codex\2026-08-25\3-05-5points-1-2-3\work\audio_transcript")

sys.path.insert(0, str(LIB_DIR))

import av  # noqa: E402
from faster_whisper import WhisperModel  # noqa: E402

SAMPLE_RATE = 16_000
CHUNK_SECONDS = 4 * 60


def format_time(seconds: float) -> str:
    total = max(0, int(seconds))
    hours, remainder = divmod(total, 3600)
    minutes, secs = divmod(remainder, 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


def make_audio_chunks() -> list[tuple[Path, float]]:
    chunk_dir = OUTPUT_DIR / "chunks"
    chunk_dir.mkdir(parents=True, exist_ok=True)
    max_chunk_bytes = CHUNK_SECONDS * SAMPLE_RATE * 2
    chunks: list[tuple[Path, float]] = []
    resampler = av.AudioResampler(format="s16", layout="mono", rate=SAMPLE_RATE)

    chunk_index = 0
    chunk_bytes = 0
    chunk_handle = None

    def open_chunk(index: int):
        path = chunk_dir / f"chunk-{index:03d}.wav"
        handle = wave.open(str(path), "wb")
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(SAMPLE_RATE)
        chunks.append((path, index * CHUNK_SECONDS))
        return handle

    try:
        with av.open(str(AUDIO_PATH)) as container:
            for input_frame in container.decode(audio=0):
                for output_frame in resampler.resample(input_frame):
                    pcm = output_frame.to_ndarray().tobytes()
                    while pcm:
                        if chunk_handle is None:
                            chunk_handle = open_chunk(chunk_index)
                        remaining = max_chunk_bytes - chunk_bytes
                        part, pcm = pcm[:remaining], pcm[remaining:]
                        chunk_handle.writeframesraw(part)
                        chunk_bytes += len(part)
                        if chunk_bytes >= max_chunk_bytes:
                            chunk_handle.close()
                            chunk_handle = None
                            chunk_index += 1
                            chunk_bytes = 0
            for output_frame in resampler.resample(None):
                pcm = output_frame.to_ndarray().tobytes()
                if pcm:
                    if chunk_handle is None:
                        chunk_handle = open_chunk(chunk_index)
                    chunk_handle.writeframesraw(pcm)
    finally:
        if chunk_handle is not None:
            chunk_handle.close()

    return chunks


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with av.open(str(AUDIO_PATH)) as container:
        duration_seconds = float(container.duration / av.time_base)
    print(f"AUDIO_DURATION_SECONDS={duration_seconds:.1f}", flush=True)

    chunks = make_audio_chunks()
    print(f"AUDIO_CHUNKS={len(chunks)} CHUNK_SECONDS={CHUNK_SECONDS}", flush=True)

    model = WhisperModel(
        "base",
        device="cpu",
        compute_type="int8",
        cpu_threads=2,
        num_workers=1,
    )
    print("MODEL_READY=base", flush=True)

    initial_prompt = (
        "한국어 픽업 강의 기획 회의. 주요 용어: 거시적인 전략론 5 Points, 마인드셋, "
        "상황 읽기, 프레임 컨트롤, FRAME CONTROL, 팀 플레이, TEAM PLAYING, 협상력, 화술, "
        "메이드, 메이드 자리, 윙, 리더, 밸런서, 아버지 역할, 어머니 역할, 이태원, 권력의 흐름, "
        "텐션, 의미 부여, 명분, 구장, 기세, 섹슈얼 토크, 트레이너, DHV."
    )

    transcript_path = OUTPUT_DIR / "transcript.txt"
    jsonl_path = OUTPUT_DIR / "segments.jsonl"

    count = 0
    detected_language = "ko"
    language_probability = 1.0
    with transcript_path.open("w", encoding="utf-8") as transcript_file, jsonl_path.open(
        "w", encoding="utf-8"
    ) as jsonl_file:
        for chunk_number, (chunk_path, offset) in enumerate(chunks, start=1):
            segments, info = model.transcribe(
                str(chunk_path),
                language="ko",
                beam_size=1,
                best_of=1,
                vad_filter=True,
                vad_parameters={"min_silence_duration_ms": 500},
                condition_on_previous_text=True,
                initial_prompt=initial_prompt,
            )
            detected_language = info.language
            language_probability = info.language_probability
            for segment in segments:
                text = segment.text.strip()
                if not text:
                    continue
                count += 1
                start = offset + segment.start
                end = offset + segment.end
                timestamped = f"[{format_time(start)}–{format_time(end)}] {text}"
                transcript_file.write(timestamped + "\n")
                transcript_file.flush()
                jsonl_file.write(
                    json.dumps(
                        {
                            "id": count,
                            "chunk": chunk_number,
                            "start": start,
                            "end": end,
                            "text": text,
                            "avg_logprob": segment.avg_logprob,
                            "no_speech_prob": segment.no_speech_prob,
                        },
                        ensure_ascii=False,
                    )
                    + "\n"
                )
                jsonl_file.flush()
            print(
                f"PROGRESS_CHUNK={chunk_number}/{len(chunks)} "
                f"LAST_END={format_time(min(offset + CHUNK_SECONDS, duration_seconds))} "
                f"SEGMENTS={count}",
                flush=True,
            )

    metadata_path = OUTPUT_DIR / "metadata.json"
    metadata_path.write_text(
        json.dumps(
            {
                "source": str(AUDIO_PATH),
                "duration_seconds": duration_seconds,
                "language": detected_language,
                "language_probability": language_probability,
                "model": "base",
                "segment_count": count,
                "chunk_seconds": CHUNK_SECONDS,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"TRANSCRIPTION_COMPLETE SEGMENTS={count}", flush=True)
    print(f"TRANSCRIPT_PATH={transcript_path}", flush=True)


if __name__ == "__main__":
    main()
