import type {GameState} from "@src/game/types/GameState";
import type {Standing} from "@src/game/types/Standing";
import {RANKS} from "@src/game/board/BoardDimensions";
import {placed} from "@src/testing/Placed";
import {standingOf} from "@src/game/utils/StandingOf";

/**
 * The game as it stands, having already stood in this same position `times` times — what a test needs
 * to be handed a second or third standing without playing the circuit that leads there.
 *
 * `seen` is padded out to the eight entries `isRepetition` will not look below, because a position
 * cannot come round in fewer than four plies and a third standing needs two circuits. The padding is
 * real standings of positions the game is not in — one soldier more than it has — since a `Standing`
 * cannot be conjured from a string and a made-up one would not be what the guard counts.
 */
export function stoodBefore(state: GameState, times: number): GameState {
  const standing = standingOf(state);

  return {...state, seen: [...elsewhere(state, FEWEST_ENTRIES - times), ...Array<Standing>(times).fill(standing)]};
}

function elsewhere(state: GameState, count: number): readonly Standing[] {
  return RANKS.slice(0, count).map(rank =>
    standingOf({...state, pieces: [...state.pieces, placed({side: "han", type: "soldier", file: 9, rank})]}),
  );
}

/** The fewest standings `isRepetition` will look through, `game/repetition/IsRepetition.ts`. */
const FEWEST_ENTRIES = 8;
