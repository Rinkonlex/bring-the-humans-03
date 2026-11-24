// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry itself is the TikTok video named in VIDEO.json; this program's
// whole job is to hand that file to the grader: it reads VIDEO.json from the
// repository root, sanity-checks that the url really is a TikTok video
// address, and writes the file, unchanged, into the output directory.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A TikTok video address: https://www.tiktok.com/@<handle>/video/<digits>,
// with m.tiktok.com and a trailing query or fragment read past.
const TIKTOK_VIDEO_URL =
  /^https:\/\/(?:www\.)?(?:m\.)?tiktok\.com\/@[^/]+\/video\/\d+(?:[?#].*)?$/;

function fail(message) {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

let raw;
try {
  raw = readFileSync(join(botDir, 'VIDEO.json'), 'utf8');
} catch (err) {
  fail(`VIDEO.json could not be read from ${botDir}: ${err.message}`);
}

let video;
try {
  // A stray byte-order mark would defeat JSON.parse; drop it first.
  video = JSON.parse(raw.replace(/^﻿/, ''));
} catch (err) {
  fail(`VIDEO.json is not valid JSON: ${err.message}`);
}

if (typeof video?.url !== 'string' || !TIKTOK_VIDEO_URL.test(video.url)) {
  fail('VIDEO.json does not name a TikTok video address in its "url" field');
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'VIDEO.json'), raw);
console.log(`VIDEO.json handed over: ${video.url}`);
