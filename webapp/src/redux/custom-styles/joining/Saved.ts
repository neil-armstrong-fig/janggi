import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import {added} from "@src/redux/custom-styles/joining/Added";

/**
 * `style` in place of the player's own style of that name, or added where there is none.
 *
 * This is what saving an edit means: somebody who opened their own "Midnight", changed a colour and saved
 * it wants that style changed, not a second one called "Midnight (2)". A built-in's name is still never
 * taken over — that goes through `added`, and comes out numbered.
 */
export function saved<Style extends CustomStyle>(
  styles: readonly Style[],
  style: Style,
  builtIns: readonly string[],
): readonly Style[] {
  if (builtIns.includes(style.name) || !styles.some(existing => existing.name === style.name)) {
    return added(styles, style, builtIns);
  }

  return styles.map(existing => (existing.name === style.name ? style : existing));
}
