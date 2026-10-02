import type {PayloadAction} from "@reduxjs/toolkit";
import type {StyleStamps} from "@src/redux/account/ledger/types/StyleStamps";
import type {SyncLedgerSliceState} from "@src/redux/account/ledger/types/SyncLedgerSliceState";
import {createSlice} from "@reduxjs/toolkit";
import {ledgerOf} from "@src/redux/account/ledger/LedgerOf";
import {syncMerged} from "@src/redux/account/actions/SyncMerged";

/**
 * The ledger of when things changed. Reducers cannot read a clock or make an id, so every action here is told
 * the answer by `stamping`, which does — this only keeps it.
 */
export const syncLedgerSlice = createSlice({
  name: "syncLedger",
  initialState: {
    boards: {},
    pieceSets: {},
    deleted: [],
    preferencesAt: 0,
    ratingsResetAt: undefined,
  } as SyncLedgerSliceState,
  reducers: {
    stylesStamped: (state, action: PayloadAction<StyleStamps>): SyncLedgerSliceState => ({...state, ...action.payload}),
    preferencesStamped: (state, action: PayloadAction<number>): SyncLedgerSliceState => ({
      ...state,
      preferencesAt: action.payload,
    }),
    ratingsResetStamped: (state, action: PayloadAction<string>): SyncLedgerSliceState => ({
      ...state,
      ratingsResetAt: action.payload,
    }),
  },
  extraReducers: builder => {
    builder.addCase(syncMerged, (_state, action): SyncLedgerSliceState => ledgerOf(action.payload));
  },
});

export const {stylesStamped, preferencesStamped, ratingsResetStamped} = syncLedgerSlice.actions;

export const syncLedgerReducer = syncLedgerSlice.reducer;
