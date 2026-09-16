import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import {untakenName} from "@src/redux/custom-styles/joining/untaken-name/UntakenName";

/**
 * `style` added to the end of the player's own, under a name nothing of its kind answers to — its own, or
 * its own with a number after it.
 *
 * The built-ins' names count as taken: a style of the player's own called "Neon" would be two styles under
 * one name in every picker, and the preference naming it could only find the built-in.
 */
export function added<Style extends CustomStyle>(
  styles: readonly Style[],
  style: Style,
  builtIns: readonly string[],
): readonly Style[] {
  const taken = [...builtIns, ...styles.map(existing => existing.name)];

  return [...styles, {...style, name: untakenName(style.name, taken)}];
}
