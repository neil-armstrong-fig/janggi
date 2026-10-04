import type {PayloadAction} from "@reduxjs/toolkit";
import type {ToastSliceState} from "@src/redux/toast/types/ToastSliceState";
import {createSlice} from "@reduxjs/toolkit";

/** One toast at a time: showing another replaces it, and `toastDismissed` (the page's timer) puts it away. */
export const toastSlice = createSlice({
  name: "toast",
  initialState: {message: undefined, id: 0} as ToastSliceState,
  reducers: {
    toastShown: (state, action: PayloadAction<string>): ToastSliceState => ({
      message: action.payload,
      id: state.id + 1,
    }),

    toastDismissed: (state): ToastSliceState => ({...state, message: undefined}),
  },
});

export const {toastShown, toastDismissed} = toastSlice.actions;

export const toastReducer = toastSlice.reducer;
