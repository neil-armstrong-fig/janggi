import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import type {ClockPose} from "@src/redux/clock/types/ClockPose";
import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";
import {DEFAULT_TIME_CONTROL} from "@janggi/shared/janggi/settings/TimeControlName";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";
import {restarted} from "@src/redux/game/GameSlice";

/**
 * The clock's example: what it is set to and how it is posed, with nothing yet running. The setting and both plaques
 * read this, so it is a slice rather than state on the page. It is not kept on the device, and a page opens with it off.
 *
 * Only `IN_DEVELOPMENT` work dispatches here, so in production it sits at Off. A new game stands a pose back at the start,
 * or a game just begun would open with the previous one's time lost still announced over it.
 */
export const clockSlice = createSlice({
  name: "clock",
  initialState: {
    name: DEFAULT_TIME_CONTROL,
    custom: {minutes: 10, periodSeconds: 30, periods: 3},
    pose: "Start",
  } as ClockSliceState,
  reducers: {
    timeControlChosen: (state, action: PayloadAction<TimeControlName>): ClockSliceState => ({
      ...state,
      name: action.payload,
    }),

    customTimeControlWritten: (state, action: PayloadAction<TimeControl>): ClockSliceState => ({
      ...state,
      custom: action.payload,
    }),

    clockPosed: (state, action: PayloadAction<ClockPose>): ClockSliceState => ({...state, pose: action.payload}),
  },
  extraReducers: builder => {
    builder.addCase(restarted, (state): ClockSliceState => ({...state, pose: "Start"}));
  },
});

export const {timeControlChosen, customTimeControlWritten, clockPosed} = clockSlice.actions;

export const clockReducer = clockSlice.reducer;
