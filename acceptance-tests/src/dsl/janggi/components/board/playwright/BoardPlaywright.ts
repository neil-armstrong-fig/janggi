import type {Locator, Page} from "@playwright/test";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {motionSettled} from "@src/dsl/janggi/components/board/playwright/motion-settled/MotionSettled";
import {parsePieceKey} from "@janggi/shared/janggi/pieces/ParsePieceKey";

/** Ranks 1-5 are Han's half of the board, 6-10 Cho's — the boundary `getSurfaceAt` splits on. */
const HALF_RANK_COUNT = 5;

/** An intersection, as a spec taps it. */
export interface Point {
  readonly file: number;
  readonly rank: number;
}

/** The two intersections the board marks a move on. */
export interface MarkedMove {
  readonly from: Point;
  readonly to: Point;
}

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

  /** Whether the pieces are turned upside down, to face a player sat across the device — read off the screen. */
  async isFlippedForHan(): Promise<boolean> {
    const piece = this.pieceLocator(1, 1);
    await piece.waitFor({state: "visible"});

    return (await piece.evaluate(element => getComputedStyle(element).rotate)) === "180deg";
  }

  async getPieceCount(): Promise<number> {
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
  async getPieceLabelAt(file: number, rank: number): Promise<string | undefined> {
    return (await this.cellLocator(file, rank).getByTestId("piece").getAttribute("aria-label")) ?? undefined;
  }

  async getPieceAt(file: number, rank: number): Promise<Piece | undefined> {
    const piece = this.pieceLocator(file, rank);

    // Most of the board is empty, and asking an element that is not there for an attribute waits
    // for one to appear and then throws. Checking first is what makes "nothing here" an answer.
    if ((await piece.count()) === 0) return undefined;

    const key = await piece.getAttribute("data-piece");

    if (key) {
      return parsePieceKey(key);
    }

    return undefined;
  }

  /**
   * The character painted on a piece, or undefined where the set in use draws a picture instead.
   * The one thing on a piece that does change with the set, and so the only way to tell from
   * outside which of them is being worn.
   */
  async getCharacterAt(file: number, rank: number): Promise<string | undefined> {
    const character = this.pieceLocator(file, rank).locator("text");
    if ((await character.count()) === 0) return undefined;

    return (await character.textContent()) ?? undefined;
  }

  /**
   * How wide a piece is drawn, in pixels. A traditional set is turned in three sizes so that rank
   * is legible by feel before a character has been read; this is how a spec can see that.
   */
  async getPieceWidthAt(file: number, rank: number): Promise<number | undefined> {
    const box = await this.pieceLocator(file, rank).boundingBox();

    return box?.width;
  }

  /** Taps an intersection, the way a player does. `click` rather than `tap`, which needs a touch
   * context the desktop project does not have. */
  async tap(file: number, rank: number): Promise<void> {
    await this.cellLocator(file, rank).click();
  }

  /** Rests the pointer on an intersection without tapping it. */
  async hover(file: number, rank: number): Promise<void> {
    await this.cellLocator(file, rank).hover();
  }

  /** Whether the piece on an intersection is the one currently picked up. */
  async isSelected(file: number, rank: number): Promise<boolean> {
    return (await this.cellLocator(file, rank).getAttribute("aria-pressed")) === "true";
  }

  /** Whether the board is offering this intersection as somewhere the selected piece may go. */
  async canMoveTo(file: number, rank: number): Promise<boolean> {
    return ((await this.cellLocator(file, rank).getAttribute("data-can-move-to")) ?? undefined) !== undefined;
  }

  /** Whether the board is showing this intersection as one the piece in question would land on but for its own army. */
  async isShownAsCovered(file: number, rank: number): Promise<boolean> {
    return ((await this.cellLocator(file, rank).getAttribute("data-covered")) ?? undefined) !== undefined;
  }

  /** Whether the board is marking the piece on this intersection as one its owner may move now. */
  async canBeMoved(file: number, rank: number): Promise<boolean> {
    return ((await this.cellLocator(file, rank).getAttribute("data-can-be-moved")) ?? undefined) !== undefined;
  }

  /** Whether the intersection is marked as the point the last move left. */
  async isMarkedAsMovedFrom(file: number, rank: number): Promise<boolean> {
    return (await this.cellLocator(file, rank).getAttribute("data-last-move")) === "from";
  }

  /** Whether the intersection is marked as the point the last move arrived on. */
  async isMarkedAsMovedTo(file: number, rank: number): Promise<boolean> {
    return (await this.cellLocator(file, rank).getAttribute("data-last-move")) === "to";
  }

  /**
   * The move the board marks as the last one, read off the two marked cells' test ids — or undefined
   * where nothing is marked, because the game has just been dealt or its last turn was not a move.
   */
  async getLastMove(): Promise<MarkedMove | undefined> {
    await this.container.waitFor({state: "visible"});

    const from = this.container.locator("[data-last-move='from']");
    const to = this.container.locator("[data-last-move='to']");
    if ((await from.count()) === 0 || (await to.count()) === 0) return undefined;

    return {
      from: this.pointOf((await from.getAttribute("data-testid")) ?? undefined),
      to: this.pointOf((await to.getAttribute("data-testid")) ?? undefined),
    };
  }

  /** Reads a cell's `cell-f<file>r<rank>` test id back into the intersection it names. */
  private pointOf(testId: string | undefined): Point {
    const [, file, rank] = /^cell-f(\d+)r(\d+)$/.exec(testId ?? "") ?? [];
    if (file === undefined || rank === undefined) throw new Error(`Expected a cell's test id, got ${testId}`);

    return {file: Number(file), rank: Number(rank)};
  }

  /** Whether the intersection is marked as a general under attack. */
  async isMarkedAsUnderAttack(file: number, rank: number): Promise<boolean> {
    return ((await this.cellLocator(file, rank).getAttribute("data-under-attack")) ?? undefined) !== undefined;
  }

  /** Whether the intersection is marked as holding a piece that is giving check. */
  async isMarkedAsAttacking(file: number, rank: number): Promise<boolean> {
    return ((await this.cellLocator(file, rank).getAttribute("data-attacking")) ?? undefined) !== undefined;
  }

  /** Whether the intersection carries the 빅장 label of a move that would let a bikjang be called. */
  async isMarkedAsBikjangRisk(file: number, rank: number): Promise<boolean> {
    const label = this.cellLocator(file, rank).getByTestId("bikjang-risk");
    if ((await label.count()) === 0) return false;

    return (await label.textContent()) === "빅장";
  }

  /** The colour the lines of an intersection are drawn in, as the browser resolves it — `rgb(…)`. */
  async getLineColourAt(file: number, rank: number): Promise<string> {
    return await this.cellLocator(file, rank)
      .locator("svg line")
      .first()
      .evaluate(line => getComputedStyle(line).stroke);
  }

  /**
   * The board's own background behind a rank, as the browser resolves it. Han's half is ranks 1-5,
   * Cho's 6-10 — where the two armies wear different boards, the bottom half is its own layer
   * (`${testId}-bottom-surface`); where they do not, both halves resolve to the one surface.
   */
  async getSurfaceAt(rank: number): Promise<string> {
    const bottomHalf = this.page.getByTestId("board-bottom-surface");
    const inBottomHalf = rank > HALF_RANK_COUNT && (await bottomHalf.count()) > 0;
    const element = inBottomHalf ? bottomHalf : this.container;

    return await element.evaluate(surface => {
      // The shorthand carries layout defaults along with the colour; a gradient shows up as the
      // image and leaves the colour transparent, so read whichever of the two is actually painting.
      const style = getComputedStyle(surface);
      if (style.backgroundImage === "none") {
        return style.backgroundColor;
      }

      return style.backgroundImage;
    });
  }

  /** The colour the line down the open file is drawn in, as the browser resolves it — `rgb(…)` — or undefined with no bikjang called. */
  async getBikjangLineColour(): Promise<string | undefined> {
    return await this.lineStyle("bikjang-line", "stroke");
  }

  /** How thick, in pixels, the line down the open file is drawn, or undefined with no bikjang called. */
  async getBikjangLineWidth(): Promise<number | undefined> {
    const width = await this.lineStyle("bikjang-line", "strokeWidth");

    if (width === undefined) {
      return undefined;
    }

    return Number.parseFloat(width);
  }

  /** The colour the lines of a check are drawn in, as the browser resolves it, or undefined with no check. */
  async getCheckLineColour(): Promise<string | undefined> {
    return await this.lineStyle("check-lines", "stroke");
  }

  private async lineStyle(testId: string, property: "stroke" | "strokeWidth"): Promise<string | undefined> {
    const line = this.page.getByTestId(testId).locator("line").first();
    if ((await line.count()) === 0) return undefined;

    return await line.evaluate((element, name) => getComputedStyle(element)[name], property);
  }

  /** The colour of the dot marking a point the piece in hand may move to, as the browser resolves it. */
  async getMoveHintColourAt(file: number, rank: number): Promise<string> {
    return await this.cellLocator(file, rank)
      .getByTestId("move-hint")
      .evaluate(hint => getComputedStyle(hint).backgroundColor);
  }

  /** The colour washed over the point of the piece in hand, as the browser resolves it. */
  async getSelectionColourAt(file: number, rank: number): Promise<string> {
    return await this.cellLocator(file, rank)
      .getByTestId("selected-wash")
      .evaluate(wash => getComputedStyle(wash).backgroundColor);
  }

  /** How thick the outline of a piece's body is drawn, in the units of the piece — thicker under the pointer. */
  async getPieceOutlineWidthAt(file: number, rank: number): Promise<number> {
    return await this.pieceLocator(file, rank)
      .locator("[stroke-width]")
      .first()
      .evaluate(body => Number.parseFloat(getComputedStyle(body).strokeWidth));
  }

  /** The shadow cast under a piece drawn raised off the board, as the browser resolves it. */
  async getHeldShadowAt(file: number, rank: number): Promise<string> {
    await motionSettled(this.page);

    return await this.pieceLocator(file, rank).evaluate(piece => {
      const lifter = piece.parentElement;

      if (lifter) {
        return getComputedStyle(lifter).filter;
      }

      return "none";
    });
  }

  private pieceLocator(file: number, rank: number): Locator {
    return this.cellLocator(file, rank).getByTestId("piece");
  }

  private cellLocator(file: number, rank: number): Locator {
    return this.container.getByTestId(`cell-f${file}r${rank}`);
  }
}
