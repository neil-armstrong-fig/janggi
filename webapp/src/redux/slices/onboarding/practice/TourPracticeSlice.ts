import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {ParkedPlay} from "@src/redux/shared/parking/types/ParkedPlay";
import type {TourPracticeState} from "@src/redux/slices/onboarding/practice/types/TourPracticeState";

const initialState: TourPracticeState = {};

export const tourPracticeSlice = createSlice({
  name: "tourPractice",
  initialState,
  reducers: {
    practiceStarted: (_state, action: PayloadAction<ParkedPlay>): TourPracticeState => ({parked: action.payload}),
    practiceEnded: (): TourPracticeState => ({}),
  },
});

export const {practiceStarted, practiceEnded} = tourPracticeSlice.actions;
export const tourPracticeReducer = tourPracticeSlice.reducer;
