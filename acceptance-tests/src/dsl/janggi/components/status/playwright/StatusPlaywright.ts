import type {Locator, Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";

/** Where the game says what it is doing, rather than what is standing on it. */
export class StatusPlaywright extends BaseComponent {
  readonly container: Locator;
  private readonly newGame: Locator;
  private readonly passTurn: Locator;
  private readonly takeBack: Locator;
  private readonly playAgain: Locator;
  private readonly scores: Locator;

  constructor(page: Page) {
    super(page);

    this.container = page.getByTestId("turn");
    this.newGame = page.getByTestId("new-game");
    this.passTurn = page.getByTestId("pass");
    this.takeBack = page.getByTestId("undo");
    this.playAgain = page.getByTestId("redo");
    this.scores = page.getByTestId("scores");
  }

  /** Whether the army to move is in check. */
  async isInCheck(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return (await this.container.getAttribute("data-in-check")) !== null;
  }

  /** The army that has won, or undefined while the game is still being played. */
  async getWinner(): Promise<Side | undefined> {
    await this.container.waitFor({state: "visible"});

    const winner = await this.container.getAttribute("data-winner");

    return SIDES.find(candidate => candidate === winner);
  }

  async startNewGame(): Promise<void> {
    await this.newGame.click();
  }

  async pass(): Promise<void> {
    await this.passTurn.click();
  }

  /** Whether the turn may be rested, which the control says by being enabled or not. */
  async canPass(): Promise<boolean> {
    await this.passTurn.waitFor({state: "visible"});

    return await this.passTurn.isEnabled();
  }

  async undo(): Promise<void> {
    await this.takeBack.click();
  }

  /** Whether there is anything to take back, which the control says by being enabled or not. */
  async canUndo(): Promise<boolean> {
    await this.takeBack.waitFor({state: "visible"});

    return await this.takeBack.isEnabled();
  }

  async redo(): Promise<void> {
    await this.playAgain.click();
  }

  /** Whether anything taken back is waiting to be played again. */
  async canRedo(): Promise<boolean> {
    await this.playAgain.waitFor({state: "visible"});

    return await this.playAgain.isEnabled();
  }

  /**
   * What one army is worth, read off an attribute rather than off the words, so the line can be
   * reworded without breaking a spec. A missing attribute is a NaN, which no assertion will match.
   */
  async getScore(side: Side): Promise<number> {
    await this.scores.waitFor({state: "visible"});

    return Number(await this.scores.getAttribute(`data-${side}`));
  }

  /**
   * Which army is to move, read from `data-side` rather than from the words on screen, so the
   * wording can change without breaking a spec.
   *
   * The value is validated against the real union, the way `parsePieceKey` does it, so an attribute
   * naming an army that does not exist comes back as "nothing there" rather than as a `Side`.
   */
  async getTurn(): Promise<Side | undefined> {
    await this.container.waitFor({state: "visible"});

    const side = await this.container.getAttribute("data-side");

    return SIDES.find(candidate => candidate === side);
  }
}
