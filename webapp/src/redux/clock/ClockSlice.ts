import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import type {ChargedTurn} from "@src/redux/clock/types/ChargedTurn";
import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";
import {FIRST_CLOCK} from "@src/redux/clock/first-clock/FirstClock";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";
import {clockAfterCharge} from "@src/redux/clock/spending/ClockAfterCharge";
import {clockAfterFlag} from "@src/redux/clock/spending/ClockAfterFlag";
import {clockAfterResume} from "@src/redux/clock/resuming/ClockAfterResume";
import {clockTurnedOff} from "@src/redux/clock/time-controls/ClockTurnedOff";
import {formatWhenOnAfter} from "@src/redux/clock/time-controls/FormatWhenOnAfter";
import {freshArmiesOf} from "@src/redux/clock/spending/FreshArmiesOf";
import {friendGameDealt} from "@src/redux/online/actions/FriendGameDealt";
import {localGameRestored} from "@src/redux/online/actions/LocalGameRestored";
import {timeControlOf} from "@src/redux/clock/time-controls/TimeControlOf";
import {withinLimits} from "@src/redux/clock/time-controls/WithinLimits";

/**
 * The clock: what it is set to, the time each army has, and when the turn being timed began. The setting and both
 * plaques read this, so it is a slice rather than state on the page. It is kept on the device, and a turn that was being
 * timed comes back waiting, holding what it had spent (`loadClock`), until the player to move resumes it (`ResumeGame`).
 *
 * `useClockKeeper` is what dispatches the turns, off the page's one moment: a turn charged when it ends, a flag when time
 * runs out, and nothing as time passes.
 *
 * A game with a friend has no clock, and the player's own game coming back after one is a game restored, so both turn
 * it off. See `docs/rules.md` §6.7.
 */
export const clockSlice = createSlice({
  name: "clock",
  initialState: FIRST_CLOCK,
  reducers: {
    timeControlChosen: (state, action: PayloadAction<TimeControlName>): ClockSliceState => ({
      ...state,
      name: action.payload,
      formatWhenOn: formatWhenOnAfter(state.formatWhenOn, action.payload),
      armies: freshArmiesOf(timeControlOf(action.payload, state.custom)),
      turnStartedAt: undefined,
      heldMs: undefined,
    }),

    customTimeControlWritten: (state, action: PayloadAction<TimeControl>): ClockSliceState => {
      const custom = withinLimits(action.payload);

      return {
        ...state,
        custom,
        armies: freshArmiesOf(timeControlOf(state.name, custom)),
        turnStartedAt: undefined,
        heldMs: undefined,
      };
    },

    clockDealt: (state): ClockSliceState => ({
      ...state,
      armies: freshArmiesOf(timeControlOf(state.name, state.custom)),
      turnStartedAt: undefined,
      heldMs: undefined,
    }),

    clockStarted: (state, action: PayloadAction<number>): ClockSliceState => ({
      ...state,
      turnStartedAt: action.payload,
      heldMs: undefined,
    }),

    clockResumed: (state, action: PayloadAction<number>): ClockSliceState => clockAfterResume(state, action.payload),

    turnCharged: (state, action: PayloadAction<ChargedTurn>): ClockSliceState => {
      return clockAfterCharge(state, action.payload);
    },

    timeRanOut: (state, action: PayloadAction<Side>): ClockSliceState => clockAfterFlag(state, action.payload),
  },
  extraReducers: builder => {
    builder.addCase(friendGameDealt, clockTurnedOff);
    builder.addCase(localGameRestored, clockTurnedOff);
  },
});

export const {
  timeControlChosen,
  customTimeControlWritten,
  clockDealt,
  clockStarted,
  clockResumed,
  turnCharged,
  timeRanOut,
} = clockSlice.actions;

export const clockReducer = clockSlice.reducer;
