import {RateLimit} from "alchemy/cloudflare";

/**
 * Opening rooms, counted by account: ten a minute. The namespace id and the numbers must match `api/wrangler.jsonc`,
 * which declares the same counter for `wrangler dev` alone.
 */
export function buildRoomLimiter(): RateLimit {
  return RateLimit({namespace_id: 1003, simple: {limit: 10, period: 60}});
}
