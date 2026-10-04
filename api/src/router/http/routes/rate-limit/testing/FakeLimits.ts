/** The three limits a request can be held to. */
export type LimitName = "login" | "data" | "room";

/**
 * The rate limits as the tests meet them: everything is allowed until a test refuses one key at one limit. A class because it
 * holds state — what has been refused. `SetupApiTests` makes the `*Allowed` functions this one's.
 */
export class FakeLimits {
  private readonly refused = new Map<LimitName, Set<string>>();

  refuse = (limit: LimitName, key: string): void => {
    this.refused.set(limit, new Set([...(this.refused.get(limit) ?? []), key]));
  };

  allowed = (limit: LimitName, key: string): Promise<boolean> => Promise.resolve(!this.refused.get(limit)?.has(key));

  /** The `*Allowed` function for one limit: whether a key is allowed by it. */
  allowedBy =
    (limit: LimitName) =>
    (key: string): Promise<boolean> =>
      this.allowed(limit, key);

  /** Allows everything again. */
  reset = (): void => {
    this.refused.clear();
  };
}
