import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";

/** What a deal produces: a record with nothing in it yet, and the phase it was dealt from. */
export interface DealtBoard {
  readonly played: PlayedGame;
  readonly phase: SetupPhase;
}
