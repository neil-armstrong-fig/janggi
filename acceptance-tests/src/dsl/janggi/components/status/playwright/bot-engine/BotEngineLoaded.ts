import type {Page} from "@playwright/test";

/** The engine's download, compile and thread start, which the bot's first reply used to include. */
const BOT_LOADS_WITHIN_MS = 20_000;

/**
 * Waits until the game no longer says the bot's engine is loading, returning at once where it is not. Read off the turn
 * line, which carries the game's state, so both `status` and the bot's go-ahead wait the same way.
 */
export async function botEngineLoaded(page: Page): Promise<void> {
  await page.getByTestId("turn").waitFor({state: "visible"});
  await page
    .locator("[data-testid='turn'][data-bot-loading]")
    .waitFor({state: "detached", timeout: BOT_LOADS_WITHIN_MS});
}
