import type {CustomStyle} from "@src/redux/custom-styles/types/CustomStyle";
import {merged} from "@src/redux/custom-styles/joining/merged/Merged";

/**
 * Every style a save carries, merged into the player's own in turn — so two styles of one name in the same
 * save both arrive, the second seeing the first already there and taking a number.
 */
export function mergedAll<Style extends CustomStyle>(
  styles: readonly Style[],
  incoming: readonly Style[],
  builtIns: readonly string[],
): readonly Style[] {
  return incoming.reduce<readonly Style[]>((merging, style) => merged(merging, style, builtIns), styles);
}
