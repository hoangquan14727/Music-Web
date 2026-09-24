// Prompts for every AI-generated image (Gemini). Edit a prompt, then regenerate
// just that image:  node --env-file=.env.local scripts/gen-images.mjs --only <id>
// refs: "ref/<file>" = crop of the mockup; "raw:<id>" = an image generated earlier
// (anchors keep characters and style consistent across the whole set).

export const STYLE =
  "Children's picture-book illustration in EXACTLY the same art style as the reference images (a Vietnamese kindergarten website mockup): " +
  "2D digital cartoon, soft pastel colours, rounded chubby shapes, clean smooth dark outlines of even medium weight, soft cel shading with gentle highlights, " +
  "cute friendly faces with rosy cheeks, warm happy mood, polished and detailed but uncluttered. " +
  "Absolutely no text, no letters, no numbers, no watermark, no border, no frame.";

export const ISOLATED =
  "Show ONE isolated subject group centred on a plain, flat, pure white (#FFFFFF) background: no scenery, no ground plane, no cast shadow, " +
  "and a generous empty white margin on all four sides.";

const SOUND_CUE = "Add 2–3 small blue curved sound-wave arcs next to where the sound comes from.";
const KIDS = "Children are Vietnamese preschoolers with dark hair, drawn in the same style as the girl in the references.";

// fit: output box in px (about 2× the largest display size); cutout: remove the
// white background; variants: extra smaller widths for srcset (phones).
const sound = (id, prompt, extra = []) => ({
  id,
  out: `images/sounds/${id}.webp`,
  aspect: "1:1",
  size: "1K",
  refs: ["raw:chim-hot", "ref/featured.png", ...extra],
  cutout: true,
  fit: [512, 512],
  prompt: `${prompt} ${SOUND_CUE}`,
});

export const ITEMS = [
  // ---- anchors (generated first; later images use them as references)
  // Hero = scenery background + 3 cut-out layers placed by CSS (the model can't
  // reliably leave an empty title area in a single picture).
  {
    id: "hero-scene",
    out: "images/banner/scene.webp",
    aspect: "3:2",
    size: "1K",
    refs: ["ref/banner.png"],
    cutout: false,
    band: [0.42, 0.97], // keep this vertical slice (hills + lower sky)
    prompt:
      "Background scenery only for a wide website banner, same style and colours as the reference: a light-blue sky with a few fluffy white clouds, " +
      "gentle rolling green hills with small flowers and grass tufts across the whole bottom, round green trees only at the far left and far right edges, " +
      "and a SMALL cottage with a coral roof and a little wooden fence tucked at the very right edge (x 88–100%, partly cut by the edge). Everything from x 10% to 85% is open sky and grass only. " +
      "NO characters, NO animals, NO headphones, NO rainbow, NO sun, NO text.",
  },
  {
    id: "hero-girl",
    out: "images/banner/girl.webp",
    aspect: "3:2",
    size: "1K",
    refs: ["raw:characters", "ref/girl-rabbit.png"],
    cutout: true,
    fit: [900, 560],
    variants: [480],
    prompt: `${"Show ONE isolated subject group on a plain, flat, pure white (#FFFFFF) background, no scenery, no cast shadow, generous white margin."} The little Vietnamese girl from the references (big yellow sun hat with a pink ribbon, pink polka-dot dress) lying on her tummy on a small grass tuft, chin resting on her hands, feet up in the air, smiling happily, with the small white rabbit sitting next to her on the right, and two small music notes above.`,
  },
  {
    id: "hero-headphones",
    out: "images/banner/headphones.webp",
    aspect: "1:1",
    size: "1K",
    refs: ["ref/banner.png", "raw:chim-hot"],
    cutout: true,
    fit: [600, 600],
    variants: [360],
    prompt: "Show ONE isolated subject group on a plain, flat, pure white (#FFFFFF) background, no scenery, generous white margin. Big glossy blue-and-pink over-ear headphones with a yellow star on one ear cup, floating in front of a soft pastel rainbow arc, with three small pink, blue and yellow music notes around.",
  },
  {
    id: "hero-sun",
    out: "images/banner/sun.webp",
    aspect: "1:1",
    size: "1K",
    refs: ["ref/banner.png"],
    cutout: true,
    fit: [320, 320],
    prompt: "Show ONE isolated subject on a plain, flat, pure white (#FFFFFF) background, generous white margin. A cute smiling yellow sun with rosy cheeks and short rounded rays.",
  },
  {
    id: "characters",
    out: null, // anchor only, not shipped
    aspect: "16:9",
    size: "1K",
    refs: ["ref/girl-rabbit.png", "ref/logo.png", "ref/strip-mascot.png", "ref/cta.png"],
    cutout: false,
    prompt:
      `${ISOLATED} A character reference sheet with three characters side by side, full body, evenly spaced: ` +
      "(1) the little Vietnamese girl from the references — dark hair, big yellow sun hat with a pink ribbon, pink dress — standing and smiling; " +
      "(2) the white rabbit with pink inner ears, sitting; (3) the cute fluffy white cloud mascot wearing blue-and-pink headphones, with tiny arms, happy closed eyes and rosy cheeks.",
  },
  sound("chim-hot", "A cute round yellow-and-orange songbird perched on a short leafy branch, beak open, singing, with 2–3 small blue music notes floating from its beak."),

  // ---- tự nhiên
  sound("mua-roi", "A friendly grey-blue rain cloud with a gentle smile, big round raindrops falling into a small puddle with splashes."),
  sound("gio-thoi", "A playful wind: a puffy cloud face blowing swirly air lines that make a small round tree bend and a few leaves fly."),
  sound("sam", "A friendly lilac storm cloud (not scary) with a bright yellow zig-zag lightning bolt; no rain."),
  sound("suoi-chay", "A little clear-blue stream flowing between smooth round stones and grass tufts, small ripples and a tiny orange fish jumping."),
  sound("ga-gay", "A proud rooster with a red comb and colourful tail feathers, standing and crowing with its beak wide open."),
  sound("cho-sua", "A cute brown-and-cream puppy with floppy ears, sitting and barking with its mouth open."),
  sound("meo-keu", "A cute orange-and-cream tabby cat sitting, mouth open meowing."),
  sound("vit-keu", "A cute white duck with a yellow-orange beak quacking, standing on a tiny patch of grass. No pond, no water, no background scenery."),

  // ---- môi trường xung quanh
  sound("coi-o-to", "A small rounded family car in soft blue seen from the front three-quarter view, honking its horn."),
  sound("xe-may", "A Vietnamese motor scooter (xe tay ga) seen from the side with a rider wearing a helmet, small motion lines behind.", ["raw:characters"]),
  sound("xe-cuu-thuong", "A white ambulance van with a flashing blue-and-red siren light on the roof and a pink heart symbol on the side (no red cross), siren sound arcs."),
  sound("may-bay", "A chubby friendly passenger airplane flying past small clouds."),
  sound("tau-hoa", "A small friendly train engine with two colourful carriages on tracks, puffs of steam from the chimney."),
  sound("chuong-xe-dap", "A shiny silver bicycle bell mounted on a SHORT piece of red handlebar, with a small child's hand ringing it. The whole object is fully inside the frame with a wide white margin; nothing touches the edges.", ["raw:characters"]),
  sound("cho-dong-nguoi", "A busy but cheerful Vietnamese market stall with fruit baskets and an awning, a seller wearing a conical nón lá hat and two shoppers chatting.", ["raw:characters"]),
  sound("san-truong", `A Vietnamese kindergarten playground with a colourful slide and a swing, three small children playing happily. ${KIDS}`, ["raw:characters"]),

  // ---- vật dụng
  sound("go-cua", "A wooden front door with a small child's hand knocking on it, knock marks.", ["raw:characters"]),
  sound("chuong-dong-ho", "A red twin-bell alarm clock ringing and shaking, with a cute face on the clock."),
  sound("thia-cham-bat", "A small ceramic rice bowl with a blue pattern and a metal spoon tapping its rim, clink marks."),
  sound("keo-khoa", "A child's zip-up jacket with the zipper being pulled up, the zipper pull highlighted.", ["raw:characters"]),
  sound("dien-thoai-reo", "A retro landline desk telephone with its handset shaking because it is ringing."),
  sound("phach-tre", "Two Vietnamese bamboo clappers (phách tre) striking each other, bamboo segments clearly visible."),
  sound("trong-lac", "A small round tambourine with shiny jingles being shaken, shaking lines."),
  sound("xuc-xac", "A colourful baby rattle (a round ball on a handle) being shaken."),

  // ---- hoạt động quen thuộc
  sound("vo-tay", `Two small child hands clapping with little burst marks. ${KIDS}`, ["raw:characters"]),
  sound("tre-choi-dua", `Two happy Vietnamese preschool children playing tag and laughing. ${KIDS}`, ["raw:characters"]),
  sound("buoc-chay", `A preschool child running happily, side view, with speed lines and small footprints. ${KIDS}`, ["raw:characters"]),
  sound("dap-bong", `A preschool child bouncing a red-and-yellow ball. ${KIDS}`, ["raw:characters"]),
  sound("danh-rang", `A smiling preschool child brushing their teeth with foam bubbles. ${KIDS}`, ["raw:characters"]),
  sound("rua-tay", "Two small hands washing under a running tap with soap bubbles."),
  sound("tieng-cuoi", `A preschool child laughing heartily with eyes closed and a big open smile, little joy marks. ${KIDS}`, ["raw:characters"]),
  sound("an-tao", `A preschool child biting a crunchy red apple, the bite mark visible, crunch marks. ${KIDS}`, ["raw:characters"]),

  // ---- topic scenes (recreate the mockup's 5 topic-card illustrations in high quality)
  ...[
    ["tu-nhien", "the FIRST card (nature): a small pond, two round trees and a blue bird flying"],
    ["moi-truong-xung-quanh", "the SECOND card (surroundings): a small house, an orange truck/car on a short road, trees"],
    ["vat-dung", "the THIRD card (household objects): a golden bell, a blue teacup and a spoon"],
    ["hoat-dong-quen-thuoc", "the FOURTH card (activities): three happy Vietnamese children playing and jumping"],
    ["dac-tinh-am-thanh", "the FIFTH card (sound qualities): a big purple music note with small yellow stars"],
  ].map(([id, what]) => ({
    id: `topic-${id}`,
    out: `images/topics/${id}.webp`,
    aspect: "16:9",
    size: "1K",
    refs: ["ref/topics.png", "raw:chim-hot", "raw:characters"],
    cutout: true,
    fit: [640, 320],
    prompt: `${ISOLATED} Recreate, in high quality, the illustration shown on ${what} in the first reference (ignore the card, the title text and the arrow button). Small vignette with a little grass patch under it.`,
  })),

  // ---- CTA cards (recreate the 4 characters of the mockup's bottom cards)
  ...[
    ["tro-choi", "the FIRST card: a smiling girl wearing pink headphones holding a tablet, with music notes"],
    ["thu-vien-nhac", "the SECOND card: a small child sleeping peacefully on a pillow next to a white bunny plush, music notes floating"],
    ["goc-giao-vien", "the THIRD card: a friendly young Vietnamese female teacher holding a book and pointing at a small green chalkboard. The chalkboard shows ONLY three tiny chalk drawings — a flower, a star and a music note — and absolutely NO letters, NO numbers, NO plus signs, NO writing of any kind"],
    ["goc-sinh-vien", "the FOURTH card: a young Vietnamese university student at a desk with an open laptop and a small plant"],
  ].map(([id, what]) => ({
    id: `cta-${id}`,
    out: `images/cta/${id}.webp`,
    aspect: "4:3",
    size: "1K",
    refs: ["ref/cta.png", "raw:characters"],
    cutout: true,
    fit: [432, 360],
    prompt: `${ISOLATED} Recreate, in high quality, the character illustration from ${what} in the first reference (ignore the card, texts and buttons).`,
  })),

  // ---- game cards
  ...[
    ["nghe-chon-hinh", "a big cute cartoon ear with blue sound arcs above three small picture cards (a bird, a car, a bell)"],
    ["noi-am-thanh-hinh-anh", "a cute speaker and a picture card of a duck joined by a dotted curved line with a little heart in the middle"],
    ["doan-am-thanh", "the cloud mascot with headphones in a thinking pose next to a big pink question-mark shaped bubble (drawn as a shape, not a letter)"],
    ["phan-biet-am-thanh", "a big elephant and a tiny mouse on the two pans of a balance scale, a big sound arc near the elephant and a tiny one near the mouse"],
    ["on-tap-nhanh", "a golden star medal with a smiling face surrounded by music notes and small stars"],
  ].map(([id, what]) => ({
    id: `game-${id}`,
    out: `images/games/${id}.webp`,
    aspect: "1:1",
    size: "1K",
    refs: ["raw:chim-hot", "raw:characters"],
    cutout: true,
    fit: [512, 512],
    prompt: `${ISOLATED} ${what}.`,
  })),

  // ---- mascot poses + logo
  ...[
    ["happy", "cheering with both tiny arms up, surrounded by small stars and confetti"],
    ["listening", "eyes closed, one tiny hand cupped behind its ear, listening carefully, a few blue sound arcs"],
    ["confused", "looking puzzled but cute, head tilted, two small question-mark shapes floating (drawn shapes, not letters)"],
    ["strip", "waving hello happily, with two small music notes"],
  ].map(([id, what]) => ({
    id: `mascot-${id}`,
    out: `images/mascot/${id}.webp`,
    aspect: "1:1",
    size: "1K",
    refs: ["raw:characters", "ref/logo.png", "ref/strip-mascot.png"],
    cutout: true,
    fit: [512, 512],
    prompt: `${ISOLATED} The fluffy white cloud mascot wearing blue-and-pink headphones (exactly the one in the references), ${what}.`,
  })),
  {
    id: "logo",
    out: "images/logo.webp",
    aspect: "1:1",
    size: "1K",
    refs: ["ref/logo.png", "raw:characters"],
    cutout: true,
    fit: [256, 256],
    favicon: "src/app/icon.png",
    prompt: `${ISOLATED} A simple, bold logo version of the cloud mascot wearing blue-and-pink headphones, front view, happy closed eyes, rosy cheeks, small music notes. Clear shapes that still read at 48 px.`,
  },

  // ---- compare-game concept pictures
  ...[
    ["to", "a big friendly elephant trumpeting loudly with big sound arcs (means LOUD)"],
    ["nho", "a tiny mouse squeaking softly with one very small sound arc (means SOFT)"],
    ["nhanh", "a white rabbit running fast with speed lines (means FAST)"],
    ["cham", "a green turtle walking slowly (means SLOW)"],
    ["cao", "a small blue bird singing high with music notes going up (means HIGH pitch)"],
    ["thap", "a big brown bear humming low with music notes going down (means LOW pitch)"],
    ["chuong", "a golden hand bell ringing"],
    ["trong", "a small red drum with two drumsticks"],
    ["giong", "two IDENTICAL golden hand bells side by side (means SAME)"],
    ["khac", "a golden hand bell next to a small red drum (means DIFFERENT)"],
  ].map(([id, what]) => ({
    id: `pair-${id}`,
    out: `images/pairs/${id}.webp`,
    aspect: "1:1",
    size: "1K",
    refs: ["raw:chim-hot"],
    cutout: true,
    fit: [512, 512],
    prompt: `${ISOLATED} ${what}.`,
  })),
  {
    id: "pair-to-nho-feature",
    out: "images/pairs/to-nho-feature.webp",
    aspect: "16:9",
    size: "1K",
    refs: ["raw:chim-hot"],
    cutout: true,
    fit: [640, 320],
    prompt: `${ISOLATED} A big red drum with big blue sound arcs next to a tiny red drum with one tiny sound arc (loud vs soft).`,
  },

  // ---- decorative stickers (replace generic icons in section titles and CTA cards)
  ...[
    ["star", "a glossy golden star"],
    ["heart", "a glossy pink heart"],
    ["soundwave", "a blue sound wave: FIVE separate rounded vertical bars of different heights standing side by side on one baseline, short-tall-tallest-tall-short, like an audio equaliser; the bars do not touch each other and do not look like a hand"],
    ["gamepad", "a pink game controller"],
    ["music", "a blue double music note"],
    ["teacher", "a purple round badge showing a friendly female teacher next to a small green chalkboard that has ONLY a tiny chalk flower and a star drawn on it — absolutely NO letters, NO numbers, NO writing of any kind"],
    ["student", "a teal graduation cap with a tassel"],
  ].map(([id, what]) => ({
    id: `sticker-${id}`,
    out: `images/stickers/${id}.webp`,
    aspect: "1:1",
    size: "1K",
    refs: ["ref/mockup-full.png"],
    cutout: true,
    fit: [192, 192],
    prompt: `${ISOLATED} A single cute, slightly glossy cartoon sticker icon of ${what}, like the small colourful icons in the reference mockup (the star beside a section title, the heart in the pink slogan strip). Simple, bold, readable at 40 px.`,
  })),
];
