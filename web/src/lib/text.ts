// Accent-insensitive Vietnamese matching: "dong ho" finds "Đồng hồ".
// NFD strips most marks, but đ/Đ has no decomposition, so map it by hand.
export function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

// Words teachers type that name no sound: "tiếng mưa", "con chó", "âm thanh xe".
const FILLER = new Set(["tieng", "con", "cai", "chiec", "am", "thanh"]);
const lower = (s: string) => s.normalize("NFC").toLowerCase();
const words = (s: string) => lower(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

// A word as [letters without tone mark, tone mark] (NFD), so the old and new
// tone placements compare equal: "khoá" = "khóa", "thuỷ" = "thủy".
const TONES = /[̣̀́̃̉]/g;
const split = (w: string): [string, string] => {
  const d = w.normalize("NFD");
  return [d.replace(TONES, ""), (d.match(TONES) ?? []).join("")];
};

// Every meaningful query word must start a word of ONE field (so "động vật" does
// not match "đồng hồ" + "vật dụng"). A word typed with accents must match them
// ("chó" ≠ "chợ"); one typed without matches any ("cho").
export function matches(query: string, ...fields: string[]): boolean {
  const all = words(query);
  if (!all.length) return false; // only punctuation or emoji
  const kept = all.filter((w) => !FILLER.has(fold(w)));
  const terms = (kept.length ? kept : all).map((t) => ({ t, loose: fold(t) === t, parts: split(t) }));
  return fields.some((f) => {
    const ws = words(f).map(split);
    return terms.every(({ t, loose, parts: [tb, tt] }) =>
      ws.some(([wb, wt]) => (loose ? fold(wb).startsWith(t) : wb.startsWith(tb) && (!tt || tt === wt))),
    );
  });
}
