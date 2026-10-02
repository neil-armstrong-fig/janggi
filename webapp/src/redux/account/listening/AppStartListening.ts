import type {AppDispatch, RootState} from "@src/redux/Store";
import type {TypedStartListening} from "@reduxjs/toolkit";

/** `startListening` against this store: a listener is handed its state and its dispatch, typed. */
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
