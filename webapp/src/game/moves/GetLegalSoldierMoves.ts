import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Step} from "@src/game/board/types/Step";
import {canLandOn} from "@src/game/moves/utils/CanLandOn";
import {isInPalace} from "@src/game/board/palaces/Palaces";
import {pointAfterStep} from "@src/game/moves/utils/PointAfterStep";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {palaceDiagonalStepsAt} from "@src/game/board/palaces/PalaceDiagonals";

/**
 * Where a soldier (졸 for Cho, 병 for Han) may go: one point forward or one point to either side.
 * **Never backwards**, at any stage of the game, and there is no promotion — a soldier that reaches
 * the far edge simply has no forward move left for the rest of the game.
 *
 * Sideways from the very first move, unlike xiangqi: there is no river here to cross first.
 *
 * It moves and captures identically. See `docs/rules.md` §4.7.
 */
export function getLegalSoldierMoves(pieces: PieceLookup, from: Position, side: Side): readonly Position[] {
  const steps = [...marchingSteps(side), ...forwardPalaceDiagonalsAt(from, side)];

  return steps
    .map(step => pointAfterStep(from, step))
    .filter(to => to !== undefined)
    .filter(to => canLandOn(pieces, to, side));
}

function marchingSteps(side: Side): readonly Step[] {
  return [
    {fileStep: 0, rankStep: FORWARD_RANK_STEP[side]},
    {fileStep: -1, rankStep: 0},
    {fileStep: 1, rankStep: 0},
  ];
}

/**
 * The extra diagonals a soldier earns by standing **in the enemy palace** — and only those that
 * carry it forward. The Korea Janggi Association names the two by the clock: 1시반과 10시반, one
 * thirty and ten thirty as the soldier itself faces.
 *
 * So from the palace centre a soldier gets both far corners, from a near corner it gets the centre,
 * and from a far corner it gets nothing at all, because the only line drawn there points back the
 * way it came. Its own palace's diagonals do nothing for it.
 */
function forwardPalaceDiagonalsAt(from: Position, side: Side): readonly Step[] {
  if (!isInPalace(from, opponentOf(side))) return [];

  return palaceDiagonalStepsAt(from).filter(({rankStep}) => rankStep === FORWARD_RANK_STEP[side]);
}

/**
 * Which way is forward. Ranks run 1 to 10 down the board with Han at the top, so Han advances into
 * a rising rank and Cho into a falling one. See `docs/rules.md` §1.
 */
const FORWARD_RANK_STEP: Record<Side, number> = {
  han: 1,
  cho: -1,
};
