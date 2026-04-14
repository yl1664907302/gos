# MiniMax CLI (mmx)

GitHub: https://github.com/MiniMax-AI/cli

Supports both **Global** (api.minimax.io) and **CN** (api.minimaxi.com) regions. Requires Node.js 18+ and an active MiniMax Token Plan.

## Capabilities

| Skill      | Capabilities                                                  |
| ---------- | ------------------------------------------------------------- |
| mmx-text   | Multi-turn chat, streaming, system prompts, JSON output       |
| mmx-image  | Text-to-image, batch generation, aspect ratio control         |
| mmx-video  | Text-to-video, async generation, task tracking, file download |
| mmx-speech | Text-to-speech, 30+ voices, speed control, streaming output  |
| mmx-music  | Text-to-music, lyrics support, instrumental mode              |
| mmx-vision | Image understanding, description, visual Q&A                 |
| mmx-search | Web search powered by MiniMax search infrastructure           |

## Installation & Configuration

```bash
# 1. Install CLI
npm install -g mmx-cli
npx skills add MiniMax-AI/cli -y -g

# 2. Login
# Option A: API Key (if you have one)
mmx auth login --api-key sk-xxxxx
# Option B: OAuth browser flow
mmx auth login

# 3. Set region (if needed)
mmx config set --key region --value cn    # For China
mmx config set --key region --value global  # For Global (default)
```

## Common Commands

```bash
# Text chat
mmx text chat --message "Hello"
mmx text chat --model MiniMax-M2.7-highspeed --message "Hello"
mmx text chat --system "You are a translator" --message "Translate: hello"

# Image generation
mmx image "a cute cat in watercolor style"
mmx image generate --n 3 --aspect-ratio 16:9 --out-dir ./images/

# Video generation (async)
mmx video generate --prompt "a sunset over the ocean" --async
mmx video task get --task-id <task_id>
mmx video download --file-id <file_id> --out video.mp4

# Speech synthesis
mmx speech voices                          # List available voices
mmx speech synthesize --text "Hello world" --voice <voice_name>
mmx speech synthesize --text "Hello" --speed 1.2 --out hello.mp3
mmx speech synthesize --text "Hello" --stream | mpv -   # Stream playback

# Music generation
mmx music generate --prompt "upbeat pop" --lyrics "la la la" --out song.mp3
mmx music generate --prompt "calm piano" --instrumental

# Vision (image understanding)
mmx vision photo.jpg
mmx vision describe --image https://example.com/img.jpg --prompt "What is in this image?"

# Web search
mmx search "latest AI news"
mmx search query --q "MiniMax API" --output json

# Account & config
mmx auth status    # Check login status
mmx quota          # Check token usage
mmx config show    # View current config
mmx update         # Update CLI to latest version
```

## Authentication

MiniMax credentials are not stored in `gateway.config.json`. Ask the user for their API key, or guide them through the OAuth browser flow (`mmx auth login`).
