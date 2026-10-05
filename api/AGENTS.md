# AGENTS.md — api

The Cloudflare Worker behind opt-in Google sign-in and cloud sync. It lives on its own host
(`janggi-api.neilarmstrong.dev`), apart from the GitHub Pages site, so every answer carries CORS headers
and the session cookie is `HttpOnly; Secure; SameSite=Lax` — `api.` and the site share a registrable domain, so
they are same-site and Lax cookies ride along on a credentialed `fetch` (`SameSite=None` is not needed, and Safari's
tracking prevention leaves a same-site cookie alone). The plan and the reasons are in
`docs/online-play.md`.

## Import boundaries

This package may import `@janggi/shared` and `@janggi/engine` (the rules of janggi, to validate a move) and nothing else from the workspace, and **nothing in the
workspace may import it** — the webapp and the acceptance tests talk to it over HTTP, never through code.
Import with the `@src/*` alias.

## Conventions

- **Decide in plain functions that take a `Request` or a value and return one; keep the runtime at the
  edge.** `ApiWorker.ts` and `env/WorkerEnvironment.ts` are the only files that touch the Workers runtime
  (`WorkerEnvironment.ts` imports `cloudflare:workers`, so neither is unit tested: keep them to wiring);
  everything else runs under node's own Web-standard `Request`, `Response` and `crypto`. A request's flow is the
  folder tree (below): `router/` is everything that answers one.
- **No ternaries; guard with an `if` and return early.** `if (x === undefined) return …;` then the next case, so each condition
  is read alone and the happy path is the last line — not `x === undefined ? a : b`, which makes a reader hold both branches.
  A value that is sometimes there is built in stages by a small function that returns the object unchanged on a guard
  (`withResult`, `replaceSeat`), not by a conditional spread. `??` and `?.` are fine: they are not a choice between two
  expressions. ESLint's `no-ternary` enforces it here (`eslint.config.js`).
- **Plain functions, not interfaces; a class only for state.** Code that reaches out — to D1, to Google, to a rate limit — is a
  function (`findOrCreateAccount`, `googleSubjectOf`, `loginAllowed`), not a method of an object made to an interface, and its callers
  import and call it. Nothing is passed down a request as a bag of services (`RouteServices` is gone). A class is for something that
  holds state — the Durable Object, and the test doubles (`InMemoryDatabase`, `FakeGoogle`, `FakeLimits`, `ApiHarness`) — and for
  nothing else. A thing shared between functions that really must be one object (the Drizzle client, `database/Database.ts`) is a
  singleton `const` in a file of its own, created when the module loads.
- **Bindings, variables and secrets come from `workerEnvironment`, read where they are used.** A function that needs one reads it
  (`workerEnvironment.GOOGLE_CLIENT_ID`) when it runs; the only thing made at import is the singleton above. Under node
  `cloudflare:workers` is a stub with an empty `env` (`vitest.config.ts`), and a test that touches a binding sets it on
  `workerEnvironment` and removes it after (`router/testing/GameRoomsStub.ts`). A pure helper (`corsHeadersFor`) takes its values as
  arguments. `@cloudflare/vitest-pool-workers` is not used: it peers on vitest 4 and the workspace is on 5.
- **Tests mock the modules that reach out, and the setup does it once.** `src/testing/SetupApiTests.ts` (a vitest `setupFile`) `vi.mock`s
  every database function, the two Google functions, the three `*Allowed` rate limits and the structured event logger, resets them, stops
  time (`vi.setSystemTime`) and fixes `Math.random`, so a route test runs the real route over a world it controls. A test of one of those
  functions themselves puts the real one back with `vi.unmock`, and for the database also replaces `database/Database.ts` with a client
  over its own local D1 (`database/testing/RealDatabase.test.ts`).
- **Persistent logs contain closed application events, never request data.** Emit through `logApiEvent`, whose discriminated input and
  reconstructed output admit only the allow-listed route, transport, outcome, status, operation and exception class fields. Never add a
  URL, path, query, origin, header, cookie, account, room code, player data, message, stack or arbitrary context. HTTP and WebSocket
  handlers emit exactly once after answering; the top-level boundary covers missing configuration and thrown failures; a room emits only
  operational failures and the few lifecycle transitions already named by the logger. `console.*` belongs only inside that logger.
- **Everything that touches the database is in `src/database/`, and it reaches into almost nothing else.** The rest of the Worker imports
  from it; it may import only itself and the Worker's environment (its D1 binding) — a lint rule (`eslint.config.js`) says so. What it
  takes in and gives back is spelled out in its own `types/`. It holds the schema (`schema/`, one table per file), one function per
  operation (`accounts/`, `sessions/`, `data/`, `rooms/`, `push/`), the shared client (`Database.ts`), and what tests need (`testing/`: the
  in-memory `InMemoryDatabase`, and `databaseContract`, the one set of tests both it and the real functions must pass).
- **Drizzle writes the SQL, Wrangler applies it.** `drizzle-kit generate` turns a change to the schema into a SQL
  file in `migrations/` (inspect it: Drizzle can generate something destructive), and **Wrangler is what applies
  it** — `pnpm db:migrate:local` here, `wrangler d1 migrations apply janggi --remote` for real. Never run
  `drizzle-kit migrate` or `push` against D1 as well, and never hand-edit an applied migration. Queries go through
  the one `database` client (`database/Database.ts`). D1 has no `BEGIN`/`COMMIT`: where several writes must land
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

**The flow is the folder tree.** `ApiWorker.ts` hands the request to `HandleApiRequest.ts`, which checks the secrets and then hands it to
`router/RouteRequest.ts`, whose one decision is whether it asks to become a WebSocket (`Upgrade: websocket`):

```
router/
  RouteRequest.ts          the fork: websocket upgrade -> websocket/, anything else -> http/
  http/                    HandleHttp: preflight, 404 for an unknown route, 403 for a forged cross-site change, the route, CORS last
    cors/
    routes/                AnswerHttpRoute is the one switch (a case per route); HttpRouteOf matches; ForSignedInPlayer checks the session once
      <one folder per route>/   sign-in/{start,finish,oauth}, log-out, read-me, rename-me, read-data, write-data, delete-account, open-room, push-subscription
  websocket/               HandleWebSocket: a room's socket path (404), the site's origin (403), a session (401), then the room
    room-socket/           SocketRouteOf, ForwardToRoom
  shared/                  what both flows use, a folder to a subject: origin/ respond/ session/
  upgrade/ testing/        the fork's own helper; what the route tests stand on
```

A route's own helpers live in its folder; what two routes share rises to the folder above them and no further
(`sign-in/` holds what start and finish share), and what both flows share rises to `router/`. A request that is not a route
is answered 404 and looked at no further — including `GET /api/rooms/<CODE>/socket` without an upgrade. The webapp's
`redux/account/` and the acceptance tests' `FakeApi` both speak this contract.

| Route                                                         | Does                                                                                                                                                 |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/auth/google?return=`                                | Redirects to Google; the attempt (state, PKCE verifier, checked return address) rides in a short cookie                                              |
| `GET /api/auth/google/callback`                               | Checks the state, asks Google who the player is, makes the account and session, redirects back                                                       |
| `POST /api/auth/logout`                                       | Ends the session; succeeds with none                                                                                                                 |
| `GET /api/me`, `PATCH /api/me`                                | `{displayName}`; rename checked by `@janggi/shared`'s `cleanedDisplayName`                                                                           |
| `GET /api/data`, `PUT /api/data`                              | `{version, blob}`; the write carries `If-Match: <version>` — 409 with the version where behind, 428 without it, 413 over 1 MB                        |
| `PUT /api/push-subscription`, `DELETE /api/push-subscription` | `{endpoint, keys: {p256dh, auth}}` / `{endpoint}`: the device asks to be sent "your turn" notifications, or to stop (`push/`, `docs/online-play.md`) |
| `DELETE /api/account`                                         | Deletes the account, its sessions, its devices' notification addresses and its data                                                                  |
| `POST /api/rooms`                                             | `{side, awayDays?}` → 201 `{code}`: a friend-code room for the host on that side. 409 with one already open, 503 when full, 429 limited              |
| `GET /api/rooms/<CODE>/socket`                                | The player's WebSocket upgrade, handed to the room: 403 unless `Origin` is the site, 401 no session, 404 not a room's socket or no such room         |

**Tested three ways, each where it is cheapest.** Each route against the in-memory database, Google and limits `SetupApiTests` puts in
place of the real ones (`router/testing/ApiHarness.ts`), in a test file beside the route; the database functions against a real local
D1 (`getPlatformProxy`, the migrations applied), through the same `databaseContract` the in-memory one runs, so the two cannot differ;
and the whole thing once, by hand, under `wrangler dev`. `ApiWorker` is wiring and untested. `googleSubjectOf` is tested against a
stand-in for Google's token endpoint (the real exchange, the ID token's issuer, audience and expiry checks, the PKCE challenge against
RFC 7636's own example).

**Friend-code rooms** (`docs/online-play.md`). `room/` is the decisions, all pure and tested, and **its folders are its call
tree**: `GameRoom.ts` (the Durable Object runtime; only its observability boundaries are unit tested) calls what sits in a folder beneath it, and each of
those owns its helpers in folders beneath it in turn — `request/` (`roomRequestFrom`, and `ROOM_OBJECT_CALL`, the Worker's half of the
call too), `answering/` (`answerFrame`: `parsing/` reads the frame, `reducing/` holds `reduceRoom` with `seating/` and `acting/`
beneath it), `leaving/` (`closedSocket`), `alarm/` (`alarmDecisionFor`, `alarmPlanForRoom` and their timings), `opening/` (`newRoom`),
`seats/` (the lookups `seating/`, `acting/` and `leaving/` share, so at their common ancestor) and `types/`. `mintFriendCode` is under
`router/http/routes/open-room/`, which alone uses it. `room/GameRoom.ts` is the Durable Object that runs them — wiring apart from its tested event boundaries, and
**nothing in a field**, since it hibernates: the room is read from storage per message. Who is in which room, one open per
account and a ceiling overall, is the `rooms` table behind `openRoomRecord`/`closeRoomRecord`; the object clears its row when the game finishes, and on
teardown. The room is exercised whole only by hand (`pnpm api:dev`, two browsers).

**Turn notifications** (`docs/online-play.md`). After a move the room asks `turnNotificationFor` (`room/notifying/`, pure) whom the turn
has passed to and whether they are away, and `GameRoom` hands the answer to `notifyTurn` (`push/`) under `context.waitUntil`, so a slow push service
never holds a game. `push/` is plain Web Crypto, no library: `encrypting/` is RFC 8291 `aes128gcm` (tested against the RFC's own example) and
`vapid/` the RFC 8292 `Authorization` header. The public VAPID key is `VAPID_PUBLIC_KEY` in `@janggi/shared` (the app subscribes with it); the
private key and the contact subject are `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT`, and with either unset nothing is sent. A subscription a push
service calls gone (404/410) is deleted. Locally, put both in `api/.dev.vars`.

**Rate limits** are Cloudflare's Rate Limiting bindings (`ratelimits` in `wrangler.jsonc`): sign-in by address, writes of the player's data and
opening a room, each by account. A binding that fails lets the request through.

**Human setup** (Cloudflare account, D1, Google OAuth client, DNS, secrets) is in
`MANUAL-SETUP-STEPS.md`; until the CI secrets exist, the deploy job in `ci.yml` does nothing.

## Trying it with real Google, on localhost

Nothing here needs Cloudflare, only a Google OAuth client. Sign-in works over `http://localhost` (Chrome and Firefox
treat it as secure, so the `Secure` session cookie is accepted; Safari does not) because the app on `:3000` and the
Worker on `:8787` are same-site, ports being ignored, so the `SameSite=Lax` cookie rides along.

1. **Google Cloud console:** the OAuth client from `/MANUAL-SETUP-STEPS.md`, step 3, with `http://localhost:8787/api/auth/google/callback`
   among its authorised redirect URIs.
2. **`api/.dev.vars`** (git-ignored): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and
   `GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback` (`wrangler dev` reports the custom domain as the
   request's host, so the callback address cannot be worked out from the request there).
3. **Local database:** `pnpm --filter @janggi/api exec wrangler d1 migrations apply janggi --local`.
4. **Run both:** `pnpm api:dev` (port 8787 is pinned: Wrangler would otherwise quietly use 8788 when something else holds it, and the
   app and Google would then be pointing at the wrong place — a stale `wrangler dev` is the usual culprit, so it fails loudly instead), and in another terminal `VITE_API_ORIGIN=http://localhost:8787 pnpm start`.
5. Open **`http://localhost:3000`**, then Settings, Progress, _Sign in with Google_. Sign in on a second browser
   profile to watch progress follow, and check `api/.wrangler/state` is where the data went.

### Playing a friend alone, with one Google account

Friend-code play needs two signed-in players. Sign in as yourself in one browser, and seed a second, made-up player
into the **local** D1 and give the other browser its session cookie. Local only: nothing here touches a deployed
database, and a session token is a password, so never write one into a file in the repository.

1. **Seed the player** (with `wrangler dev` stopped or running, either way). Pick any random token, hash it with
   SHA-256 as hex (what `HashSessionToken` does, since the table keeps only the hash), and insert both rows.
   `created_at` and `expires_at` are **seconds**, not milliseconds (Drizzle `mode: "timestamp"`):

   ```bash
   TOKEN=$(openssl rand -hex 16); HASH=$(printf %s "$TOKEN" | sha256sum | cut -d' ' -f1); NOW=$(date +%s)
   pnpm --filter @janggi/api exec wrangler d1 execute janggi --local --command \
     "INSERT INTO users(id,google_sub,display_name,created_at) VALUES('dev-friend','dev-friend-sub','Dev Friend',$NOW);
      INSERT INTO sessions(id_hash,user_id,expires_at) VALUES('$HASH','dev-friend',$((NOW+2592000)));"
   echo "$TOKEN"
   ```

2. **In the second browser** (another profile or a private window; cookies are shared per profile, ports ignored),
   open `http://localhost:3000`, then DevTools, Application, Cookies, `http://localhost`: add `session` = the token,
   Path `/`, HttpOnly. `Secure` may stay off. Check it first with
   `curl -H "Cookie: session=$TOKEN" http://localhost:8787/api/me`, which answers `{"displayName":"Dev Friend"}`.
3. **Tell the app it is signed in.** A device recorded as signed out never calls the API, so the cookie is never tried
   (`Store.ts` only runs `restoreSession` when `janggi.account.v1` is not `signed-out`). But writing that key and
   reloading does not work: the store writes every slice again on `pagehide`, overwriting it with `signed-out` before
   the new page loads. Write it, then stop further writes for that one unload, in the console:

   ```js
   Storage.prototype.setItem.call(
     localStorage,
     "janggi.account.v1",
     JSON.stringify({status: "signed-in", sync: "idle"}),
   );
   Storage.prototype.setItem = () => {};
   location.reload();
   ```

   The page then asks `/api/me`, shows "Dev Friend", and keeps itself signed in from there.
