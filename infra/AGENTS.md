# AGENTS.md — infra

The Cloudflare infrastructure for the API, as code, with [Alchemy](https://alchemy.run) (the 0.x line: `latest` on npm is
the 2.0 beta rewrite). `src/ApiInfrastructure.ts` puts together `src/api-database/` (the D1 database, with the migrations Drizzle generated into
`api/migrations/`) and `src/api-worker/` (the Worker bound to it, with its two rate limiters). It is what
someone standing the game up on their own Cloudflare account runs, and what CI runs for this one.

## What it does not do, on purpose

- **The domain.** The Worker gets its `workers.dev` address. Attaching `janggi-api.neilarmstrong.dev` (or any name) is a
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

## Standing it up

Every manual step, in order, with the links, is in `/MANUAL-SETUP-STEPS.md`: the
contact address, the Google OAuth client, the API token, the first
`pnpm --filter @janggi/infra provision`, the Worker's custom domain (by hand,
and one label below the domain: a deeper name has no free certificate), and the
CI secrets. The script is `provision` because `pnpm deploy` is a built-in pnpm
command that refuses with "requires one parameter".

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
