import {ControlsPlaywright} from "@src/dsl/janggi/components/status/components/controls/playwright/ControlsPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {ControlName} from "@src/dsl/janggi/components/status/components/controls/types/ControlName";
import type {Page} from "@playwright/test";

/**
 * The row of controls under the board — Pass, Bikjang, Draw, Undo, Redo and the settings button — reached as
 * `janggi.status.controls`: pressing them, whether each may be pressed, and where the row sits.
 */
export class ControlsDsl {
  private readonly controls: ControlsPlaywright;

  constructor(page: Page) {
    this.controls = new ControlsPlaywright(page);
  }

  /** The words on a control in the row under the board, as the player reads them. */
  async getControlLabel(control: ControlName): Promise<string> {
    try {
      return await this.controls.getControlLabel(control);
    } catch (error) {
      throw new DslError(`Failed to read the label on the ${control} control`, error);
    }
  }

  /** Rests the turn — 한수쉼 — playing nothing and handing the move to the other army. */
  async pass(): Promise<void> {
    try {
      await this.controls.pass();
    } catch (error) {
      throw new DslError("Failed to rest the turn", error);
    }
  }

  /** Whether the army to move may rest the turn, rather than being obliged to play something. */
  async canPass(): Promise<boolean> {
    try {
      return await this.controls.canPass();
    } catch (error) {
      throw new DslError("Failed to read whether the turn may be rested", error);
    }
  }

  /** Calls the bikjang the two generals are standing in — 빅장, which stops the game. */
  async callBikjang(): Promise<void> {
    try {
      await this.controls.callBikjang();
    } catch (error) {
      throw new DslError("Failed to call the bikjang", error);
    }
  }

  /** Whether there is a bikjang on the board that this format lets the players call. */
  async canCallBikjang(): Promise<boolean> {
    try {
      return await this.controls.canCallBikjang();
    } catch (error) {
      throw new DslError("Failed to read whether a bikjang may be called", error);
    }
  }

  /** Offers the other army a draw, which it may accept or decline. */
  async offerDraw(): Promise<void> {
    try {
      await this.controls.offerDraw();
    } catch (error) {
      throw new DslError("Failed to offer a draw", error);
    }
  }

  /** Whether the army to move may offer a draw. */
  async canOfferDraw(): Promise<boolean> {
    try {
      return await this.controls.canOfferDraw();
    } catch (error) {
      throw new DslError("Failed to read whether a draw may be offered", error);
    }
  }

  /** Takes the last thing played back, whether that was a move or a rested turn. */
  async undo(): Promise<void> {
    try {
      await this.controls.undo();
    } catch (error) {
      throw new DslError("Failed to take the last turn back", error);
    }
  }

  /** Whether there is anything to take back. */
  async canUndo(): Promise<boolean> {
    try {
      return await this.controls.canUndo();
    } catch (error) {
      throw new DslError("Failed to read whether there is anything to take back", error);
    }
  }

  /** Whether the row of controls sits above the board rather than below it. */
  async areControlsAboveTheBoard(): Promise<boolean> {
    try {
      return await this.controls.areControlsAboveTheBoard();
    } catch (error) {
      throw new DslError("Failed to read whether the controls are above the board", error);
    }
  }

  /** Whether the row of controls ends above the bottom strip of the window, where a system bar can sit. */
  async areControlsClearOfTheBottom(clearance: number): Promise<boolean> {
    try {
      return await this.controls.areControlsClearOfTheBottom(clearance);
    } catch (error) {
      throw new DslError("Failed to read whether the controls are clear of the bottom of the window", error);
    }
  }

  /** Whether the row of controls is turned upside down, for a player sat across the device. */
  async areControlsUpsideDown(): Promise<boolean> {
    try {
      return await this.controls.areControlsUpsideDown();
    } catch (error) {
      throw new DslError("Failed to read whether the controls are upside down", error);
    }
  }

  /** Plays again the turn that was most recently taken back. */
  async redo(): Promise<void> {
    try {
      await this.controls.redo();
    } catch (error) {
      throw new DslError("Failed to play the turn that was taken back again", error);
    }
  }

  /** Whether anything taken back is waiting to be played again. */
  async canRedo(): Promise<boolean> {
    try {
      return await this.controls.canRedo();
    } catch (error) {
      throw new DslError("Failed to read whether there is anything to play again", error);
    }
  }
}
