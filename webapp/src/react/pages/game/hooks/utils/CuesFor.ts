import type {Cue} from "@src/audio/types/Cue";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {RecordChange} from "@src/game/record/types/RecordChange";
import type {Transition} from "@src/game/record/types/Transition";
import {isInCheck} from "@src/game/check/IsInCheck";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * The sounds one change to the game makes: first what was done — a piece set down, a piece taken, a
 * turn rested, a bikjang called — then what that did, if it did anything — a check, or the end.
 *
 * **What was done is struck by what it cost.** A capture is one sound struck harder the more the
 * taken piece was worth, so a soldier going is a sharp tap and a chariot going is a blow; a quiet move
 * is softer than any capture. That is the whole of the variety a sixty-move game can bear without
 * the common sound wearing thin.
 *
 * **Undoing is one quiet sound, whatever it undid.** A take-back is a player correcting themselves,
 * and sounding the check or the mate it steps back out of again would be the game shouting about
 * something that is no longer true. A new deal is its own sound for the same reason.
 *
 * Check and the end are read off the position the change arrived at, by the engine — never worked out
 * here — so a sound can never announce a check the board does not show.
 */
export function cuesFor(change: RecordChange, after: GameState): readonly Cue[] {
  if (change.direction === "dealt") return [{name: "dealt", weight: 1}];

  if (change.direction === "takenBack") return [{name: "turnTakenBack", weight: 1}];

  return [...doneBy(change.transition), ...consequencesIn(after)];
}

function doneBy(transition: Transition | undefined): Cue[] {
  if (!transition) return [];

  switch (transition.kind) {
    case "moved":
      return transition.taken
        ? [{name: "pieceTaken", weight: TAKEN_WEIGHTS[transition.taken.type]}]
        : [{name: "piecePlaced", weight: PLACED_WEIGHT}];
    case "passed":
      return [{name: "turnRested", weight: 1}];
    case "bikjangCalled":
      return [{name: "bikjang", weight: 1}];
  }
}

function consequencesIn(after: GameState): Cue[] {
  const outcome = outcomeOf(after);

  switch (outcome.kind) {
    case "checkmate":
      return [{name: "checkmate", weight: 1}];
    case "pointsWin":
      return [{name: "pointsWin", weight: 1}];
    case "bikjang":
      // A casual bikjang can only be reached by calling one, and the call has already been sounded.
      return [];
    case "undecided":
      return isInCheck(after, after.sideToMove) ? [{name: "check", weight: 1}] : [];
  }
}

/** Softer than the lightest capture, so a capture always stands out from a move. */
const PLACED_WEIGHT = 0.5;

/** In the order of the pieces' own values — `scoring/MaterialFor.ts` — from a sharp tap to a blow. */
const TAKEN_WEIGHTS: Record<PieceType, number> = {
  general: 1,
  chariot: 1,
  cannon: 0.8,
  horse: 0.7,
  elephant: 0.6,
  guard: 0.6,
  soldier: 0.55,
};
