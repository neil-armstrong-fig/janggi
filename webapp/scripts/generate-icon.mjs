/**
 * Draws `public/icon.svg` from scratch — no font, no traced artwork.
 *
 * A simplified 태극기: white field, the taegeuk in the middle, the four trigrams around it, and the
 * syllables 장기 lettered across the taegeuk. Every shape is built here from coordinates, so the
 * icon carries no font and renders identically on every platform whatever Hangul fonts a device
 * happens to have.
 *
 * It has two jobs at very different sizes — a launcher tile on a phone home screen and a ~16px
 * favicon in a browser tab — which drives most of the proportions below:
 *
 * - Everything sits inside `SAFE_RADIUS`, the 80% circle a maskable launcher icon may be cropped
 *   to, so no trigram loses a corner to a round mask.
 * - The lettering is white on the saturated red and blue, the strongest contrast available here,
 *   and the strokes are deliberately heavy so they survive being scaled to a favicon.
 *
 * Run with `pnpm --filter @janggi/webapp generate-icon`.
 */
import {writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";

const OUTPUT = fileURLToPath(new URL("../public/icon.svg", import.meta.url));

const SIZE = 512;
const CENTER = SIZE / 2;

const FIELD = "#ffffff";
const RED = "#cd2e3a";
const BLUE = "#0047a0";
const BLACK = "#12100f";
const LETTERING = "#ffffff";

/** The area a maskable launcher icon is guaranteed to keep: the middle 80%. Nothing may cross it. */
const SAFE_RADIUS = SIZE * 0.4;

const TAEGEUK_RADIUS = 124;

/**
 * The taegeuk turned so red sits toward the upper left and blue the lower right, as on the flag.
 * The flag's own tilt follows its 3:2 diagonal; a square icon's diagonal is 45°.
 */
const TAEGEUK_TILT = -45;

/** Trigram bars, and how far their centres sit from the middle of the icon. */
const BAR_LENGTH = 76;
const BAR_THICKNESS = 13;
const BAR_PITCH = 21;
const BAR_BREAK = 14;
const TRIGRAM_DISTANCE = 160;

/** Stroke weight of the lettering, in the grid units the syllables below are drawn in. */
const PEN = 10;

/** Grid units between the left edge of 장 and the left edge of 기. */
const ADVANCE = 104;

/** How much of the taegeuk the lettering reaches across, corner to corner. */
const FILL = 0.94;

writeFileSync(OUTPUT, renderIcon(), "utf8");

/** The finished SVG document: field, taegeuk, trigrams, then the lettering over the top. */
function renderIcon() {
  const strokes = [...jang(), ...translate(gi(), ADVANCE, 0)];

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="장기 (Janggi)">`,
    `  <rect width="${SIZE}" height="${SIZE}" fill="${FIELD}" />`,
    ...taegeuk(),
    ...trigrams(),
    `  <g transform="${fitToTaegeuk(strokes)}"`,
    `     fill="none" stroke="${LETTERING}" stroke-width="${PEN}" stroke-linecap="round" stroke-linejoin="round">`,
    ...strokes.map(stroke => `    ${element(stroke)}`),
    `  </g>`,
    `</svg>`,
    ``,
  ].join("\n");
}

/**
 * The taegeuk: a blue disc with the red half laid over it.
 *
 * The red outline runs along the top of the circle and back through the middle on two half-size
 * arcs curving opposite ways, which is what makes the dividing line an S rather than a diameter.
 */
function taegeuk() {
  const r = TAEGEUK_RADIUS;
  const half = r / 2;

  const red = [
    `M ${CENTER - r} ${CENTER}`,
    `A ${r} ${r} 0 0 1 ${CENTER + r} ${CENTER}`,
    `A ${half} ${half} 0 0 1 ${CENTER} ${CENTER}`,
    `A ${half} ${half} 0 0 0 ${CENTER - r} ${CENTER}`,
    `Z`,
  ].join(" ");

  return [
    `  <g transform="rotate(${TAEGEUK_TILT} ${CENTER} ${CENTER})">`,
    `    <circle cx="${CENTER}" cy="${CENTER}" r="${r}" fill="${BLUE}" />`,
    `    <path d="${red}" fill="${RED}" />`,
    `  </g>`,
  ];
}

/**
 * The four trigrams, in their flag positions: 건 upper left, 리 lower left, 감 upper right, 곤
 * lower right. Each is drawn flat and then swung out to its corner, which turns its bars to face
 * the taegeuk the way the flag's do.
 *
 * All four happen to read the same from either end, so there is no inner-to-outer ordering to get
 * wrong — only which bars are whole and which are split.
 */
function trigrams() {
  const solid = true;
  const broken = false;

  return [
    ["건", 135, [solid, solid, solid]],
    ["리", 45, [solid, broken, solid]],
    ["감", 225, [broken, solid, broken]],
    ["곤", -45, [broken, broken, broken]],
  ].flatMap(([name, angle, bars]) => [
    `  <g transform="translate(${CENTER} ${CENTER}) rotate(${angle}) translate(0 ${TRIGRAM_DISTANCE})" fill="${BLACK}">`,
    `    <title>${name}</title>`,
    ...bars.flatMap((whole, index) => bar(whole, (index - 1) * BAR_PITCH)),
    `  </g>`,
  ]);
}

/** One bar of a trigram, centred on the group's origin and offset along it by `y`. */
function bar(whole, y) {
  const top = y - BAR_THICKNESS / 2;
  const half = (BAR_LENGTH - BAR_BREAK) / 2;

  const rect = (x, width) => `    <rect x="${x}" y="${top}" width="${width}" height="${BAR_THICKNESS}" rx="3" />`;

  return whole
    ? [rect(-BAR_LENGTH / 2, BAR_LENGTH)]
    : [rect(-BAR_LENGTH / 2, half), rect(BAR_BREAK / 2, half)];
}

/** 장 — ㅈ over ㅇ down the left, ㅏ standing full height beside them. */
function jang() {
  return [
    // ㅈ: a roof, then the two legs that fall away from its middle.
    polyline([
      [5, 15],
      [55, 15],
    ]),
    polyline([
      [30, 15],
      [6, 50],
    ]),
    polyline([
      [30, 15],
      [54, 50],
    ]),
    // ㅏ: the upright, with its arm reaching out to the right — an arm on the left would read 정.
    polyline([
      [74, 5],
      [74, 95],
    ]),
    polyline([
      [74, 42],
      [96, 42],
    ]),
    // ㅇ: the batchim, tucked under ㅈ.
    ring(30, 76, 19),
  ];
}

/** 기 — ㄱ hooking over the top left, ㅣ standing full height on the right. */
function gi() {
  return [
    polyline([
      [6, 16],
      [64, 16],
      [50, 66],
    ]),
    polyline([
      [82, 5],
      [82, 95],
    ]),
  ];
}

/**
 * Scales and centres the lettering on the taegeuk.
 *
 * The fit is on the bounding box's diagonal rather than its width, so the corners — not the edges —
 * are what stop short of the taegeuk's rim, which is what the eye actually reads as the margin.
 */
function fitToTaegeuk(strokes) {
  const {minX, minY, maxX, maxY} = bounds(strokes);
  const [halfWidth, halfHeight] = [(maxX - minX) / 2, (maxY - minY) / 2];

  const scale = (TAEGEUK_RADIUS * FILL) / Math.hypot(halfWidth, halfHeight);

  const x = CENTER - (minX + halfWidth) * scale;
  const y = CENTER - (minY + halfHeight) * scale;
  return `translate(${round(x)} ${round(y)}) scale(${round(scale)})`;
}

/** The extent of the drawn ink, which is the geometry grown by half the pen on every side. */
function bounds(strokes) {
  const nib = PEN / 2;
  const spread = stroke =>
    stroke.kind === "circle"
      ? [
          [stroke.cx - stroke.r - nib, stroke.cx + stroke.r + nib],
          [stroke.cy - stroke.r - nib, stroke.cy + stroke.r + nib],
        ]
      : [
          stroke.points.flatMap(([x]) => [x - nib, x + nib]),
          stroke.points.flatMap(([, y]) => [y - nib, y + nib]),
        ];

  const xs = strokes.flatMap(stroke => spread(stroke)[0]);
  const ys = strokes.flatMap(stroke => spread(stroke)[1]);

  return {minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys)};
}

function polyline(points) {
  return {kind: "polyline", points};
}

function ring(cx, cy, r) {
  return {kind: "circle", cx, cy, r};
}

/** Shifts a syllable's strokes into its slot on the line. */
function translate(strokes, dx, dy) {
  return strokes.map(stroke =>
    stroke.kind === "circle"
      ? ring(stroke.cx + dx, stroke.cy + dy, stroke.r)
      : polyline(stroke.points.map(([x, y]) => [x + dx, y + dy])),
  );
}

function element(stroke) {
  if (stroke.kind === "circle") {
    return `<circle cx="${stroke.cx}" cy="${stroke.cy}" r="${stroke.r}" />`;
  }

  const [start, ...rest] = stroke.points;
  const d = [`M${start[0]} ${start[1]}`, ...rest.map(([x, y]) => `L${x} ${y}`)].join(" ");
  return `<path d="${d}" />`;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}
