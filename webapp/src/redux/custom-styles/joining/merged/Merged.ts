import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import {added} from "@src/redux/custom-styles/joining/Added";

/**
 * `style` added, unless the very same style is already among the player's own.
 *
 * "The very same" is every field, name included, compared as written — which is what makes loading one
 * save twice add its styles once, while a *different* style under a name already taken still arrives, as
 * a numbered one.
 */
export function merged<Style extends CustomStyle>(
  styles: readonly Style[],
  style: Style,
  builtIns: readonly string[],
): readonly Style[] {
  const written = JSON.stringify(style);

  return styles.some(existing => JSON.stringify(existing) === written) ? styles : added(styles, style, builtIns);
}
