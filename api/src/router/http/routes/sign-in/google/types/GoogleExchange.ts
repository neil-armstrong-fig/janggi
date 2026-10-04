import type {GoogleAuthorization} from "@src/router/http/routes/sign-in/google/types/GoogleAuthorization";

/** What finishes one: the same attempt (state, verifier, redirect address) and the code Google sent the player back with. */
export interface GoogleExchange extends GoogleAuthorization {
  readonly code: string;
}
