import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {GameState} from "@src/game/types/GameState";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {dealDelay} from "@src/react/pages/game/components/board/components/intersections/motion/flourishes-of/deal-delay/DealDelay";
import {expect, it} from "vitest";
import {flourishesOf} from "@src/react/pages/game/components/board/components/intersections/motion/flourishes-of/FlourishesOf";
import {newGame} from "@src/game/NewGame";
import {pass} from "@src/game/passing/Pass";

it("sets out every piece on the board when a game is dealt, each at its own moment", () => {
  const game = opening();
  const flourishes = flourishesOf({id: 4, direction: "dealt", transition: undefined}, game);

  expect(flourishes.size).toBe(32);
  expect(flourishes.get("f1r10")).toEqual({id: 4, kind: "dealt", delay: dealDelay({file: 1, rank: 10})});
  expect(flourishes.get("f5r7")).toEqual({id: 4, kind: "dealt", delay: dealDelay({file: 5, rank: 7})});
});

it("lifts the resting army's general, and nothing else, when a turn is rested", () => {
  const game = pass(opening());
  const flourishes = flourishesOf(rested("advanced"), game);

  expect([...flourishes.entries()]).toEqual([["f5r9", {id: 2, kind: "rested", delay: 0}]]);
});

it("lifts the general again when a rested turn is played again", () => {
  expect(flourishesOf(rested("replayed"), pass(opening())).get("f5r9")).toMatchObject({kind: "rested"});
});

it("shows nothing in place when a rested turn is taken back", () => {
  expect(flourishesOf(rested("takenBack"), opening()).size).toBe(0);
});

it("shows nothing in place for a move, which flies instead", () => {
  const moved: GameMoment = {
    id: 3,
    direction: "advanced",
    transition: {
      kind: "moved",
      move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}},
      mover: {side: "cho", type: "soldier"},
      taken: undefined,
    },
  };

  expect(flourishesOf(moved, opening()).size).toBe(0);
});

it("shows nothing before the game has changed", () => {
  expect(flourishesOf(undefined, opening()).size).toBe(0);
});

function rested(direction: GameMoment["direction"]): GameMoment {
  return {id: 2, direction, transition: {kind: "passed", side: "cho"}};
}

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
