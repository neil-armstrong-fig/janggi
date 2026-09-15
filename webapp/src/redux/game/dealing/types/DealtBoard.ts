import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";

/**
 * What a deal produces: a record with nothing in it yet, the phase it was dealt from, and a bot that
 * has not been let make the first move of it.
 */
export interface DealtBoard {
  readonly played: PlayedGame;
  readonly phase: SetupPhase;
  readonly botMayOpen: boolean;
}
