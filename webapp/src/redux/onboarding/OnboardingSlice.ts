import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
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
    /** From the welcome, or from the Progress pane's replay: the tour from its first step. */
    tourStarted: (): OnboardingSliceState => tourBegun(),

    tourSteppedForward: (state): OnboardingSliceState => tourStepForward(state),

    tourSteppedBack: (state): OnboardingSliceState => tourStepBack(state),

    /** Skipping the welcome or the tour, wherever the player is — neither is shown again. */
    onboardingSkipped: (): OnboardingSliceState => ({stage: "done", tourStep: 0}),
  },
});

export const {tourStarted, tourSteppedForward, tourSteppedBack, onboardingSkipped} = onboardingSlice.actions;

export const onboardingReducer = onboardingSlice.reducer;
