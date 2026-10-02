# AGENTS.md — infra

The Cloudflare infrastructure for the API, as code, with [Alchemy](https://alchemy.run) (the 0.x line: `latest` on npm is
the 2.0 beta rewrite). `src/ApiInfrastructure.ts` puts together `src/api-database/` (the D1 database, with the migrations Drizzle generated into
`api/migrations/`) and `src/api-worker/` (the Worker bound to it, with its two rate limiters). It is what
someone standing the game up on their own Cloudflare account runs, and what CI runs for this one.

## What it does not do, on purpose

- **The domain.** The Worker gets its `workers.dev` address. Attaching `api.janggi.neilarmstrong.dev` (or any name) is a
  step in the dashboard, since whose domain it is, and where its DNS lives, is the owner's. The webapp finds the API at
  `API_ORIGIN` in `@janggi/shared`, or `VITE_API_ORIGIN`, so a different address is one setting.
- **The Google OAuth client**, which Google lets nobody create from code. Create one (`api/AGENTS.md` has how) and give
  this the client id and secret.
- **GitHub**: repository secrets, Pages. Manual.

## Layout

```
src/ApiInfrastructure.ts   the file a deploy runs, and the whole of what is infrastructure: the app, the database, and the
                           Worker bound to it. How each is built is in its folder below
src/api-database/          the D1 database (`buildApiDatabase()`), and nothing else
src/api-worker/            `buildApiWorker(database)`; its `rate-limiters/` and `settings/` (allowed origins) sit beneath
                           it, being used by it alone
src/secrets/               `export const secrets` — what a deploy needs that is secret, checked on import by `required-environment/`
src/paths/ApiPath.ts       absolute paths into the API package, worked out from the file and checked to exist
```

Secrets and the environment are `export const`s, imported where they are used, never passed in: nothing about them varies
from one resource to the next. The resources are made in `ApiInfrastructure.ts`, where the Alchemy app is, and handed on —
the Worker is given the database it is bound to — because Alchemy tells which app a resource belongs to by the scope it is
made in, and that scope is not carried into other modules.

## Using it

Set these in the environment (`secrets/required-environment/` names everything missing at once):

| Variable                                   | What                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`                     | A token for the account; `pnpm --filter @janggi/infra exec alchemy util create-cloudflare-token` makes one   |
| `CLOUDFLARE_ACCOUNT_ID`                    | Only if the token reaches more than one account                                                              |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | The OAuth client's; stored as Worker secrets                                                                 |
| `ALCHEMY_PASSWORD`                         | Any long random string; encrypts the secrets in Alchemy's state                                              |
| `SITE_ORIGINS`                             | Optional: comma-separated origins allowed to call the API; defaults to this game's site and `localhost:3000` |

Then `pnpm --filter @janggi/infra provision` (not `deploy`: that is a built-in pnpm command, which refuses with "requires one parameter"), which makes `janggi` and `janggi-api` on the account. The names are fixed, so
there is one of each per account: to try it first, use a throwaway Cloudflare account. `destroy` removes what it made.

**Resources are adopted by name where they exist**, so running it against an account that already has them takes them
over rather than failing — which is also what lets CI run it with no state kept between runs. Alchemy's local state is in
`.alchemy/` (git-ignored); a second person deploying the same stage from another machine would want a shared state store
(`CloudflareStateStore`), which is not set up here.

## Standing it up, in order

`<account-id>` is the hex id in the dashboard's address, `dash.cloudflare.com/<account-id>/home`.

1. **A contact address for the Google and Cloudflare accounts**, forwarded to your own inbox, so neither needs your personal address. Email Routing
   is already on for the zone (the personal site's contact form uses it), so this is one more rule:
   `https://dash.cloudflare.com/<account-id>/home`, the `neilarmstrong.dev` domain, _Compute_, _Email Service_, _Email Routing_, _Routing Rules_,
   _Create routing rule_: pattern `janggi`, action _Send to an email_, destination your verified inbox. Send it a test message before using it.
2. **Google OAuth client** (the one thing no tool creates).
   - Project: `https://console.cloud.google.com/projectcreate`
   - Branding (app name; **user support email** is a dropdown of the signed-in Google account and any Google Group it manages, so it cannot be a free-text address. To keep a personal address off the consent screen, do this whole step signed in to a Google account created with `janggi@neilarmstrong.dev` as its address (`https://accounts.google.com/signup`, _Use my existing email_; the verification code arrives through step 1's forwarding), and add your own account as an _Owner_ at `https://console.cloud.google.com/iam-admin/iam`; or use a Google Group you own. **Developer contact email** is free text: `janggi@neilarmstrong.dev`): `https://console.cloud.google.com/auth/branding`
   - Audience: _External_, left in **Testing**, with your own Google account under _Test users_: `https://console.cloud.google.com/auth/audience`
   - Client: type _Web application_, with **Authorised redirect URIs** `https://api.janggi.neilarmstrong.dev/api/auth/google/callback` and `http://localhost:8787/api/auth/google/callback`: `https://console.cloud.google.com/auth/clients/create`
   - Copy the client id and secret. (Older console: `https://console.cloud.google.com/apis/credentials`.)
   - Only the `openid` scope is ever asked for, which needs no Google verification, so _Publish app_ on the Audience page is all it takes to let anyone sign in, later.
3. **Try it on localhost first** (`api/AGENTS.md`, "Trying it with real Google, on localhost"), which needs only step 2.
4. **Cloudflare API token**: `https://dash.cloudflare.com/<account-id>/api-tokens`, _Create Token_, _Create Custom Token_, with
   _Account · Workers Scripts · Edit_, _Account · D1 · Edit_ and _Account · Account Settings · Read_ on this account. If the first deploy
   names a permission it lacks, add it. The account id is `CLOUDFLARE_ACCOUNT_ID`.
5. **First deploy, from your machine**, with every variable in the table above set (`ALCHEMY_PASSWORD`: `openssl rand -base64 32`):
   `pnpm --filter @janggi/infra provision`. It makes the database (`https://dash.cloudflare.com/<account-id>/workers/d1`) and the
   Worker (`https://dash.cloudflare.com/<account-id>/workers-and-pages`), and prints the Worker's `workers.dev` address.
6. **Attach the domain, by hand**: the Worker, _Settings_, _Domains & Routes_, _Add_, _Custom domain_, `api.janggi.neilarmstrong.dev`
   (`https://dash.cloudflare.com/<account-id>/workers/services/view/janggi-api/production/settings`). The zone must be on this account.
   It must be the custom domain, not `workers.dev`: the session cookie only works between a site and an API under one domain.
7. **Check the free plan took it**: the Worker's _Settings_, _Bindings_ lists `LOGIN_LIMITER` and `DATA_LIMITER`; if the deploy refused
   the rate limits, remove them from `infra/` and `api/wrangler.jsonc`. The plan: `https://dash.cloudflare.com/<account-id>/billing`.
8. **Try it live**: `https://janggi.neilarmstrong.dev/?account`, signing in with the Google account from step 2.
9. **CI**: repository secrets (`https://github.com/neil-armstrong-fig/janggi/settings/secrets/actions`): `CLOUDFLARE_API_TOKEN`,
   `CLOUDFLARE_ACCOUNT_ID`, `ALCHEMY_PASSWORD`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. From then on every green `main` redeploys.

## Moving to Alchemy 2

`alchemy` on npm has `latest` pointing at `2.0.0-beta.*` — an Effect-based rewrite, in weekly betas with breaking changes, with no stable
release; this stays on the 0.x line until there is one. When it does ship, the move is small because of how this is written:

- **The physical names are pinned** (`name: "janggi"`, `"janggi-api"`) and every resource is `adopt: true`, which is what the migration
  guide asks for: v2 starts with empty state and adopts what already exists by name.
- **Nothing depends on Alchemy's state**: CI keeps none, so there is nothing to carry across. Delete `.alchemy/` after the move.
- **What changes is `src/ApiInfrastructure.ts` and the `build*` files**: `await alchemy(...)` becomes `Alchemy.Stack`, `await` becomes
  `yield*`, `entrypoint` becomes `main`, secrets become Effect `Config`. The Worker's own code (`api/`) does not change.
- **Keep the infrastructure this small**, with no logic in it, so that rewrite stays an afternoon.

## Limits of what is checked

Only `requiredEnvironment` is unit tested. The file that declares the resources cannot be exercised without a Cloudflare
account — even `alchemy dev` creates the database remotely — so what has been checked is that it type-checks, lints, and
runs as far as asking for credentials. **The first real deploy is the test**: do it on a throwaway account first.

## Import boundaries

Imports no other package in the workspace, and nothing imports it. The Worker's entry file and the migrations are named
by `apiPath`, which works them out from where the file is and fails early, naming the path, if it is not there; they are
bundled and uploaded by Alchemy, which is not an import.

**Imports use `@src/*`, like every package.** Alchemy runs the entry file straight on Node, which knows nothing of
`tsconfig` `paths`, so the scripts run it with `NODE_OPTIONS=--import=tsx`: Alchemy starts Node with the environment it was
given, and `tsx` reads the aliases. A command that runs Alchemy by hand needs the same (`alchemy deploy` on its own fails
with "Cannot find package '@src/...'"), which is why the scripts exist.
