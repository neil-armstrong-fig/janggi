import type {ColourParts} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/colour/types/ColourParts";

/** The CSS colour the controls' two parts make: the hex alone where it is solid, an `rgba()` where it is not. */
export function cssColourOf({hex, alpha}: ColourParts): string {
  if (alpha >= 1) return hex;

  const [red, green, blue] = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16));

  return `rgba(${red}, ${green}, ${blue}, ${Math.round(Math.max(0, alpha) * 100) / 100})`;
}
