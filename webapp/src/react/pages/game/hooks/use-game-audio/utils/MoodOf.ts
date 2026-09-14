import type {Ending} from "@src/audio/types/Ending";
import type {GameState} from "@src/game/types/GameState";
import type {Mood} from "@src/audio/types/Mood";
import type {Outcome} from "@src/game/types/Outcome";
import {isInCheck} from "@src/game/check/IsInCheck";
import {materialFor} from "@src/game/scoring/MaterialFor";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * How a position feels to listen to: how tense, whether a general is under attack, and whether the
 * game is over.
 *
 * **Tension is material off the board**, and nothing else. Every army is dealt seventy-two points, so
 * what has gone is a fair measure of how far into the fight a game is, it can be read from any
 * position without a history — which is what lets a take-back ease the music back down — and it only
 * climbs as a game is played forward. It is eased rather than linear, and full well before the board
 * is empty: the last few captures of a game are already the most fraught, and music still building at
 * that point would have nowhere left to go.
 *
 * Check is read off the engine for the army to move, and falls silent once the game has ended — a
 * mate is an ending, not a check the music should keep worrying about.
 */
export function moodOf(game: GameState): Mood {
  const outcome = outcomeOf(game);
  const ending = endingOf(outcome);

  return {
    tension: tensionOf(game),
    inCheck: ending === "none" && isInCheck(game, game.sideToMove),
    ending,
  };
}

function tensionOf(game: GameState): number {
  const taken = (DEALT_MATERIAL * 2 - materialFor(game, "cho") - materialFor(game, "han")) / (DEALT_MATERIAL * 2);
  const progress = Math.min(1, Math.max(0, taken / FULLY_TENSE_AT));

  return progress * progress * (3 - 2 * progress);
}

function endingOf(outcome: Outcome): Ending {
  switch (outcome.kind) {
    case "undecided":
      return "none";
    case "checkmate":
    case "pointsWin":
      return "won";
    case "bikjang":
      return "drawn";
  }
}

/** What each army is dealt, in points — `scoring/MaterialFor.ts`. */
const DEALT_MATERIAL = 72;

/** The share of both armies gone by which the music is as tense as it gets. */
const FULLY_TENSE_AT = 0.6;
