import type {AppDispatch, RootState} from "@src/redux/Store";

/** A thunk against this store: what a dispatch of a function is handed, typed. */
export type AppThunk<Result = void> = (dispatch: AppDispatch, getState: () => RootState) => Result;
