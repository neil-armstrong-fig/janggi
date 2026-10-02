/** Whether one more request from `key` is allowed right now; the free plan's limits protect the daily quota from a flood. */
export interface RateLimiter {
  allow(key: string): Promise<boolean>;
}
