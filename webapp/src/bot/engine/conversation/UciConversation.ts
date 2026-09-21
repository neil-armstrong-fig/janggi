import type {Search} from "@src/bot/engine/types/Search";
import type {SearchResult} from "@src/bot/engine/types/SearchResult";
import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";
import {bestMoveIn} from "@src/bot/engine/conversation/uci-lines/BestMoveIn";
import {evaluationIn} from "@src/bot/engine/conversation/uci-lines/EvaluationIn";

/** A search waiting on its `bestmove`, and the last score it reported on the way. */
interface PendingSearch {
  readonly resolve: (result: SearchResult) => void;
  evaluation: number | undefined;
}

/** A line of UCI output someone is waiting for. */
interface AwaitedLine {
  readonly prefix: string;
  readonly resolve: () => void;
}

/**
 * The UCI conversation held with **one** running engine: what it is told, what it is waited on for, and
 * the search it is in the middle of.
 *
 * Everything the conversation remembers — the search waiting on its `bestmove`, the lines being waited
 * for — belongs to this engine and no other. An engine that is given up on and replaced therefore leaves
 * nothing behind that a late line from it could reach: it can go on talking to a conversation nobody is
 * listening to, and the new engine's conversation never hears of it.
 *
 * UCI is one question at a time, so a search asked for while another is pending is the caller's to queue.
 */
export class UciConversation {
  private readonly engine: StockfishModule;
  private pending: PendingSearch | undefined;
  private awaited: AwaitedLine[] = [];

  constructor(engine: StockfishModule) {
    this.engine = engine;

    engine.addMessageListener(line => {
      this.heard(line);
    });
  }

  /** Puts a file where the engine can read it — how it is handed its variant. */
  writeFile(path: string, contents: string): void {
    this.engine.FS.writeFile(path, contents);
  }

  send(command: string): void {
    this.engine.postMessage(command);
  }

  /** Sends a command, and resolves once the engine has written a line that begins with `reply`. */
  sendAndAwait(command: string, reply: string): Promise<void> {
    return new Promise(resolve => {
      this.awaited.push({prefix: reply, resolve});
      this.send(command);
    });
  }

  /** Puts the search to the engine, and resolves with its `bestmove` and the last score it reported. */
  search(search: Search): Promise<SearchResult> {
    this.send(`setoption name UCI_Elo value ${search.elo}`);
    this.send(positionCommandFor(search));

    return new Promise(resolve => {
      this.pending = {resolve, evaluation: undefined};
      this.send(goCommandFor(search));
    });
  }

  /**
   * Hurries a search along: the engine answers with the best it has so far, and the search still resolves
   * — to whoever asked for it, who has usually stopped listening by then. Does nothing when there is no
   * search, so it can never cut short one that began after the caller decided to stop.
   */
  interrupt(): void {
    if (this.pending) this.send("stop");
  }

  /**
   * Gives up on the search under way: the engine is told to stop, and the search is forgotten, so an
   * answer that turns up late resolves nothing. For an engine that has stopped answering.
   */
  abandon(): void {
    this.pending = undefined;
    this.send("stop");
  }

  private heard(line: string): void {
    const evaluation = evaluationIn(line);
    if (this.pending && evaluation !== undefined) this.pending.evaluation = evaluation;

    const bestMove = bestMoveIn(line);
    if (this.pending && bestMove !== undefined) {
      const finished = this.pending;
      this.pending = undefined;
      finished.resolve({bestMove, evaluation: finished.evaluation});
    }

    const matched = this.awaited.filter(({prefix}) => line.startsWith(prefix));
    this.awaited = this.awaited.filter(waiting => !matched.includes(waiting));
    matched.forEach(({resolve}) => {
      resolve();
    });
  }
}

function positionCommandFor({fen, moves}: Search): string {
  return moves.length > 0 ? `position fen ${fen} moves ${moves.join(" ")}` : `position fen ${fen}`;
}

function goCommandFor({moveTimeMs, searchMoves}: Search): string {
  return `go movetime ${moveTimeMs} searchmoves ${searchMoves.join(" ")}`;
}
