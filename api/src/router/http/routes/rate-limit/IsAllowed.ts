/**
 * Whether one more request from `key` is allowed right now, by one of Cloudflare's Rate Limiting bindings: the free plan's limits
 * protect the daily quota from a flood. **A binding that fails lets the request through** — a limiter that is down must not be
 * what takes the sign-in down.
 */
export async function isAllowed(limiter: RateLimit, key: string): Promise<boolean> {
  try {
    return (await limiter.limit({key})).success;
  } catch {
    return true;
  }
}
