import type {Search} from "@src/bot/engine/types/Search";
import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";
import {FairyStockfish} from "@src/bot/engine/FairyStockfish";
import {afterEach, beforeEach, expect, it, vi} from "vitest";

/** An engine that speaks UCI as far as `FairyStockfish` listens, and answers a search only when told to. */
interface FakeEngine extends StockfishModule {
  readonly say: (line: string) => void;
}

/** What a fake engine is told to do. */
interface FakeEngineBehaviour {
  /** What its `go` is answered with, straight away — without it the engine hears the search and says nothing. */
  readonly answers?: string;
}

const SEARCH: Search = {
  fen: "the start",
  moves: [],
  searchMoves: ["a1a2", "b1b2"],
  elo: 800,
  moveTimeMs: 1_000,
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("starts the engine once however many times it is prepared", async () => {
  const started = vi.fn(() => Promise.resolve(fakeEngine()));
  const engine = new FairyStockfish(started, 1);

  await Promise.all([engine.prepare(), engine.prepare()]);
  await engine.prepare();

  expect(started).toHaveBeenCalledTimes(1);
});

it("answers a search with the engine's bestmove and the last score it reported", async () => {
  const engine = new FairyStockfish(() => Promise.resolve(fakeEngine({answers: "e2e3"})), 1);

  await expect(engine.search(SEARCH)).resolves.toEqual({bestMove: "e2e3", evaluation: 25});
});

it("reports an engine that fails to start", async () => {
  const engine = new FairyStockfish(() => Promise.reject(new Error("no wasm here")), 1);

  await expect(engine.prepare()).rejects.toThrow("no wasm here");
});

it("starts afresh when asked again after a start that failed", async () => {
  const started = vi
    .fn<() => Promise<StockfishModule>>()
    .mockRejectedValueOnce(new Error("no wasm here"))
    .mockResolvedValue(fakeEngine());
  const engine = new FairyStockfish(started, 1);
  await expect(engine.prepare()).rejects.toThrow("no wasm here");

  await expect(engine.prepare()).resolves.toBeUndefined();

  expect(started).toHaveBeenCalledTimes(2);
});

it("reports a start that never finishes once its time is up", async () => {
  const engine = new FairyStockfish(() => new Promise<StockfishModule>(() => undefined), 1);
  const outcome = expect(engine.prepare()).rejects.toThrow("did not start in time");

  await vi.advanceTimersByTimeAsync(45_000);

  await outcome;
});

it("starts afresh when asked again after a start that never finished", async () => {
  const started = vi
    .fn<() => Promise<StockfishModule>>()
    .mockReturnValueOnce(new Promise<StockfishModule>(() => undefined))
    .mockResolvedValue(fakeEngine());
  const engine = new FairyStockfish(started, 1);
  const outcome = expect(engine.prepare()).rejects.toThrow("did not start in time");
  await vi.advanceTimersByTimeAsync(45_000);
  await outcome;

  await expect(engine.prepare()).resolves.toBeUndefined();

  expect(started).toHaveBeenCalledTimes(2);
});

it("reports a search that is never answered once its time and the grace after it are up", async () => {
  const engine = new FairyStockfish(() => Promise.resolve(fakeEngine()), 1);
  const outcome = expect(engine.search(SEARCH)).rejects.toThrow("did not answer");

  await vi.advanceTimersByTimeAsync(1_000 + 15_000);

  await outcome;
});

it("starts a fresh engine for the search after one that was never answered", async () => {
  const started = vi
    .fn<() => Promise<StockfishModule>>()
    .mockResolvedValueOnce(fakeEngine())
    .mockResolvedValue(fakeEngine({answers: "b1b2"}));
  const engine = new FairyStockfish(started, 1);
  const outcome = expect(engine.search(SEARCH)).rejects.toThrow("did not answer");
  await vi.advanceTimersByTimeAsync(1_000 + 15_000);
  await outcome;

  await expect(engine.search(SEARCH)).resolves.toMatchObject({bestMove: "b1b2"});

  expect(started).toHaveBeenCalledTimes(2);
});

it("does not take a late answer from an engine it gave up on for the answer to the next search", async () => {
  const abandoned = fakeEngine();
  const fresh = fakeEngine();
  const started = vi.fn<() => Promise<StockfishModule>>().mockResolvedValueOnce(abandoned).mockResolvedValue(fresh);
  const engine = new FairyStockfish(started, 1);
  const outcome = expect(engine.search(SEARCH)).rejects.toThrow("did not answer");
  await vi.advanceTimersByTimeAsync(1_000 + 15_000);
  await outcome;
  const next = engine.search(SEARCH);
  await vi.advanceTimersByTimeAsync(0);

  abandoned.say("bestmove a1a2");
  fresh.say("bestmove b1b2");

  await expect(next).resolves.toMatchObject({bestMove: "b1b2"});
});

it("does nothing when told to stop before the engine has been started", () => {
  const engine = new FairyStockfish(() => Promise.resolve(fakeEngine()), 1);

  expect(() => {
    engine.stop();
  }).not.toThrow();
});

/** Left silent, the engine is the one that has stopped answering. */
function fakeEngine({answers}: FakeEngineBehaviour = {}): FakeEngine {
  const listeners: ((line: string) => void)[] = [];
  const say = (line: string): void => {
    listeners.forEach(listener => {
      listener(line);
    });
  };

  return {
    say,
    addMessageListener: listener => listeners.push(listener),
    FS: {writeFile: () => undefined},
    postMessage: command => {
      if (command === "uci") say("uciok");
      if (command === "isready") say("readyok");
      if (command.startsWith("go") && answers !== undefined) {
        say("info depth 8 score cp 25 nodes 1000");
        say(`bestmove ${answers}`);
      }
    },
  };
}
