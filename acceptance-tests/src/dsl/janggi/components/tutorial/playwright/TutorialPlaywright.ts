import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {isUnderTheSettings} from "@src/dsl/janggi/components/under-the-settings/playwright/IsUnderTheSettings";
import type {Locator, Page} from "@playwright/test";
import type {SpotlightedPoint} from "@src/dsl/janggi/components/types/SpotlightedPoint";

/** More turns than any scene of the tutorial, so a tutorial that never stops asking fails rather than hangs. */
const MOST_TURNS = 200;

export class TutorialPlaywright extends BaseComponent {
  private readonly card: Locator;
  private readonly leaveButton: Locator;
  private readonly finishButton: Locator;
  private readonly nextButton: Locator;
  private readonly collapseButton: Locator;
  private readonly expandButton: Locator;
  private readonly title: Locator;
  private readonly narration: Locator;
  private readonly spotlightedPoint: Locator;
  private readonly spotlight: Locator;
  private readonly heldBackPoint: Locator;

  constructor(page: Page) {
    super(page);

    this.card = page.getByTestId("tutorial");
    this.leaveButton = page.getByTestId("tutorial-leave");
    this.finishButton = page.getByTestId("tutorial-finish");
    this.nextButton = page.getByTestId("tutorial-next");
    this.collapseButton = page.getByTestId("tutorial-collapse");
    this.expandButton = page.getByTestId("tutorial-expand");
    this.title = page.getByTestId("tutorial-title");
    this.narration = page.getByTestId("tutorial-narration");
    this.spotlightedPoint = page.locator("[data-testid^='cell-'][data-tour-target='point']");
    this.spotlight = page.getByTestId("tour-spotlight");
    this.heldBackPoint = page.locator("[data-testid^='cell-'][data-held-back]");
  }

  async isAboveTheDimmingLayer(): Promise<boolean> {
    const cardLayer = await this.card.evaluate(element => Number(getComputedStyle(element).zIndex));
    const spotlightLayer = await this.spotlight.evaluate(element => Number(getComputedStyle(element).zIndex));
    return cardLayer > spotlightLayer;
  }

  async isShown(): Promise<boolean> {
    return await this.card.isVisible();
  }

  /** Which step the card is on, counting from one, as `data-step` carries it. */
  async getStep(): Promise<number> {
    await this.card.waitFor({state: "visible"});

    return Number(await this.card.getAttribute("data-step"));
  }

  async getSpotlightedPoint(): Promise<SpotlightedPoint> {
    const [, file, rank] = /^cell-f(\d+)r(\d+)$/.exec(await this.spotlightedTestId()) ?? [];

    return {file: Number(file), rank: Number(rank)};
  }

  /** The point the board marks as one the piece the step asks for may not go to, the move being held back. */
  async getHeldBackPoint(): Promise<SpotlightedPoint> {
    await this.heldBackPoint.waitFor({state: "attached"});
    const [, file, rank] =
      /^cell-f(\d+)r(\d+)$/.exec((await this.heldBackPoint.getAttribute("data-testid")) ?? "") ?? [];

    return {file: Number(file), rank: Number(rank)};
  }

  async isSpotlightShown(): Promise<boolean> {
    return await this.spotlight.isVisible();
  }

  /** Waits until the other army has made its scripted answer, read off the card saying it is no longer waiting on it. */
  async waitForTheReply(): Promise<void> {
    await this.card.and(this.page.locator("[data-replying='false']")).waitFor({state: "visible"});
  }

  /**
   * Plays the scene on the board to its end, by following the card rather than knowing the script: for a move, the
   * piece it rings and then the point it moves the ring to; for a control (Pass, Bikjang, Draw), the control it rings.
   * Then the other army's answer, until the scene asks for nothing more.
   */
  async playTheScene(): Promise<void> {
    await this.playUntil(undefined);
  }

  /** Plays the scene as `playTheScene` does, but stops with its last step still to take, once that step is up. */
  async playTheSceneToItsLastStep(): Promise<void> {
    await this.playUntil(Number(await this.card.getAttribute("data-steps")));
  }

  /** Starts the scene after the one just finished, from the card's Next. */
  async goOnToTheNextScene(): Promise<void> {
    const scene = await this.card.getAttribute("data-scene");
    await this.nextButton.click();
    await this.card.and(this.page.locator(`:not([data-scene='${scene}'])`)).waitFor({state: "visible"});
  }

  /** Goes on from the last scene's ending to the card that closes the tutorial, from the card's Next. */
  async goOnToTheClosingCard(): Promise<void> {
    await this.nextButton.click();
    await this.card.and(this.page.locator("[data-closing='true']")).waitFor({state: "visible"});
  }

  /** Whether the card is the one that closes the tutorial, after its last scene. */
  async isClosing(): Promise<boolean> {
    await this.card.waitFor({state: "visible"});

    return (await this.card.getAttribute("data-closing")) === "true";
  }

  /** Which scene the card is on, counting from one: the whole game first, then one for each other ending. */
  async getScene(): Promise<number> {
    await this.card.waitFor({state: "visible"});

    return Number(await this.card.getAttribute("data-scene"));
  }

  async isNextSceneOffered(): Promise<boolean> {
    await this.card.waitFor({state: "visible"});

    return (await this.nextButton.count()) > 0;
  }

  /** Whether the card says the tutorial's game has been won. */
  async isGameWon(): Promise<boolean> {
    await this.card.waitFor({state: "visible"});

    return (await this.card.getAttribute("data-won")) === "true";
  }

  /** Tucks the card away to its title, so the board behind it can be seen. */
  async collapse(): Promise<void> {
    await this.collapseButton.click();
    await this.expandButton.waitFor({state: "visible"});
  }

  async expand(): Promise<void> {
    await this.expandButton.click();
    await this.collapseButton.waitFor({state: "visible"});
  }

  async isNarrationShown(): Promise<boolean> {
    await this.card.waitFor({state: "visible"});

    return await this.narration.isVisible();
  }

  async isTitleShown(): Promise<boolean> {
    await this.card.waitFor({state: "visible"});

    return await this.title.isVisible();
  }

  /** Every word on the card, its buttons' included, as written: the scene line is drawn in capitals, so not `innerText`. */
  async getWords(): Promise<string> {
    await this.card.waitFor({state: "visible"});

    return (await this.card.textContent()) ?? "";
  }

  /** Whether an opened settings sheet is drawn over the card, rather than the card over it. */
  async isUnderTheSettings(): Promise<boolean> {
    await this.card.waitFor({state: "visible"});

    return await isUnderTheSettings(this.page, this.card);
  }

  /** Finishes the tutorial from its closing card, which puts the player's own game back as leaving does. */
  async finish(): Promise<void> {
    await this.finishButton.click();
    await this.card.waitFor({state: "hidden"});
  }

  async leave(): Promise<void> {
    await this.leaveButton.click();
    await this.card.waitFor({state: "hidden"});
  }

  /** Takes each turn the card asks for, until it asks for none, or until step `lastStep` is the one up. */
  private async playUntil(lastStep: number | undefined): Promise<void> {
    for (let turns = 0; turns < MOST_TURNS; turns++) {
      await this.waitForTheReply();
      const askingFor = await this.card.getAttribute("data-asking-for");
      if (askingFor === null) return;

      const step = await this.card.getAttribute("data-step");
      if (Number(step) === lastStep) return;

      if (askingFor === "point") {
        await this.makeTheRingedMove();
      } else {
        await this.page.locator(`[data-tour-target='${askingFor}']`).click();
      }
      await this.card.and(this.page.locator(`:not([data-step='${step}'])`)).waitFor({state: "visible"});
    }

    throw new Error(`The tutorial was still asking for turns after ${MOST_TURNS}`);
  }

  private async makeTheRingedMove(): Promise<void> {
    const piece = await this.spotlightedTestId();
    await this.page.getByTestId(piece).click();
    await this.spotlightedPoint.and(this.page.locator(`:not([data-testid='${piece}'])`)).waitFor({state: "attached"});
    await this.page.getByTestId(await this.spotlightedTestId()).click();
  }

  private async spotlightedTestId(): Promise<string> {
    await this.spotlightedPoint.waitFor({state: "attached"});

    return (await this.spotlightedPoint.getAttribute("data-testid")) ?? "";
  }
}
