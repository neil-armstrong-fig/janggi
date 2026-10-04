# Giving Alchemy persistent state in CI

The production API deploy currently lets every GitHub Actions runner use an
empty, local Alchemy state store. Alchemy 0.94 rejects that in CI by default, so
`.github/workflows/ci.yml` deliberately sets
`ALCHEMY_CI_STATE_STORE_CHECK=false`.

That is a temporary tradeoff, not the intended final design. This records what
the tradeoff loses and how to replace it without re-deriving the migration.

## Why the stateless deploy works today

The stack has only two top-level resources: the D1 database named `janggi` and
the Worker named `janggi-api`. Both have `adopt: true`, so a runner with no prior
state can find the existing resource by its fixed physical name and update it.
The workflow also serialises runs for the same Git ref.

This is enough for ordinary deployments that leave both resource identities in
place. It is not equivalent to keeping state:

- removing a resource from the program leaves no previous record from which
  Alchemy can identify and delete the orphan;
- renaming a physical resource can create the replacement without cleaning up
  the old one;
- a clean runner cannot perform a complete `alchemy destroy` because it does
  not know everything a previous run created; and
- an interrupted deployment loses Alchemy's in-progress lifecycle record. The
  workflow's `cancel-in-progress` setting makes interruption possible when a
  newer push supersedes a running one.

Name-based adoption solves discovery of the two resources that still appear in
the program. It does not solve lifecycle history. Revisit this decision before
adding another infrastructure resource, renaming or removing one, relying on
`destroy` in CI, or allowing more than one production deployment path.

## Better design: CloudflareStateStore

For the pinned Alchemy 0.94 line, use its `CloudflareStateStore`. It deploys an
`alchemy-state-service` Worker backed by a SQLite Durable Object. Every runner
then reads and writes the same state, including resource inputs, outputs and
lifecycle status.

Change `infra/src/ApiInfrastructure.ts` to configure the store:

```ts
import alchemy from "alchemy";
import { CloudflareStateStore } from "alchemy/state";

const app = await alchemy("janggi", {
  password: secrets.ALCHEMY_PASSWORD,
  stateStore: (scope) => new CloudflareStateStore(scope),
});
```

Keep `adopt: true` on the database and Worker for the first stateful deployment.
The new store begins empty; adoption lets that deployment take ownership of the
existing physical resources and persist their state. It also remains useful for
recovering an existing account if state ever has to be rebuilt.

## Migration checklist

1. Generate a long random value for `ALCHEMY_STATE_TOKEN`, for example with
   `openssl rand -base64 32`. This authenticates access to the state service and
   is separate from `ALCHEMY_PASSWORD`, which encrypts secrets in Alchemy state.
2. Add that value as an `ALCHEMY_STATE_TOKEN` GitHub Actions secret and pass it
   to the deploy step's environment.
3. Configure `CloudflareStateStore` as above. Use the same token for every
   deployment to this Cloudflare account.
4. Remove `ALCHEMY_CI_STATE_STORE_CHECK=false` from the workflow.
5. Run the first deployment from a controlled environment. Confirm it creates
   `alchemy-state-service`, adopts `janggi` and `janggi-api`, and completes a
   second deployment without recreating either application resource.
6. Confirm a harmless Worker setting change is detected and applied, then
   restore it. Do not prove deletion against the production D1 database.
7. Update `infra/AGENTS.md` so stateless adoption is no longer described as the
   CI design, and add `ALCHEMY_STATE_TOKEN` to its environment and CI setup.

The Cloudflare token already used by the deploy must be able to create the
state-service Worker and its Durable Object. If its deliberately narrow policy
rejects the first bootstrap, add only the permission named by Cloudflare's
error.

Alchemy 2 replaces this API with `Cloudflare.state()` on an `Alchemy.Stack`.
If the repository moves to Alchemy 2 first, preserve the reasoning and migration
order here, but use the stable v2 API rather than copying the 0.94 snippet.

## Sources

- [Alchemy 0.x: Cloudflare State Store][v1-state-store]
- [Alchemy 0.x: state and state stores][v1-state]
- [Alchemy 2: state store][v2-state]

[v1-state-store]: https://v1.alchemy.run/guides/cloudflare-state-store/
[v1-state]: https://v1.alchemy.run/concepts/state/
[v2-state]: https://alchemy.run/state-store/
