import type {Opponent} from "@src/redux/game/types/Opponent";
import type {Outcome} from "@src/game/types/Outcome";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {RatingEvent} from "@src/react/pages/game/hooks/use-rated-game/types/RatingEvent";
import type {RecordChange} from "@src/game/record/types/RecordChange";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {outcomeOf} from "@src/game/OutcomeOf";

/** One change to the record, the record it left, who was played, and whether a rated game was in progress. */
export interface RatedChange {
  readonly change: RecordChange;
  readonly played: PlayedGame;
  readonly opponent: Opponent;
  readonly inProgress: boolean;
}

/**
 * What one change to the record means for the player's rating, if anything.
 *
 * - **A deal over a game in progress abandons it.** New game, or any dealt setting, while a rated game
 *   is still undecided — the player walked away from it, and that is a loss.
 * - **The first turn of a game against the bot starts one**, whichever army took it: the game is under
 *   way from then, and leaving it now costs something.
 * - **A turn that decides the game finishes it**, as the player's win, draw or loss.
 *
 * Nothing is read into a turn taken back or played again: against the bot neither control is offered,
 * and between two people at one device nothing is rated at all.
 */
export function ratingEventFor({change, played, opponent, inProgress}: RatedChange): RatingEvent | undefined {
  if (change.direction === "dealt") return inProgress ? {kind: "abandoned"} : undefined;

  if (change.direction !== "advanced" || opponent.name !== "Bot") return undefined;

  if (played.past.length === 1) {
    return {kind: "started", format: played.present.format, botElo: opponent.botElo, playerSide: opponent.playerSide};
  }

  const outcome = outcomeOf(played.present);
  if (!inProgress || outcome.kind === "undecided") return undefined;

  return finishedAs(outcome, opponent.playerSide);
}

function finishedAs(outcome: Exclude<Outcome, {kind: "undecided"}>, playerSide: Side): RatingEvent {
  switch (outcome.kind) {
    case "checkmate":
      return {kind: "finished", result: outcome.winner === playerSide ? "won" : "lost", ending: "checkmate"};
    case "pointsWin":
      return {kind: "finished", result: outcome.winner === playerSide ? "won" : "lost", ending: "points"};
    case "bikjang":
      return {kind: "finished", result: "drawn", ending: "bikjang"};
  }
}
