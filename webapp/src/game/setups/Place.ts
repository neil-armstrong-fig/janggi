import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {canPlace} from "@src/game/setups/CanPlace";

/**
 * The phase after an army has laid its back rank out, with the other army's choice and the format
 * exactly as they were.
 *
 * A later choice replaces an earlier one rather than joining it — a player has one back rank, and
 * where a second thought is allowed at all it is a change of mind, not an addition.
 *
 * **Throws** when the army may not lay out now, exactly as `pass` and `callBikjang` throw: the
 * caller has just been told by `canPlace`. The two scored refusals get their own messages, because
 * they are different mistakes — Han reaching for a second arrangement, and Cho answering a board
 * Han has not laid out yet.
 */
export function place(phase: SetupPhase, side: Side, setup: Setup): SetupPhase {
  if (!canPlace(phase, side)) throw new Error(refusalFor(side));

  return side === "han" ? {...phase, hanSetup: setup} : {...phase, choSetup: setup};
}

/** Only ever reached in a scored game, `canPlace` refusing nobody in a casual one. */
function refusalFor(side: Side): string {
  if (side === "han") return "Han may not lay out again once it has: 馬와 象의 배치를 바꿔 다시 차릴 수 없다";

  return "In a scored game han lays out first, and cho answers what it can see";
}
