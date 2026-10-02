# AGENTS.md — api

The Cloudflare Worker behind opt-in Google sign-in and cloud sync. It lives on its own host
(`janggi-api.neilarmstrong.dev`), apart from the GitHub Pages site, so every answer carries CORS headers
and the session cookie is `HttpOnly; Secure; SameSite=Lax` — `api.` and the site share a registrable domain, so
they are same-site and Lax cookies ride along on a credentialed `fetch` (`SameSite=None` is not needed, and Safari's
tracking prevention leaves a same-site cookie alone). The plan and the reasons are in
`docs/online-capability/`.

## Import boundaries

This package may import `@janggi/shared` and nothing else from the workspace, and **nothing in the
workspace may import it** — the webapp and the acceptance tests talk to it over HTTP, never through code.
Import with the `@src/*` alias.

## Conventions

- **Decide in plain functions that take a `Request` or a value and return one; keep the runtime at the
  edge.** `ApiWorker.ts` and `env/WorkerEnvironment.ts` are the only files that touch the Workers runtime
  (`WorkerEnvironment.ts` imports `cloudflare:workers`, so neither is unit tested: keep them to wiring);
  everything else runs under node's own Web-standard `Request`, `Response` and `crypto`. Layout follows
  the personal-website's `contact-worker`: `handler/` holds the request handling, with a subject folder
  (`cors/`, later `auth/`, `data/`) per concern.
- **Bindings, variables and secrets come from `workerEnvironment`, read where they are used.** Never copy
  one into a module-level `const`: a Worker is serverless, an isolate can outlive a change to a variable
  or secret, and a captured value would be served stale. A tested handler mocks the module
  (`vi.mock("@src/env/WorkerEnvironment", ...)`); a pure helper (`corsHeadersFor`) takes its values as
  arguments. `@cloudflare/vitest-pool-workers` is not
  used: it peers on vitest 4 and the workspace is on 5.
- **Everything that touches the database is in `src/database/`, and it reaches into nothing else.** The rest of
  the Worker (handlers, environment) imports from it; it may not import them, nor `@janggi/shared` — a lint rule
  (`eslint.config.js`) says so. What it takes in and gives back is spelled out in its own `types/`. It holds the
  schema (`schema/`, one table per file), the `AccountStore` interface the routes ask their questions through, the
  Drizzle implementation over D1 (`DrizzleAccountStore`), and what tests need (`testing/`: an in-memory
  `InMemoryAccountStore` and `accountStoreContract`, the one set of tests both implementations must pass).
- **Drizzle writes the SQL, Wrangler applies it.** `drizzle-kit generate` turns a change to the schema into a SQL
  file in `migrations/` (inspect it: Drizzle can generate something destructive), and **Wrangler is what applies
  it** — `pnpm db:migrate:local` here, `wrangler d1 migrations apply janggi --remote` for real. Never run
  `drizzle-kit migrate` or `push` against D1 as well, and never hand-edit an applied migration. Queries go through
  `drizzle(workerEnvironment.DB)`, built per request. D1 has no `BEGIN`/`COMMIT`: where several writes must land
  together use `db.batch()`, and make each rule that must hold under two writers one conditional statement.
- **There is no Cloudflare SDK to lean on for this:** the `cloudflare` npm package is the REST management API
  (deploys, DNS), not runtime access, and `@cloudflare/vitest-pool-workers` (which offers `applyD1Migrations`) is
  excluded above.
- **Store only what sync needs:** Google's subject id, a display name, a hash of each session token (never the
  token) and the player's document as an opaque string. No email, and never the real name: Google is asked for
  `openid` alone, and the display name is one of the generals (`GeneratedDisplayName`) until the player changes it.
- **Never enable Workers Paid.** On the free plan an over-limit operation fails until 00:00 UTC rather than
  billing, which is what keeps the cost at $0 — the webapp degrades to local-only when it does.

## Commands

`pnpm --filter @janggi/api db:generate --name=<what-changed>` writes a migration from the schema; always pass `--name`, or Drizzle invents one like `massive_talisman`. `pnpm --filter @janggi/api start` runs `wrangler dev` against secrets in the ignored `.dev.vars`. Migrations are in `migrations/`, generated, not hand-written.

## The API

Every route is answered by `handler/HandleApiRequest.ts`, which does CORS, refuses a state-changing request not from
the site (CSRF), and checks the session once so a route is only ever handed an account. The routes are in
`handler/routes/`; the webapp's `redux/account/` and the acceptance tests' `FakeApi` both speak this contract.

| Route                            | Does                                                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/auth/google?return=`   | Redirects to Google; the attempt (state, PKCE verifier, checked return address) rides in a short cookie                       |
| `GET /api/auth/google/callback`  | Checks the state, asks Google who the player is, makes the account and session, redirects back                                |
| `POST /api/auth/logout`          | Ends the session; succeeds with none                                                                                          |
| `GET /api/me`, `PATCH /api/me`   | `{displayName}`; rename checked by `@janggi/shared`'s `cleanedDisplayName`                                                    |
| `GET /api/data`, `PUT /api/data` | `{version, blob}`; the write carries `If-Match: <version>` — 409 with the version where behind, 428 without it, 413 over 1 MB |
| `DELETE /api/account`            | Deletes the account, its sessions and its data                                                                                |

**Tested three ways, each where it is cheapest.** Each route against `InMemoryAccountStore` and a Google the test
controls (`handler/testing/ApiHarness.ts`), in a test file beside the route; the store against a real local D1
(`getPlatformProxy`, the migrations applied), through the same `accountStoreContract` the in-memory one runs, so the
two cannot differ; and the whole thing
once, by hand, under `wrangler dev`. `BindingRateLimiter`, `ServicesFor` and `ApiWorker` are wiring and untested.
`OAuth4WebapiGoogleSignIn` is tested against a stand-in for Google's token endpoint (the real exchange, the ID token's
issuer, audience and expiry checks, the PKCE challenge against RFC 7636's own example).

**Rate limits** are Cloudflare's Rate Limiting bindings (`ratelimits` in `wrangler.jsonc`): sign-in by address, writes
by account. A binding that fails lets the request through.

**Human setup** (Cloudflare account, D1, Google OAuth client, DNS, secrets) is Phase 0 of
`docs/online-capability/TODO.md`; until the CI secrets exist, the deploy job in `ci.yml` does nothing.

## Trying it with real Google, on localhost

Nothing here needs Cloudflare, only a Google OAuth client. Sign-in works over `http://localhost` (Chrome and Firefox
treat it as secure, so the `Secure` session cookie is accepted; Safari does not) because the app on `:3000` and the
Worker on `:8787` are same-site, ports being ignored, so the `SameSite=Lax` cookie rides along.

1. **Google Cloud console:** the OAuth client from `infra/AGENTS.md`, step 2, with `http://localhost:8787/api/auth/google/callback`
   among its authorised redirect URIs.
2. **`api/.dev.vars`** (git-ignored): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and
   `GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback` (`wrangler dev` reports the custom domain as the
   request's host, so the callback address cannot be worked out from the request there).
3. **Local database:** `pnpm --filter @janggi/api exec wrangler d1 migrations apply janggi --local`.
4. **Run both:** `pnpm api:dev` (port 8787 is pinned: Wrangler would otherwise quietly use 8788 when something else holds it, and the
   app and Google would then be pointing at the wrong place — a stale `wrangler dev` is the usual culprit, so it fails loudly instead), and in another terminal `VITE_API_ORIGIN=http://localhost:8787 pnpm start`.
5. Open **`http://localhost:3000/?account`**, then Settings, Progress, _Sign in with Google_. Sign in on a second browser
   profile to watch progress follow, and check `api/.wrangler/state` is where the data went.
