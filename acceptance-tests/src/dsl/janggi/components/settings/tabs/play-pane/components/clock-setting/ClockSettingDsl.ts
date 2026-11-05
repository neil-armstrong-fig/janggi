import type {Page} from "@playwright/test";
import {ClockSettingPlaywright} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/clock-setting/playwright/ClockSettingPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlFigure} from "@janggi/shared/janggi/settings/TimeControlFigure";
import type {TimeControlFormat, TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";

/** The switch and picker for the clock in a game between two people at one device, reached as `janggi.settings.play.clock`. */
export class ClockSettingDsl {
  private readonly clock: ClockSettingPlaywright;

  constructor(page: Page) {
    this.clock = new ClockSettingPlaywright(page);
  }

  async turnOn(): Promise<void> {
    try {
      await this.clock.turnOn();
    } catch (error) {
      throw new DslError("Failed to turn the clock on", error);
    }
  }

  async turnOff(): Promise<void> {
    try {
      await this.clock.turnOff();
    } catch (error) {
      throw new DslError("Failed to turn the clock off", error);
    }
  }

  /** Turns the clock on, if it is off, and chooses the format. */
  async setTo(format: TimeControlFormat): Promise<void> {
    try {
      await this.clock.choose(format);
    } catch (error) {
      throw new DslError(`Failed to set the clock to "${format}"`, error);
    }
  }

  /** Turns the clock on, if it is off, chooses Custom and writes the format out. */
  async setCustomTo(timeControl: TimeControl): Promise<void> {
    try {
      await this.clock.writeOut(timeControl);
    } catch (error) {
      throw new DslError("Failed to write out a format for the clock", error);
    }
  }

  /** Clears one field of Custom, types into it a key at a time as a player does, and leaves it. */
  async typeCustomFigure(figure: TimeControlFigure, typed: string): Promise<void> {
    try {
      await this.clock.typeFigure(figure, typed);
    } catch (error) {
      throw new DslError(`Failed to type "${typed}" into the clock's ${figure}`, error);
    }
  }

  async getCustomFigure(figure: TimeControlFigure): Promise<string> {
    try {
      return await this.clock.getFigure(figure);
    } catch (error) {
      throw new DslError(`Failed to read the clock's ${figure}`, error);
    }
  }

  /** Presses the (?) beside the switch, which unfolds what a clock is or folds it away again. */
  async toggleExplanation(): Promise<void> {
    try {
      await this.clock.toggleExplanation();
    } catch (error) {
      throw new DslError("Failed to press the clock's (?)", error);
    }
  }

  async isExplanationShown(): Promise<boolean> {
    try {
      return await this.clock.isExplanationShown();
    } catch (error) {
      throw new DslError("Failed to read whether the clock's explanation is shown", error);
    }
  }

  async getExplanationWords(): Promise<string> {
    try {
      return await this.clock.getExplanationWords();
    } catch (error) {
      throw new DslError("Failed to read the clock's explanation", error);
    }
  }

  /** Whether the formats are there to choose from, which they only are with the clock on. */
  async areFormatsShown(): Promise<boolean> {
    try {
      return await this.clock.areFormatsShown();
    } catch (error) {
      throw new DslError("Failed to read whether the clock's formats are shown", error);
    }
  }

  async getSelected(): Promise<TimeControlName | undefined> {
    try {
      return await this.clock.getSelected();
    } catch (error) {
      throw new DslError("Failed to read what the clock is set to", error);
    }
  }

  /** Whether the clock can be set to something else, which it can only until play begins. */
  async canChange(): Promise<boolean> {
    try {
      return await this.clock.canChange();
    } catch (error) {
      throw new DslError("Failed to check whether the clock can be changed", error);
    }
  }

  /** Whether Custom's figures can be written in, which they can only until play begins. */
  async canWriteOut(): Promise<boolean> {
    try {
      return await this.clock.canWriteOut();
    } catch (error) {
      throw new DslError("Failed to check whether the clock's figures can be written", error);
    }
  }

  /** Whether a player is offered a clock at all, which only two people at one device are. */
  async isOffered(): Promise<boolean> {
    try {
      return await this.clock.isOffered();
    } catch (error) {
      throw new DslError("Failed to check whether a clock is offered", error);
    }
  }
}
