import type {Engine} from "@src/bot/engine/types/Engine";
import type {Search} from "@src/bot/engine/types/Search";
import type {SearchResult} from "@src/bot/engine/types/SearchResult";
import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";
import {bestMoveIn} from "@src/bot/engine/uci-lines/BestMoveIn";
import {evaluationIn} from "@src/bot/engine/uci-lines/EvaluationIn";

/** A search waiting on its `bestmove`, and the last score it reported on the way. */
interface PendingSearch {
  readonly resolve: (result: SearchResult) => void;
  evaluation: number | undefined;
}

/** A line of UCI output someone is waiting for. */
interface Awaited {
  readonly prefix: string;
  readonly resolve: () => void;
}

/**
 * Fairy-Stockfish as an `Engine`, however it was started: the UCI conversation, and nothing about the
 * runtime it is held in.
 *
 * `started` brings the engine up — from a script tag in the page (`createFairyStockfish`), or out of
 * `node_modules` for a test that plays whole games against it (`src/testing/`). Everything after that is
 * here, so the conversation that test holds with the engine is the one the page holds, not a copy.
 *
 * **Nothing is started until the first search.** Starting it defines `janggibot` — Fairy-Stockfish's
 * janggi with automatic bikjang switched off and material counting on, the nearest it comes to our
 * rules (`docs/bot.md`) — and every search after that reuses it.
 *
 * **Searches run one at a time.** UCI is a single conversation, so a search asked for while another
 * is still thinking waits for that one's `bestmove`; `stop` hurries it along, and its answer goes to
 * whoever asked for it, who has usually stopped listening by then.
 */
export function fairyStockfishFrom(started: () => Promise<StockfishModule>, threads: number): Engine {
  let booting: Promise<StockfishModule> | undefined;
  let queue: Promise<unknown> = Promise.resolve();
  let pending: PendingSearch | undefined;
  let awaited: Awaited[] = [];

  return {
    search(search: Search): Promise<SearchResult> {
      const result = queue.then(() => searched(search));
      queue = result.catch(() => undefined);

      return result;
    },

    stop(): void {
      if (pending) void booting?.then(engine => engine.postMessage("stop"));
    },
  };

  async function searched(search: Search): Promise<SearchResult> {
    const engine = await booted();

    engine.postMessage(`setoption name UCI_Elo value ${search.elo}`);
    engine.postMessage(
      `position fen ${search.fen}${search.moves.length > 0 ? ` moves ${search.moves.join(" ")}` : ""}`,
    );

    return await new Promise<SearchResult>(resolve => {
      pending = {resolve, evaluation: undefined};
      engine.postMessage(`go movetime ${search.moveTimeMs} searchmoves ${search.searchMoves.join(" ")}`);
    });
  }

  function booted(): Promise<StockfishModule> {
    booting ??= boot();

    return booting;
  }

  async function boot(): Promise<StockfishModule> {
    const engine = await started();
    engine.addMessageListener(heard);

    engine.FS.writeFile(VARIANT_PATH, VARIANT);
    await answered(engine, "uci", "uciok");

    engine.postMessage(`setoption name VariantPath value ${VARIANT_PATH}`);
    engine.postMessage("setoption name UCI_Variant value janggibot");
    engine.postMessage(`setoption name Threads value ${threads}`);
    engine.postMessage("setoption name UCI_LimitStrength value true");
    await answered(engine, "isready", "readyok");

    return engine;
  }

  function heard(line: string): void {
    const evaluation = evaluationIn(line);
    if (pending && evaluation !== undefined) pending.evaluation = evaluation;

    const bestMove = bestMoveIn(line);
    if (pending && bestMove !== undefined) {
      const finished = pending;
      pending = undefined;
      finished.resolve({bestMove, evaluation: finished.evaluation});
    }

    const matched = awaited.filter(({prefix}) => line.startsWith(prefix));
    awaited = awaited.filter(waiting => !matched.includes(waiting));
    matched.forEach(({resolve}) => resolve());
  }

  function answered(engine: StockfishModule, command: string, prefix: string): Promise<void> {
    return new Promise(resolve => {
      awaited.push({prefix, resolve});
      engine.postMessage(command);
    });
  }
}

const VARIANT_PATH = "/janggibot.ini";

/**
 * Fairy-Stockfish's `janggi` with its automatic bikjang turned off. Our bikjang is *called*, and the bot
 * decides when to call one itself; left on, the engine would treat facing generals as ending the game
 * and forbid moves our rules allow. Material counting stays on, so two passes in a row are a points
 * decision — as they are here in both formats.
 */
const VARIANT = "[janggibot:janggi]\nbikjangRule = false\nmaterialCounting = janggi\n";
