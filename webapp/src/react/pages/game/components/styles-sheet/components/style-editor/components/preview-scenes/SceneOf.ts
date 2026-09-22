import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {PreviewScene} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/PreviewScene";
import type {SceneName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/SceneName";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {applyMove} from "@src/game/ApplyMove";
import {callBikjang} from "@src/game/bikjang/CallBikjang";
import {movesFrom} from "@src/game/MovesFrom";
import {newGame} from "@src/game/NewGame";
import {threatIn} from "@src/react/pages/game/components/board/utils/ThreatIn";

/**
 * A position to show a style in, and what is being done in it. Every one is the engine's own: the
 * opening with a move played, and from there only moves the rules allow — so a mark in the preview is
 * there for the reason it is on a board in play.
 *
 * - `opening` — every piece of both armies in place, and a move just made, so the last move is marked.
 * - `hints` — cho's chariot in hand, with its own soldier stepped out of its way: dots where it may go, a
 *   ring on the han soldier it would take, and a dashed ring on the horse it would land on but for.
 * - `check` — the general in check, and the chariot giving it.
 * - `bikjang` — the two generals facing down an open file, and the bikjang called.
 */
export function sceneOf(sceneName: SceneName): PreviewScene {
  return SCENES[sceneName]();
}

const SCENES: Record<SceneName, () => PreviewScene> = {
  opening: () => {
    const move: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};

    return {game: played(opening(), [move]), held: undefined, lastMove: move, threat: undefined};
  },

  hints: () => {
    const moves: readonly Move[] = [
      {from: {file: 1, rank: 7}, to: {file: 2, rank: 7}},
      {from: {file: 3, rank: 4}, to: {file: 4, rank: 4}},
    ];

    return {game: played(opening(), moves), held: {file: 1, rank: 10}, lastMove: undefined, threat: undefined};
  },

  check: () => {
    const moves: readonly Move[] = [
      {from: {file: 1, rank: 10}, to: {file: 1, rank: 9}},
      {from: {file: 5, rank: 2}, to: {file: 4, rank: 2}},
      {from: {file: 1, rank: 9}, to: {file: 4, rank: 9}},
    ];
    const gameState = played(opening(), moves);

    return {game: gameState, held: undefined, lastMove: moves.at(-1), threat: threatIn(gameState)};
  },

  bikjang: () => {
    const moves: readonly Move[] = [
      {from: {file: 5, rank: 7}, to: {file: 4, rank: 7}},
      {from: {file: 5, rank: 4}, to: {file: 4, rank: 4}},
    ];

    return {game: callBikjang(played(opening(), moves)), held: undefined, lastMove: undefined, threat: undefined};
  },
};

function opening(): GameState {
  return newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");
}

/** The game after the moves, each of which must be one the rules allow — a scene that is not a position the engine reached is a mistake here. */
function played(gameState: GameState, moves: readonly Move[]): GameState {
  return moves.reduce((state, move) => {
    if (!movesFrom(state, move.from).some(({file, rank}) => file === move.to.file && rank === move.to.rank)) {
      throw new Error(`A preview scene plays a move the rules do not allow: ${JSON.stringify(move)}`);
    }

    return applyMove(state, move);
  }, gameState);
}
