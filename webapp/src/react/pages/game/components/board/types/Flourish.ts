import type {FlourishKind} from "@src/react/pages/game/components/board/types/FlourishKind";

/** A piece showing a change in place, and when to start. */
export interface Flourish {
  /** The id of the moment it shows, so the piece plays it once and plays the next one afresh. */
  readonly id: number;
  readonly kind: FlourishKind;
  /** How long after the change the piece starts, in milliseconds. */
  readonly delay: number;
}
