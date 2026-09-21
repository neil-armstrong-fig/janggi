import type {Locator, Page} from "@playwright/test";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {parsePieceKey} from "@janggi/shared/janggi/pieces/ParsePieceKey";

/** Longer than any score takes to roll to its new value. */
const SETTLES_WITHIN_MS = 3_000;

const BOT_REPLIES_WITHIN_MS = 20_000;

/** The engine's download, compile and thread start, which the bot's first reply used to include. */
const BOT_LOADS_WITHIN_MS = 20_000;

/** Well past the bot's least thinking time and the engine's first load, at the bottom rung. */
const BOT_OPENS_WITHIN_MS = 4_000;

/** Longer than a score's whole roll, so words unchanged for this long have truly come to rest. */
const AT_REST_FOR_MS = 700;

const POLL_MS = 50;

/** Every piece except its general, which is checkmated rather than taken. */
const MOST_PIECES_AN_ARMY_CAN_LOSE = 15;

/** Where the game says what it is doing, rather than what is standing on it. */
export class StatusPlaywright extends BaseComponent {
  readonly container: Locator;
  private readonly passTurn: Locator;
  private readonly takeBack: Locator;
  private readonly playAgain: Locator;
  private readonly bikjang: Locator;
  private readonly scores: Record<Side, Locator>;
  private readonly taken: Record<Side, Locator>;
  private readonly result: Locator;
  private readonly resultExplanation: Locator;
  private readonly resultXpBar: Locator;
  private readonly newGame: Locator;
  private readonly players: Record<Side, Locator>;
  private readonly botGoAhead: Locator;
  private readonly botEngineRetry: Locator;
  private readonly repetitionNotice: Locator;

  constructor(page: Page) {
    super(page);

    this.container = page.getByTestId("turn");
    this.passTurn = page.getByTestId("pass");
    this.takeBack = page.getByTestId("undo");
    this.playAgain = page.getByTestId("redo");
    this.bikjang = page.getByTestId("bikjang");
    this.scores = {cho: page.getByTestId("score-cho"), han: page.getByTestId("score-han")};
    this.taken = {cho: page.getByTestId("taken-cho"), han: page.getByTestId("taken-han")};
    this.result = page.getByTestId("result");
    this.resultExplanation = page.getByTestId("result-explanation");
    this.resultXpBar = page.getByTestId("result-xp-bar");
    this.newGame = page.getByTestId("result-new-game");
    this.players = {cho: page.getByTestId("plaque-player-cho"), han: page.getByTestId("plaque-player-han")};
    this.botGoAhead = page.getByTestId("bot-go-ahead");
    this.botEngineRetry = page.getByTestId("bot-engine-retry");
    this.repetitionNotice = page.getByTestId("repetition-notice");
  }

  /**
   * Lets as long pass as a bottom-rung bot takes to open, engine load included. A fixed wait, because
   * what it serves is a claim that something does **not** happen — the bot playing a move nobody let
   * it — and there is no attribute to wait on for the absence of a move.
   */
  async giveTheBotTimeToOpen(): Promise<void> {
    await this.page.waitForTimeout(BOT_OPENS_WITHIN_MS);
  }

  /**
   * Whether the turn line says the bot's engine is still loading. Counted rather than waited for: it is
   * derived from the store in the same render that chooses the bot, so its absence is the answer.
   */
  async isWaitingForTheBotToLoad(): Promise<boolean> {
    return (await this.page.locator("[data-testid='turn'][data-bot-loading]").count()) > 0;
  }

  /** Whether the turn line says the bot's engine could not be started. */
  async isTheBotUnavailable(): Promise<boolean> {
    return (await this.page.locator("[data-testid='turn'][data-bot-unavailable]").count()) > 0;
  }

  /** Waits for the bot's engine to finish loading, which the turn line marks with `data-bot-loading`. */
  async waitForTheBotToLoad(): Promise<void> {
    await this.container.waitFor({state: "visible"});
    await this.page
      .locator("[data-testid='turn'][data-bot-loading]")
      .waitFor({state: "detached", timeout: BOT_LOADS_WITHIN_MS});
  }

  /** Presses the button over the board that tries to start the bot's engine again. */
  async retryTheBot(): Promise<void> {
    await this.botEngineRetry.click();
  }

  /**
   * Presses the button over the board that lets the bot make the game's first move. The button is not
   * there while the bot's engine is loading, so this waits for that first.
   */
  async letTheBotStart(): Promise<void> {
    await this.waitForTheBotToLoad();
    await this.botGoAhead.click();
  }

  /**
   * Whether the board is holding the bot's first move until the player lets it start. Counted rather
   * than waited for: the button is drawn in the same render as the change that puts the bot on move —
   * **once the bot's engine is up**. While it is loading a notice covers the board instead, so this waits
   * for that first, or it would count no button for as long as the engine took.
   */
  async isWaitingToLetTheBotStart(): Promise<boolean> {
    await this.waitForTheBotToLoad();

    return (await this.botGoAhead.count()) > 0;
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
   * The XP shown on an army's plaque, or undefined where none is — the bot's own plaque, and both
   * plaques in a game between two people. Read off `data-xp`, since the words are shortened.
   */
  async getShownXp(side: Side): Promise<number | undefined> {
    const xp = this.page.getByTestId(`plaque-xp-${side}`);
    if ((await xp.count()) === 0) return undefined;

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

  /**
   * How full the XP bar on the announced result is, in whole percent, or undefined where the result draws
   * none — no result yet, a game between two people, or everything already unlocked.
   */
  async getResultXpBarPercent(): Promise<number | undefined> {
    if ((await this.resultXpBar.count()) === 0) return undefined;

    return Number(await this.resultXpBar.getAttribute("data-percent"));
  }

  /** The next unlock shown beside an army's XP, or undefined where there is no next unlock. */
  async getNextUnlock(side: Side): Promise<string | undefined> {
    const nextUnlock = this.page.getByTestId(`plaque-next-unlock-${side}`);
    if (!(await nextUnlock.isVisible())) return undefined;

    return (await nextUnlock.textContent()) ?? undefined;
  }

  /** Whether the losses tray has room for all fifteen capturable pieces at its full height. */
  async canShowAllTakenPieces(side: Side): Promise<boolean> {
    const tray = await this.taken[side].boundingBox();
    if (!tray) return false;

    return tray.width >= tray.height * MOST_PIECES_AN_ARMY_CAN_LOSE;
  }

  /**
   * The army an announced result says called the bikjang that ended the game, or undefined where the
   * announcement explains no bikjang.
   */
  async getBikjangCaller(): Promise<Side | undefined> {
    if ((await this.resultExplanation.count()) === 0) return undefined;

    const caller = await this.resultExplanation.getAttribute("data-called-by");

    return SIDES.find(candidate => candidate === caller);
  }

  /** Whether a note over the board explains that a move repeating the position is being held back. */
  async isRepetitionExplained(): Promise<boolean> {
    return (await this.repetitionNotice.count()) > 0;
  }

  /**
   * The turn line carries `data-bot-to-move` for exactly as long as the bot is the one being waited on,
   * so this waits for it to go. It is derived from the position on every render, never set by a timer,
   * so it is already there by the time the tap that handed the bot its turn returns.
   *
   * A generous timeout of its own, because the first reply includes loading the engine.
   */
  async waitForTheBot(): Promise<void> {
    await this.container.waitFor({state: "visible"});
    await this.page
      .locator("[data-testid='turn'][data-bot-to-move]")
      .waitFor({state: "detached", timeout: BOT_REPLIES_WITHIN_MS});
  }

  /** Presses New game on the announcement of a result. */
  async startNewGame(): Promise<void> {
    await this.newGame.click();
  }

  /**
   * Whether a result is announced over the board. Counted rather than waited for: a game still going
   * has no announcement to wait for, and its absence is the answer.
   */
  async isResultAnnounced(): Promise<boolean> {
    return (await this.result.count()) > 0;
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

  /**
   * The kinds of piece one army has lost, read off the `data-piece` of each piece drawn in its tray
   * — the same attribute, and the same parser, as a piece standing on the board.
   *
   * Waits for the tray to be attached rather than visible: an army that has lost nothing has an empty
   * tray, which has no size to be visible with.
   */
  async getTakenFrom(side: Side): Promise<PieceType[]> {
    const tray = this.taken[side];
    await tray.waitFor({state: "attached"});

    const keys = await tray
      .getByTestId("piece")
      .evaluateAll(pieces => pieces.map(piece => piece.getAttribute("data-piece")));

    return keys.flatMap(key => {
      const piece = key ? parsePieceKey(key) : undefined;

      return piece ? [piece.type] : [];
    });
  }

  /**
   * Whether the game is still being laid out — 판차림 — rather than played. Only a scored game ever
   * says so; a casual one puts the usual arrangement out and starts.
   *
   * `getTurn` names the army it is waiting on either way, so a spec asks this first and then asks
   * whose go it is.
   */
  async isLayingOut(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return (await this.container.getAttribute("data-laying-out")) !== null;
  }

  /** Whether the army to move is in check. */
  async isInCheck(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return (await this.container.getAttribute("data-in-check")) !== null;
  }

  /** The army that has won, or undefined while the game is still being played. */
  async getWinner(): Promise<Side | undefined> {
    await this.container.waitFor({state: "visible"});

    const winner = await this.container.getAttribute("data-winner");

    return SIDES.find(candidate => candidate === winner);
  }

  async pass(): Promise<void> {
    await this.passTurn.click();
  }

  /** Whether the turn may be rested, which the control says by being enabled or not. */
  async canPass(): Promise<boolean> {
    await this.passTurn.waitFor({state: "visible"});

    return await this.passTurn.isEnabled();
  }

  async callBikjang(): Promise<void> {
    await this.bikjang.click();
  }

  /** Whether a bikjang may be called, which the control says by being enabled or not. */
  async canCallBikjang(): Promise<boolean> {
    await this.bikjang.waitFor({state: "visible"});

    return await this.bikjang.isEnabled();
  }

  /** Whether the game ended drawn, which only a called bikjang in a casual game does. */
  async isDrawn(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return (await this.container.getAttribute("data-drawn")) !== null;
  }

  async undo(): Promise<void> {
    await this.takeBack.click();
  }

  /** Whether there is anything to take back, which the control says by being enabled or not. */
  async canUndo(): Promise<boolean> {
    await this.takeBack.waitFor({state: "visible"});

    return await this.takeBack.isEnabled();
  }

  async redo(): Promise<void> {
    await this.playAgain.click();
  }

  /** Whether anything taken back is waiting to be played again. */
  async canRedo(): Promise<boolean> {
    await this.playAgain.waitFor({state: "visible"});

    return await this.playAgain.isEnabled();
  }

  /**
   * What one army is worth, read off the `data-score` of that army's own figure rather than off the
   * words, so the plaque can be reworded without breaking a spec. A missing attribute is a NaN, which
   * no assertion will match.
   */
  async getScore(side: Side): Promise<number> {
    const score = this.scores[side];
    await score.waitFor({state: "visible"});

    return Number(await score.getAttribute("data-score"));
  }

  /**
   * Which army is to move, read from `data-side` rather than from the words on screen, so the
   * wording can change without breaking a spec.
   *
   * The value is validated against the real union, the way `parsePieceKey` does it, so an attribute
   * naming an army that does not exist comes back as "nothing there" rather than as a `Side`.
   */
  async getTurn(): Promise<Side | undefined> {
    await this.container.waitFor({state: "visible"});

    const side = await this.container.getAttribute("data-side");

    return SIDES.find(candidate => candidate === side);
  }
}
