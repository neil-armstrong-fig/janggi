/**
 * The brief message over the page, if there is one. `id` counts the toasts shown, so a second toast with the same words
 * is still a new one and starts its own few seconds. Not kept: a page opens with none up.
 */
export interface ToastSliceState {
  readonly message: string | undefined;
  readonly id: number;
}
