// Generate illustrations with an AI image model, using mockup crops and earlier
// "anchor" images as references so style and characters stay consistent.
//   node --env-file=.env.local scripts/gen-images.mjs              # anchors, then everything missing
//   node --env-file=.env.local scripts/gen-images.mjs --anchors    # only banner/characters/chim-hot
//   node --env-file=.env.local scripts/gen-images.mjs --only sam,ga-gay [--force]
//   node scripts/gen-images.mjs --dry                               # list what would be generated
// Provider: Pollinations if POLLINATIONS_API_KEY is set (model: POLLINATIONS_MODEL),
// otherwise Gemini (GEMINI_API_KEY, paid tier). Raw results go to
// assets-src/images-raw/<id>.<ext>; run process-images.mjs afterwards.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { ITEMS, STYLE } from "../assets-src/image-prompts.mjs";

const WEB = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = join(WEB, "assets-src", "images-raw");
const REF = join(WEB, "assets-src");
const ANCHORS = ["characters", "chim-hot"];
const POLL_KEY = process.env.POLLINATIONS_API_KEY;
const PROVIDER = POLL_KEY ? "pollinations" : "gemini";
const MODEL = POLL_KEY ? process.env.POLLINATIONS_MODEL || "gpt-image-1-mini" : process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image";

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const force = flag("--force");

const rawPath = (id) => {
  if (!existsSync(RAW)) return null;
  const f = readdirSync(RAW).find((n) => n.replace(/\.(png|jpe?g|webp)$/, "") === id);
  return f ? join(RAW, f) : null;
};

// References are downscaled to ≤1024 px JPEG so requests stay small.
async function refImages(item) {
  const out = [];
  for (const ref of item.refs) {
    const isRaw = ref.startsWith("raw:");
    if (isRaw && ref.slice(4) === item.id) continue;
    const p = isRaw ? rawPath(ref.slice(4)) : join(REF, ref);
    if (!p || !existsSync(p)) {
      console.warn(`  ! ${item.id}: reference ${ref} not available yet, skipped`);
      continue;
    }
    const buf = await sharp(p).flatten({ background: "#ffffff" }).resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
    out.push(buf.toString("base64"));
  }
  return out;
}

// Output size per aspect (OpenAI-family models only accept a few fixed sizes).
function sizeFor(aspect) {
  if (MODEL.includes("gpt-image")) return aspect === "1:1" ? "1024x1024" : "1536x1024";
  return { "1:1": "1024x1024", "4:3": "1280x960", "16:9": "1536x864", "21:9": "2048x880" }[aspect] ?? "1024x1024";
}

async function callGemini(item, prompt, refs) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }, ...refs.map((data) => ({ inlineData: { mimeType: "image/jpeg", data } }))] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: item.aspect, imageSize: item.size } },
    }),
  });
  const text = await res.text();
  if (res.status === 429 && text.includes("limit: 0")) throw new Error("quota is 0 — this Gemini key is on the free tier; enable billing");
  const json = JSON.parse(text || "{}");
  const img = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData;
  return { status: res.status, error: json.error?.message, b64: img?.data, mime: img?.mimeType };
}

async function callPollinations(item, prompt, refs) {
  const body = { model: MODEL, prompt, size: sizeFor(item.aspect), response_format: "b64_json", quality: "high" };
  const url = refs.length ? "https://gen.pollinations.ai/v1/images/edits" : "https://gen.pollinations.ai/v1/images/generations";
  if (refs.length) body.image = refs.map((d) => ({ image_url: `data:image/jpeg;base64,${d}` }));
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${POLL_KEY}` }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  const b64 = json.data?.[0]?.b64_json;
  return { status: res.status, error: json.error?.message ?? json.message, b64, mime: "image/png" };
}

async function generate(item, attempt = 1) {
  const prompt = `${STYLE}\n\n${item.prompt}`;
  const refs = await refImages(item);
  const r = await (PROVIDER === "pollinations" ? callPollinations : callGemini)(item, prompt, refs);
  if ((r.status === 429 || r.status >= 500 || (r.status === 200 && !r.b64)) && attempt < 4) {
    const wait = 3000 * 2 ** attempt;
    console.warn(`  … ${item.id}: HTTP ${r.status}${r.error ? ` (${r.error.slice(0, 80)})` : ""}, retry in ${wait / 1000}s`);
    await new Promise((res) => setTimeout(res, wait));
    return generate(item, attempt + 1);
  }
  if (!r.b64) throw new Error(`${item.id}: HTTP ${r.status} ${r.error ?? "no image returned"}`);
  const buf = Buffer.from(r.b64, "base64");
  const meta = await sharp(buf).metadata();
  mkdirSync(RAW, { recursive: true });
  writeFileSync(join(RAW, `${item.id}.${meta.format === "jpeg" ? "jpg" : meta.format}`), buf);
  return item;
}

let outOfCredit = false;

async function runAll(items, concurrency) {
  let i = 0;
  const failed = [];
  const worker = async () => {
    while (i < items.length && !outOfCredit) {
      const item = items[i++];
      try {
        await generate(item);
        console.log(`  ✔ ${item.id}`);
      } catch (e) {
        failed.push(item.id);
        // 402 = no credit left: stop now and resume on the next run (images already made are kept).
        if (/HTTP 402/.test(e.message)) outOfCredit = true;
        else console.error(`  ✖ ${e.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  return failed;
}

const wanted = ITEMS.filter((it) => (only ? only.includes(it.id) : !flag("--anchors") || ANCHORS.includes(it.id))).filter(
  (it) => force || !rawPath(it.id),
);
console.log(`${wanted.length} image(s) to generate · ${PROVIDER} / ${MODEL}`);
if (flag("--dry")) {
  wanted.forEach((it) => console.log(`  - ${it.id} (${it.aspect}, ${sizeFor(it.aspect)})`));
  process.exit(0);
}
if (!POLL_KEY && !process.env.GEMINI_API_KEY) {
  console.error("No API key — put POLLINATIONS_API_KEY (or GEMINI_API_KEY) in web/.env.local and run with: node --env-file=.env.local scripts/gen-images.mjs");
  process.exit(1);
}

// Anchors first and one at a time, so every later image can use them as references.
const anchors = wanted.filter((it) => ANCHORS.includes(it.id)).sort((a, b) => ANCHORS.indexOf(a.id) - ANCHORS.indexOf(b.id));
const rest = wanted.filter((it) => !ANCHORS.includes(it.id));
const failed = [...(await runAll(anchors, 1)), ...(await runAll(rest, 3))];
const left = ITEMS.filter((it) => !rawPath(it.id)).length;
if (outOfCredit) console.log(`out of credit — ${left} image(s) still to generate; run again when the free balance refills.`);
else console.log(`done${failed.length ? ` · failed: ${failed.join(", ")}` : ""} · ${left} image(s) left`);
