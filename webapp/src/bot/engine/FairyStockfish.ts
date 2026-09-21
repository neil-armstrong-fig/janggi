import type {Engine} from "@src/bot/engine/types/Engine";
import type {EngineStarter} from "@src/bot/engine/types/EngineStarter";
import type {Search} from "@src/bot/engine/types/Search";
import type {SearchResult} from "@src/bot/engine/types/SearchResult";
import {UciConversation} from "@src/bot/engine/conversation/UciConversation";
import {openJanggibot} from "@src/bot/engine/janggibot/OpenJanggibot";
import {within} from "@src/bot/engine/deadline/Within";

/**
 * Fairy-Stockfish as an `Engine`, however it was started: when it is brought up, when it is given up on,
 * and one search at a time. The conversation with the engine itself is `UciConversation`'s, and how it is
 * set up as `janggibot` is `openJanggibot`'s; nothing here knows the runtime it is held in.
 *
 * `startEngine` brings the engine up — from a script tag in the page (`createFairyStockfish`), or out of
 * `node_modules` for a test that plays whole games against it (`src/testing/`). Everything after that is
 * here, so the conversation that test holds with the engine is the one the page holds, not a copy.
 *
 * **Nothing is started until `prepare` or the first search.** The page calls `prepare` as soon as the bot
 * is the opponent, so the engine is usually up before the first move is made.
 *
 * **An engine that does not come is reported, not waited for.** A start that fails or takes longer than
 * `BOOT_TIMEOUT_MS` rejects, and is forgotten, so the next `prepare` starts afresh instead of replaying
 * the failure. A search that gets no `bestmove` within its own time and `SEARCH_GRACE_MS` rejects too, and
 * the engine that failed to answer is discarded rather than reused.
 *
 * **Searches run one at a time.** UCI is a single conversation, so a search asked for while another
 * is still thinking waits for that one's `bestmove`; `stop` hurries it along, and its answer goes to
 * whoever asked for it, who has usually stopped listening by then.
 */
export class FairyStockfish implements Engine {
  private readonly startEngine: EngineStarter;
  private readonly threads: number;
  private conversation: Promise<UciConversation> | undefined;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(startEngine: EngineStarter, threads: number) {
    this.startEngine = startEngine;
    this.threads = threads;
  }

  async prepare(): Promise<void> {
    await this.conversing();
  }

  search(search: Search): Promise<SearchResult> {
    const result = this.queue.then(() => this.searched(search));
    this.queue = result.catch(() => undefined);

    return result;
  }

  stop(): void {
    void this.conversation?.then(
      conversation => {
        conversation.interrupt();
      },
      () => undefined,
    );
  }

  private async searched(search: Search): Promise<SearchResult> {
    const attempt = this.conversing();
    const conversation = await attempt;
    const deadlineMs = search.moveTimeMs + SEARCH_GRACE_MS;

    try {
      return await within(conversation.search(search), deadlineMs, "The engine did not answer the search");
    } catch (error) {
      conversation.abandon();
      this.forget(attempt);

      throw error;
    }
  }

  /** The conversation with the running engine, starting the engine first if there is none. */
  private conversing(): Promise<UciConversation> {
    if (this.conversation) return this.conversation;

    const attempt = within(this.opened(), BOOT_TIMEOUT_MS, "The engine did not start in time");
    this.conversation = attempt;
    attempt.catch(() => {
      this.forget(attempt);
    });

    return attempt;
  }

  private async opened(): Promise<UciConversation> {
    const conversation = new UciConversation(await this.startEngine());
    await openJanggibot(conversation, this.threads);

    return conversation;
  }

  /** Lets go of the conversation `attempt` was, if it is still the one held — so the next call starts afresh. */
  private forget(attempt: Promise<UciConversation>): void {
    if (this.conversation === attempt) this.conversation = undefined;
  }
}

/**
 * How long the engine has to come up: 1.6 MB of wasm to fetch and compile and its threads to start. It
 * holds the first move of a rated game, so it is generous — a slow phone must not be told the bot is
 * unavailable when it is only late.
 */
const BOOT_TIMEOUT_MS = 45_000;

/**
 * How far past the time it was given a search may run before the engine is taken to have stopped.
 *
 * The engine keeps its own time and answers within milliseconds of `movetime`, so a search that overruns
 * has stopped, not slowed — the slack is only for a device starved of CPU. It is well past the longest
 * thing the bot is ever asked: no rung thinks for more than 2.5 seconds (`MOVE_TIMES_MS`), and a scored
 * layout is rated at a quarter of a second a search (`SETUP_SEARCH_MS`), so this is six times the
 * longest search there is.
 */
const SEARCH_GRACE_MS = 15_000;
