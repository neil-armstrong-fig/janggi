import type {Locator, Page} from "@playwright/test";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {parsePieceKey} from "@janggi/shared/janggi/pieces/ParsePieceKey";

/** Where the game says what it is doing, rather than what is standing on it. */
export class StatusPlaywright extends BaseComponent {
  readonly container: Locator;
  private readonly passTurn: Locator;
  private readonly takeBack: Locator;
  private readonly playAgain: Locator;
  private readonly bikjang: Locator;
  private readonly scores: Record<Side, Locator>;
  private readonly taken: Record<Side, Locator>;
  private readonly result: Locator;
  private readonly newGame: Locator;

  constructor(page: Page) {
    super(page);

    this.container = page.getByTestId("turn");
    this.passTurn = page.getByTestId("pass");
    this.takeBack = page.getByTestId("undo");
    this.playAgain = page.getByTestId("redo");
    this.bikjang = page.getByTestId("bikjang");
    this.scores = {cho: page.getByTestId("score-cho"), han: page.getByTestId("score-han")};
    this.taken = {cho: page.getByTestId("taken-cho"), han: page.getByTestId("taken-han")};
    this.result = page.getByTestId("result");
    this.newGame = page.getByTestId("result-new-game");
  }

  /** Presses New game on the announcement of a result. */
  async startNewGame(): Promise<void> {
    await this.newGame.click();
  }

  /**
   * Whether a result is announced over the board. Counted rather than waited for: a game still going
   * has no announcement to wait for, and its absence is the answer.
   */
  async isResultAnnounced(): Promise<boolean> {
    return (await this.result.count()) > 0;
  }

  /**
   * The score an army is shown with once it has come to rest, read off the words rather than the
   * attribute.
   *
   * A score rolls to its new value rather than jumping, passing through the numbers in between — so
   * this waits for the words to **stop changing**, not merely to match, and answers with where they
   * stopped. Matching alone would be caught by a roll passing through the right number on its way to
   * the wrong one.
   */
  async getShownScore(side: Side): Promise<number> {
    const score = this.scores[side];
    await score.waitFor({state: "visible"});

    const deadline = Date.now() + SETTLES_WITHIN_MS;
    let shown = await score.textContent();
    let unchangedSince = Date.now();

    while (Date.now() - unchangedSince < AT_REST_FOR_MS && Date.now() < deadline) {
      await this.page.waitForTimeout(POLL_MS);

      const now = await score.textContent();
      if (now !== shown) {
        shown = now;
        unchangedSince = Date.now();
      }
    }

    return Number(shown);
  }

  /**
   * The kinds of piece one army has lost, read off the `data-piece` of each piece drawn in its tray
   * — the same attribute, and the same parser, as a piece standing on the board.
   *
   * Waits for the tray to be attached rather than visible: an army that has lost nothing has an empty
   * tray, which has no size to be visible with.
   */
  async getTakenFrom(side: Side): Promise<PieceType[]> {
    const tray = this.taken[side];
    await tray.waitFor({state: "attached"});

    const keys = await tray
      .getByTestId("piece")
      .evaluateAll(pieces => pieces.map(piece => piece.getAttribute("data-piece")));

    return keys.flatMap(key => {
      const piece = key ? parsePieceKey(key) : undefined;

      return piece ? [piece.type] : [];
    });
  }

  /**
   * Whether the game is still being laid out — 판차림 — rather than played. Only a scored game ever
   * says so; a casual one puts the usual arrangement out and starts.
   *
   * `getTurn` names the army it is waiting on either way, so a spec asks this first and then asks
   * whose go it is.
   */
  async isLayingOut(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return (await this.container.getAttribute("data-laying-out")) !== null;
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

  async pass(): Promise<void> {
    await this.passTurn.click();
  }

  /** Whether the turn may be rested, which the control says by being enabled or not. */
  async canPass(): Promise<boolean> {
    await this.passTurn.waitFor({state: "visible"});

    return await this.passTurn.isEnabled();
  }

  async callBikjang(): Promise<void> {
    await this.bikjang.click();
  }

  /** Whether a bikjang may be called, which the control says by being enabled or not. */
  async canCallBikjang(): Promise<boolean> {
    await this.bikjang.waitFor({state: "visible"});

    return await this.bikjang.isEnabled();
  }

  /** Whether the game ended drawn, which only a called bikjang in a casual game does. */
  async isDrawn(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return (await this.container.getAttribute("data-drawn")) !== null;
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
   * What one army is worth, read off the `data-score` of that army's own figure rather than off the
   * words, so the plaque can be reworded without breaking a spec. A missing attribute is a NaN, which
   * no assertion will match.
   */
  async getScore(side: Side): Promise<number> {
    const score = this.scores[side];
    await score.waitFor({state: "visible"});

    return Number(await score.getAttribute("data-score"));
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

/** Longer than any score takes to roll to its new value. */
const SETTLES_WITHIN_MS = 3_000;

/** Longer than a score's whole roll, so words unchanged for this long have truly come to rest. */
const AT_REST_FOR_MS = 700;

const POLL_MS = 50;
