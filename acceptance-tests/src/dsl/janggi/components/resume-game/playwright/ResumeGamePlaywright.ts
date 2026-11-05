import type {ClockReading} from "@src/dsl/janggi/components/types/ClockReading";
import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The dialog a clocked game comes back to after a reload, naming the player to move and turned to face them. */
export class ResumeGamePlaywright extends BaseComponent {
  private readonly dialog: Locator;
  private readonly resumeButton: Locator;
  private readonly clocks: Record<Side, Locator>;

  constructor(page: Page) {
    super(page);

    this.dialog = page.getByTestId("resume-game");
    this.resumeButton = page.getByTestId("resume-game-resume");
    this.clocks = {
      cho: page.getByTestId("resume-game-clock-cho"),
      han: page.getByTestId("resume-game-clock-han"),
    };
  }

  /** Counted, as an absence is its answer. */
  async isShown(): Promise<boolean> {
    return (await this.dialog.count()) > 0;
  }

  async getPlayerToMove(): Promise<Side> {
    const side = await this.dialog.getAttribute("data-side");
    if (side === "cho" || side === "han") return side;

    throw new Error(`The resume dialog names no army: ${side}`);
  }

  async isTurnedToFaceHan(): Promise<boolean> {
    return (await this.dialog.getAttribute("data-flipped")) === "true";
  }

  async getClock(side: Side): Promise<ClockReading> {
    const clock = this.clocks[side];
    await clock.waitFor({state: "visible"});

    return {
      seconds: Number(await clock.getAttribute("data-seconds")),
      periods: Number(await clock.getAttribute("data-periods")),
    };
  }

  async isTextSelectable(): Promise<boolean> {
    return await this.dialog.evaluate(element => getComputedStyle(element).userSelect !== "none");
  }

  async resume(): Promise<void> {
    await this.resumeButton.click();
  }
}
