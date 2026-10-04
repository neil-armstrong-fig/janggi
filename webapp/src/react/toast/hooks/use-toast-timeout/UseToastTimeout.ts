import {toastDismissed} from "@src/redux/toast/ToastSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {useEffect} from "react";

/** How long a toast stays up: long enough to read one short sentence. */
export const TOAST_MS = 4000;

/** Puts the toast away `TOAST_MS` after it was shown. `id` restarts the time for a toast shown over another. */
export function useToastTimeout(id: number, shown: boolean): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!shown) return undefined;

    const timer = window.setTimeout(() => dispatch(toastDismissed()), TOAST_MS);

    return () => window.clearTimeout(timer);
  }, [id, shown, dispatch]);
}
