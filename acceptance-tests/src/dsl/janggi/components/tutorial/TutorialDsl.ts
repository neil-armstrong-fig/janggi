import {DslError} from "@src/dsl/errors/DslError";
import {TutorialPlaywright} from "@src/dsl/janggi/components/tutorial/playwright/TutorialPlaywright";
import type {Page} from "@playwright/test";
import type {Point} from "@src/dsl/janggi/components/types/Point";

/**
 * The guided tutorial over the game: a fixed game whose moves the player is told to make, the card telling them, and the
 * other army answering by itself.
 */
export class TutorialDsl {
  private readonly tutorial: TutorialPlaywright;

  constructor(page: Page) {
    this.tutorial = new TutorialPlaywright(page);
  }

  async isAboveTheDimmingLayer(): Promise<boolean> {
    try {
      return await this.tutorial.isAboveTheDimmingLayer();
    } catch (error) {
      throw new DslError("Failed to check guided-game card readability", error);
    }
  }

  async isShown(): Promise<boolean> {
    try {
      return await this.tutorial.isShown();
    } catch (error) {
      throw new DslError("Failed to check whether the tutorial is shown", error);
    }
  }

  async getStep(): Promise<number> {
    try {
      return await this.tutorial.getStep();
    } catch (error) {
      throw new DslError("Failed to read which step of the tutorial is shown", error);
    }
  }

  async getSpotlightedPoint(): Promise<Point> {
    try {
      return await this.tutorial.getSpotlightedPoint();
    } catch (error) {
      throw new DslError("Failed to read which point the tutorial points at", error);
    }
  }

  async getHeldBackPoint(): Promise<Point> {
    try {
      return await this.tutorial.getHeldBackPoint();
    } catch (error) {
      throw new DslError("Failed to read which point the board marks as held back", error);
    }
  }

  async isSpotlightShown(): Promise<boolean> {
    try {
      return await this.tutorial.isSpotlightShown();
    } catch (error) {
      throw new DslError("Failed to check whether the tutorial's ring is shown", error);
    }
  }

  async waitForTheReply(): Promise<void> {
    try {
      await this.tutorial.waitForTheReply();
    } catch (error) {
      throw new DslError("Failed to wait for the tutorial's scripted answer", error);
    }
  }

  /** Plays the scene on the board to its end, taking each turn the card asks for and waiting for each answer. */
  async playTheScene(): Promise<void> {
    try {
      await this.tutorial.playTheScene();
    } catch (error) {
      throw new DslError("Failed to play the tutorial's scene through", error);
    }
  }

  /** Plays the scene up to its last step, and stops there with that step still to take. */
  async playTheSceneToItsLastStep(): Promise<void> {
    try {
      await this.tutorial.playTheSceneToItsLastStep();
    } catch (error) {
      throw new DslError("Failed to play the tutorial's scene up to its last step", error);
    }
  }

  async goOnToTheNextScene(): Promise<void> {
    try {
      await this.tutorial.goOnToTheNextScene();
    } catch (error) {
      throw new DslError("Failed to go on to the tutorial's next scene", error);
    }
  }

  async goOnToTheClosingCard(): Promise<void> {
    try {
      await this.tutorial.goOnToTheClosingCard();
    } catch (error) {
      throw new DslError("Failed to go on to the tutorial's closing card", error);
    }
  }

  async isClosing(): Promise<boolean> {
    try {
      return await this.tutorial.isClosing();
    } catch (error) {
      throw new DslError("Failed to check whether the tutorial is on its closing card", error);
    }
  }

  async getScene(): Promise<number> {
    try {
      return await this.tutorial.getScene();
    } catch (error) {
      throw new DslError("Failed to read which scene of the tutorial is shown", error);
    }
  }

  async isNextSceneOffered(): Promise<boolean> {
    try {
      return await this.tutorial.isNextSceneOffered();
    } catch (error) {
      throw new DslError("Failed to check whether the tutorial offers a next scene", error);
    }
  }

  async isGameWon(): Promise<boolean> {
    try {
      return await this.tutorial.isGameWon();
    } catch (error) {
      throw new DslError("Failed to check whether the tutorial says its game is won", error);
    }
  }

  async collapse(): Promise<void> {
    try {
      await this.tutorial.collapse();
    } catch (error) {
      throw new DslError("Failed to tuck the tutorial's card away", error);
    }
  }

  async expand(): Promise<void> {
    try {
      await this.tutorial.expand();
    } catch (error) {
      throw new DslError("Failed to bring the tutorial's card back", error);
    }
  }

  async isNarrationShown(): Promise<boolean> {
    try {
      return await this.tutorial.isNarrationShown();
    } catch (error) {
      throw new DslError("Failed to check whether the tutorial's words are shown", error);
    }
  }

  async isTitleShown(): Promise<boolean> {
    try {
      return await this.tutorial.isTitleShown();
    } catch (error) {
      throw new DslError("Failed to check whether the tutorial's title is shown", error);
    }
  }

  async getWords(): Promise<string> {
    try {
      return await this.tutorial.getWords();
    } catch (error) {
      throw new DslError("Failed to read the words on the tutorial's card", error);
    }
  }

  async isUnderTheSettings(): Promise<boolean> {
    try {
      return await this.tutorial.isUnderTheSettings();
    } catch (error) {
      throw new DslError("Failed to check whether the tutorial's card is under the settings", error);
    }
  }

  async finish(): Promise<void> {
    try {
      await this.tutorial.finish();
    } catch (error) {
      throw new DslError("Failed to finish the tutorial", error);
    }
  }

  async leave(): Promise<void> {
    try {
      await this.tutorial.leave();
    } catch (error) {
      throw new DslError("Failed to leave the tutorial", error);
    }
  }
}
