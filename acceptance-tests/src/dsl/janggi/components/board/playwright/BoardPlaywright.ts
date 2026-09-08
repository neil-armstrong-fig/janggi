import type {Locator, Page} from "@playwright/test";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {parsePieceKey} from "@janggi/shared/janggi/pieces/ParsePieceKey";

/** The board's locators, and the only place that knows how a piece is found in the DOM. */
export class BoardPlaywright extends BaseComponent {
  readonly container: Locator;

  constructor(page: Page) {
    super(page);

    this.container = page.getByTestId("board");
  }

  /**
   * Waits rather than sampling. `goto` resolves on the load event, but React mounts after that, so
   * an immediate `isVisible()` would race the first render.
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.container.waitFor({state: "visible"});
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Whether every edge of the board is inside the window.
   *
   * The board is centred in what is left over once the controls have taken their space, so when it
   * is too big for that gap it overflows evenly and the top of it goes off screen with no way to
   * scroll to it. Measuring all four edges is what catches that.
   */
  async isFullyOnScreen(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    const board = await this.container.boundingBox();
    const window = this.page.viewportSize();
    if (!board || !window) return false;

    return (
      board.x >= 0 && board.y >= 0 && board.x + board.width <= window.width && board.y + board.height <= window.height
    );
  }

  async countPieces(): Promise<number> {
    await this.container.waitFor({state: "visible"});

    return await this.container.getByTestId("piece").count();
  }

  /**
   * What stands on one intersection, or undefined where the intersection is empty.
   *
   * The webapp marks each piece with its key and this reads it straight back into a `Piece`, so a
   * spec compares objects rather than strings and cannot typo an army or a piece type. That
   * attribute is the contract: the character or drawing painted on the piece is whichever set is
   * being worn, and says nothing dependable about which piece it is.
   */
  async pieceAt(file: number, rank: number): Promise<Piece | undefined> {
    const piece = this.pieceLocator(file, rank);

    // Most of the board is empty, and asking an element that is not there for an attribute waits
    // for one to appear and then throws. Checking first is what makes "nothing here" an answer.
    if ((await piece.count()) === 0) return undefined;

    const key = await piece.getAttribute("data-piece");

    return key ? parsePieceKey(key) : undefined;
  }

  /**
   * The character painted on a piece, or undefined where the set in use draws a picture instead.
   * The one thing on a piece that does change with the set, and so the only way to tell from
   * outside which of them is being worn.
   */
  async characterAt(file: number, rank: number): Promise<string | undefined> {
    const character = this.pieceLocator(file, rank).locator("text");
    if ((await character.count()) === 0) return undefined;

    return (await character.textContent()) ?? undefined;
  }

  /**
   * How wide a piece is drawn, in pixels. A traditional set is turned in three sizes so that rank
   * is legible by feel before a character has been read; this is how a spec can see that.
   */
  async pieceWidthAt(file: number, rank: number): Promise<number | undefined> {
    const box = await this.pieceLocator(file, rank).boundingBox();

    return box?.width;
  }

  private pieceLocator(file: number, rank: number): Locator {
    return this.container.getByTestId(`cell-f${file}r${rank}`).getByTestId("piece");
  }
}
