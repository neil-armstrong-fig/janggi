import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {TourStepsSkipped} from "@src/redux/onboarding/touring/types/TourStepsSkipped";
import {createSlice} from "@reduxjs/toolkit";
import {tourBegun, tourStepBack, tourStepForward} from "@src/redux/onboarding/touring/Touring";

/**
 * Whether a player is being shown around. It starts on the welcome, which is what a device with nothing
 * kept on it gets; `loadOnboarding` decides whether that is so, and a player who has already played is
 * never sent back to it. What each step means is in `touring/`, and this only says which rule an action runs.
 */
export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {stage: "welcome", tourStep: 0} as OnboardingSliceState,
  reducers: {
    /** From the welcome, or from the You pane's replay: the tour from its first step. */
    tourStarted: (): OnboardingSliceState => tourBegun(),

    tourSteppedForward: (state, action: PayloadAction<TourStepsSkipped>): OnboardingSliceState => {
      return tourStepForward(state, action.payload);
    },

    tourSteppedBack: (state, action: PayloadAction<TourStepsSkipped>): OnboardingSliceState => {
      return tourStepBack(state, action.payload);
    },

    /** Skipping the welcome or the tour, wherever the player is — neither is shown again. */
    onboardingSkipped: (): OnboardingSliceState => ({stage: "done", tourStep: 0}),
  },
});

export const {tourStarted, tourSteppedForward, tourSteppedBack, onboardingSkipped} = onboardingSlice.actions;

export const onboardingReducer = onboardingSlice.reducer;
