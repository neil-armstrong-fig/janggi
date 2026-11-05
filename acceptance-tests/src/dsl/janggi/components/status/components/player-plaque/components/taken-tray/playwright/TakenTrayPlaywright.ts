import type {Locator, Page} from "@playwright/test";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** Every kind except the general, which is checkmated rather than taken. */
const KINDS_AN_ARMY_CAN_LOSE = 6;

/**
 * The locators behind `TakenTrayDsl` — the tray on an army's plaque of the pieces it has lost.
 */
export class TakenTrayPlaywright extends BaseComponent {
  private readonly taken: Record<Side, Locator>;

  constructor(page: Page) {
    super(page);

    this.taken = {cho: page.getByTestId("taken-cho"), han: page.getByTestId("taken-han")};
  }

  /** Whether the losses tray has room for a place for each kind an army can lose, at its full height. */
  async canShowAllTakenPieces(side: Side): Promise<boolean> {
    const tray = await this.taken[side].boundingBox();
    if (!tray) return false;

    return tray.width >= tray.height * KINDS_AN_ARMY_CAN_LOSE;
  }

  /**
   * Every piece an army has lost, one entry per piece, read off the count on each of its tray's places.
   *
   * Waits for the tray to be attached rather than visible: an army that has lost nothing has an empty
   * tray, which has no size to be visible with.
   */
  async getTakenFrom(side: Side): Promise<PieceType[]> {
    const tray = this.taken[side];
    await tray.waitFor({state: "attached"});

    const slots = await tray
      .getByTestId("taken-slot")
      .evaluateAll(found => found.map(slot => [slot.getAttribute("data-type"), slot.getAttribute("data-count")]));

    return slots.flatMap(([name, count]) => {
      const type = PIECE_TYPES.find(candidate => candidate === name);
      if (type) {
        return Array<PieceType>(Number(count)).fill(type);
      }

      return [];
    });
  }

  async getTakenCount(side: Side, type: PieceType): Promise<number> {
    return Number(await this.takenSlot(side, type).getAttribute("data-count"));
  }

  async getTakenSlotOffset(side: Side, type: PieceType): Promise<number> {
    const tray = await this.taken[side].boundingBox();
    const slot = await this.takenSlot(side, type).boundingBox();
    if (!tray || !slot) throw new Error(`${side}'s tray has no place to measure for its ${type}s`);

    return slot.x - tray.x;
  }

  private takenSlot(side: Side, type: PieceType): Locator {
    return this.taken[side].locator(`[data-testid='taken-slot'][data-type='${type}']`);
  }
}
