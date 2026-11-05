import {PlaqueClockPlaywright} from "@src/dsl/janggi/components/status/components/player-plaque/components/plaque-clock/playwright/PlaqueClockPlaywright";
import type {ClockReading} from "@src/dsl/janggi/components/types/ClockReading";
import {DslError} from "@src/dsl/errors/DslError";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Page} from "@playwright/test";

/**
 * An army's clock on its plaque, reached as `janggi.status.plaque.clock`, in a game of two people at one device that has one.
 */
export class PlaqueClockDsl {
  private readonly clock: PlaqueClockPlaywright;

  constructor(page: Page) {
    this.clock = new PlaqueClockPlaywright(page);
  }

  /** What an army's clock shows, in the game of two people at one device that has one. */
  async getClock(side: Side): Promise<ClockReading> {
    try {
      return await this.clock.getClock(side);
    } catch (error) {
      throw new DslError(`Failed to read ${side}'s clock`, error);
    }
  }

  async isClockShown(side: Side): Promise<boolean> {
    try {
      return await this.clock.isClockShown(side);
    } catch (error) {
      throw new DslError(`Failed to check whether ${side}'s plaque shows a clock`, error);
    }
  }
}
