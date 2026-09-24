import {BoardDsl} from "@src/dsl/janggi/components/board/BoardDsl";
import {DebugDsl} from "@src/dsl/janggi/components/debug/DebugDsl";
import {DslError} from "@src/dsl/errors/DslError";
import {GuideDsl} from "@src/dsl/janggi/components/guide/GuideDsl";
import {JanggiPlaywright} from "@src/dsl/janggi/playwright/JanggiPlaywright";
import type {InstallationAppearance} from "@src/dsl/janggi/types/InstallationAppearance";
import type {Page} from "@playwright/test";
import {RecordSheetDsl} from "@src/dsl/janggi/components/record-sheet/RecordSheetDsl";
import {ReleaseUpdateDsl} from "@src/dsl/janggi/components/release-update/ReleaseUpdateDsl";
import {ReferencesDsl} from "@src/dsl/janggi/components/references/ReferencesDsl";
import {SettingsDsl} from "@src/dsl/janggi/components/settings/SettingsDsl";
import {StatusDsl} from "@src/dsl/janggi/components/status/StatusDsl";
import {StylesSheetDsl} from "@src/dsl/janggi/components/styles-sheet/StylesSheetDsl";

/**
 * The application under test, and the whole of what a spec is handed.
 *
 * Every object in the DSL is a pair: the `*Dsl` here, and the `*Playwright` beside it in
 * `playwright/` that actually drives the browser. Each `*Dsl` is handed the page, builds its own
 * counterpart with it, and then never touches it again — the page reaches a method only through
 * that counterpart. This half holds no locators. Each method is a
 * call straight down into its own counterpart, wrapped in a `try`/`catch` that rethrows a
 * `DslError` naming the intention, so a failure reads as a sentence rather than as a raw timeout.
 * Most are one-to-one; occasionally one sequences two calls or decides something between them, and
 * that exception is why the layer is written by hand rather than generated.
 *
 * What sits here and what sits on a member is the one real design decision: **this level owns the
 * browser** — opening the app, and the window it is viewed through — and **each member answers for
 * its own part of the screen**. A window belongs to nothing on the board, so `resizeWindowTo` is
 * here; whether the board fits inside that window is a question about the board, so it is on
 * `board`.
 *
 * Further areas arrive as further members, which is what keeps a spec reading as
 * `janggi.settings.setBoardSettingTo("Neon")` rather than as a flat pile of methods that no longer
 * says what any of them is about.
 */
export class JanggiDsl {
  private readonly janggi: JanggiPlaywright;

  readonly board: BoardDsl;
  readonly guide: GuideDsl;
  readonly settings: SettingsDsl;
  readonly status: StatusDsl;
  readonly recordSheet: RecordSheetDsl;
  readonly references: ReferencesDsl;
  readonly releaseUpdate: ReleaseUpdateDsl;
  readonly stylesSheet: StylesSheetDsl;
  readonly debug: DebugDsl;

  constructor(page: Page) {
    this.janggi = new JanggiPlaywright(page);

    this.board = new BoardDsl(page);
    this.guide = new GuideDsl(page);
    this.settings = new SettingsDsl(page);
    this.status = new StatusDsl(page);
    this.recordSheet = new RecordSheetDsl(page);
    this.references = new ReferencesDsl(page);
    this.releaseUpdate = new ReleaseUpdateDsl(page);
    this.stylesSheet = new StylesSheetDsl(page);
    this.debug = new DebugDsl(page);
  }

  async navigateToPage(): Promise<void> {
    try {
      await this.janggi.open();
    } catch (error) {
      throw new DslError("Failed to navigate to the game", error);
    }
  }

  /** Loads the page again, the way a player closing the app and coming back to it would. */
  async reload(): Promise<void> {
    try {
      await this.janggi.reload();
    } catch (error) {
      throw new DslError("Failed to load the game again", error);
    }
  }

  /** Makes the bot's engine slow: it does not arrive until it is restored. Said before the bot is chosen. */
  async holdBackTheBotsEngine(): Promise<void> {
    try {
      await this.janggi.holdBackTheBotsEngine();
    } catch (error) {
      throw new DslError("Failed to hold back the bot's engine", error);
    }
  }

  /** Makes the bot's engine impossible to fetch, until it is restored. Said before the bot is chosen. */
  async cutOffTheBotsEngine(): Promise<void> {
    try {
      await this.janggi.cutOffTheBotsEngine();
    } catch (error) {
      throw new DslError("Failed to cut off the bot's engine", error);
    }
  }

  /** Lets the bot's engine arrive again after it was held back or cut off. */
  async restoreTheBotsEngine(): Promise<void> {
    try {
      await this.janggi.restoreTheBotsEngine();
    } catch (error) {
      throw new DslError("Failed to restore the bot's engine", error);
    }
  }

  async reloadOffline(): Promise<void> {
    try {
      await this.janggi.reloadOffline();
    } catch (error) {
      throw new DslError("Failed to reopen the game without a network connection", error);
    }
  }

  async offerInstallation(): Promise<void> {
    try {
      await this.janggi.offerInstallation();
    } catch (error) {
      throw new DslError("Failed to make installation available from the browser", error);
    }
  }

  async wasInstallationPrompted(): Promise<boolean> {
    try {
      return await this.janggi.wasInstallationPrompted();
    } catch (error) {
      throw new DslError("Failed to check whether the browser offered to save Janggi", error);
    }
  }

  async getPageTitle(): Promise<string> {
    try {
      return await this.janggi.getPageTitle();
    } catch (error) {
      throw new DslError("Failed to read the game's page title", error);
    }
  }

  async getInstallationAppearance(): Promise<InstallationAppearance> {
    try {
      return await this.janggi.getInstallationAppearance();
    } catch (error) {
      throw new DslError("Failed to read the app's installation artwork", error);
    }
  }

  async getPageDescription(): Promise<string> {
    try {
      return await this.janggi.getPageDescription();
    } catch (error) {
      throw new DslError("Failed to read the game's search description", error);
    }
  }

  async getCanonicalAddress(): Promise<string> {
    try {
      return await this.janggi.getCanonicalAddress();
    } catch (error) {
      throw new DslError("Failed to read the game's canonical address", error);
    }
  }

  async getMainHeading(): Promise<string> {
    try {
      return await this.janggi.getMainHeading();
    } catch (error) {
      throw new DslError("Failed to read the game's main heading", error);
    }
  }

  async getMainHeadingServedToSearchEngines(): Promise<string> {
    try {
      return await this.janggi.getMainHeadingServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to read the main heading in the page as served, before scripts run", error);
    }
  }

  async getTextServedToSearchEngines(): Promise<string> {
    try {
      return await this.janggi.getTextServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to read the text in the page as served, before scripts run", error);
    }
  }

  async isGuideLinkedInPageServedToSearchEngines(): Promise<boolean> {
    try {
      return await this.janggi.isGuideLinkedInPageServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to check for the guide link in the page as served, before scripts run", error);
    }
  }

  async isIdentifiedAsAFreeWebGame(): Promise<boolean> {
    try {
      return await this.janggi.isIdentifiedAsAFreeWebGame();
    } catch (error) {
      throw new DslError("Failed to read the game's structured search data", error);
    }
  }

  async isListedInSitemap(): Promise<boolean> {
    try {
      return await this.janggi.isListedInSitemap();
    } catch (error) {
      throw new DslError("Failed to check whether the game and guide are listed in the sitemap", error);
    }
  }

  /** Resizes the window, the way a user dragging the corner of a browser would. */
  async resizeWindowTo(width: number, height: number): Promise<void> {
    try {
      await this.janggi.resizeWindowTo(width, height);
    } catch (error) {
      throw new DslError(`Failed to resize the window to ${width}x${height}`, error);
    }
  }
}
