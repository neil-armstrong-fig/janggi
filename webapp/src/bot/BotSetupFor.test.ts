import type {Engine} from "@src/bot/engine/types/Engine";
import type {Search} from "@src/bot/engine/types/Search";
import {SETUPS} from "@src/game/setups/Setups";
import {SETUP_SEARCH_MS} from "@src/bot/levels/SetupSearchTime";
import type {Setup} from "@src/game/setups/types/Setup";
import {TOURNAMENT_SETUPS} from "@src/bot/setups/TournamentSetups";
import {botSetupFor} from "@src/bot/BotSetupFor";
import {expect, it} from "vitest";
import {fenOf} from "@src/bot/notation/FenOf";
import {newGame} from "@src/game/NewGame";

/** An engine that rates each pairing of setups as it is told to, and remembers what it was asked. */
interface FakeEngine extends Engine {
  readonly asked: Search[];
}

/** Cho's evaluation of the scored opening two setups come to, or undefined where none is reported. */
type Rating = (han: Setup, cho: Setup) => number | undefined;

const inner = setupNamed("Inner Elephant");
const outer = setupNamed("Outer Elephant");
const left = setupNamed("Left Elephant");

it("rates each of cho's four answers on the scored opening han's layout comes to", async () => {
  const engine = rating(() => 0);

  await botSetupFor(engine, {side: "cho", hanSetup: left, elo: 1200, roll: 0, signal: live()});

  expect(engine.asked.map(search => search.fen)).toEqual(
    TOURNAMENT_SETUPS.map(cho => fenOf(newGame(left, cho, "Scored"))),
  );
});

it("asks every search from the opening itself, at the setup search time and the bot's own strength", async () => {
  const engine = rating(() => 0);

  await botSetupFor(engine, {side: "cho", hanSetup: left, elo: 1900, roll: 0, signal: live()});

  for (const search of engine.asked) {
    expect(search.moves).toEqual([]);
    expect(search.searchMoves.length).toBeGreaterThan(0);
    expect(search.moveTimeMs).toBe(SETUP_SEARCH_MS);
    expect(search.elo).toBe(1900);
  }
});

it("answers han's layout with the setup the engine rates clearly best, whatever the roll", async () => {
  for (const roll of [0, 0.5, 0.9999]) {
    const engine = rating((_han, cho) => (cho === outer ? 200 : 0));

    expect(await botSetupFor(engine, {side: "cho", hanSetup: inner, elo: 1200, roll, signal: live()})).toBe(outer);
  }
});

it("rates every pairing when it lays out han, having no cho layout to answer", async () => {
  const engine = rating(() => 0);

  await botSetupFor(engine, {side: "han", hanSetup: undefined, elo: 1200, roll: 0, signal: live()});

  expect(engine.asked).toHaveLength(TOURNAMENT_SETUPS.length * TOURNAMENT_SETUPS.length);
});

it("lays han out on the setup whose best cho answer is least bad, not the one best on average", async () => {
  // Inner is best for han on average, but one cho answer crushes it; outer is never worse than a little behind.
  const engine = rating((han, cho) => {
    if (han === inner) return cho === left ? 300 : -100;
    if (han === outer) return 50;

    return 100;
  });

  expect(await botSetupFor(engine, {side: "han", hanSetup: undefined, elo: 1200, roll: 0, signal: live()})).toBe(outer);
});

it("stops asking the engine once it is told to stop", async () => {
  const stopping = new AbortController();
  const engine = rating(
    () => 0,
    () => stopping.abort(),
  );

  await expect(
    botSetupFor(engine, {side: "cho", hanSetup: inner, elo: 1200, roll: 0, signal: stopping.signal}),
  ).rejects.toThrow();
  expect(engine.asked).toHaveLength(1);
});

it("lays out a tournament setup when the engine reports no evaluation at all", async () => {
  const setup = await botSetupFor(
    rating(() => undefined),
    {side: "cho", hanSetup: inner, elo: 1200, roll: 0.9999, signal: live()},
  );

  expect(TOURNAMENT_SETUPS).toContain(setup);
});

it("refuses to answer as cho when han has laid nothing out", async () => {
  await expect(
    botSetupFor(
      rating(() => 0),
      {side: "cho", hanSetup: undefined, elo: 1200, roll: 0, signal: live()},
    ),
  ).rejects.toThrow();
});

function rating(evaluationOf: Rating, onSearch: () => void = () => undefined): FakeEngine {
  const asked: Search[] = [];
  const evaluations = new Map<string, number | undefined>();

  for (const han of TOURNAMENT_SETUPS) {
    for (const cho of TOURNAMENT_SETUPS) evaluations.set(fenOf(newGame(han, cho, "Scored")), evaluationOf(han, cho));
  }

  return {
    asked,
    prepare: () => Promise.resolve(),
    search: search => {
      asked.push(search);
      onSearch();

      return Promise.resolve({bestMove: search.searchMoves[0] ?? "", evaluation: evaluations.get(search.fen)});
    },
    stop: () => undefined,
  };
}

function live(): AbortSignal {
  return new AbortController().signal;
}

function setupNamed(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
