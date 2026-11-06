import {YouPanePlaywright} from "@src/dsl/janggi/components/settings/tabs/you-pane/playwright/YouPanePlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import {LanguageSettingDsl} from "@src/dsl/janggi/components/settings/tabs/you-pane/components/language-setting/LanguageSettingDsl";
import {ProgressSettingDsl} from "@src/dsl/janggi/components/settings/tabs/you-pane/components/progress-setting/ProgressSettingDsl";
import {InstallButtonDsl} from "@src/dsl/janggi/components/settings/tabs/you-pane/components/install-button/InstallButtonDsl";
import {AccountSettingDsl} from "@src/dsl/janggi/components/settings/tabs/you-pane/components/account-setting/AccountSettingDsl";
import type {Page} from "@playwright/test";
import type {TutorialOffer} from "@janggi/shared/janggi/tutorial/TutorialOffer";

/**
 * The You tab of the settings sheet, reached as `janggi.settings.you`: one member per setting the app draws in it
 * (`webapp/src/react/pages/game/components/settings/tabs/you-pane/`), and what belongs to no single one of them.
 */
export class YouPaneDsl {
  private readonly youPane: YouPanePlaywright;

  readonly language: LanguageSettingDsl;
  readonly progress: ProgressSettingDsl;
  readonly install: InstallButtonDsl;
  readonly account: AccountSettingDsl;

  constructor(page: Page) {
    this.youPane = new YouPanePlaywright(page);

    this.language = new LanguageSettingDsl(page);
    this.progress = new ProgressSettingDsl(page);
    this.install = new InstallButtonDsl(page);
    this.account = new AccountSettingDsl(page);
  }

  async startTheTutorial(): Promise<void> {
    try {
      await this.youPane.startTheTutorial();
    } catch (error) {
      throw new DslError("Failed to start the tutorial from the You tab", error);
    }
  }

  async startTheTutorialOver(): Promise<void> {
    try {
      await this.youPane.startTheTutorialOver();
    } catch (error) {
      throw new DslError("Failed to start the tutorial over from the You tab", error);
    }
  }

  async getTutorialOffer(): Promise<TutorialOffer> {
    try {
      return await this.youPane.getTutorialOffer();
    } catch (error) {
      throw new DslError("Failed to read what the You tab offers of the tutorial", error);
    }
  }

  async canStartTheTutorial(): Promise<boolean> {
    try {
      return await this.youPane.canStartTheTutorial();
    } catch (error) {
      throw new DslError("Failed to check whether the You tab can start the tutorial", error);
    }
  }

  async isTutorialStartOverOffered(): Promise<boolean> {
    try {
      return await this.youPane.isTutorialStartOverOffered();
    } catch (error) {
      throw new DslError("Failed to check whether the You tab offers to start the tutorial over", error);
    }
  }

  async isGuideLinkedFromGame(): Promise<boolean> {
    try {
      return await this.youPane.isGuideLinkedFromGame();
    } catch (error) {
      throw new DslError("Failed to check whether the Janggi guide is linked from the game", error);
    }
  }

  async getGuideAddressInGame(): Promise<string> {
    try {
      return await this.youPane.getGuideAddressInGame();
    } catch (error) {
      throw new DslError("Failed to read where the game's link to the guide goes", error);
    }
  }

  async getReferencesAddressInGame(): Promise<string> {
    try {
      return await this.youPane.getReferencesAddressInGame();
    } catch (error) {
      throw new DslError("Failed to read where the game's link to the references goes", error);
    }
  }

  async getDeveloperWebsiteDestination(): Promise<string> {
    try {
      return await this.youPane.getDeveloperWebsiteDestination();
    } catch (error) {
      throw new DslError("Failed to read where the developer website link leads", error);
    }
  }

  async getRepositoryDestination(): Promise<string> {
    try {
      return await this.youPane.getRepositoryDestination();
    } catch (error) {
      throw new DslError("Failed to read where the Janggi repository link leads", error);
    }
  }

  async getAppVersion(): Promise<string> {
    try {
      return await this.youPane.getAppVersion();
    } catch (error) {
      throw new DslError("Failed to read which build of Janggi is running", error);
    }
  }

  async getVersionWords(): Promise<string> {
    try {
      return await this.youPane.getVersionWords();
    } catch (error) {
      throw new DslError("Failed to read the line that names the build", error);
    }
  }

  async getAppHelpWords(): Promise<string> {
    try {
      return await this.youPane.getAppHelpWords();
    } catch (error) {
      throw new DslError("Failed to read what the app and help links say", error);
    }
  }

  async doExternalAppHelpLinksOpenSeparately(): Promise<boolean> {
    try {
      return await this.youPane.doExternalAppHelpLinksOpenSeparately();
    } catch (error) {
      throw new DslError("Failed to check whether the external App & help links open separately", error);
    }
  }
}
