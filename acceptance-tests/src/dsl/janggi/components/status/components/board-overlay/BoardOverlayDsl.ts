import {ResultBannerDsl} from "@src/dsl/janggi/components/status/components/board-overlay/components/result-banner/ResultBannerDsl";
import {BoardPeekDsl} from "@src/dsl/janggi/components/status/components/board-overlay/components/board-peek/BoardPeekDsl";
import {DrawOfferDsl} from "@src/dsl/janggi/components/status/components/board-overlay/components/draw-offer/DrawOfferDsl";
import {DrawDeclinedNoteDsl} from "@src/dsl/janggi/components/status/components/board-overlay/components/draw-declined-note/DrawDeclinedNoteDsl";
import {BotEngineNoticeDsl} from "@src/dsl/janggi/components/status/components/board-overlay/components/bot-engine-notice/BotEngineNoticeDsl";
import {BotGoAheadDsl} from "@src/dsl/janggi/components/status/components/board-overlay/components/bot-go-ahead/BotGoAheadDsl";
import {RepetitionNoticeDsl} from "@src/dsl/janggi/components/status/components/board-overlay/components/repetition-notice/RepetitionNoticeDsl";
import type {Page} from "@playwright/test";

/**
 * What the game puts over the board, reached as `janggi.status.overlay`: the result, the draw on offer or turned down,
 * the bot's notices and the note on a held-back repetition. It asks nothing itself, so it has no counterpart, only
 * its children — one per notice, as `webapp/src/react/pages/game/components/status/components/board-overlay/` is.
 */
export class BoardOverlayDsl {
  readonly resultBanner: ResultBannerDsl;
  readonly boardPeek: BoardPeekDsl;
  readonly drawOffer: DrawOfferDsl;
  readonly drawDeclinedNote: DrawDeclinedNoteDsl;
  readonly botEngineNotice: BotEngineNoticeDsl;
  readonly botGoAhead: BotGoAheadDsl;
  readonly repetitionNotice: RepetitionNoticeDsl;

  constructor(page: Page) {
    this.resultBanner = new ResultBannerDsl(page);
    this.boardPeek = new BoardPeekDsl(page);
    this.drawOffer = new DrawOfferDsl(page);
    this.drawDeclinedNote = new DrawDeclinedNoteDsl(page);
    this.botEngineNotice = new BotEngineNoticeDsl(page);
    this.botGoAhead = new BotGoAheadDsl(page);
    this.repetitionNotice = new RepetitionNoticeDsl(page);
  }
}
