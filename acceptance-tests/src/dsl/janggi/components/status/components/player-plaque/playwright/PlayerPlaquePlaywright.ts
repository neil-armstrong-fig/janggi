import type {Locator, Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** Longer than any score takes to roll to its new value. */
const SETTLES_WITHIN_MS = 3_000;

/** Longer than a score's whole roll, so words unchanged for this long have truly come to rest. */
const AT_REST_FOR_MS = 700;

const POLL_MS = 50;

/**
 * The locators behind `PlayerPlaqueDsl` — each army's plaque: its name, its score, and who plays it — the bot, the player, their rating and XP. Every method names the army it asks about.
 */
export class PlayerPlaquePlaywright extends BaseComponent {
  private readonly scores: Record<Side, Locator>;
  private readonly players: Record<Side, Locator>;

  constructor(page: Page) {
    super(page);

    this.scores = {cho: page.getByTestId("score-cho"), han: page.getByTestId("score-han")};
    this.players = {cho: page.getByTestId("plaque-player-cho"), han: page.getByTestId("plaque-player-han")};
  }

  /** Whether an army's plaque marks it as the bot's, read off `data-player` rather than the emoji. */
  async isMarkedAsTheBot(side: Side): Promise<boolean> {
    return (await this.markOn(side)) === "bot";
  }

  /** Whether an army's plaque marks it as the player's own, against the bot. */
  async isMarkedAsThePlayer(side: Side): Promise<boolean> {
    return (await this.markOn(side)) === "player";
  }

  /** What an army's plaque says is playing it, or undefined where it names nobody. */
  private async markOn(side: Side): Promise<string | undefined> {
    const player = this.players[side];
    if ((await player.count()) === 0) return undefined;

    return (await player.getAttribute("data-player")) ?? undefined;
  }

  /**
   * The rating shown on an army's plaque — the bot's strength, or the player's Elo — or undefined where
   * none is shown, as in a game between two people at one device.
   */
  async getShownRating(side: Side): Promise<number | undefined> {
    const player = this.players[side];
    if ((await player.count()) === 0) return undefined;

    return Number(await player.getAttribute("data-elo"));
  }

  /**
   * The XP shown on an army's plaque, or undefined where none is — the bot's own plaque, both plaques
   * in a game between two people, and any plaque on a narrow screen. Read off `data-xp`, since the words
   * are shortened.
   */
  async getShownXp(side: Side): Promise<number | undefined> {
    const xp = this.page.getByTestId(`plaque-xp-${side}`);
    if (!(await xp.isVisible())) return undefined;

    return Number(await xp.getAttribute("data-xp"));
  }

  /** Whether the amount and its XP unit occupy one line rather than breaking apart. */
  async isXpOnOneLine(side: Side): Promise<boolean> {
    const xp = this.page.getByTestId(`plaque-xp-${side}`);
    if ((await xp.count()) === 0) return false;

    return await xp.evaluate(element => {
      const text = document.createRange();
      text.selectNodeContents(element);

      return new Set([...text.getClientRects()].map(rect => rect.top)).size === 1;
    });
  }

  /** The next unlock shown beside an army's XP, or undefined where there is no next unlock. */
  async getNextUnlock(side: Side): Promise<string | undefined> {
    const nextUnlock = this.page.getByTestId(`plaque-next-unlock-${side}`);
    if (!(await nextUnlock.isVisible())) return undefined;

    return (await nextUnlock.textContent()) ?? undefined;
  }

  /**
   * The score an army is shown with once it has come to rest, read off the words rather than the
   * attribute.
   *
   * A score rolls to its new value rather than jumping, passing through the numbers in between — so
   * this waits for the words to **stop changing**, not merely to match, and answers with where they
   * stopped. Matching alone would be caught by a roll passing through the right number on its way to
   * the wrong one.
   */
  async getShownScore(side: Side): Promise<number> {
    const score = this.scores[side];
    await score.waitFor({state: "visible"});

    const deadline = Date.now() + SETTLES_WITHIN_MS;
    let shown = await score.textContent();
    let unchangedSince = Date.now();

    while (Date.now() - unchangedSince < AT_REST_FOR_MS && Date.now() < deadline) {
      await this.page.waitForTimeout(POLL_MS);

      const now = await score.textContent();
      if (now !== shown) {
        shown = now;
        unchangedSince = Date.now();
      }
    }

    return Number(shown);
  }

  /** What an army is called on its plaque. */
  async getArmyName(side: Side): Promise<string> {
    return (await this.page.getByTestId(`plaque-${side}`).getAttribute("aria-label")) ?? "";
  }

  async getScore(side: Side): Promise<number> {
    const score = this.scores[side];
    await score.waitFor({state: "visible"});

    return Number(await score.getAttribute("data-score"));
  }
}
