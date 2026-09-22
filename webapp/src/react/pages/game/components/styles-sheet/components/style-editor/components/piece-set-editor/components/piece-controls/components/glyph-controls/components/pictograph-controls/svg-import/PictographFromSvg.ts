import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import type {Size} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/types/Size";
import type {Placement} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/svg-paths/types/Placement";
import {shapePathOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/svg-paths/ShapePathOf";
import {transformedPath} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/svg-paths/TransformedPath";

/**
 * The drawing of a piece in an SVG file, as path data in the 100-unit box a piece is drawn in — or what is
 * wrong with the file.
 *
 * Every filled shape is taken and put into one path, scaled to fit the box and centred in it, so the file
 * needs no preparation beyond being a filled drawing. What it cannot follow it says so about, rather than
 * drawing something that is not what the file shows: a `transform`, which would move shapes to somewhere this
 * does not know; and shapes that are only outlines.
 *
 * Only shapes are read. Nothing else in the file — a script, a link, an image — is looked at, kept or run.
 */
export function pictographFromSvg(text: string): Checked<string> {
  const document = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = document.documentElement;
  if (document.querySelector("parsererror") || root.localName !== "svg") {
    return refused("That is not an SVG file.");
  }

  if (document.querySelector("[transform]")) {
    return refused(
      "This SVG moves or scales its shapes with a transform, which cannot be followed. Export it with transforms applied.",
    );
  }

  const size = sizeOf(root);
  if (!size) return refused("This SVG does not say how big it is — it needs a viewBox, or a width and a height.");

  const shapes = [...document.querySelectorAll(SHAPES)].filter(shape => !shape.closest(NOT_DRAWN));
  const drawn = shapes.map(shapePathOf).filter(path => path !== undefined);
  if (drawn.length === 0) {
    return refused("This SVG has no filled shapes — paths, rectangles, circles, ellipses and polygons can be used.");
  }

  const placement = fitted(size);
  const moved = drawn.map(path => transformedPath(path, placement));
  if (moved.some(path => path === undefined)) return refused("A shape in this SVG has path data that cannot be read.");

  const data = moved.join(" ");

  return data.length > LONGEST_DRAWING
    ? refused("This drawing is too detailed to keep. Simplify it, or use fewer points.")
    : {kind: "accepted", value: data};
}

/** What the file draws on: its viewBox, or failing that its width and height. */
function sizeOf(root: Element): Size | undefined {
  const box = (root.getAttribute("viewBox") ?? "")
    .split(/[\s,]+/)
    .filter(part => part !== "")
    .map(Number);
  const [x, y, width, height] = box;
  if (box.length === 4 && [x, y, width, height].every(Number.isFinite) && (width ?? 0) > 0 && (height ?? 0) > 0) {
    return {x: x ?? 0, y: y ?? 0, width: width ?? 0, height: height ?? 0};
  }

  const wide = Number.parseFloat(root.getAttribute("width") ?? "");
  const high = Number.parseFloat(root.getAttribute("height") ?? "");

  return wide > 0 && high > 0 ? {x: 0, y: 0, width: wide, height: high} : undefined;
}

/** Scaled to fit the box whole, and centred in it on the side there is room on. */
function fitted({x, y, width, height}: Size): Placement {
  const scale = BOX / Math.max(width, height);

  return {scale, dx: (BOX - width * scale) / 2 - x * scale, dy: (BOX - height * scale) / 2 - y * scale};
}

function refused(reason: string): Checked<string> {
  return {kind: "refused", reason};
}

const SHAPES = "path, rect, circle, ellipse, polygon, polyline";

/** Where a shape is defined, to be used from elsewhere, rather than drawn where it stands. */
const NOT_DRAWN = "defs, clipPath, mask, symbol, pattern, marker";

/** The box a piece's drawing is in, which `PictographSet` describes. */
const BOX = 100;

/** As long as `Reading.path` lets a drawing be. */
const LONGEST_DRAWING = 20_000;
