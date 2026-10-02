import {RateLimit} from "alchemy/cloudflare";

/**
 * Sign-in attempts, counted by the address they come from: ten a minute. The namespace id and the numbers must match
 * `api/wrangler.jsonc`, which declares the same counter for `wrangler dev` alone.
 */
export function buildLoginLimiter(): RateLimit {
  return RateLimit({namespace_id: 1001, simple: {limit: 10, period: 60}});
}
