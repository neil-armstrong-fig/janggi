import {test as base} from "@playwright/test";
import {JanggiDsl} from "@src/dsl/janggi/JanggiDsl";
import {JanggiPlaywright} from "@src/dsl/janggi/playwright/JanggiPlaywright";

/**
 * The DSL objects a spec can ask for. Each one arrives ready to use — navigated, and wrapped so the
 * spec never touches a Playwright locator.
 *
 * There is one, deliberately: `janggi` is the whole application, and every area of it is reached
 * through a member of that rather than through a fixture of its own. A second fixture here would
 * mean a second thing to navigate and keep in step; a second member on `JanggiDsl` costs nothing.
 *
 * Handing the browser to Playwright's half of the DSL happens here, which is why this is the only
 * file outside a `playwright/` folder that names a `Page` at all — a lint rule keeps it that way.
 */
export interface AcceptanceTestFixtures {
  janggi: JanggiDsl;
}

export const test = base.extend<AcceptanceTestFixtures>({
  janggi: async ({page}, use) => {
    const janggi = new JanggiDsl(new JanggiPlaywright(page));
    await janggi.navigateToPage();

    await use(janggi);
  },
});

export {expect} from "@playwright/test";
