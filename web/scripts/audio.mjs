// Builds every file under public/audio/ from source recordings + synthesis.
//   node scripts/audio.mjs
// 1. Feedback sounds and the "Đặc tính" comparison pairs are synthesised here
//    (so they are CC0 by construction and the pair differences are exact).
// 2. Downloaded recordings listed in assets-src/audio-sources.*.json are trimmed,
//    faded, loudness-normalised and written as mono MP3; sounds.json/music.json
//    get their source/author/license and placeholder=false.
// 3. Any sound still without a recording gets an audible, distinct placeholder
//    tone (placeholder stays true) so games remain playable and testable.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const WEB = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(WEB, "public");
const DATA = join(WEB, "src", "data");
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const writeJson = (p, v) => writeFileSync(p, JSON.stringify(v, null, 2) + "\n");

// Speech-free everyday sounds sit at -16 LUFS; startling ones a bit lower.
const TARGET = -16;
const QUIET = { sam: -21, "xe-cuu-thuong": -21, "may-bay": -20, "coi-o-to": -19, "tau-hoa": -20 };

function run(args) {
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: ["ignore", "ignore", "inherit"] });
}

function out(rel) {
  const p = join(PUB, rel);
  mkdirSync(dirname(p), { recursive: true });
  return p;
}

const MP3 = ["-ac", "1", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "96k"];

// Synthesise from an ffmpeg aevalsrc expression, then set loudness.
function synth(rel, expr, seconds, lufs = TARGET, extra = "") {
  const af = `loudnorm=I=${lufs}:TP=-1.5:LRA=11${extra}`;
  run(["-f", "lavfi", "-i", `aevalsrc='${expr}':s=44100:d=${seconds}`, "-af", af, ...MP3, out(rel)]);
}

// Same file at a fixed gain offset — keeps the exact "to/nhỏ" difference.
function gain(fromRel, toRel, db) {
  run(["-i", join(PUB, fromRel), "-af", `volume=${db}dB`, ...MP3, out(toRel)]);
}

const drum = (period) => `sin(2*PI*(55+90*exp(-25*mod(t,${period})))*mod(t,${period}))*exp(-7*mod(t,${period}))`;
const block = (period) => `0.9*sin(2*PI*950*mod(t,${period}))*exp(-55*mod(t,${period}))`;
const bell = (f) => `0.6*sin(2*PI*${f}*t)*exp(-2.5*t)+0.25*sin(2*PI*${f * 2}*t)*exp(-3.5*t)+0.1*sin(2*PI*${f * 3}*t)*exp(-5*t)`;

function buildSynth() {
  // Feedback: happy rising arpeggio / soft, low two-note "try again" (no buzzer).
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const arp = notes.map((f, i) => `between(t,${i * 0.12},2)*0.5*sin(2*PI*${f}*(t-${i * 0.12}))*exp(-4*(t-${i * 0.12}))`).join("+");
  synth("audio/fx/dung.mp3", arp, 1.2, -18);
  synth(
    "audio/fx/thu-lai.mp3",
    `lt(t,0.3)*0.5*sin(2*PI*440*t)*exp(-5*t)+gte(t,0.3)*0.5*sin(2*PI*349.23*(t-0.3))*exp(-5*(t-0.3))`,
    0.9,
    -24,
  );

  // Silent clip used to unlock audio on iOS from the first tap.
  run(["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "0.15", ...MP3, out("audio/fx/silence.mp3")]);

  const P = "audio/dac-tinh-am-thanh";
  synth(`${P}/to-nho-trong-a.mp3`, drum(0.55), 1.65);
  gain(`${P}/to-nho-trong-a.mp3`, `${P}/to-nho-trong-b.mp3`, -14);
  synth(`${P}/nhanh-cham-go-a.mp3`, block(0.18), 1.8);
  synth(`${P}/nhanh-cham-go-b.mp3`, block(0.6), 1.8);
  synth(`${P}/cao-thap-chuong-a.mp3`, bell(1318.5), 1.4);
  synth(`${P}/cao-thap-chuong-b.mp3`, bell(261.63), 1.4);
  synth(`${P}/giong-nhau-chuong-a.mp3`, bell(659.25), 1.4);
  synth(`${P}/giong-nhau-chuong-b.mp3`, bell(659.25), 1.4);
  synth(`${P}/khac-nhau-trong-chuong-a.mp3`, drum(0.55), 1.1);
  synth(`${P}/khac-nhau-trong-chuong-b.mp3`, bell(659.25), 1.4);
}

function manifests() {
  const dir = join(WEB, "assets-src");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^audio-sources.*\.json$/.test(f))
    .flatMap((f) => readJson(join(dir, f)));
}

function buildRecordings(sounds, music) {
  const byId = new Map([...sounds, ...music].map((x) => [x.id, x]));
  let done = 0;
  for (const m of manifests()) {
    const item = byId.get(m.id);
    if (!item || m.rejected) continue;
    const src = isAbsolute(m.file) ? m.file : join(WEB, m.file);
    if (!existsSync(src)) {
      console.warn(`! ${m.id}: file not found ${m.file}`);
      continue;
    }
    const isMusic = item.category !== undefined;
    const len = Math.max(1, m.clipSec);
    const fadeIn = QUIET[m.id] ? 0.3 : 0.05;
    // High-pass removes mic rumble / mains hum found in some field recordings
    // (it would otherwise be boosted by loudnorm); thunder keeps its low end.
    const hp = isMusic ? [] : [`highpass=f=${m.id === "sam" ? 45 : 120}`];
    const af = [
      ...hp,
      `afade=t=in:d=${fadeIn}`,
      `afade=t=out:st=${Math.max(0, len - (isMusic ? 3 : 0.3))}:d=${isMusic ? 3 : 0.3}`,
      `loudnorm=I=${QUIET[m.id] ?? (isMusic ? -20 : TARGET)}:TP=-1.5:LRA=11`,
    ].join(",");
    run(["-ss", String(m.startSec), "-t", String(len), "-i", src, "-af", af, ...MP3, out(item.audio.slice(1))]);
    Object.assign(item, { source: m.pageUrl, author: m.author, license: m.license, placeholder: false });
    if (isMusic) item.duration = Math.round(len);
    done++;
  }
  return done;
}

// Distinct, obviously-fake tone pattern per missing sound (still audible for testing).
function buildPlaceholders(sounds) {
  let n = 0;
  sounds.forEach((s, i) => {
    if (!s.placeholder || existsSync(join(PUB, s.audio.slice(1)))) return;
    const f = 300 + (i % 8) * 70;
    const period = 0.25 + (i % 4) * 0.1;
    synth(s.audio.slice(1), `0.5*sin(2*PI*${f}*t)*lt(mod(t,${period}),${period / 2})`, 2, -20);
    n++;
  });
  return n;
}

const soundsPath = join(DATA, "sounds.json");
const musicPath = join(DATA, "music.json");
const sounds = readJson(soundsPath);
const music = readJson(musicPath);

buildSynth();
const recorded = buildRecordings(sounds, music);
const placeholders = buildPlaceholders(sounds);
writeJson(soundsPath, sounds);
writeJson(musicPath, music);
console.log(`synth ok · ${recorded} recordings processed · ${placeholders} placeholder tones`);
