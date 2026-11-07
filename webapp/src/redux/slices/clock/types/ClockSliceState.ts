import type {ArmyClocks} from "@src/redux/slices/clock/types/ArmyClocks";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlFormat, TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";

/** The clock chosen for a game between two people at one device, and the time each army has. */
export interface ClockSliceState {
  readonly name: TimeControlName;
  /** The format the clock's switch turns on: the last one chosen, kept while the clock is off. */
  readonly formatWhenOn: TimeControlFormat;
  /** The format Custom means, kept while another is chosen so that going back to it finds what was written. */
  readonly custom: TimeControl;
  /** What each army has banked, as of the last turn it finished. Nothing while the clock is off. */
  readonly armies?: ArmyClocks | undefined;
  /**
   * When the turn now being timed began, against the army to move. Nothing while no clock runs: before the first move,
   * and once the game is over. What has been spent since is worked out from this when it is read, so nothing is
   * dispatched as time passes.
   */
  readonly turnStartedAt?: number | undefined;
  /**
   * What the turn had already spent when the page went away, while the clock waits to be resumed. Nothing otherwise. It is
   * kept as it is, for a page reloaded again while it waits: no time runs, so `turnStartedAt` stays empty.
   */
  readonly heldMs?: number | undefined;
}
