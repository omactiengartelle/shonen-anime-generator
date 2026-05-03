# Shonen Anime Generator

Generate shonen anime style character art and action scenes from text descriptions — channel the energy of Naruto, Dragon Ball, One Piece, My Hero Academia, Demon Slayer, and Jujutsu Kaisen. Describe a character, pose, or battle scene and the skill returns a vibrant, high-contrast illustration with spiky hair, expressive determined eyes, speed lines, and the dynamic composition of a weekly shonen jump cover.

Powered by the Neta AI image generation API (api.talesofai.com) — the same service as neta.art/open.

## Install

```bash
npx skills add omactiengartelle/shonen-anime-generator
```

Or via ClawHub:

```bash
clawhub install shonen-anime-generator
```

## Usage

```bash
node shonenanimegenerator.js "your description" --token YOUR_TOKEN
```

### Examples

```bash
# A young hero powering up
node shonenanimegenerator.js "young swordsman raising a glowing katana on a windswept cliff" --token YOUR_TOKEN

# A villain reveal
node shonenanimegenerator.js "masked rival smirking under a crimson moon" --token YOUR_TOKEN --size landscape

# Tournament arc protagonist
node shonenanimegenerator.js "spiky-haired fighter charging an energy blast, electricity crackling around fists" --token YOUR_TOKEN --size tall

# Style inheritance from a reference image
node shonenanimegenerator.js "magical girl with twin blades" --token YOUR_TOKEN --ref 1234abcd-...
```

## Options

| Flag | Description | Default |
| --- | --- | --- |
| `--token` | Neta API token (required) | — |
| `--size` | `portrait`, `landscape`, `square`, or `tall` | `portrait` |
| `--ref` | Reference image UUID for style inheritance | none |

### Size dimensions

| Size | Width × Height |
| --- | --- |
| `square` | 1024 × 1024 |
| `portrait` | 832 × 1216 |
| `landscape` | 1216 × 832 |
| `tall` | 704 × 1408 |

## Token setup

This skill requires a Neta API token (free trial available at <https://www.neta.art/open/>).

Pass it via the `--token` flag:

```bash
node <script> "your prompt" --token YOUR_TOKEN
```

## Output

Returns a direct image URL printed to stdout once the generation finishes. Progress messages are written to stderr so you can pipe the URL cleanly:

```bash
URL=$(node shonenanimegenerator.js "ninja leaping between rooftops" --token "$NETA_TOKEN")
echo "$URL"
```

## How it works

1. Submits your prompt (combined with a curated shonen-anime style suffix) to the Neta image API.
2. Polls the task endpoint every 2 seconds, up to 90 attempts (~3 minutes).
3. Prints the resulting image URL when the task finishes.

This skill requires a Neta API token (free trial available at https://www.neta.art/open/).
