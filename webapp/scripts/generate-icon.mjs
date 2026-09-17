/**
 * Draws the SVG favicon and raster home-screen icons from scratch — no font, no traced artwork.
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
import {deflateSync} from "node:zlib";

const PUBLIC_DIRECTORY = new URL("../public/", import.meta.url);
const SVG_OUTPUT = fileURLToPath(new URL("icon.svg", PUBLIC_DIRECTORY));

const RASTER_OUTPUTS = [
  {name: "apple-touch-icon.png", size: 180},
  {name: "icon-192.png", size: 192},
  {name: "icon-512.png", size: 512},
  {name: "maskable-icon-512.png", size: 512},
];

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

const SOLID = true;
const BROKEN = false;

const TRIGRAMS = [
  {name: "건", angle: 135, bars: [SOLID, SOLID, SOLID]},
  {name: "리", angle: 45, bars: [SOLID, BROKEN, SOLID]},
  {name: "감", angle: 225, bars: [BROKEN, SOLID, BROKEN]},
  {name: "곤", angle: -45, bars: [BROKEN, BROKEN, BROKEN]},
];

const LETTERING_STROKES = [...jang(), ...translate(gi(), ADVANCE, 0)];
const COLOURS = {
  field: rgb(FIELD),
  red: rgb(RED),
  blue: rgb(BLUE),
  black: rgb(BLACK),
  lettering: rgb(LETTERING),
};
const RED_TAEGEUK = taegeukRedOutline();
const LETTERING_TRANSFORM = letteringTransformFor(LETTERING_STROKES);

writeFileSync(SVG_OUTPUT, renderIcon(), "utf8");

const rasterImages = new Map();
for (const {name, size} of RASTER_OUTPUTS) {
  const rasterImage = rasterImages.get(size) ?? renderPng(size);
  rasterImages.set(size, rasterImage);
  writeFileSync(fileURLToPath(new URL(name, PUBLIC_DIRECTORY)), rasterImage);
}

/** The finished SVG document: field, taegeuk, trigrams, then the lettering over the top. */
function renderIcon() {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="장기 (Janggi)">`,
    `  <rect width="${SIZE}" height="${SIZE}" fill="${FIELD}" />`,
    ...taegeuk(),
    ...trigrams(),
    `  <g transform="${fitToTaegeuk(LETTERING_STROKES)}"`,
    `     fill="none" stroke="${LETTERING}" stroke-width="${PEN}" stroke-linecap="round" stroke-linejoin="round">`,
    ...LETTERING_STROKES.map(stroke => `    ${element(stroke)}`),
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
  return TRIGRAMS.flatMap(({name, angle, bars}) => [
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
  const {x, y, scale} = letteringTransformFor(strokes);

  return `translate(${round(x)} ${round(y)}) scale(${round(scale)})`;
}

function letteringTransformFor(strokes) {
  const {minX, minY, maxX, maxY} = bounds(strokes);
  const [halfWidth, halfHeight] = [(maxX - minX) / 2, (maxY - minY) / 2];

  const scale = (TAEGEUK_RADIUS * FILL) / Math.hypot(halfWidth, halfHeight);

  const x = CENTER - (minX + halfWidth) * scale;
  const y = CENTER - (minY + halfHeight) * scale;
  return {x, y, scale};
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

/**
 * A dependency-free rasterisation of the same geometry used by the SVG above. Launcher artwork has
 * to be PNG on platforms that do not use an SVG manifest icon, notably Apple's home screen. Four
 * samples along each pixel edge keep the curves and rotated bars smooth at every emitted size.
 */
function renderPng(size) {
  const samplesPerEdge = 4;
  const pixels = Buffer.alloc(size * size * 3);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sum = [0, 0, 0];

      for (let sampleY = 0; sampleY < samplesPerEdge; sampleY += 1) {
        for (let sampleX = 0; sampleX < samplesPerEdge; sampleX += 1) {
          const iconX = ((x + (sampleX + 0.5) / samplesPerEdge) * SIZE) / size;
          const iconY = ((y + (sampleY + 0.5) / samplesPerEdge) * SIZE) / size;
          const colour = colourAt(iconX, iconY);

          sum[0] += colour[0];
          sum[1] += colour[1];
          sum[2] += colour[2];
        }
      }

      const samples = samplesPerEdge ** 2;
      const offset = (y * size + x) * 3;
      pixels[offset] = Math.round(sum[0] / samples);
      pixels[offset + 1] = Math.round(sum[1] / samples);
      pixels[offset + 2] = Math.round(sum[2] / samples);
    }
  }

  return pngFrom(size, pixels);
}

function colourAt(x, y) {
  let colour = COLOURS.field;

  const taegeukPoint = rotateAround(x, y, CENTER, CENTER, -TAEGEUK_TILT);
  if (distanceBetween(taegeukPoint.x, taegeukPoint.y, CENTER, CENTER) <= TAEGEUK_RADIUS) {
    colour = COLOURS.blue;
  }
  if (insidePolygon(taegeukPoint.x, taegeukPoint.y, RED_TAEGEUK)) colour = COLOURS.red;

  if (insideTrigram(x, y)) colour = COLOURS.black;
  if (onLettering(x, y)) colour = COLOURS.lettering;

  return colour;
}

function taegeukRedOutline() {
  const half = TAEGEUK_RADIUS / 2;

  return [
    ...arcPoints(CENTER, CENTER, TAEGEUK_RADIUS, Math.PI, Math.PI * 2),
    ...arcPoints(CENTER + half, CENTER, half, 0, Math.PI),
    ...arcPoints(CENTER - half, CENTER, half, 0, -Math.PI),
  ];
}

function arcPoints(cx, cy, radius, start, end) {
  const steps = 48;

  return Array.from({length: steps + 1}, (_, index) => {
    const angle = start + ((end - start) * index) / steps;
    return {x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle)};
  });
}

function insidePolygon(x, y, points) {
  let inside = false;

  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const point = points[index];
    const previousPoint = points[previous];
    const crosses =
      point.y > y !== previousPoint.y > y &&
      x < ((previousPoint.x - point.x) * (y - point.y)) / (previousPoint.y - point.y) + point.x;

    if (crosses) inside = !inside;
  }

  return inside;
}

function insideTrigram(x, y) {
  return TRIGRAMS.some(({angle, bars}) => {
    const rotated = rotateAround(x, y, CENTER, CENTER, -angle);
    const localX = rotated.x - CENTER;
    const localY = rotated.y - CENTER - TRIGRAM_DISTANCE;

    return bars.some((whole, index) => insideBar(localX, localY, whole, (index - 1) * BAR_PITCH));
  });
}

function insideBar(x, y, whole, middle) {
  const top = middle - BAR_THICKNESS / 2;
  const half = (BAR_LENGTH - BAR_BREAK) / 2;

  if (whole) return insideRoundedRectangle(x, y, -BAR_LENGTH / 2, top, BAR_LENGTH, BAR_THICKNESS, 3);

  return (
    insideRoundedRectangle(x, y, -BAR_LENGTH / 2, top, half, BAR_THICKNESS, 3) ||
    insideRoundedRectangle(x, y, BAR_BREAK / 2, top, half, BAR_THICKNESS, 3)
  );
}

function insideRoundedRectangle(x, y, left, top, width, height, radius) {
  const nearestX = Math.max(left + radius, Math.min(x, left + width - radius));
  const nearestY = Math.max(top + radius, Math.min(y, top + height - radius));

  return distanceBetween(x, y, nearestX, nearestY) <= radius;
}

function onLettering(x, y) {
  const localX = (x - LETTERING_TRANSFORM.x) / LETTERING_TRANSFORM.scale;
  const localY = (y - LETTERING_TRANSFORM.y) / LETTERING_TRANSFORM.scale;
  const nib = PEN / 2;

  return LETTERING_STROKES.some(stroke => {
    if (stroke.kind === "circle") {
      return Math.abs(distanceBetween(localX, localY, stroke.cx, stroke.cy) - stroke.r) <= nib;
    }

    return stroke.points.slice(1).some((point, index) => {
      const previous = stroke.points[index];
      return distanceFromSegment(localX, localY, previous[0], previous[1], point[0], point[1]) <= nib;
    });
  });
}

function distanceFromSegment(x, y, startX, startY, endX, endY) {
  const dx = endX - startX;
  const dy = endY - startY;
  const lengthSquared = dx * dx + dy * dy;
  const progress = Math.max(0, Math.min(1, ((x - startX) * dx + (y - startY) * dy) / lengthSquared));

  return distanceBetween(x, y, startX + progress * dx, startY + progress * dy);
}

function rotateAround(x, y, cx, cy, degrees) {
  const angle = (degrees * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;

  return {
    x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: cy + dx * Math.sin(angle) + dy * Math.cos(angle),
  };
}

function distanceBetween(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function rgb(hex) {
  return [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

function pngFrom(size, pixels) {
  const scanlines = Buffer.alloc(size * (size * 3 + 1));

  for (let row = 0; row < size; row += 1) {
    const scanline = row * (size * 3 + 1);
    pixels.copy(scanlines, scanline + 1, row * size * 3, (row + 1) * size * 3);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(scanlines, {level: 9})),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function pngChunk(name, data) {
  const type = Buffer.from(name, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);

  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([type, data])));

  return Buffer.concat([length, type, data, checksum]);
}

function crc32(data) {
  let checksum = 0xffffffff;

  for (const byte of data) {
    checksum ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      checksum = (checksum >>> 1) ^ (checksum & 1 ? 0xedb88320 : 0);
    }
  }

  return (checksum ^ 0xffffffff) >>> 0;
}
