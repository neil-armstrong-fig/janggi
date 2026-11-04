/** What each kind of unlock is called. A style keeps its own name, which is handed in. */
export interface UnlockMessages {
  readonly theme: (name: string) => string;
  readonly board: (name: string) => string;
  readonly pieces: (name: string) => string;
  readonly styleEditor: string;
}
