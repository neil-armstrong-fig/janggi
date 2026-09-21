import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";

/**
 * What `botAwaitsGoAhead` reads of the game: the record, the phase, who the opponent is and whether the
 * bot has been let open. A whole `GameSliceState` answers it, but the rest of the slice — a draw on
 * offer, say — is nothing to do with when the bot may start, and asking for it would make every change
 * to the slice a change to this question.
 */
export interface GoAheadQuestion {
  readonly played: PlayedGame;
  readonly phase: SetupPhase;
  readonly opponent: Opponent;
  readonly botMayOpen: boolean;
}
