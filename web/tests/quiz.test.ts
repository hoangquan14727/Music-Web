import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRound, mulberry32 } from "../src/lib/quiz.ts";
import { fold, matches } from "../src/lib/text.ts";
import sounds from "../src/data/sounds.json" with { type: "json" };

const confusable = (a: string, b: string) => {
  const A = sounds.find((s) => s.id === a)!;
  const B = sounds.find((s) => s.id === b)!;
  return A.confusable.includes(b) || B.confusable.includes(a);
};

test("round: unique answers, 3 distinct options, never two confusable sounds", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const round = buildRound(sounds, { count: 6, choices: 3, rng: mulberry32(seed) });
    assert.equal(round.length, 6);
    assert.equal(new Set(round.map((q) => q.answerId)).size, 6);
    for (const q of round) {
      assert.equal(q.optionIds.length, 3);
      assert.equal(new Set(q.optionIds).size, 3);
      assert.ok(q.optionIds.includes(q.answerId));
      for (const a of q.optionIds) for (const b of q.optionIds) if (a !== b) assert.ok(!confusable(a, b), `${a} vs ${b}`);
    }
  }
});

test("round: group filter keeps every answer in that group and still has 3 options", () => {
  for (const g of ["tu-nhien", "moi-truong-xung-quanh", "vat-dung", "hoat-dong-quen-thuoc"]) {
    const round = buildRound(sounds, { count: 6, choices: 3, group: g, rng: mulberry32(7) });
    assert.equal(round.length, 6);
    for (const q of round) {
      assert.equal(sounds.find((s) => s.id === q.answerId)!.group, g);
      assert.equal(q.optionIds.length, 3);
    }
  }
});

test("round: asking for more questions than sounds returns what exists", () => {
  const small = sounds.slice(0, 4);
  assert.equal(buildRound(small, { count: 10, choices: 3, rng: mulberry32(1) }).length, 4);
});

test("search skips filler words, needs every word, respects typed accents", () => {
  assert.ok(matches("tiếng mưa", "Mưa rơi"));
  assert.ok(matches("con cho", "Chó sủa") && matches("con cho", "Chợ đông người"));
  assert.ok(matches("con chó", "Chó sủa") && !matches("con chó", "Chợ đông người"));
  assert.ok(matches("dong vat", "Gà gáy", "Âm thanh tự nhiên", "động vật, con vật"));
  assert.ok(!matches("dong vat", "Chuông đồng hồ báo thức", "Âm thanh vật dụng"));
  assert.ok(matches("ru ngu", "Khúc hát ru (J. Brahms) Giờ ngủ trưa"));
  assert.ok(!matches("xe mưa", "Xe máy"));
  assert.ok(matches("tiếng", "Tiếng sấm")); // only fillers → search them as typed
  assert.ok(matches("kéo khóa", "Kéo khoá áo")); // new vs old tone placement
  assert.ok(!matches("?", "Mưa rơi"));
});

test("fold matches Vietnamese without accents, including đ", () => {
  assert.equal(fold("Chuông Đồng hồ"), "chuong dong ho");
  assert.ok(fold("Đập bóng").includes(fold("dap bong")));
  assert.ok(fold("Gõ cửa").includes(fold("go cua")));
});

import { buildMatchBoards, buildCompareRound, buildMixedRound, tally } from "../src/lib/quiz.ts";
import pairs from "../src/data/pairs.json" with { type: "json" };

test("match boards: distinct sounds across boards, no confusable pair on a board, images are a permutation", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const boards = buildMatchBoards(sounds, { boards: 3, size: 3, rng: mulberry32(seed) });
    assert.equal(boards.length, 3);
    const all = boards.flatMap((b) => b.soundIds);
    assert.equal(new Set(all).size, 9);
    for (const b of boards) {
      assert.deepEqual([...b.imageIds].sort(), [...b.soundIds].sort());
      for (const a of b.soundIds) for (const c of b.soundIds) if (a !== c) assert.ok(!confusable(a, c));
    }
  }
});

test("compare round: answer follows the play order; same/different kept", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const round = buildCompareRound(pairs, { count: 5, rng: mulberry32(seed) });
    assert.equal(round.length, 5);
    for (const q of round) {
      const p = pairs.find((x) => x.pairId === q.pairId)!;
      if (p.dimension === "giong-khac") assert.equal(q.answer, p.answer);
      else assert.equal(q.answer, q.order[0] === p.answer ? "first" : "second");
    }
  }
  // Over many rounds both "first" and "second" occur (not always the first sound).
  const answers = new Set(Array.from({ length: 50 }, (_, i) => buildCompareRound(pairs, { count: 5, rng: mulberry32(i) }).map((q) => q.answer)).flat());
  assert.ok(answers.has("first") && answers.has("second"));
});

test("mixed round: 3 choose + 1 match + 2 compare, no sound reused between choose and match", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const items = buildMixedRound(sounds, pairs, mulberry32(seed));
    assert.equal(items.filter((i) => i.kind === "choose").length, 3);
    assert.equal(items.filter((i) => i.kind === "match").length, 1);
    assert.equal(items.filter((i) => i.kind === "compare").length, 2);
    const chooseIds = items.flatMap((i) => (i.kind === "choose" ? [i.question.answerId] : []));
    const matchIds = items.flatMap((i) => (i.kind === "match" ? i.board.soundIds : []));
    assert.ok(chooseIds.every((id) => !matchIds.includes(id)));
  }
  assert.deepEqual(tally([{ correct: 1, total: 1 }, { correct: 2, total: 3 }]), { correct: 3, total: 4 });
});
