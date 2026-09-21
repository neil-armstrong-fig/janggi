import type {BotEngineSliceState} from "@src/redux/bot-engine/types/BotEngineSliceState";
import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";

/**
 * Whether the bot's engine can be searched yet. The page starts it once the bot is the opponent and
 * reports here how that went, so that the herald, the board and the notice over it can all say the same
 * thing — that the bot is loading, or could not be started — rather than each guessing from a bot that
 * has not answered.
 *
 * `failed` goes back to `idle` when the player asks to try again, and the page starts it again from there.
 */
export const botEngineSlice = createSlice({
  name: "botEngine",
  initialState: {status: "idle", reason: undefined} as BotEngineSliceState,
  reducers: {
    botEngineLoading: (): BotEngineSliceState => ({status: "loading", reason: undefined}),
    botEngineReady: (): BotEngineSliceState => ({status: "ready", reason: undefined}),
    botEngineFailed: (_state, action: PayloadAction<string>): BotEngineSliceState => ({
      status: "failed",
      reason: action.payload,
    }),
    botEngineRetried: (): BotEngineSliceState => ({status: "idle", reason: undefined}),
  },
});

export const {botEngineLoading, botEngineReady, botEngineFailed, botEngineRetried} = botEngineSlice.actions;

export const botEngineReducer = botEngineSlice.reducer;
