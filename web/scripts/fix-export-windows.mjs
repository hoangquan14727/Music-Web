// Next 16 `output: "export"` on Windows writes router prefetch files as nested
// folders (out/x/__next.!abc/seg/__PAGE__.txt) because it joins Windows
// backslash paths; the browser requests the flat dotted name
// (out/x/__next.!abc.seg.__PAGE__.txt) and gets a 404. Flatten them.
// No-op on Linux/macOS builds, where Next already writes flat files.
// ponytail: delete this script once Next fixes the Windows export path join.
import { readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../out", import.meta.url));
let moved = 0;

function filesUnder(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const f of filesUnder(p)) {
        renameSync(f, join(dir, `${name}.${relative(p, f).split(sep).join(".")}`));
        moved++;
      }
      rmSync(p, { recursive: true });
    } else {
      walk(p);
    }
  }
}

walk(OUT);
if (moved) console.log(`fix-export-windows: flattened ${moved} prefetch files`);
