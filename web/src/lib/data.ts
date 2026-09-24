import groupsJson from "@/data/groups.json";
import soundsJson from "@/data/sounds.json";
import pairsJson from "@/data/pairs.json";
import musicJson from "@/data/music.json";
import suggestionsJson from "@/data/suggestions.json";

export type Group = (typeof groupsJson)[number];
export type Sound = (typeof soundsJson)[number];
export type Pair = (typeof pairsJson)[number];
export type Track = (typeof musicJson)[number];
export type Suggestion = (typeof suggestionsJson)[number];

export const groups: Group[] = groupsJson;
export const sounds: Sound[] = soundsJson;
export const pairs: Pair[] = pairsJson;
export const music: Track[] = musicJson;
export const suggestions: Suggestion[] = suggestionsJson;

export const PAIR_GROUP = "dac-tinh-am-thanh";

export const getGroup = (slug: string) => groups.find((g) => g.slug === slug);
export const soundsIn = (slug: string) => sounds.filter((s) => s.group === slug);

// Card counts come from the data, never from the mockup's example numbers.
export function countLabel(slug: string): string {
  return slug === PAIR_GROUP ? `${pairs.length} cặp âm thanh` : `${soundsIn(slug).length} âm thanh`;
}

export type Featured = { key: string; name: string; group: Group; image: string | null; srcs: string[] };

export function featured(): Featured[] {
  const single = sounds
    .filter((s) => s.featured)
    .map((s) => ({ key: s.id, name: s.name, group: getGroup(s.group)!, image: s.image, srcs: [s.audio] }));
  const pair = pairs
    .filter((p) => p.featured)
    .map((p) => ({ key: p.pairId, name: p.title, group: getGroup(PAIR_GROUP)!, image: p.image, srcs: [p.audioA, p.audioB] }));
  // Keep the homepage order the same as the topic cards.
  return [...single, ...pair].sort((a, b) => groups.indexOf(a.group) - groups.indexOf(b.group));
}

export const groupStyle = (g: Group) =>
  ({ "--g-bg": g.colors.bg, "--g-accent": g.colors.accent, "--g-ink": g.colors.ink }) as React.CSSProperties;
