import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";

/**
 * What a deal produces: a record with nothing in it yet, the phase it was dealt from, a bot that
 * has not been let make the first move of it, and no draw on offer.
 */
export interface DealtBoard {
  readonly played: PlayedGame;
  readonly phase: SetupPhase;
  readonly botMayOpen: boolean;
  readonly drawOffer: undefined;
}
