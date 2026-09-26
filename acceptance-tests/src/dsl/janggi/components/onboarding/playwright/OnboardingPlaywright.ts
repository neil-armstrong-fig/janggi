import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {Locator, Page} from "@playwright/test";
import {expect} from "@playwright/test";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {SpotlightedPoint} from "@src/dsl/janggi/components/onboarding/types/SpotlightedPoint";
import type {TourTargetName} from "@janggi/shared/janggi/onboarding/TourTargetName";
import type {SoundChoiceName} from "@janggi/shared/janggi/onboarding/SoundChoiceName";

export class OnboardingPlaywright extends BaseComponent {
  private readonly welcome: Locator;
  private readonly next: Locator;
  private readonly skip: Locator;
  private readonly startTour: Locator;
  private readonly tour: Locator;
  private readonly tourStep: Locator;
  private readonly tourTitle: Locator;
  private readonly tourBack: Locator;
  private readonly tourNext: Locator;
  private readonly tourFinish: Locator;
  private readonly tourSkip: Locator;
  private readonly tourText: Locator;
  private readonly tourGuide: Locator;
  private readonly spotlight: Locator;
  private readonly spotlightedPoint: Locator;
  private readonly music: Record<SoundChoiceName, Locator>;
  private readonly soundEffects: Record<SoundChoiceName, Locator>;
  private readonly animations: Record<EffectsName, Locator>;
  private readonly movableHighlight: Record<MovableHighlightName, Locator>;

  constructor(page: Page) {
    super(page);

    this.welcome = page.getByTestId("welcome");
    this.next = page.getByTestId("welcome-next");
    this.skip = page.getByTestId("welcome-skip");
    this.startTour = page.getByTestId("welcome-start-tour");
    this.tour = page.getByTestId("tour");
    this.tourStep = page.getByTestId("tour-step");
    this.tourTitle = page.getByTestId("tour-title");
    this.tourBack = page.getByTestId("tour-back");
    this.tourNext = page.getByTestId("tour-next");
    this.tourFinish = page.getByTestId("tour-finish");
    this.tourSkip = page.getByTestId("tour-skip");
    this.tourText = page.getByTestId("tour-body");
    this.tourGuide = page.getByTestId("tour-open-guide");
    this.spotlight = page.getByTestId("tour-spotlight");
    this.spotlightedPoint = page.locator("[data-testid^='cell-'][data-tour-target='point']");
    this.music = {On: page.getByTestId("welcome-music-on"), Off: page.getByTestId("welcome-music-off")};
    this.soundEffects = {
      On: page.getByTestId("welcome-sound-effects-on"),
      Off: page.getByTestId("welcome-sound-effects-off"),
    };
    this.animations = {
      Full: page.getByTestId("welcome-animations-full"),
      Reduced: page.getByTestId("welcome-animations-reduced"),
    };
    this.movableHighlight = {
      Shown: page.getByTestId("welcome-movable-highlight-shown"),
      Hidden: page.getByTestId("welcome-movable-highlight-hidden"),
    };
  }

  async continueTheWelcome(): Promise<void> {
    await this.next.click();
  }

  async skipTheWelcome(): Promise<void> {
    await this.skip.click();
  }

  async startTheTour(): Promise<void> {
    await this.startTour.click();
  }

  async pressEscape(): Promise<void> {
    await this.page.keyboard.press("Escape");
  }

  async setWelcomeMusicTo(choice: SoundChoiceName): Promise<void> {
    await this.music[choice].click();
  }

  async setWelcomeSoundEffectsTo(choice: SoundChoiceName): Promise<void> {
    await this.soundEffects[choice].click();
  }

  async setWelcomeAnimationsTo(name: EffectsName): Promise<void> {
    await this.animations[name].click();
  }

  async setWelcomeMovableHighlightTo(name: MovableHighlightName): Promise<void> {
    await this.movableHighlight[name].click();
  }

  /** Presses Next, and returns once the tour is on its next step — with the page put as that step wants it. */
  async nextTourStep(): Promise<void> {
    await this.movedOnBy(this.tourNext);
  }

  /** Presses Back, and returns once the tour is on the step before. */
  async previousTourStep(): Promise<void> {
    await this.movedOnBy(this.tourBack);
  }

  async skipTheTour(): Promise<void> {
    await this.tourSkip.click();
  }

  async finishTheTour(): Promise<void> {
    await this.tourFinish.click();
  }

  async isTourShown(): Promise<boolean> {
    return await this.tour.isVisible();
  }

  async canGoBackInTheTour(): Promise<boolean> {
    return await this.tourBack.isEnabled();
  }

  async isFinishOffered(): Promise<boolean> {
    return await this.tourFinish.isVisible();
  }

  /** Which step of the tour is up, counting from one as the card says. */
  async getTourStep(): Promise<number> {
    return Number(await this.tourStep.getAttribute("data-step"));
  }

  async getTourStepCount(): Promise<number> {
    return Number(await this.tourStep.getAttribute("data-step-count"));
  }

  async getTourTitle(): Promise<string> {
    return await this.tourTitle.innerText();
  }

  /** What the spotlight is round, once it has appeared — it follows the step by a frame. */
  async getTourSpotlightTarget(): Promise<TourTargetName> {
    await this.spotlight.waitFor({state: "attached"});

    return (await this.spotlight.getAttribute("data-target")) as TourTargetName;
  }

  /** The point on the board the spotlight is round, read back from its cell's `cell-f<file>r<rank>` test id. */
  async getSpotlightedPoint(): Promise<SpotlightedPoint> {
    await this.spotlightedPoint.waitFor({state: "attached"});

    const testId = await this.spotlightedPoint.getAttribute("data-testid");
    const [, file, rank] = /^cell-f(\d+)r(\d+)$/.exec(testId ?? "") ?? [];

    return {file: Number(file), rank: Number(rank)};
  }

  async getTourText(): Promise<string> {
    return await this.tourText.innerText();
  }

  async isTourGuideLinkForTheGuide(): Promise<boolean> {
    const href = await this.tourGuide.getAttribute("href");

    return (
      href !== null &&
      new URL(href, this.page.url()).href === new URL("learn.html", this.page.url()).href &&
      (await this.tourGuide.getAttribute("target")) === "_blank"
    );
  }

  async isWelcomeShown(): Promise<boolean> {
    return await this.welcome.isVisible();
  }

  async getWelcomeText(): Promise<string> {
    return await this.welcome.innerText();
  }

  private async movedOnBy(button: Locator): Promise<void> {
    const before = await this.tourStep.getAttribute("data-step");

    await button.click();
    await expect(this.tourStep).not.toHaveAttribute("data-step", before ?? "");
  }
}
