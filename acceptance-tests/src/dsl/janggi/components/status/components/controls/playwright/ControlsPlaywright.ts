import type {Locator, Page} from "@playwright/test";
import type {ControlName} from "@src/dsl/janggi/components/status/components/controls/types/ControlName";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/**
 * The locators behind `ControlsDsl` — the row of controls under the board — Pass, Bikjang, Draw, Undo, Redo and the settings button — reached as `janggi.status.controls`: pressing them, whether each may be pressed, and where the row sits.
 */
export class ControlsPlaywright extends BaseComponent {
  private readonly passTurn: Locator;
  private readonly takeBack: Locator;
  private readonly playAgain: Locator;
  private readonly bikjang: Locator;
  private readonly draw: Locator;
  private readonly controls: Record<ControlName, Locator>;

  constructor(page: Page) {
    super(page);

    this.passTurn = page.getByTestId("pass");
    this.takeBack = page.getByTestId("undo");
    this.playAgain = page.getByTestId("redo");
    this.bikjang = page.getByTestId("bikjang");
    this.draw = page.getByTestId("draw");
    this.controls = {
      pass: this.passTurn,
      bikjang: this.bikjang,
      draw: this.draw,
      undo: this.takeBack,
      redo: this.playAgain,
      settings: page.getByTestId("settings-open"),
    };
  }

  /**
   * The words on a control in the row under the board, as written rather than as the stylesheet shows them
   * — they are drawn in capitals, which is the page's look and not what it says.
   */
  async getControlLabel(control: ControlName): Promise<string> {
    return ((await this.controls[control].textContent()) ?? "").trim();
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

  async offerDraw(): Promise<void> {
    await this.draw.click();
  }

  /** Whether a draw may be offered, which the control says by being enabled or not. */
  async canOfferDraw(): Promise<boolean> {
    await this.draw.waitFor({state: "visible"});

    return await this.draw.isEnabled();
  }

  async undo(): Promise<void> {
    await this.takeBack.click();
  }

  /** Whether there is anything to take back, which the control says by being enabled or not. */
  async canUndo(): Promise<boolean> {
    await this.takeBack.waitFor({state: "visible"});

    return await this.takeBack.isEnabled();
  }

  /** Whether the row of controls sits above the board rather than below it — read off the screen. */
  async areControlsAboveTheBoard(): Promise<boolean> {
    await this.takeBack.waitFor({state: "visible"});

    const controls = await this.takeBack.boundingBox();
    const board = await this.page.getByTestId("board").boundingBox();
    if (!controls || !board) throw new Error("Expected the controls and the board to be on screen");

    return controls.y < board.y;
  }

  /**
   * Whether the row of controls ends at least `clearance` pixels above the bottom of the window — the
   * strip a system bar can cover. The controls are the lowest thing on the page.
   */
  async areControlsClearOfTheBottom(clearance: number): Promise<boolean> {
    await this.takeBack.waitFor({state: "visible"});

    const controls = await this.takeBack.boundingBox();
    const window = this.page.viewportSize();
    if (!controls || !window) throw new Error("Expected the controls and the window to be on screen");

    return controls.y + controls.height <= window.height - clearance;
  }

  /** Whether the row of controls is turned upside down, its buttons included. */
  async areControlsUpsideDown(): Promise<boolean> {
    await this.takeBack.waitFor({state: "visible"});

    return (await this.takeBack.locator("..").evaluate(row => getComputedStyle(row).rotate)) === "180deg";
  }

  async redo(): Promise<void> {
    await this.playAgain.click();
  }

  /** Whether anything taken back is waiting to be played again. */
  async canRedo(): Promise<boolean> {
    await this.playAgain.waitFor({state: "visible"});

    return await this.playAgain.isEnabled();
  }
}
