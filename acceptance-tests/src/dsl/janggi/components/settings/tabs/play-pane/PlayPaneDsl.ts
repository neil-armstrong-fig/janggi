import type {GroupAppearance} from "@src/dsl/janggi/components/settings/types/GroupAppearance";
import {PlayPanePlaywright} from "@src/dsl/janggi/components/settings/tabs/play-pane/playwright/PlayPanePlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import {ClockSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/clock-setting/ClockSettingDsl";
import {FlipBoardSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/flip-board-setting/FlipBoardSettingDsl";
import {GamesSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/games-setting/GamesSettingDsl";
import {MatchFormatSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/match-format-setting/MatchFormatSettingDsl";
import {OpponentSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/opponent-setting/OpponentSettingDsl";
import {BotStrengthSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/bot-strength-setting/BotStrengthSettingDsl";
import {YourSideSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/your-side-setting/YourSideSettingDsl";
import {HanSetupSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/han-setup-setting/HanSetupSettingDsl";
import {ChoSetupSettingDsl} from "@src/dsl/janggi/components/settings/tabs/play-pane/components/cho-setup-setting/ChoSetupSettingDsl";
import type {Page} from "@playwright/test";
import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {PlayGroupName} from "@janggi/shared/janggi/settings/PlayGroupName";

/**
 * The Play tab of the settings sheet, reached as `janggi.settings.play`: one member per setting the app draws in it
 * (`webapp/src/react/pages/game/components/settings/tabs/play-pane/`), and what belongs to no single one of them.
 */
export class PlayPaneDsl {
  private readonly playPane: PlayPanePlaywright;

  readonly clock: ClockSettingDsl;
  readonly flipBoard: FlipBoardSettingDsl;
  readonly games: GamesSettingDsl;
  readonly matchFormat: MatchFormatSettingDsl;
  readonly opponent: OpponentSettingDsl;
  readonly botStrength: BotStrengthSettingDsl;
  readonly yourSide: YourSideSettingDsl;
  readonly hanSetup: HanSetupSettingDsl;
  readonly choSetup: ChoSetupSettingDsl;

  constructor(page: Page) {
    this.playPane = new PlayPanePlaywright(page);

    this.clock = new ClockSettingDsl(page);
    this.flipBoard = new FlipBoardSettingDsl(page);
    this.games = new GamesSettingDsl(page);
    this.matchFormat = new MatchFormatSettingDsl(page);
    this.opponent = new OpponentSettingDsl(page);
    this.botStrength = new BotStrengthSettingDsl(page);
    this.yourSide = new YourSideSettingDsl(page);
    this.hanSetup = new HanSetupSettingDsl(page);
    this.choSetup = new ChoSetupSettingDsl(page);
  }

  async isGuidedGameOffered(): Promise<boolean> {
    try {
      return await this.playPane.isGuidedGameOffered();
    } catch (error) {
      throw new DslError("Failed to check the guided-game layout", error);
    }
  }

  async startTheGuidedGame(): Promise<void> {
    try {
      await this.playPane.startTheGuidedGame();
    } catch (error) {
      throw new DslError("Failed to start the guided game", error);
    }
  }

  async getGuidedGameLabel(): Promise<string> {
    try {
      return await this.playPane.getGuidedGameLabel();
    } catch (error) {
      throw new DslError("Failed to read the guided-game label", error);
    }
  }

  async isClockInOpponent(): Promise<boolean> {
    try {
      return await this.playPane.isClockInOpponent();
    } catch (error) {
      throw new DslError("Failed to locate the clock in Opponent", error);
    }
  }

  async isClockVisible(): Promise<boolean> {
    try {
      return await this.playPane.isClockVisible();
    } catch (error) {
      throw new DslError("Failed to check clock visibility", error);
    }
  }

  async getGroupAppearance(name: PlayGroupName): Promise<GroupAppearance> {
    try {
      return await this.playPane.getGroupAppearance(name);
    } catch (error) {
      throw new DslError(`Failed to read the ${name} group's appearance`, error);
    }
  }

  /** Whether a group of the tab is unfolded, its settings in reach, rather than folded to its line. */
  async isGroupOpen(name: PlayGroupName): Promise<boolean> {
    try {
      return await this.playPane.isGroupOpen(name);
    } catch (error) {
      throw new DslError(`Failed to check whether the ${name} group is open`, error);
    }
  }

  /** Whether a group is laid out at all — the clock's is only there for two people at one device. */
  async isGroupOffered(name: PlayGroupName): Promise<boolean> {
    try {
      return await this.playPane.isGroupOffered(name);
    } catch (error) {
      throw new DslError(`Failed to check whether the ${name} group is offered`, error);
    }
  }

  /** The line a group is folded to, saying what it is set to, as the player reads it. */
  async getGroupSummary(name: PlayGroupName): Promise<string> {
    try {
      return await this.playPane.getGroupSummary(name);
    } catch (error) {
      throw new DslError(`Failed to read the ${name} group's line`, error);
    }
  }

  /** Unfolds a group, which folds whichever was open before it. */
  async closeGroup(name: PlayGroupName): Promise<void> {
    try {
      await this.playPane.closeGroup(name);
    } catch (error) {
      throw new DslError(`Failed to close the ${name} settings group`, error);
    }
  }

  async openGroup(name: PlayGroupName): Promise<void> {
    try {
      await this.playPane.openGroup(name);
    } catch (error) {
      throw new DslError(`Failed to open the ${name} group`, error);
    }
  }

  /** Both armies at once, for a spec that only cares that they match. */
  async setBothSetupsTo(name: SetupName): Promise<void> {
    await this.hanSetup.setTo(name);
    await this.choSetup.setTo(name);
  }

  /**
   * Whether either army's arrangement may still be changed. A back rank is set before play.
   *
   * Asks both pickers rather than one. They lock together on the same move count, so asking one
   * would pass just as happily if the other had been left live.
   */
  async canChooseSetups(): Promise<boolean> {
    try {
      return (await this.hanSetup.isChoosable()) && (await this.choSetup.isChoosable());
    } catch (error) {
      throw new DslError("Failed to check whether the setups can still be chosen", error);
    }
  }

  /** Whether the pairing line is shown at all — it is absent where there is no pairing to name. */
  async isElephantPairingShown(): Promise<boolean> {
    try {
      return await this.playPane.isElephantPairingShown();
    } catch (error) {
      throw new DslError("Failed to check whether the pairing line is shown", error);
    }
  }

  /**
   * Whether the two arrangements have come to 맞상 or 엇상, or to neither — the classification that
   * falls out of both choices rather than out of either one, which is why it is here.
   */
  async getElephantPairing(): Promise<ElephantPairing | undefined> {
    try {
      return await this.playPane.getElephantPairing();
    } catch (error) {
      throw new DslError("Failed to read how the two arrangements pair up", error);
    }
  }

  /** The words on the New game button, as the player reads them. */
  async getNewGameLabel(): Promise<string> {
    try {
      return await this.playPane.getNewGameLabel();
    } catch (error) {
      throw new DslError("Failed to read the label on the New game button", error);
    }
  }

  /** Whether the tab offers a fresh game to deal at all. */
  async canStartNewGame(): Promise<boolean> {
    try {
      return await this.playPane.canStartNewGame();
    } catch (error) {
      throw new DslError("Failed to check whether a new game can be started", error);
    }
  }

  /** Deals a fresh game from the format and setups chosen, abandoning whatever was being played. */
  async startNewGame(): Promise<void> {
    try {
      await this.playPane.startNewGame();
    } catch (error) {
      throw new DslError("Failed to start a new game", error);
    }
  }
}
