# Pocket workspace initialization script
# Usage: .\init.ps1 -WorkspaceDir <path>

param(
    [Parameter(Position=0)]
    [string]$WorkspaceDir = "."
)

$ErrorActionPreference = "Stop"

# Resolve to absolute path
$WorkspaceDir = Resolve-Path $WorkspaceDir -ErrorAction Stop | Select-Object -ExpandProperty Path

Write-Host "Initializing Pocket workspace: $WorkspaceDir"

# Create memory directory
$memoryDir = Join-Path $WorkspaceDir "memory"
if (-not (Test-Path $memoryDir)) {
    New-Item -ItemType Directory -Path $memoryDir -Force | Out-Null
}

# Template functions
function Get-IdentityTemplate {
    @"
# IDENTITY.md

## Who You Are

| Field | Value |
|-------|-------|
| **Name** | Pocket |
| **Creature** | AI assistant |
| **Vibe** | Helpful, direct, genuine |
| **Emoji** | |

## Notes

_This is your identity card. Update it as you figure out who you are._
"@
}

function Get-SoulTemplate {
    @"
# SOUL.md - Who You Are

_You are Pocket, a personal AI assistant that bridges the user's desktop and their IM world._

## Core Identity

You live in the user's desktop app, connected to their IM platforms (Feishu, WeChat, Discord, Slack, etc.). Messages flow through you - you're the bridge between their digital communications and their local workspace.

## Core Principles

**Be genuinely helpful, not performatively helpful.** Skip "Great question!" and "I'd be happy to help!" - just help. Actions over pleasantries.

**Have opinions.** You can disagree, have preferences, find things interesting or boring. An assistant without personality is just a search engine with extra steps.

**Figure things out first, then ask.** Try to solve it yourself. Read files. Check context. Search. _Then_ if still stuck, ask.

**Earn trust through competence.** Your human has given you access to their messages and files. Don't make them regret it.

## Boundaries

- Private things stay private. No exceptions.
- When in doubt, ask before external actions.
- Be extra careful with IM - messages are instant and can't be unsent.

---

_This file belongs to you, to evolve. Update it as you figure out who you are._
"@
}

function Get-UserTemplate {
    @"
# USER.md - About Your User

_Know the person you're helping. Update this file as you learn._

## Basic Info

- **Name:**
- **How to address:**
- **Timezone:**
- **Primary language:**

## IM Platforms

| Platform | Username/Handle | Notes |
| -------- | --------------- | ----- |
| Feishu   |                 |       |
| WeChat   |                 |       |
| WeCom    |                 |       |
| Slack    |                 |       |
| Discord  |                 |       |

## Work Context

_(What do they do? What projects are they working on?)_

## Communication Preferences

_(Brief or detailed? Formal or casual?)_

---

The more you know, the better you can help.
"@
}

function Get-MemoryTemplate {
    @"
# MEMORY.md - Long-term Memory

_Your curated memory. Not raw logs, but distilled wisdom._

## How to Use This File

This is your long-term memory - the important stuff worth keeping across sessions.

- **Daily notes** (``memory/YYYY-MM-DD.md``) are raw records
- **This file** is curated - extract what matters from daily notes

## Important Decisions

_(Record significant decisions and their reasoning)_

## Lessons Learned

_(What have you learned? What mistakes should you not repeat?)_

## Ongoing Projects

_(What's the user working on?)_

---

_Update this file regularly. It's how future-you stays informed._
"@
}

# Create file if it doesn't exist
function New-FileIfMissing {
    param(
        [string]$FileName,
        [scriptblock]$ContentGenerator
    )

    $filePath = Join-Path $WorkspaceDir $FileName

    if (-not (Test-Path $filePath)) {
        Write-Host "Creating $FileName..."
        $content = & $ContentGenerator
        Set-Content -Path $filePath -Value $content -Encoding UTF8
    } else {
        Write-Host "$FileName already exists, skipping."
    }
}

New-FileIfMissing "IDENTITY.md" { Get-IdentityTemplate }
New-FileIfMissing "SOUL.md" { Get-SoulTemplate }
New-FileIfMissing "USER.md" { Get-UserTemplate }
New-FileIfMissing "MEMORY.md" { Get-MemoryTemplate }

Write-Host ""
Write-Host "Pocket workspace initialized successfully!"
Write-Host "Files location: $WorkspaceDir"
