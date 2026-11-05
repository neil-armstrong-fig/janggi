import {TakenTrayPlaywright} from "@src/dsl/janggi/components/status/components/player-plaque/components/taken-tray/playwright/TakenTrayPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Page} from "@playwright/test";

/**
 * The tray on an army's plaque of the pieces it has lost, reached as `janggi.status.plaque.takenTray`.
 */
export class TakenTrayDsl {
  private readonly takenTray: TakenTrayPlaywright;

  constructor(page: Page) {
    this.takenTray = new TakenTrayPlaywright(page);
  }

  /** How many of a kind an army has lost, which the tray shows as one piece with a count. */
  async getTakenCount(side: Side, type: PieceType): Promise<number> {
    try {
      return await this.takenTray.getTakenCount(side, type);
    } catch (error) {
      throw new DslError(`Failed to read how many of ${side}'s ${type}s have been taken`, error);
    }
  }

  /** How far along its tray the place for a kind stands, in pixels, whether or not any have been lost. */
  async getTakenSlotOffset(side: Side, type: PieceType): Promise<number> {
    try {
      return await this.takenTray.getTakenSlotOffset(side, type);
    } catch (error) {
      throw new DslError(`Failed to read where ${side}'s tray keeps its ${type}s`, error);
    }
  }

  /** Every piece one army has lost, by kind, most valuable first. */
  async getTakenFrom(side: Side): Promise<PieceType[]> {
    try {
      return await this.takenTray.getTakenFrom(side);
    } catch (error) {
      throw new DslError(`Failed to read what ${side} has lost`, error);
    }
  }

  /** Whether an army's losses tray has a full-size place for every kind it can lose. */
  async canShowAllTakenPieces(side: Side): Promise<boolean> {
    try {
      return await this.takenTray.canShowAllTakenPieces(side);
    } catch (error) {
      throw new DslError(`Failed to read whether every kind taken from ${side} would fit`, error);
    }
  }
}
