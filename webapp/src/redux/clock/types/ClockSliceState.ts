import type {ClockPose} from "@src/redux/clock/types/ClockPose";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";

/** The clock chosen for a game between two people at one device, and the pose the example clocks stand in. */
export interface ClockSliceState {
  readonly name: TimeControlName;
  /** The format Custom means, kept while another is chosen so that going back to it finds what was written. */
  readonly custom: TimeControl;
  readonly pose: ClockPose;
}
