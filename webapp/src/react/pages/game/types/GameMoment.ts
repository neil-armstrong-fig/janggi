import type {RecordChange} from "@src/game/record/types/RecordChange";

/**
 * One change to the game, as the screen shows it and the sound hears it: the engine's own
 * `RecordChange` — which way the record moved, and the turn that moved it — with an id of its own.
 *
 * Everything that answers a change — a piece flying, a capture landing, a sound — keys off the same
 * moment, so they cannot disagree about what just happened.
 */
export interface GameMoment extends RecordChange {
  /**
   * Different for every change, and the same across every render of one. An effect keyed on it runs
   * once per change, however many times React renders or re-runs effects in between.
   */
  readonly id: number;
}
