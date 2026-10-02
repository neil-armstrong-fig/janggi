import type {RateLimiter} from "@src/handler/services/RateLimiter";

/**
 * A `RateLimiter` over Cloudflare's Rate Limiting binding, whose counters are shared across the places the Worker runs.
 *
 * Untested: it is one call to the binding. A binding that fails lets the request through rather than refuse everybody —
 * the limits are there to protect the free plan's quota from a flood, and a limiter that is down is not worth making
 * sign-in down as well.
 */
export class BindingRateLimiter implements RateLimiter {
  private readonly binding: RateLimit;

  constructor(binding: RateLimit) {
    this.binding = binding;
  }

  async allow(key: string): Promise<boolean> {
    try {
      return (await this.binding.limit({key})).success;
    } catch {
      return true;
    }
  }
}
