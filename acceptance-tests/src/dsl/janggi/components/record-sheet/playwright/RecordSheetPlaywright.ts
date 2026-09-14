import type {Locator, Page} from "@playwright/test";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** One row of the record: every game played against one strength of bot, and how each ended. */
export interface GamesAgainst {
  readonly played: number;
  readonly won: number;
  readonly drawn: number;
  readonly lost: number;
}

/**
 * The player's record against the bot — a sheet that slides up over the game, reached from the
 * settings sheet, with a tab for each match format because the two are rated apart.
 *
 * Every read opens the sheet, picks the format's tab, reads, and closes it again, so a spec asks for a
 * figure the way it asks for a score and never has to say where it is standing. That is the settings
 * sheet's `inSheet` again. Like that sheet it is always in the page and only `inert` while closed,
 * which is what closing waits for.
 */
export class RecordSheetPlaywright extends BaseComponent {
  private readonly settingsOpener: Locator;
  private readonly opener: Locator;
  private readonly closer: Locator;
  private readonly closed: Locator;
  private readonly tabs: Record<MatchFormat, Locator>;
  private readonly elo: Locator;
  private readonly board: Locator;
  private readonly reset: Locator;
  private readonly confirmReset: Locator;

  constructor(page: Page) {
    super(page);

    this.settingsOpener = page.getByTestId("settings-open");
    this.opener = page.getByTestId("record-open");
    this.closer = page.getByTestId("record-close");
    this.closed = page.locator("[data-testid='record'][inert]");
    this.tabs = {
      Casual: page.getByTestId("record-tab-casual"),
      Scored: page.getByTestId("record-tab-scored"),
    };
    this.elo = page.getByTestId("record-elo");
    this.board = page.getByTestId("board");
    this.reset = page.getByTestId("record-reset");
    this.confirmReset = page.getByTestId("record-reset-confirm");
  }

  /** Clears the record, answering the question the reset asks before it does anything. */
  async resetRecord(): Promise<void> {
    await this.onTab("Casual", async () => {
      await this.reset.click();
      await this.confirmReset.click();
    });
  }

  /**
   * Whether the game is still on the page while the record is open over it — counted rather than
   * waited for, since a board that has gone is the answer rather than something to wait out.
   */
  async isGameStillBeneath(): Promise<boolean> {
    return await this.onTab("Casual", async () => (await this.board.count()) > 0);
  }

  async getElo(format: MatchFormat): Promise<number> {
    return await this.onTab(format, async () => Number(await this.elo.getAttribute("data-elo")));
  }

  async getGamesAgainst(format: MatchFormat, elo: BotElo): Promise<GamesAgainst> {
    return await this.onTab(format, async () => {
      const row = this.page.getByTestId(`record-row-${elo}`);

      return {
        played: Number(await row.getAttribute("data-played")),
        won: Number(await row.getAttribute("data-won")),
        drawn: Number(await row.getAttribute("data-drawn")),
        lost: Number(await row.getAttribute("data-lost")),
      };
    });
  }

  /** Opens the record on one format's tab, reads it, and closes it again. */
  private async onTab<Read>(format: MatchFormat, read: () => Promise<Read>): Promise<Read> {
    await this.settingsOpener.click();
    await this.opener.click();
    await this.tabs[format].click();
    await this.elo.waitFor({state: "visible"});

    const answer = await read();

    await this.closer.click();
    await this.closed.waitFor({state: "attached"});

    return answer;
  }
}
