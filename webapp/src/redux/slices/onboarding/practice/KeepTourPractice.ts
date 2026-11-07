import type {AppStartListening} from "@src/redux/slices/account/listening/AppStartListening";
import {onboardingSkipped} from "@src/redux/slices/onboarding/OnboardingSlice";
import {practiceStarted} from "@src/redux/slices/onboarding/practice/TourPracticeSlice";
import {restorePractice} from "@src/redux/slices/onboarding/practice/actions/RestorePractice";
import {clockHeldAt} from "@src/redux/shared/parking/ClockHeldAt";

/** The tour owns a practice board only while its cards are showing. */
export function keepTourPractice(startListening: AppStartListening): void {
  startListening({
    predicate: (_action, state, previous) => state.onboarding.stage !== previous.onboarding.stage,
    effect: (_action, {dispatch, getState}) => {
      const state = getState();
      if (state.onboarding.stage !== "tour") {
        dispatch(restorePractice());
        return;
      }

      if (
        state.friend.code !== undefined ||
        state.friend.parkedGame !== undefined ||
        state.tutorial.parked !== undefined
      ) {
        dispatch(onboardingSkipped());
        return;
      }

      dispatch(practiceStarted({game: state.game, clock: clockHeldAt(state.clock, Date.now())}));
    },
  });
}
