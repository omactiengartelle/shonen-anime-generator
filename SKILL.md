---
name: shonen-anime-generator
description: Generate shonen anime style character art and action scenes — Naruto, Dragon Ball, One Piece, My Hero Academia, Demon Slayer, Jujutsu Kaisen aesthetic. Create shonen protagonists, action poses, battle scenes, manga-style hero art, weekly shonen jump style illustrations, and dynamic anime fighter portraits with spiky hair, expressive eyes, and high-energy composition via the Neta AI image generation API (free trial at neta.art/open).
tools: Bash
---

# Shonen Anime Generator

Generate shonen anime style character art and action scenes — Naruto, Dragon Ball, One Piece, My Hero Academia, Demon Slayer, Jujutsu Kaisen aesthetic. Create shonen protagonists, action poses, battle scenes, manga-style hero art, weekly shonen jump style illustrations, and dynamic anime fighter portraits with spiky hair, expressive eyes, and high-energy composition.

## Token

Requires a Neta API token (free trial at <https://www.neta.art/open/>). Pass it via the `--token` flag.

```bash
node <script> "your prompt" --token YOUR_TOKEN
```

## When to use
Use when someone asks to generate or create shonen anime art generator images.

## Quick start
```bash
node shonenanimegenerator.js "your description here" --token YOUR_TOKEN
```

## Options
- `--size` — `portrait`, `landscape`, `square`, `tall` (default: `portrait`)
- `--ref` — reference image UUID for style inheritance

## Install
```bash
npx skills add omactiengartelle/shonen-anime-generator
```
