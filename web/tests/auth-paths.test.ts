import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { HOME, isPublicPath, safeNext } from "../src/lib/auth-paths.ts";

const ORIGIN = "https://tgat.example";

test("safeNext: anything off-site, public or malformed goes HOME", () => {
  for (const next of [null, undefined, "", "//evil.com", "/\\evil.com", "/\t/evil.com", "/.//evil.com", "/%2e//evil.com", "https://evil.com", "javascript:alert(1)", "/dang-nhap/", "/", "/gioi-thieu"])
    assert.equal(safeNext(next, ORIGIN), HOME, String(next));
});

test("safeNext: same-site app pages keep path, query and hash", () => {
  assert.equal(safeNext("/chu-de/?q=a#b", ORIGIN), "/chu-de/?q=a#b");
  assert.equal(safeNext("/on-tap/nghe-chon-hinh/?nhom=tu-nhien", ORIGIN), "/on-tap/nghe-chon-hinh/?nhom=tu-nhien");
  assert.equal(safeNext(`${ORIGIN}/thu-vien-nhac/`, ORIGIN), "/thu-vien-nhac/");
});

test("isPublicPath: with or without the trailing slash", () => {
  for (const p of ["/", "/gioi-thieu", "/gioi-thieu/", "/dang-nhap", "/dang-ky/", "/quen-mat-khau", "/dat-lai-mat-khau/"]) assert.ok(isPublicPath(p), p);
  for (const p of ["/trang-chu/", "/on-tap", "/chu-de/x/", "/khong-co/", "/gioi-thieu/x/"]) assert.ok(!isPublicPath(p), p);
});

test("routes: pages under (public) are public, every other page needs login", () => {
  const app = new URL("../src/app/", import.meta.url);
  const pages = readdirSync(app, { recursive: true, encoding: "utf8" }).filter((f) => /(^|[\\/])page\.tsx$/.test(f));
  assert.ok(pages.length > 5);
  for (const f of pages) {
    const dirs = f.split(/[\\/]/).slice(0, -1);
    const route = `/${dirs.filter((d) => !/^\(.*\)$/.test(d)).map((d) => (d.startsWith("[") ? "x" : d)).join("/")}/`.replace("//", "/");
    assert.equal(isPublicPath(route), dirs.includes("(public)"), `${f} → ${route}`);
  }
});
