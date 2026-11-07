import type {AppHelpLink} from "@src/dsl/janggi/components/settings/tabs/you-pane/playwright/types/AppHelpLink";
import type {GroupAppearance} from "@src/dsl/janggi/components/settings/types/GroupAppearance";
import type {YouGroupName} from "@janggi/shared/janggi/settings/YouGroupName";
import type {Locator, Page} from "@playwright/test";
import {TUTORIAL_OFFERS} from "@janggi/shared/janggi/tutorial/TutorialOffer";
import type {TutorialOffer} from "@janggi/shared/janggi/tutorial/TutorialOffer";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The You tab — the part of it that belongs to no single setting: the links to the guide and the references, the App
 * & help links out of the game, and the line naming the build.
 *
 * It holds no other component. Each setting is built by its own `*Dsl` from the page, so this is the counterpart of
 * `YouPaneDsl` and nothing else's parent.
 */
export class YouPanePlaywright extends SettingsSheetComponent {
  private readonly helpLinks: Record<AppHelpLink, Locator>;
  private readonly appVersion: Locator;
  private readonly tutorialStart: Locator;
  private readonly tutorialStartOver: Locator;
  private readonly helpSections: Locator;
  private readonly guidedGameInLearningSection: Locator;
  private readonly sourceCodeInReferenceSection: Locator;
  private readonly appHelp: Locator;
  private readonly progressXp: Locator;
  private readonly languagePicker: Locator;
  private readonly accountSignIn: Locator;
  private readonly guideOpen: Locator;
  private readonly referencesOpen: Locator;
  private readonly versionLine: Locator;
  private readonly developerWebsiteOpen: Locator;
  private readonly repositoryOpen: Locator;

  constructor(page: Page) {
    super(page);
    this.helpLinks = {
      "developer-website-open": page.getByTestId("developer-website-open"),
      "repository-open": page.getByTestId("repository-open"),
    };

    this.appVersion = page.getByTestId("app-version");
    this.tutorialStart = page.getByTestId("tutorial-start");
    this.tutorialStartOver = page.getByTestId("tutorial-start-over");
    this.helpSections = page.getByTestId("app-help").getByTestId("settings-section");
    this.guidedGameInLearningSection = this.helpSections
      .filter({has: page.getByTestId("guide-open")})
      .getByTestId("tutorial-start");
    this.sourceCodeInReferenceSection = this.helpSections
      .filter({has: page.getByTestId("references-open")})
      .getByTestId("repository-open");

    this.appHelp = this.page.getByTestId("app-help");
    this.progressXp = this.page.getByTestId("progress-xp");
    this.languagePicker = this.page.getByTestId("language-picker");
    this.accountSignIn = this.page.getByTestId("account-sign-in");
    this.guideOpen = this.page.getByTestId("guide-open");
    this.referencesOpen = this.page.getByTestId("references-open");
    this.versionLine = this.appVersion.locator("xpath=..");
    this.developerWebsiteOpen = this.page.getByTestId("developer-website-open");
    this.repositoryOpen = this.page.getByTestId("repository-open");
  }

  async isHelpGrouped(): Promise<boolean> {
    return (
      (await this.areLearningLinksGrouped()) &&
      (await this.areReferenceLinksGrouped()) &&
      (await this.hasTwoHelpSections())
    );
  }

  private async areLearningLinksGrouped(): Promise<boolean> {
    return (await this.guidedGameInLearningSection.count()) === 1;
  }

  private async areReferenceLinksGrouped(): Promise<boolean> {
    return (await this.sourceCodeInReferenceSection.count()) === 1;
  }

  private async hasTwoHelpSections(): Promise<boolean> {
    return (await this.helpSections.count()) === 2;
  }

  async getGroupAppearance(name: YouGroupName): Promise<GroupAppearance> {
    return await this.readGroupAppearance(name);
  }

  async isPlayerOverviewVisible(): Promise<boolean> {
    return (
      (await this.appHelp.isVisible()) && (await this.progressXp.isVisible()) && (await this.languagePicker.isVisible())
    );
  }

  async isAccountSignInVisible(): Promise<boolean> {
    return await this.accountSignIn.isVisible();
  }

  async isGroupOpen(name: YouGroupName): Promise<boolean> {
    return await this.settingsGroupNamed(name).isOpen();
  }

  async getGroupSummary(name: YouGroupName): Promise<string> {
    return await this.settingsGroupNamed(name).getSummary(false);
  }

  async openGroup(name: YouGroupName): Promise<void> {
    await this.setGroupOpen(name, true);
  }

  async closeGroup(name: YouGroupName): Promise<void> {
    await this.setGroupOpen(name, false);
  }

  /** Starts the tutorial, or resumes it where the player has come part way, which puts the sheet away itself. */
  async startTheTutorial(): Promise<void> {
    await this.openSheet(this.tutorialStart);
    await this.tutorialStart.click();
  }

  /** Starts the tutorial again from its first scene, where the player had come part way. */
  async startTheTutorialOver(): Promise<void> {
    await this.openSheet(this.tutorialStartOver);
    await this.tutorialStartOver.click();
  }

  /** What the tutorial's button offers, read off its `data-offer`. */
  async getTutorialOffer(): Promise<TutorialOffer> {
    const offer = await this.inSheet(this.tutorialStart, async () => {
      return (await this.tutorialStart.getAttribute("data-offer")) ?? undefined;
    });

    const found = TUTORIAL_OFFERS.find(candidate => candidate === offer);
    if (found === undefined) throw new Error(`The tutorial's button offers "${String(offer)}"`);

    return found;
  }

  async canStartTheTutorial(): Promise<boolean> {
    return await this.inSheet(this.tutorialStart, () => this.tutorialStart.isEnabled());
  }

  async isTutorialStartOverOffered(): Promise<boolean> {
    return await this.inSheet(this.tutorialStart, () => this.tutorialStartOver.isVisible());
  }

  async isGuideLinkedFromGame(): Promise<boolean> {
    const href = (await this.guideOpen.getAttribute("href")) ?? undefined;

    return href !== undefined && new URL(href, this.page.url()).href === new URL("learn.html", this.page.url()).href;
  }

  /** Where the link to the guide in the game goes, as written in the page. */
  async getGuideAddressInGame(): Promise<string> {
    return (await this.guideOpen.getAttribute("href")) ?? "";
  }

  /** Where the link to the references in the game goes, as written in the page. */
  async getReferencesAddressInGame(): Promise<string> {
    return (await this.referencesOpen.getAttribute("href")) ?? "";
  }

  async getDeveloperWebsiteDestination(): Promise<string> {
    return await this.appHelpDestination("developer-website-open");
  }

  async getRepositoryDestination(): Promise<string> {
    return await this.appHelpDestination("repository-open");
  }

  private async appHelpDestination(testId: AppHelpLink): Promise<string> {
    const href = (await this.helpLinks[testId].getAttribute("href")) ?? undefined;
    if (href === undefined) throw new Error(`The ${testId} link has no destination`);

    return href;
  }

  /** The build the app was made from, as the You tab names it. */
  async getAppVersion(): Promise<string> {
    return ((await this.appVersion.textContent()) ?? "").trim();
  }

  /** The line that names the build, with the word for a version in front of it. */
  async getVersionWords(): Promise<string> {
    return ((await this.versionLine.textContent()) ?? "").trim();
  }

  /** What the app and help links in the You tab say, as the player reads them. */
  async getAppHelpWords(): Promise<string> {
    return ((await this.appHelp.textContent()) ?? "").trim();
  }

  async doExternalAppHelpLinksOpenSeparately(): Promise<boolean> {
    const developerWebsite = this.developerWebsiteOpen;
    const repository = this.repositoryOpen;

    return (
      (await developerWebsite.getAttribute("target")) === "_blank" &&
      (await developerWebsite.getAttribute("rel")) === "noopener noreferrer" &&
      (await repository.getAttribute("target")) === "_blank" &&
      (await repository.getAttribute("rel")) === "noopener noreferrer"
    );
  }
}
