import type {AccountStore} from "@src/database/AccountStore";
import type {GoogleSignIn} from "@src/google/GoogleSignIn";
import type {RateLimiter} from "@src/handler/services/RateLimiter";

/**
 * What a request is answered with, handed in rather than reached for, so a test answers a request against an
 * in-memory store, a Google that says what the test says, and a clock it holds still.
 */
export interface RouteServices {
  readonly store: AccountStore;
  readonly google: GoogleSignIn;
  /** Origins allowed to call the API with credentials; the first is where a sign-in returns to by default. */
  readonly allowedOrigins: readonly string[];
  readonly loginLimiter: RateLimiter;
  readonly dataLimiter: RateLimiter;
  readonly now: () => Date;
  readonly random: () => number;
}
