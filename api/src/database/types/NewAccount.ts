/** What an account is made with, for a Google subject that has none yet. */
export interface NewAccount {
  readonly id: string;
  readonly displayName: string;
  readonly now: Date;
}
