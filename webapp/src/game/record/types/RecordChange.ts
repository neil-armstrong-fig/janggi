import type {ChangeDirection} from "@src/game/record/types/ChangeDirection";
import type {Transition} from "@src/game/record/types/Transition";

/** What changed between two readings of a record: which way it moved, and the turn that moved it. */
export interface RecordChange {
  readonly direction: ChangeDirection;
  /**
   * The turn involved, always the way it was **played**. A move taken back is still the move from
   * where it started to where it landed; it is `direction` that says it ran the other way. Nothing
   * where the game was dealt afresh.
   */
  readonly transition: Transition | undefined;
}
