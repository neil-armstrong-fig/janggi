import {test as base} from "@playwright/test";
import {JanggiDsl} from "@src/dsl/janggi/JanggiDsl";

/**
 * The DSL objects a spec can ask for. Each one arrives ready to use — navigated, and wrapped so the
 * spec never touches a Playwright locator.
 *
 * There is one, deliberately: `janggi` is the whole application, and every area of it is reached
 * through a member of that rather than through a fixture of its own. A second fixture here would
 * mean a second thing to navigate and keep in step; a second member on `JanggiDsl` costs nothing.
 *
 * Handing the browser to the DSL happens here: `JanggiDsl` takes the page, builds its own
 * `*Playwright` counterpart with it and passes the same page down to each area, which does the same.
 * A `*Dsl` may name a `Page` for that and for nothing else — it never stores one, so `this.page`
 * cannot be reached from a method, and a lint rule says so as well.
 */
export interface AcceptanceTestFixtures {
  janggi: JanggiDsl;
}

export const test = base.extend<AcceptanceTestFixtures>({
  janggi: async ({page}, use) => {
    const janggi = new JanggiDsl(page);
    await janggi.navigateToPage();

    await use(janggi);
  },
});

export {expect} from "@playwright/test";
