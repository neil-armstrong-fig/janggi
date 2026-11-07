import {appearsWithin} from "@src/dsl/playwright/visibility/AppearsWithin";
import {pollUntil} from "@src/dsl/playwright/polling/PollUntil";
import {cellAt} from "@src/dsl/playwright/board/CellAt";
import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {motionSettled} from "@src/dsl/janggi/components/board/playwright/motion-settled/MotionSettled";

/** Longer than any flight or landing lasts, so a piece shown moving at all is caught in the act. */
const APPEARS_WITHIN_MS = 1_500;

/** Longer than a flight, a capture landing and the shake after it take together. */
const SETTLES_WITHIN_MS = 4_000;

/** A shake starts as the capturing piece lands, which is within a flight's length of the tap. */
const SHAKE_STARTS_WITHIN_MS = 1_500;

/**
 * How long, once every animation has finished, the page is given to catch up with it — long enough for
 * a flight that has just touched down to unhide its piece, and no longer.
 */
const SETTLED_GRACE_MS = 500;

/**
 * The locators behind `MotionDsl` — what the board is doing rather than what stands on it: a piece lifted, in flight,
 * landing or settling, and the board shaking.
 */
export class MotionPlaywright extends BaseComponent {
  private readonly container: Locator;
  private readonly moveFlight: Locator;
  private readonly impact: Locator;

  constructor(page: Page) {
    super(page);

    this.container = page.getByTestId("board");

    this.moveFlight = this.container.getByTestId("move-flight");
    this.impact = this.container.getByTestId("impact");
  }

  /**
   * Whether the piece on an intersection is drawn raised off the board, the way a piece in hand is.
   * Asked once every animation on the page has run its course, so a lift still rising or settling is
   * never caught half way.
   */
  async isPieceRaisedAt(file: number, rank: number): Promise<boolean> {
    await motionSettled(this.page);

    const scale = await this.pieceLocator(file, rank).evaluate(piece => {
      const lifter = piece.parentElement;
      if (lifter) {
        return getComputedStyle(lifter).scale;
      }

      return "none";
    });

    return scale !== "none" && Number.parseFloat(scale) > 1;
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
    await motionSettled(this.page);

    return await this.eventually(async () => {
      const opacity = await piece.evaluate(element => {
        let product = 1;
        for (let node: Element | undefined = element; node; node = node.parentElement ?? undefined) {
          product *= Number(getComputedStyle(node).opacity);
        }

        return product;
      });

      return opacity === 1;
    }, SETTLED_GRACE_MS);
  }

  /**
   * Whether a piece is shown travelling over the board. Waits for one to appear rather than sampling,
   * because a flight is brief — and so a board that never shows one answers only after that wait.
   */
  async isShowingAPieceInFlight(): Promise<boolean> {
    return await this.appears(this.moveFlight);
  }

  /** Whether a capture is shown landing on the board, waiting for it to appear as a flight is waited for. */
  async isShowingAnImpact(): Promise<boolean> {
    return await this.appears(this.impact);
  }

  private async appears(locator: Locator): Promise<boolean> {
    return await appearsWithin(locator, {state: "attached", timeout: APPEARS_WITHIN_MS});
  }

  /** Whether nothing is left drawn over the board — no piece in flight, no capture landing — once motion settles. */
  async isClearOfMotion(): Promise<boolean> {
    return await this.eventually(async () => {
      const flights = await this.moveFlight.count();
      const impacts = await this.impact.count();

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

  /** Asks until the answer is yes, or gives the last answer once motion has had long enough to settle. */
  private async eventually(ask: () => Promise<boolean>, within = SETTLES_WITHIN_MS): Promise<boolean> {
    return await pollUntil(ask, within);
  }

  private async isUnmoved(): Promise<boolean> {
    const translate = await this.container.evaluate(board => getComputedStyle(board).translate);

    return translate === "none" || translate === "0px" || translate === "0px 0px";
  }

  private pieceLocator(file: number, rank: number): Locator {
    return this.cellLocator(file, rank).getByTestId("piece");
  }

  private cellLocator(file: number, rank: number): Locator {
    return cellAt(this.container, file, rank);
  }
}
