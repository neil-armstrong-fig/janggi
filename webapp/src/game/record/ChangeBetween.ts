import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {RecordChange} from "@src/game/record/types/RecordChange";
import {transitionBetween} from "@src/game/record/TransitionBetween";

/**
 * What changed between two readings of a record: a turn played, taken back or played again — with
 * the turn itself — or a game dealt afresh.
 *
 * Told apart by **identity**, which is what a record promises. `undo` and `redo` move the very
 * positions `past` and `future` were holding rather than rebuilding them, so a position taken back is
 * the same object that was left behind, and a new deal shares no position with the game before it.
 *
 * A turn played again is asked about before a turn played, because it looks like one too — it also
 * leaves the position it was in on the end of `past`. What sets it apart is that it lands on the very
 * position `future` was holding, where a new turn builds one nobody has seen.
 *
 * Not a rule of janggi, any more than `undo` is; it is here beside `undo` because it reads the record
 * the way `undo` and `redo` write it, and because more than the board needs to know what just
 * happened — the sound does too, and may not reach into the page for it.
 */
export function changeBetween(before: PlayedGame, after: PlayedGame): RecordChange {
  if (after.present === before.future[0]) {
    return {direction: "replayed", transition: transitionBetween(before.present, after.present)};
  }

  if (after.past.at(-1) === before.present) {
    return {direction: "advanced", transition: transitionBetween(before.present, after.present)};
  }

  if (after.present === before.past.at(-1)) {
    return {direction: "takenBack", transition: transitionBetween(after.present, before.present)};
  }

  return {direction: "dealt", transition: undefined};
}
