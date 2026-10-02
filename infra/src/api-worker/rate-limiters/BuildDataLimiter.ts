import {RateLimit} from "alchemy/cloudflare";

/**
 * Writes of a player's data, counted by account: thirty a minute. The namespace id and the numbers must match
 * `api/wrangler.jsonc`, which declares the same counter for `wrangler dev` alone.
 */
export function buildDataLimiter(): RateLimit {
  return RateLimit({namespace_id: 1002, simple: {limit: 30, period: 60}});
}
