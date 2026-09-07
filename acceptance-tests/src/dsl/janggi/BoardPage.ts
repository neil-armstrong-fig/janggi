import type {Page} from "@playwright/test";
import {BoardComponent} from "@src/dsl/janggi/components/board/BoardComponent";
import {DslError} from "@src/dsl/errors/DslError";
import {BasePage} from "@src/dsl/types/BasePage";

/**
 * What a test is allowed to say about the board. Every method reads as an intention, never as a
 * click on a selector — that detail lives in the components.
 */
export class BoardPage extends BasePage {
  private readonly board: BoardComponent;

  constructor(page: Page) {
    super(page);

    this.board = new BoardComponent(page);
  }

  /**
   * Relative to the `baseURL` in `playwright.config.ts`, which the package scripts choose. "./"
   * rather than "/" so a deployment served from a subpath — GitHub Pages — is not skipped past.
   */
  async navigateToPage(): Promise<void> {
    try {
      await this.page.goto("./");
    } catch (error) {
      throw new DslError("Failed to navigate to the board", error);
    }
  }

  async isVisible(): Promise<boolean> {
    try {
      return await this.board.isVisible();
    } catch (error) {
      throw new DslError("Failed to check whether the board is visible", error);
    }
  }
}
