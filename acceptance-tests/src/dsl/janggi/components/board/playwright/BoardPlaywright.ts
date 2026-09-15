import type {Locator, Page} from "@playwright/test";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {parsePieceKey} from "@janggi/shared/janggi/pieces/ParsePieceKey";

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
  async getPieceAt(file: number, rank: number): Promise<Piece | undefined> {
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
    return (await this.cellLocator(file, rank).getAttribute("data-can-move-to")) !== null;
  }

  /** Whether the board is showing this intersection as one the piece in question would land on but for its own army. */
  async isShownAsCovered(file: number, rank: number): Promise<boolean> {
    return (await this.cellLocator(file, rank).getAttribute("data-covered")) !== null;
  }

  /** Whether the board is marking the piece on this intersection as one its owner may move now. */
  async canBeMoved(file: number, rank: number): Promise<boolean> {
    return (await this.cellLocator(file, rank).getAttribute("data-can-be-moved")) !== null;
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

    return {from: pointOf(await from.getAttribute("data-testid")), to: pointOf(await to.getAttribute("data-testid"))};
  }

  /** Whether the intersection is marked as a general under attack. */
  async isMarkedAsUnderAttack(file: number, rank: number): Promise<boolean> {
    return (await this.cellLocator(file, rank).getAttribute("data-under-attack")) !== null;
  }

  /** Whether the intersection is marked as holding a piece that is giving check. */
  async isMarkedAsAttacking(file: number, rank: number): Promise<boolean> {
    return (await this.cellLocator(file, rank).getAttribute("data-attacking")) !== null;
  }

  /**
   * Whether the piece on an intersection is drawn raised off the board, the way a piece in hand is.
   * Asked once every animation on the page has run its course, so a lift still rising or settling is
   * never caught half way.
   */
  async isPieceRaisedAt(file: number, rank: number): Promise<boolean> {
    await this.motionSettled();

    const scale = await this.pieceLocator(file, rank).evaluate(piece => {
      const lifter = piece.parentElement;

      return lifter ? getComputedStyle(lifter).scale : "none";
    });

    return scale !== "none" && Number.parseFloat(scale) > 1;
  }

  /**
   * Whether a piece is shown travelling over the board. Waits for one to appear rather than sampling,
   * because a flight is brief — and so a board that never shows one answers only after that wait.
   */
  async isShowingAPieceInFlight(): Promise<boolean> {
    return await this.appears(this.container.getByTestId("move-flight"));
  }

  /** Whether a capture is shown landing on the board, waiting for it to appear as a flight is waited for. */
  async isShowingAnImpact(): Promise<boolean> {
    return await this.appears(this.container.getByTestId("impact"));
  }

  /**
   * Whether the piece on an intersection ends up drawn fully opaque — every element above it counted,
   * since a piece hidden while its flight is shown is hidden by its wrapper rather than by itself.
   *
   * **Asked only once every animation on the page has finished.** A piece dropping into place passes
   * through full opacity on its way, so a question asked mid-drop could be answered yes by a frame in
   * passing whatever the drop ends on. What is left after that is a short grace for the page to catch
   * up — a flight that has just touched down unhides its piece a moment after its animation ends — and
   * nothing in that time can make a hidden piece look shown and then hide it again.
   */
  async isPieceFullyShownAt(file: number, rank: number): Promise<boolean> {
    const piece = this.pieceLocator(file, rank);
    await this.motionSettled();

    return await this.eventually(async () => {
      const opacity = await piece.evaluate(element => {
        let product = 1;
        for (let node: Element | null = element; node; node = node.parentElement) {
          product *= Number(getComputedStyle(node).opacity);
        }

        return product;
      });

      return opacity === 1;
    }, SETTLED_GRACE_MS);
  }

  /** Whether nothing is left drawn over the board — no piece in flight, no capture landing — once motion settles. */
  async isClearOfMotion(): Promise<boolean> {
    return await this.eventually(async () => {
      const flights = await this.container.getByTestId("move-flight").count();
      const impacts = await this.container.getByTestId("impact").count();

      return flights + impacts === 0;
    });
  }

  /** Whether the board is pushed off where it belongs, waiting for a shake to start as a flight is waited for. */
  async isBeingShaken(): Promise<boolean> {
    return await this.eventually(async () => !(await this.isUnmoved()), SHAKE_STARTS_WITHIN_MS);
  }

  /**
   * Whether the board is back exactly where it belongs. Waits for the capture to finish landing first:
   * a shake starts part way through one, so a board sampled before then would be "at rest" only
   * because it had not been pushed yet.
   */
  async isAtRest(): Promise<boolean> {
    await this.isClearOfMotion();

    return await this.eventually(async () => await this.isUnmoved());
  }

  /**
   * Waits until every animation and transition on the page that ends has ended. One that repeats
   * forever — a general under attack pulsing — is left running, since waiting on it would never finish.
   */
  private async motionSettled(): Promise<void> {
    await this.page.waitForFunction(
      () =>
        document
          .getAnimations()
          .every(
            animation =>
              animation.playState !== "running" || animation.effect?.getComputedTiming().iterations === Infinity,
          ),
      undefined,
      {timeout: SETTLES_WITHIN_MS},
    );
  }

  private async isUnmoved(): Promise<boolean> {
    const translate = await this.container.evaluate(board => getComputedStyle(board).translate);

    return translate === "none" || translate === "0px" || translate === "0px 0px";
  }

  private async appears(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({state: "attached", timeout: APPEARS_WITHIN_MS});
      return true;
    } catch {
      return false;
    }
  }

  /** Asks until the answer is yes, or gives the last answer once motion has had long enough to settle. */
  private async eventually(ask: () => Promise<boolean>, within = SETTLES_WITHIN_MS): Promise<boolean> {
    const deadline = Date.now() + within;

    for (;;) {
      if (await ask()) return true;
      if (Date.now() > deadline) return false;

      await this.page.waitForTimeout(POLL_MS);
    }
  }

  private pieceLocator(file: number, rank: number): Locator {
    return this.cellLocator(file, rank).getByTestId("piece");
  }

  private cellLocator(file: number, rank: number): Locator {
    return this.container.getByTestId(`cell-f${file}r${rank}`);
  }
}

/** Reads a cell's `cell-f<file>r<rank>` test id back into the intersection it names. */
function pointOf(testId: string | null): Point {
  const [, file, rank] = /^cell-f(\d+)r(\d+)$/.exec(testId ?? "") ?? [];
  if (file === undefined || rank === undefined) throw new Error(`Expected a cell's test id, got ${testId}`);

  return {file: Number(file), rank: Number(rank)};
}

/** Longer than any flight or landing lasts, so a piece shown moving at all is caught in the act. */
const APPEARS_WITHIN_MS = 1_500;

/** Longer than a flight, a capture landing and the shake after it take together. */
const SETTLES_WITHIN_MS = 4_000;

/** A shake starts as the capturing piece lands, which is within a flight's length of the tap. */
const SHAKE_STARTS_WITHIN_MS = 1_500;

const POLL_MS = 50;

/**
 * How long, once every animation has finished, the page is given to catch up with it — long enough for
 * a flight that has just touched down to unhide its piece, and no longer.
 */
const SETTLED_GRACE_MS = 500;
