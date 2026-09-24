// Turn raw AI outputs (assets-src/images-raw) into web images (public/images).
//   node scripts/process-images.mjs [--only id1,id2]
// - cutout: remove the flat white background by flood-filling from the image
//   border (the cartoon outlines stop the fill), soften the edge, trim.
// - band: keep a horizontal slice of a scenery picture (hero background).
// - writes WebP, plus contact sheets per folder in assets-src/sheets/ for review.
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { ITEMS } from "../assets-src/image-prompts.mjs";

const WEB = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = join(WEB, "assets-src", "images-raw");
const SHEETS = join(WEB, "assets-src", "sheets");
const PUB = join(WEB, "public");
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;

const rawPath = (id) => {
  const f = existsSync(RAW) && readdirSync(RAW).find((n) => n.replace(/\.(png|jpe?g|webp)$/, "") === id);
  return f ? join(RAW, f) : null;
};

// Flood-fill background removal. Returns an RGBA buffer + share of pixels removed.
async function cutout(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  // Background colour = median of the four corners (AI "white" is rarely exactly #fff).
  const corner = [];
  for (const [x0, y0] of [[0, 0], [w - 8, 0], [0, h - 8], [w - 8, h - 8]])
    for (let y = y0; y < y0 + 8; y++) for (let x = x0; x < x0 + 8; x++) corner.push((y * w + x) * 4);
  const med = (c) => corner.map((i) => data[i + c]).sort((a, b) => a - b)[corner.length >> 1];
  const bg = [med(0), med(1), med(2)];
  const isBg = (p) => Math.max(Math.abs(data[p] - bg[0]), Math.abs(data[p + 1] - bg[1]), Math.abs(data[p + 2] - bg[2])) <= 24;

  const mask = new Uint8Array(w * h).fill(255);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  let removed = 0;
  while (stack.length) {
    const i = stack.pop();
    if (mask[i] === 0 || !isBg(i * 4)) continue;
    mask[i] = 0;
    removed++;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }
  // Soft 1px edge: blur the mask slightly and use it as alpha.
  const soft = await sharp(Buffer.from(mask), { raw: { width: w, height: h, channels: 1 } }).blur(0.7).extractChannel(0).raw().toBuffer();
  for (let i = 0; i < w * h; i++) data[i * 4 + 3] = Math.min(data[i * 4 + 3], soft[i]);
  return { buf: sharp(data, { raw: { width: w, height: h, channels: 4 } }), removed: removed / (w * h) };
}

async function processItem(item) {
  if (!item.out) return null;
  const src = rawPath(item.id);
  const out = join(PUB, item.out);
  if (!src) return null; // not generated yet: listed at the end, and check-data fails on the missing file
  mkdirSync(dirname(out), { recursive: true });

  if (item.band) {
    // Background scenery: keep a horizontal slice, native width, plus a small variant.
    const { width, height } = await sharp(src).metadata();
    const top = Math.round(height * item.band[0]);
    const strip = await sharp(src).extract({ left: 0, top, width, height: Math.round(height * item.band[1]) - top }).toBuffer();
    await sharp(strip).webp({ quality: 82 }).toFile(out);
    await sharp(strip).resize({ width: 768 }).webp({ quality: 80 }).toFile(out.replace(".webp", "-768.webp"));
    return { item, out, note: "band" };
  }

  let img = sharp(src);
  let note = "";
  if (item.cutout) {
    const { buf, removed } = await cutout(src);
    note = `bg removed ${(removed * 100).toFixed(0)}%`;
    if (removed < 0.1 || removed > 0.97) note += " ⚠ check";
    img = sharp(await buf.png().toBuffer()).trim({ threshold: 1 });
  }
  const [W, H] = item.fit;
  const pad = Math.round(Math.min(W, H) * 0.03);
  await img
    .resize({ width: W - 2 * pad, height: H - 2 * pad, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 86, alphaQuality: 90, effort: 5 })
    .toFile(out);
  for (const w of item.variants ?? [])
    await sharp(out).resize({ width: w }).webp({ quality: 86, alphaQuality: 90, effort: 5 }).toFile(out.replace(".webp", `-${w}.webp`));
  if (item.favicon) await sharp(out).resize(192).png({ palette: true }).toFile(join(WEB, item.favicon));
  return { item, out, note };
}

async function sheet(group, rows) {
  const T = 220;
  const cols = 6;
  const h = Math.ceil(rows.length / cols) * (T + 30);
  const check = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * T}" height="${h}"><defs><pattern id="c" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#fff"/><rect width="10" height="10" fill="#e8eef5"/><rect x="10" y="10" width="10" height="10" fill="#e8eef5"/></pattern></defs><rect width="100%" height="100%" fill="url(#c)"/></svg>`,
  );
  const layers = [];
  for (const [n, r] of rows.entries()) {
    const x = (n % cols) * T;
    const y = Math.floor(n / cols) * (T + 30);
    layers.push({ input: await sharp(r.out).resize({ width: T - 10, height: T - 10, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), left: x + 5, top: y + 5 });
    layers.push({
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="28"><text x="4" y="19" font-family="Arial" font-size="15" fill="#2b3f5c">${r.item.id} ${r.note}</text></svg>`),
      left: x,
      top: y + T,
    });
  }
  mkdirSync(SHEETS, { recursive: true });
  await sharp(check).composite(layers).png().toFile(join(SHEETS, `${group}.png`));
}

const items = ITEMS.filter((it) => !only || only.includes(it.id));
const done = (await Promise.all(items.map(processItem))).filter(Boolean);
done.forEach((r) => console.log(`  ✔ ${r.item.id} → ${r.item.out} ${r.note}`));
const groups = Object.groupBy(done.filter((r) => !r.item.band), (r) => r.item.out.split("/")[1].replace(/\.webp$/, ""));
for (const [g, rows] of Object.entries(groups)) await sheet(g, rows);
const missing = ITEMS.filter((it) => it.out && !rawPath(it.id)).map((it) => it.id);
console.log(`${done.length} processed${missing.length ? ` · not generated yet: ${missing.join(", ")}` : ""} · sheets in assets-src/sheets/`);
