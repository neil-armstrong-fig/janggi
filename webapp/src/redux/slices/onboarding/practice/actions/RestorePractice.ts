import type {AppThunk} from "@src/redux/AppThunk";
import {practiceEnded} from "@src/redux/slices/onboarding/practice/TourPracticeSlice";
import {practiceRestored} from "@src/redux/slices/onboarding/practice/actions/PracticeRestored";

/** Puts back the game and held clock before another activity can take the board. */
export function restorePractice(): AppThunk {
  return (dispatch, getState) => {
    const {parked} = getState().tourPractice;
    if (parked === undefined) return;

    dispatch(practiceRestored(parked));
    dispatch(practiceEnded());
  };
}
