import {clockReadingOf} from "@src/dsl/playwright/clock/ClockReadingOf";
import type {ClockReading} from "@src/dsl/janggi/components/types/ClockReading";
import type {Locator, Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/**
 * The locators behind `PlaqueClockDsl` — an army's clock on its plaque, in a game of two people at one device that has one.
 */
export class PlaqueClockPlaywright extends BaseComponent {
  private readonly scores: Record<Side, Locator>;
  private readonly clocks: Record<Side, Locator>;

  constructor(page: Page) {
    super(page);

    this.scores = {cho: page.getByTestId("score-cho"), han: page.getByTestId("score-han")};
    this.clocks = {cho: page.getByTestId("clock-cho"), han: page.getByTestId("clock-han")};
  }

  /**
   * The clock's seconds and remaining periods, read from figures rather than translated text.
   * Missing figures become NaN, so they cannot pass an assertion for a clock at zero.
   */
  async getClock(side: Side): Promise<ClockReading> {
    return await clockReadingOf(this.clocks[side]);
  }

  /** Asked once the plaque's score is up, so a clock not yet drawn is not taken for one that will not be. */
  async isClockShown(side: Side): Promise<boolean> {
    await this.scores[side].waitFor({state: "visible"});

    return await this.clocks[side].isVisible();
  }
}
