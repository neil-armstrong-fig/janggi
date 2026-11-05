import {DslError} from "@src/dsl/errors/DslError";
import {LookPaneDsl} from "@src/dsl/janggi/components/settings/tabs/look-pane/LookPaneDsl";
import {PlayPaneDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/PlayPaneDsl";
import {SettingsPlaywright} from "@src/dsl/janggi/components/settings/playwright/SettingsPlaywright";
import {SoundPaneDsl} from "@src/dsl/janggi/components/settings/tabs/sound-pane/SoundPaneDsl";
import {YouPaneDsl} from "@src/dsl/janggi/components/settings/tabs/you-pane/YouPaneDsl";
import type {Page} from "@playwright/test";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";

/**
 * The settings sheet, reached as `janggi.settings`.
 *
 * One member per tab, and one member per setting beneath that, so a spec says where a control is and which it means
 * before it says what to do with it — `janggi.settings.look.board.setTo("Neon")`. The tabs are the app's own
 * (`webapp/src/react/pages/game/components/settings/tabs/`), and each setting is its own DSL beside its own
 * `*Playwright`, which keeps a picker's methods, its error messages and its test ids in one place.
 *
 * A setting is named by the label a player reads on the button, and the names come from
 * `@janggi/shared` — so a spec says what a user would say, and asking for a style the app does not
 * ship is a compile error rather than a click that silently times out.
 *
 * What is left here is only the sheet itself and its tabs: opening it, which tab is showing, how the tabs are drawn.
 *
 * None of it asks a spec to open the sheet first. Every action opens it and shuts it again itself —
 * see `SettingsSheetComponent` — so choosing a setting reads the same as it did before there was one.
 */
export class SettingsDsl {
  private readonly settings: SettingsPlaywright;

  readonly play: PlayPaneDsl;
  readonly look: LookPaneDsl;
  readonly sound: SoundPaneDsl;
  readonly you: YouPaneDsl;

  constructor(page: Page) {
    this.settings = new SettingsPlaywright(page);

    this.play = new PlayPaneDsl(page);
    this.look = new LookPaneDsl(page);
    this.sound = new SoundPaneDsl(page);
    this.you = new YouPaneDsl(page);
  }

  /** Opens the sheet and leaves it open, so a spec can watch the board behind it while it chooses. */
  async openTheSettings(): Promise<void> {
    try {
      await this.settings.openTheSettings();
    } catch (error) {
      throw new DslError("Failed to open the settings", error);
    }
  }

  async isOpen(): Promise<boolean> {
    try {
      return await this.settings.isOpen();
    } catch (error) {
      throw new DslError("Failed to read whether the settings are open", error);
    }
  }

  /** Whether a tab's settings are on screen. */
  async isTabShowing(name: SettingsTabName): Promise<boolean> {
    try {
      return await this.settings.isTabShowing(name);
    } catch (error) {
      throw new DslError(`Failed to read whether the "${name}" settings are showing`, error);
    }
  }

  /** Whether a tab is marked as the one chosen. */
  async isTabSelected(name: SettingsTabName): Promise<boolean> {
    try {
      return await this.settings.isTabSelected(name);
    } catch (error) {
      throw new DslError(`Failed to read whether the "${name}" tab is chosen`, error);
    }
  }

  /** The words on a tab, as the player reads them. */
  async getTabLabel(name: SettingsTabName): Promise<string> {
    try {
      return await this.settings.getTabLabel(name);
    } catch (error) {
      throw new DslError(`Failed to read the label on the "${name}" tab`, error);
    }
  }

  /** Whether a tab draws a picture beside its name. */
  async isTabIconShown(name: SettingsTabName): Promise<boolean> {
    try {
      return await this.settings.isTabIconShown(name);
    } catch (error) {
      throw new DslError(`Failed to read whether the "${name}" tab shows an icon`, error);
    }
  }

  /** Whether the selected treatment fills the tab's whole touch target. */
  async doesSelectedTabHighlightFillTab(name: SettingsTabName): Promise<boolean> {
    try {
      return await this.settings.doesSelectedTabHighlightFillTab(name);
    } catch (error) {
      throw new DslError(`Failed to check the size of the "${name}" tab's highlight`, error);
    }
  }

  /** Whether all four tab labels fit beside Close on one touch-sized row. */
  async canTabsFitInOneRow(): Promise<boolean> {
    try {
      return await this.settings.canTabsFitInOneRow();
    } catch (error) {
      throw new DslError("Failed to check that the settings tabs fit in one row", error);
    }
  }

  /** Reads a tab's settings down to their end, and puts the sheet away. */
  async scrollTabToTheEnd(name: SettingsTabName): Promise<void> {
    try {
      await this.settings.scrollTabToTheEnd(name);
    } catch (error) {
      throw new DslError(`Failed to scroll the ${name} settings to their end`, error);
    }
  }

  /** How far a tab's settings are scrolled, in pixels. */
  async getTabScroll(name: SettingsTabName): Promise<number> {
    try {
      return await this.settings.getTabScroll(name);
    } catch (error) {
      throw new DslError(`Failed to read how far the ${name} settings are scrolled`, error);
    }
  }

  /** Shows a tab's pane, putting the others away. */
  async selectTab(name: SettingsTabName): Promise<void> {
    try {
      await this.settings.selectTab(name);
    } catch (error) {
      throw new DslError(`Failed to choose the "${name}" tab`, error);
    }
  }

  /** Whether the open sheet reaches over an intersection of the board, so hiding part of it. */
  async isCoveringTheBoardAt(file: number, rank: number): Promise<boolean> {
    try {
      return await this.settings.isCoveringTheBoardAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether the settings cover file ${file}, rank ${rank}`, error);
    }
  }
}
