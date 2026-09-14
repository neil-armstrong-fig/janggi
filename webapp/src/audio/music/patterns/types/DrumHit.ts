import type {JangguHead} from "@src/audio/instruments/types/JangguHead";

/** One stroke on the 장구, and how hard. */
export interface DrumHit {
  readonly head: JangguHead;
  /** From nought to one. */
  readonly weight: number;
}
