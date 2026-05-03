#!/usr/bin/env node
// Shonen Anime Generator — Neta AI image generation
// Usage: node shonenanimegenerator.js "prompt" --token YOUR_TOKEN [--size portrait] [--ref picture_uuid]

const DEFAULT_PROMPT_SUFFIX = "shonen anime style, dynamic action pose, expressive determined eyes, spiky hair, vibrant saturated colors, speed lines, dramatic lighting, energetic composition, weekly shonen jump manga aesthetic, high contrast inking, powerful character art";

const SIZES = {
  square: { width: 1024, height: 1024 },
  portrait: { width: 832, height: 1216 },
  landscape: { width: 1216, height: 832 },
  tall: { width: 704, height: 1408 },
};

function parseArgs(argv) {
  const args = { positional: [], size: "portrait", token: null, ref: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--size") {
      args.size = argv[++i];
    } else if (a === "--token") {
      args.token = argv[++i];
    } else if (a === "--ref") {
      args.ref = argv[++i];
    } else if (a.startsWith("--size=")) {
      args.size = a.slice(7);
    } else if (a.startsWith("--token=")) {
      args.token = a.slice(8);
    } else if (a.startsWith("--ref=")) {
      args.ref = a.slice(6);
    } else {
      args.positional.push(a);
    }
  }
  return args;
}

async function main() {
  const { positional, size, token: tokenFlag, ref } = parseArgs(process.argv);

  const userPrompt = positional[0];
  if (!userPrompt) {
    console.error("✗ Prompt required. Usage: node shonenanimegenerator.js \"your prompt\" --token YOUR_TOKEN");
    process.exit(1);
  }

  const TOKEN = tokenFlag;

  if (!TOKEN) {
    console.error("\n✗ Token required. Pass via: --token YOUR_TOKEN");
    console.error("  Get yours at: https://www.neta.art/open/");
    process.exit(1);
  }

  const dims = SIZES[size];
  if (!dims) {
    console.error(`✗ Invalid size: ${size}. Choose: square, portrait, landscape, tall`);
    process.exit(1);
  }

  const PROMPT = `${userPrompt}, ${DEFAULT_PROMPT_SUFFIX}`;

  const headers = {
    "x-token": TOKEN,
    "x-platform": "nieta-app/web",
    "content-type": "application/json",
  };

  const body = {
    storyId: "DO_NOT_USE",
    jobType: "universal",
    rawPrompt: [{ type: "freetext", value: PROMPT, weight: 1 }],
    width: dims.width,
    height: dims.height,
    meta: { entrance: "PICTURE,VERSE" },
    context_model_series: "8_image_edit",
  };

  if (ref) {
    body.inherit_params = { collection_uuid: ref, picture_uuid: ref };
  }

  console.error(`→ Submitting (${dims.width}×${dims.height})...`);

  const submitRes = await fetch("https://api.talesofai.com/v3/make_image", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    console.error(`✗ Submit failed: ${submitRes.status} ${text}`);
    process.exit(1);
  }

  const submitText = await submitRes.text();
  let task_uuid;
  try {
    const parsed = JSON.parse(submitText);
    task_uuid = typeof parsed === "string" ? parsed : parsed.task_uuid;
  } catch {
    task_uuid = submitText.trim().replace(/^"|"$/g, "");
  }

  if (!task_uuid) {
    console.error(`✗ No task_uuid in response: ${submitText}`);
    process.exit(1);
  }

  console.error(`→ Task ${task_uuid}, polling...`);

  for (let attempt = 0; attempt < 90; attempt++) {
    await new Promise((r) => setTimeout(r, 2000));

    const pollRes = await fetch(`https://api.talesofai.com/v1/artifact/task/${task_uuid}`, {
      method: "GET",
      headers,
    });

    if (!pollRes.ok) {
      continue;
    }

    const data = await pollRes.json();
    const status = data.task_status;

    if (status === "PENDING" || status === "MODERATION") {
      continue;
    }

    const url =
      (data.artifacts && data.artifacts[0] && data.artifacts[0].url) ||
      data.result_image_url;

    if (url) {
      console.log(url);
      process.exit(0);
    }

    console.error(`✗ Task ended with status ${status} but no image URL`);
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.error("✗ Timed out after 90 polling attempts (3 minutes)");
  process.exit(1);
}

main().catch((err) => {
  console.error(`✗ Error: ${err.message}`);
  process.exit(1);
});
