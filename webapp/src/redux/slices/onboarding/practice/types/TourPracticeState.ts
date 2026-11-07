import type {ParkedPlay} from "@src/redux/shared/parking/types/ParkedPlay";

/** Runtime ownership of the practice board; never written to storage. */
export interface TourPracticeState {
  readonly parked?: ParkedPlay;
}
