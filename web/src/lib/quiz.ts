// Pure game logic (no imports) so it runs under `node --test` without a build step.

export type QuizSound = { id: string; group: string; confusable?: string[] };
export type Question = { answerId: string; optionIds: string[] };
export type RoundOptions = { count: number; choices: number; group?: string | null; rng: () => number };

export function shuffle<T>(items: T[], rng: () => number): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Two sounds are "confusable" if either lists the other (e.g. rain vs stream):
// never offer them side by side, since that tests luck rather than listening.
function clash(a: QuizSound, b: QuizSound): boolean {
  return !!(a.confusable?.includes(b.id) || b.confusable?.includes(a.id));
}

// Distractors come from other groups by default (clearly different sounds for
// 3–6 year olds); with a group filter they come from that group first.
function pickDistractors(answer: QuizSound, pool: QuizSound[], n: number, group: string | null, rng: () => number): QuizSound[] {
  const ok = shuffle(pool.filter((s) => s.id !== answer.id && !clash(s, answer)), rng);
  const preferred = ok.filter((s) => (group ? s.group === group : s.group !== answer.group));
  const rest = ok.filter((s) => !preferred.includes(s));
  const picked: QuizSound[] = [];
  for (const s of [...preferred, ...rest]) {
    if (picked.length === n) break;
    if (!picked.some((p) => clash(p, s))) picked.push(s);
  }
  return picked;
}

export function buildRound(pool: QuizSound[], opts: RoundOptions): Question[] {
  const group = opts.group ?? null;
  const answers = shuffle(group ? pool.filter((s) => s.group === group) : pool, opts.rng).slice(0, opts.count);
  return answers.map((answer) => {
    const others = pickDistractors(answer, pool, opts.choices - 1, group, opts.rng);
    return { answerId: answer.id, optionIds: shuffle([answer.id, ...others.map((s) => s.id)], opts.rng) };
  });
}

// ---- Nối âm thanh – hình ảnh: boards of N sounds, no two confusable on a board.
export type MatchBoard = { soundIds: string[]; imageIds: string[] };

export function buildMatchBoards(pool: QuizSound[], opts: { boards: number; size: number; group?: string | null; rng: () => number }): MatchBoard[] {
  const source = shuffle(opts.group ? pool.filter((s) => s.group === opts.group) : pool, opts.rng);
  const used = new Set<string>();
  const boards: MatchBoard[] = [];
  for (let b = 0; b < opts.boards; b++) {
    const picked: QuizSound[] = [];
    for (const s of source) {
      if (picked.length === opts.size) break;
      if (!used.has(s.id) && !picked.some((p) => clash(p, s))) picked.push(s);
    }
    if (picked.length < 2) break;
    picked.forEach((s) => used.add(s.id));
    const ids = picked.map((s) => s.id);
    boards.push({ soundIds: ids, imageIds: shuffle(ids, opts.rng) });
  }
  return boards;
}

// ---- Phân biệt âm thanh: play two sounds, child picks by the pair's criterion.
export type QuizPair = { pairId: string; dimension: string; answer: string };
export type CompareAnswer = "first" | "second" | "same" | "different";
export type CompareQuestion = { pairId: string; order: ["A", "B"] | ["B", "A"]; answer: CompareAnswer };

export function buildCompareRound(pairs: QuizPair[], opts: { count: number; rng: () => number }): CompareQuestion[] {
  const out: CompareQuestion[] = [];
  while (out.length < opts.count && pairs.length) {
    for (const p of shuffle(pairs, opts.rng)) {
      if (out.length === opts.count) break;
      // Random order so "the first one" is not always the answer.
      const order: ["A", "B"] | ["B", "A"] = opts.rng() < 0.5 ? ["A", "B"] : ["B", "A"];
      const answer: CompareAnswer =
        p.dimension === "giong-khac" ? (p.answer as CompareAnswer) : order[0] === p.answer ? "first" : "second";
      out.push({ pairId: p.pairId, order, answer });
    }
  }
  return out;
}

// ---- Ôn tập nhanh: a short mixed round (the teacher's 3–7 minute session).
export type MixedItem =
  | { kind: "choose"; question: Question }
  | { kind: "match"; board: MatchBoard }
  | { kind: "compare"; question: CompareQuestion };

export function buildMixedRound(pool: QuizSound[], pairs: QuizPair[], rng: () => number): MixedItem[] {
  const choose = buildRound(pool, { count: 3, choices: 3, rng });
  const inChoose = new Set(choose.map((q) => q.answerId));
  const board = buildMatchBoards(pool.filter((s) => !inChoose.has(s.id)), { boards: 1, size: 3, rng });
  const compare = buildCompareRound(pairs, { count: 2, rng });
  return shuffle<MixedItem>(
    [
      ...choose.map((question) => ({ kind: "choose" as const, question })),
      ...board.map((b) => ({ kind: "match" as const, board: b })),
      ...compare.map((question) => ({ kind: "compare" as const, question })),
    ],
    rng,
  );
}

// Each item reports { correct, total }; a match board counts one per pair.
export type ItemResult = { correct: number; total: number };
export function tally(results: ItemResult[]): ItemResult {
  return results.reduce((a, r) => ({ correct: a.correct + r.correct, total: a.total + r.total }), { correct: 0, total: 0 });
}

// Deterministic RNG for tests and reproducible rounds.
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
