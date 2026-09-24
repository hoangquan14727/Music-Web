// Runs before every build (npm "prebuild"). Content people edit the JSON files;
// this makes a typo fail the build loudly instead of breaking a page silently.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const WEB = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(WEB, "src", "data", f), "utf8"));
const groups = read("groups.json");
const sounds = read("sounds.json");
const pairs = read("pairs.json");
const music = read("music.json");

const errors = [];
const warns = [];
const slugs = new Set(groups.map((g) => g.slug));
const PAIR_GROUP = "dac-tinh-am-thanh";

function file(path, what) {
  if (!path) return;
  if (path !== path.toLowerCase()) errors.push(`${what}: đường dẫn phải viết thường (${path})`);
  if (!existsSync(join(WEB, "public", path))) errors.push(`${what}: thiếu file public${path}`);
}

const ids = [...sounds.map((s) => s.id), ...pairs.map((p) => p.pairId), ...music.map((m) => m.id)];
ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => errors.push(`id bị trùng: ${id}`));

for (const s of sounds) {
  if (!slugs.has(s.group) || s.group === PAIR_GROUP) errors.push(`${s.id}: nhóm không hợp lệ "${s.group}"`);
  (s.confusable ?? []).forEach((c) => sounds.some((x) => x.id === c) || errors.push(`${s.id}: confusable "${c}" không tồn tại`));
  file(s.audio, s.id);
  file(s.image, `${s.id} (ảnh)`);
  if (!s.placeholder && !(s.license && s.author && s.source)) errors.push(`${s.id}: thiếu nguồn/tác giả/giấy phép`);
}
const DIMENSIONS = ["to-nho", "nhanh-cham", "cao-thap", "giong-khac"];
for (const p of pairs) {
  if (!DIMENSIONS.includes(p.dimension)) errors.push(`${p.pairId}: dimension "${p.dimension}" phải là một trong ${DIMENSIONS.join(", ")}`);
  const answers = p.dimension === "giong-khac" ? ["same", "different"] : ["A", "B"];
  if (!answers.includes(p.answer)) errors.push(`${p.pairId}: answer "${p.answer}" phải là ${answers.join(" hoặc ")}`);
  file(p.audioA, `${p.pairId} A`);
  file(p.audioB, `${p.pairId} B`);
  file(p.image, `${p.pairId} (ảnh)`);
  file(p.iconA, `${p.pairId} (icon A)`);
  file(p.iconB, `${p.pairId} (icon B)`);
}
for (const m of music) {
  file(m.cover, `${m.id} (ảnh bìa)`);
  if (!m.placeholder) {
    file(m.audio, m.id);
    if (!(m.license && m.author && m.source)) errors.push(`${m.id}: thiếu nguồn/tác giả/giấy phép`);
  }
}
for (const g of groups) file(g.image, `${g.slug} (ảnh nhóm)`);

// PDF §5: 35–45 carefully chosen sounds, not hundreds.
const total = sounds.length + pairs.length;
if (total < 35 || total > 45) warns.push(`tổng số mục âm thanh = ${total} (khuyến nghị 35–45)`);
const todo = sounds.filter((s) => s.placeholder).map((s) => s.id);
if (todo.length) warns.push(`${todo.length} âm thanh còn là placeholder: ${todo.join(", ")}`);

// Loudness must NOT be equalised inside a "to – nhỏ" pair.
function meanDb(path) {
  const r = spawnSync(ffmpeg, ["-hide_banner", "-i", join(WEB, "public", path), "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" });
  return Number(/mean_volume:\s*(-?[\d.]+)/.exec(r.stderr ?? "")?.[1]);
}
for (const p of pairs.filter((x) => x.dimension === "to-nho")) {
  const gap = Math.abs(meanDb(p.audioA) - meanDb(p.audioB));
  if (!(gap >= 8)) errors.push(`${p.pairId}: chênh lệch to–nhỏ ${Number.isNaN(gap) ? "không đo được" : gap.toFixed(1) + " dB"} (cần ≥ 8 dB)`);
}

warns.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✖ ${e}`));
  process.exit(1);
}
console.log(`✔ dữ liệu hợp lệ: ${sounds.length} âm thanh + ${pairs.length} cặp, ${music.length} bản nhạc`);
