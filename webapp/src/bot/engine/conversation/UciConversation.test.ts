import type {Search} from "@src/bot/engine/types/Search";
import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";
import {UciConversation} from "@src/bot/engine/conversation/UciConversation";
import {expect, it} from "vitest";

/** An engine that remembers what it was sent, and says whatever it is told to. */
interface FakeEngine extends StockfishModule {
  readonly sent: string[];
  readonly say: (line: string) => void;
}

const SEARCH: Search = {
  fen: "the start",
  moves: [],
  searchMoves: ["a1a2", "b1b2"],
  elo: 800,
  moveTimeMs: 250,
};

it("resolves what it was waiting on once the engine writes a line beginning with the reply", async () => {
  const engine = fakeEngine();
  const conversation = new UciConversation(engine);
  const readied = conversation.sendAndAwait("isready", "readyok");

  engine.say("readyok");

  await expect(readied).resolves.toBeUndefined();
  expect(engine.sent).toEqual(["isready"]);
});

it("keeps waiting through lines that are not the reply", async () => {
  const engine = fakeEngine();
  const conversation = new UciConversation(engine);
  let readied = false;
  void conversation.sendAndAwait("isready", "readyok").then(() => (readied = true));

  engine.say("info string NNUE evaluation using nn.nnue");
  await flushPromises();

  expect(readied).toBe(false);
});

it("puts a search as the engine's strength, the position and the moves it may choose from", () => {
  const engine = fakeEngine();

  void new UciConversation(engine).search(SEARCH);

  expect(engine.sent).toEqual([
    "setoption name UCI_Elo value 800",
    "position fen the start",
    "go movetime 250 searchmoves a1a2 b1b2",
  ]);
});

it("puts the moves played since the position beside it, so the engine can see a repetition coming", () => {
  const engine = fakeEngine();

  void new UciConversation(engine).search({...SEARCH, moves: ["e2e3", "e9e8"]});

  expect(engine.sent).toContain("position fen the start moves e2e3 e9e8");
});

it("answers a search with the engine's bestmove and the last score it reported on the way", async () => {
  const engine = fakeEngine();
  const answer = new UciConversation(engine).search(SEARCH);

  engine.say("info depth 6 score cp 12 nodes 500");
  engine.say("info depth 8 score cp 25 nodes 1000");
  engine.say("bestmove b1b2");

  await expect(answer).resolves.toEqual({bestMove: "b1b2", evaluation: 25});
});

it("tells the engine to stop when a search is interrupted, and still answers it", async () => {
  const engine = fakeEngine();
  const conversation = new UciConversation(engine);
  const answer = conversation.search(SEARCH);

  conversation.interrupt();
  engine.say("bestmove a1a2");

  expect(engine.sent).toContain("stop");
  await expect(answer).resolves.toMatchObject({bestMove: "a1a2"});
});

it("tells the engine nothing when there is no search to interrupt", () => {
  const engine = fakeEngine();

  new UciConversation(engine).interrupt();

  expect(engine.sent).toEqual([]);
});

it("tells the engine to stop when a search is abandoned, and takes no answer to it after", async () => {
  const engine = fakeEngine();
  const conversation = new UciConversation(engine);
  let answered = false;
  void conversation.search(SEARCH).then(() => (answered = true));

  conversation.abandon();
  engine.say("bestmove a1a2");
  await flushPromises();

  expect(engine.sent).toContain("stop");
  expect(answered).toBe(false);
});

function fakeEngine(): FakeEngine {
  const listeners: ((line: string) => void)[] = [];
  const sent: string[] = [];

  return {
    sent,
    say: line => {
      listeners.forEach(listener => {
        listener(line);
      });
    },
    addMessageListener: listener => listeners.push(listener),
    FS: {writeFile: () => undefined},
    postMessage: command => sent.push(command),
  };
}

/** Lets every promise already settled run its continuations, so "it did not happen" is a claim about now. */
async function flushPromises(): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, 0));
}
