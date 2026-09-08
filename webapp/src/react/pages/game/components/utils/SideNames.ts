import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * What an army is called on screen. The `Side` union is the game's own vocabulary — lower case,
 * never shown to anyone — and this is the one place it becomes something to read.
 *
 * Here rather than beside either caller because the pieces and the turn indicator both name an
 * army, and two copies of "Cho" is one rename away from disagreeing.
 */
export function sideName(side: Side): string {
  return SIDE_NAMES[side];
}

const SIDE_NAMES: Record<Side, string> = {han: "Han", cho: "Cho"};
