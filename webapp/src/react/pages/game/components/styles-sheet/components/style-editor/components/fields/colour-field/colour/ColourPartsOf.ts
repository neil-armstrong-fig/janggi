import type {ColourParts} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/colour/types/ColourParts";

/**
 * A CSS colour split into the two things the controls hold, or undefined for one they cannot — a gradient,
 * a named colour, `var(…)`. Those are shown as text to be edited, which is what a colour picker would
 * otherwise flatten them to.
 *
 * Reads `#rgb`, `#rrggbb`, `#rrggbbaa`, and `rgb(…)`/`rgba(…)` with commas — the forms the built-in styles
 * are written in.
 */
export function colourPartsOf(css: string): ColourParts | undefined {
  const text = css.trim().toLowerCase();

  const short = SHORT_HEX.exec(text);
  if (short) return {hex: `#${[...(short[1] ?? "")].map(digit => digit + digit).join("")}`, alpha: 1};

  const long = LONG_HEX.exec(text);
  if (long) {
    const alpha = long[2] === undefined ? 1 : Math.round((parseInt(long[2], 16) / 255) * 100) / 100;

    return {hex: `#${long[1]}`, alpha};
  }

  const functional = FUNCTIONAL.exec(text);
  if (functional) {
    const channels = [functional[1], functional[2], functional[3]].map(channel => Number(channel));
    if (channels.some(channel => channel > 255)) return undefined;

    const alpha = functional[4] === undefined ? 1 : Number(functional[4]);
    if (alpha > 1) return undefined;

    return {hex: `#${channels.map(channel => channel.toString(16).padStart(2, "0")).join("")}`, alpha};
  }

  return undefined;
}

const SHORT_HEX = /^#([0-9a-f]{3})$/;
const LONG_HEX = /^#([0-9a-f]{6})([0-9a-f]{2})?$/;
const FUNCTIONAL = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/;
