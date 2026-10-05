import {env} from "cloudflare:workers";

// The Worker's bindings, variables and secrets; see wrangler.jsonc for where each one comes from.
interface ApiWorkerEnv {
  DB: D1Database;
  // Rate Limiting bindings, one counter each: sign-in attempts by address, and writes of the player's data by account.
  LOGIN_LIMITER: RateLimit;
  DATA_LIMITER: RateLimit;
  // Opening rooms, by account.
  ROOM_LIMITER: RateLimit;
  // The friend-code rooms: one `GameRoom` Durable Object for each code.
  GAME_ROOMS: DurableObjectNamespace;
  // Comma-separated origins allowed to call the API with credentials: the site, plus the dev server locally.
  ALLOWED_ORIGINS: string;
  // Secrets: set with `wrangler secret put`, or in .dev.vars locally. Never committed.
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  // Turn notifications (web push): the private half of the VAPID pair (the public half is `VAPID_PUBLIC_KEY` in `@janggi/shared`),
  // as the unpadded base64url scalar a generator prints, and a `mailto:` or https address a push service may reach the operator on.
  // With either unset nobody is notified and nothing else changes. See MANUAL-SETUP-STEPS.md.
  VAPID_PRIVATE_KEY?: string;
  VAPID_SUBJECT?: string;
  // Only for local dev, in `.dev.vars`: `wrangler dev` reports the custom domain as the request's host, so the callback
  // address cannot be worked out from the request there and is given outright, as `http://localhost:8787/api/auth/google/callback`.
  GOOGLE_REDIRECT_URI?: string;
}

// Read from the runtime's global `env` rather than passed down from `fetch`, and always read at the point of use,
// never copied into a module-level `const`: a Worker is serverless, so an isolate can outlive a change to a variable
// or secret, and a value captured once at load would go on being served stale. `cloudflare:workers` only exists inside
// the Workers runtime, so unit tests cannot load this file and mock it instead
// (`vi.mock("@src/env/WorkerEnvironment", ...)`). `env` is typed as an empty interface until augmented, hence the cast.
export const workerEnvironment = env as ApiWorkerEnv;
