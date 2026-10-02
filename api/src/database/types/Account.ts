/** A player's account as the API knows it: who it is, and what they are called. Nothing else about them is kept. */
export interface Account {
  readonly id: string;
  readonly displayName: string;
}
