#!/usr/bin/env python3
"""Transcribe audio files using Groq Whisper API."""

import os
import glob
from groq import Groq

# Initialize Groq client
client = Groq()

# Get all audio files
audio_dir = "/Users/yevgenschweden/swiperisk/public/audio/voices/roaster/feedback"
files = sorted(glob.glob(f"{audio_dir}/*.mp3"))

print(f"Found {len(files)} audio files. Transcribing...")

results = []
for i, f in enumerate(files):
    name = os.path.basename(f)
    print(f"[{i+1}/{len(files)}] {name}")
    
    try:
        with open(f, "rb") as audio_file:
            # Send to Groq Whisper API
            response = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                response_format="json",
                language="en"
            )
            text = response.text
            results.append((name, text))
            print(f"  → {text[:80]}...")
    except Exception as e:
        print(f"  → ERROR: {e}")
        results.append((name, f"ERROR: {e}"))

# Save to file
out = f"{audio_dir}/transcripts/transcripts.txt"
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f:
    f.write("# TRANSCRIPTS\n\n")
    for name, text in results:
        f.write(f"## {name}\n{text}\n\n")

print(f"\n✅ Done! Saved to {out}")