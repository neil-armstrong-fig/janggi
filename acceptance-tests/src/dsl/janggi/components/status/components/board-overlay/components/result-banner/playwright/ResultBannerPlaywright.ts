import type {Locator, Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {SettingsOverlap} from "@src/dsl/playwright/components/settings-overlap/SettingsOverlap";

/**
 * The locators behind `ResultBannerDsl` — the announcement of a game's result over the board: what it says, and the next game it offers.
 */
export class ResultBannerPlaywright extends BaseComponent {
  private readonly result: Locator;
  private readonly showBoardButton: Locator;
  private readonly resultExplanation: Locator;
  private readonly resultXpBar: Locator;
  private readonly newGame: Locator;
  private readonly newGameAtNextStrength: Locator;
  private readonly settingsOverlap: SettingsOverlap;

  constructor(page: Page) {
    super(page);

    this.result = page.getByTestId("result");
    this.showBoardButton = page.getByTestId("result-show-board");
    this.resultExplanation = page.getByTestId("result-explanation");
    this.resultXpBar = page.getByTestId("result-xp-bar");
    this.newGame = page.getByTestId("result-new-game");
    this.newGameAtNextStrength = page.getByTestId("result-new-game-harder");
    this.settingsOverlap = new SettingsOverlap(page, this.showBoardButton);
  }

  /**
   * How full the XP bar on the announced result is, in whole percent, or undefined where the result draws
   * none — no result yet, a game between two people, or everything already unlocked.
   */
  async getResultXpBarPercent(): Promise<number | undefined> {
    if ((await this.resultXpBar.count()) === 0) return undefined;

    return Number(await this.resultXpBar.getAttribute("data-percent"));
  }

  /**
   * The army an announced result says called the bikjang that ended the game, or undefined where the
   * announcement explains no bikjang.
   */
  async getBikjangCaller(): Promise<Side | undefined> {
    if ((await this.resultExplanation.count()) === 0) return undefined;

    const caller = await this.resultExplanation.getAttribute("data-called-by");

    return SIDES.find(candidate => candidate === caller);
  }

  /** Presses New game on the announcement of a result. */
  async startNewGame(): Promise<void> {
    await this.newGame.click();
  }

  /** Presses Show board on the announcement of a result, to look at the board it was announced over. */
  async showBoard(): Promise<void> {
    await this.showBoardButton.click();
  }

  /** Presses New game at the strength of bot the win opened, on the announcement of a result. */
  async startNewGameAtNextStrength(): Promise<void> {
    await this.newGameAtNextStrength.click();
  }

  /** Whether the announcement offers a game against the strength of bot the win opened. Counted, as an absence is its answer. */
  async isNewGameAtNextStrengthOffered(): Promise<boolean> {
    return (await this.newGameAtNextStrength.count()) > 0;
  }

  /**
   * Whether a result is announced over the board. Counted rather than waited for: a game still going
   * has no announcement to wait for, and its absence is the answer.
   */
  async isResultAnnounced(): Promise<boolean> {
    return (await this.result.count()) > 0;
  }

  /** Whether the open settings sheet stands over the announcement's Show board button. */
  async isUnderTheSettings(): Promise<boolean> {
    return await this.settingsOverlap.isUnderTheSettings();
  }

  /** Whether the announcement, once it is up, offers New game at all. */
  async isNewGameOffered(): Promise<boolean> {
    await this.result.waitFor({state: "visible"});

    return (await this.newGame.count()) > 0;
  }
}
