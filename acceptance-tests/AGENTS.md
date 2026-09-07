# AGENTS.md — acceptance-tests

Playwright runs the specs. Four layers, and imports only ever point downwards:

```
src/tests/                        "@acceptance-criteria-mapping" and "@src/shared/*", nothing else
src/acceptance-criteria-mapping/  src/dsl/ and src/shared/; never src/tests/
src/dsl/                          page objects in janggi/, base types in types/, errors/
src/shared/                       helpers more than one layer needs — empty for now
```

Every arrow above is a lint rule, so a violation fails `pnpm checks`.

## Writing a spec

```ts
import {expect, given, then, when} from "@acceptance-criteria-mapping";

given("a user opens the game for the first time", () => {
  when("the page has loaded", () => {
    then("the board is visible", async ({board}) => {
      const visible = await board.isVisible();

      expect(visible).toBe(true);
    });
  });
});
```

`given`/`when` are `test.describe`; `then` is `test`, which is why only `then` receives the DSL.

## What a spec may reach

The DSL, and nothing else — no `page`, `context`, `browser` or `testInfo`. Enforced three ways: the
argument type, `withDslOnly` rebuilding the argument object at runtime, and a lint rule banning
Playwright imports under `src/tests/`.

**Do not work around it.** To give a spec a new capability, add a method to a page object in
`src/dsl/janggi/`, or a fixture to `AcceptanceTestFixtures`.

**A new fixture must also be named in `withDslOnly`'s destructuring**
(`AcceptanceCriteriaMapping.ts`). Playwright reads that destructuring to decide which fixtures to
build, so one missing from it is silently never constructed.

## Page objects

`src/dsl/janggi/` holds page objects; they own the locators and expose intentions, never selectors.
Locators go in components under `components/`. Locate by `data-testid` — that attribute is the
contract with the webapp. Prefer waiting over sampling, since React mounts after `goto` resolves:

```ts
await this.container.waitFor({state: "visible"}); // not locator.isVisible()
```

## Running

```bash
pnpm start                          # terminal 1 — the app under test
pnpm acceptance-tests               # terminal 2 — desktop + mobile projects
pnpm acceptance-tests --project=mobile
pnpm acceptance-tests:headed        # watch it drive
pnpm acceptance-tests:ui            # time-travel debugging
```

`WEBAPP_URL` picks the target and the `:local` / `:production` scripts set it — there is no
"environment" concept in the tests, only a URL. Failure screenshots and video land in
`test-results/` automatically, so do not write screenshot code.

`pnpm test` here is Vitest, for unit-testing DSL helpers. It excludes `src/tests/`.

## Known, not a bug

Playwright reports each test's location as `AcceptanceCriteriaMapping.ts`, because it reads the
caller of `test()` and that is our wrapper. Failure output still points at the real spec line.
