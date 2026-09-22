/**
 * The path data of one SVG shape, in the units the SVG is drawn in, or undefined for anything that is not a
 * filled shape this can draw: a path, a rectangle, a circle, an ellipse, a polygon or a polyline. A shape
 * that says it is not filled (`fill="none"`) is an outline, and a piece's drawing is filled.
 */
export function shapePathOf(shape: Element): string | undefined {
  if (shape.getAttribute("fill") === "none") return undefined;

  switch (shape.localName) {
    case "path":
      return shape.getAttribute("d") ?? undefined;
    case "rect":
      return rectangle(shape);
    case "circle":
      return ellipse(shape, "r", "r");
    case "ellipse":
      return ellipse(shape, "rx", "ry");
    case "polygon":
      return polygon(shape, true);
    case "polyline":
      return polygon(shape, false);
    default:
      return undefined;
  }
}

function rectangle(shape: Element): string | undefined {
  const x = length(shape, "x") ?? 0;
  const y = length(shape, "y") ?? 0;
  const width = length(shape, "width");
  const height = length(shape, "height");
  if (width === undefined || height === undefined) return undefined;

  return `M${x} ${y} h${width} v${height} h${-width} Z`;
}

/** Two arcs, the way a circle is written as a path: from the left of it round to the right and back. */
function ellipse(shape: Element, horizontal: string, vertical: string): string | undefined {
  const cx = length(shape, "cx") ?? 0;
  const cy = length(shape, "cy") ?? 0;
  const rx = length(shape, horizontal);
  const ry = length(shape, vertical);
  if (rx === undefined || ry === undefined) return undefined;

  return `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
}

function polygon(shape: Element, closed: boolean): string | undefined {
  const points = (shape.getAttribute("points") ?? "")
    .split(/[\s,]+/)
    .filter(part => part !== "")
    .map(Number);
  if (points.length < 4 || points.length % 2 !== 0 || points.some(point => !Number.isFinite(point))) return undefined;

  const [x, y, ...rest] = points;

  return `M${x} ${y} L${rest.join(" ")}${closed ? " Z" : ""}`;
}

/** An attribute that is a length in the SVG's own units — a bare number, or one with `px` after it. */
function length(shape: Element, name: string): number | undefined {
  const written = shape.getAttribute(name);
  if (written === null) return undefined;

  const match = /^\s*(-?(?:\d+\.?\d*|\.\d+))(?:px)?\s*$/.exec(written);

  return match?.[1] === undefined ? undefined : Number(match[1]);
}
