import {test as base} from "@playwright/test";
import {BoardPage} from "@src/dsl/janggi/BoardPage";

/**
 * The DSL objects a spec can ask for. Each one arrives ready to use — navigated, and wrapped so the
 * spec never touches a Playwright locator. Add a page object here to make it available to tests.
 */
export interface AcceptanceTestFixtures {
  board: BoardPage;
}

export const test = base.extend<AcceptanceTestFixtures>({
  board: async ({page}, use) => {
    const board = new BoardPage(page);
    await board.navigateToPage();

    await use(board);
  },
});

export {expect} from "@playwright/test";
