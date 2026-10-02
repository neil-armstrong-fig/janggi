/** A session as it is kept: the hash of its token, never the token, and when it stops counting. */
export interface NewSession {
  readonly idHash: string;
  readonly userId: string;
  readonly expiresAt: Date;
}
