import {DslError} from "@src/dsl/errors/DslError";
import {OnboardingPlaywright} from "@src/dsl/janggi/components/onboarding/playwright/OnboardingPlaywright";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {Page} from "@playwright/test";
import type {SpotlightedPoint} from "@src/dsl/janggi/components/onboarding/types/SpotlightedPoint";
import type {TourTargetName} from "@janggi/shared/janggi/onboarding/TourTargetName";
import type {SoundChoiceName} from "@janggi/shared/janggi/onboarding/SoundChoiceName";

/**
 * What a first-time player is shown before the game: the welcome and the tour over the real page.
 * Only the specs under `tests/onboarding/` ask for a first visit (`useFreshPlayer`); every other spec
 * starts as a returning player, for whom none of this is on the page.
 */
export class OnboardingDsl {
  private readonly onboarding: OnboardingPlaywright;

  constructor(page: Page) {
    this.onboarding = new OnboardingPlaywright(page);
  }

  /** From the welcome's introduction to the choices it offers. */
  async continueTheWelcome(): Promise<void> {
    try {
      await this.onboarding.continueTheWelcome();
    } catch (error) {
      throw new DslError("Failed to go on from the welcome's introduction", error);
    }
  }

  async skipTheWelcome(): Promise<void> {
    try {
      await this.onboarding.skipTheWelcome();
    } catch (error) {
      throw new DslError("Failed to skip the welcome", error);
    }
  }

  async startTheTour(): Promise<void> {
    try {
      await this.onboarding.startTheTour();
    } catch (error) {
      throw new DslError("Failed to start the tour from the welcome", error);
    }
  }

  async pressEscape(): Promise<void> {
    try {
      await this.onboarding.pressEscape();
    } catch (error) {
      throw new DslError("Failed to press Escape", error);
    }
  }

  async setWelcomeMusicTo(choice: SoundChoiceName): Promise<void> {
    try {
      await this.onboarding.setWelcomeMusicTo(choice);
    } catch (error) {
      throw new DslError(`Failed to turn the music ${choice} in the welcome`, error);
    }
  }

  async setWelcomeSoundEffectsTo(choice: SoundChoiceName): Promise<void> {
    try {
      await this.onboarding.setWelcomeSoundEffectsTo(choice);
    } catch (error) {
      throw new DslError(`Failed to turn the sound effects ${choice} in the welcome`, error);
    }
  }

  async setWelcomeAnimationsTo(name: EffectsName): Promise<void> {
    try {
      await this.onboarding.setWelcomeAnimationsTo(name);
    } catch (error) {
      throw new DslError(`Failed to set the animations to ${name} in the welcome`, error);
    }
  }

  async setWelcomeMovableHighlightTo(name: MovableHighlightName): Promise<void> {
    try {
      await this.onboarding.setWelcomeMovableHighlightTo(name);
    } catch (error) {
      throw new DslError(`Failed to set the movable-piece mark to ${name} in the welcome`, error);
    }
  }

  async nextTourStep(): Promise<void> {
    try {
      await this.onboarding.nextTourStep();
    } catch (error) {
      throw new DslError("Failed to go on to the tour's next step", error);
    }
  }

  async previousTourStep(): Promise<void> {
    try {
      await this.onboarding.previousTourStep();
    } catch (error) {
      throw new DslError("Failed to go back to the tour's previous step", error);
    }
  }

  async skipTheTour(): Promise<void> {
    try {
      await this.onboarding.skipTheTour();
    } catch (error) {
      throw new DslError("Failed to skip the tour", error);
    }
  }

  async finishTheTour(): Promise<void> {
    try {
      await this.onboarding.finishTheTour();
    } catch (error) {
      throw new DslError("Failed to finish the tour", error);
    }
  }

  async isTourShown(): Promise<boolean> {
    try {
      return await this.onboarding.isTourShown();
    } catch (error) {
      throw new DslError("Failed to check whether the tour is shown", error);
    }
  }

  async canGoBackInTheTour(): Promise<boolean> {
    try {
      return await this.onboarding.canGoBackInTheTour();
    } catch (error) {
      throw new DslError("Failed to check whether the tour can go back", error);
    }
  }

  async isFinishOffered(): Promise<boolean> {
    try {
      return await this.onboarding.isFinishOffered();
    } catch (error) {
      throw new DslError("Failed to check whether the tour offers to finish", error);
    }
  }

  async getTourStep(): Promise<number> {
    try {
      return await this.onboarding.getTourStep();
    } catch (error) {
      throw new DslError("Failed to read which step of the tour is up", error);
    }
  }

  async getTourStepCount(): Promise<number> {
    try {
      return await this.onboarding.getTourStepCount();
    } catch (error) {
      throw new DslError("Failed to read how many steps the tour has", error);
    }
  }

  async getTourTitle(): Promise<string> {
    try {
      return await this.onboarding.getTourTitle();
    } catch (error) {
      throw new DslError("Failed to read the tour step's title", error);
    }
  }

  async getTourSpotlightTarget(): Promise<TourTargetName> {
    try {
      return await this.onboarding.getTourSpotlightTarget();
    } catch (error) {
      throw new DslError("Failed to read what the tour's spotlight is round", error);
    }
  }

  /** The point on the board the tour is pointing at. */
  async getSpotlightedPoint(): Promise<SpotlightedPoint> {
    try {
      return await this.onboarding.getSpotlightedPoint();
    } catch (error) {
      throw new DslError("Failed to read the point on the board the tour is pointing at", error);
    }
  }

  async getTourText(): Promise<string> {
    try {
      return await this.onboarding.getTourText();
    } catch (error) {
      throw new DslError("Failed to read what the tour step says", error);
    }
  }

  async isTourGuideLinkForTheGuide(): Promise<boolean> {
    try {
      return await this.onboarding.isTourGuideLinkForTheGuide();
    } catch (error) {
      throw new DslError("Failed to check where the tour's guide link leads", error);
    }
  }

  async isWelcomeShown(): Promise<boolean> {
    try {
      return await this.onboarding.isWelcomeShown();
    } catch (error) {
      throw new DslError("Failed to check whether the welcome is shown", error);
    }
  }

  async getWelcomeText(): Promise<string> {
    try {
      return await this.onboarding.getWelcomeText();
    } catch (error) {
      throw new DslError("Failed to read the welcome", error);
    }
  }
}
