import type {AccountSliceState} from "@src/redux/account/types/AccountSliceState";
import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";

/**
 * Whether the player has a Google account signed in on this device, and whether their data is being kept in step.
 *
 * Opt-in, from the settings alone: a player who never asks stays `signed-out` and nothing here ever runs. Signing
 * out stops syncing and leaves everything on the device where it was.
 */
export const accountSlice = createSlice({
  name: "account",
  initialState: {status: "signed-out", sync: "idle", displayName: undefined} as AccountSliceState,
  reducers: {
    /** The player pressed "Sign in with Google" — kept, so the page that comes back knows to ask who they are. */
    signInStarted: (): AccountSliceState => ({status: "signing-in", sync: "idle", displayName: undefined}),
    signedIn: (_state, action: PayloadAction<string | undefined>): AccountSliceState => ({
      status: "signed-in",
      sync: "idle",
      displayName: action.payload,
    }),
    displayNameChanged: (state, action: PayloadAction<string>): AccountSliceState => ({
      ...state,
      displayName: action.payload,
    }),
    signedOut: (): AccountSliceState => ({status: "signed-out", sync: "idle", displayName: undefined}),
    /** The player changed something the server keeps, and it has not been sent yet. */
    syncPending: (state): AccountSliceState => ({...state, sync: "idle"}),
    syncSucceeded: (state): AccountSliceState => ({...state, sync: "synced"}),
    syncFailed: (state): AccountSliceState => ({...state, sync: "paused"}),
    syncTooLarge: (state): AccountSliceState => ({...state, sync: "too-large"}),
  },
});

export const {
  signInStarted,
  signedIn,
  displayNameChanged,
  signedOut,
  syncPending,
  syncSucceeded,
  syncFailed,
  syncTooLarge,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
