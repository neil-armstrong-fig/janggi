import type {ChangeDirection} from "@src/game/record/types/ChangeDirection";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {GameState} from "@src/game/types/GameState";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {endsTheGame} from "@src/react/pages/game/components/board/hooks/use-ending-shake/utils/EndsTheGame";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";

it("ends the game with a turn played into a decided position", () => {
  expect(endsTheGame(moment("advanced"), decided())).toBe(true);
});

it("ends it again when that turn is played again after being taken back", () => {
  expect(endsTheGame(moment("replayed"), decided())).toBe(true);
});

it("does not end a game that is still being played", () => {
  expect(endsTheGame(moment("advanced"), opening())).toBe(false);
});

it("does not end it by taking a turn back, even into a position that is still decided", () => {
  expect(endsTheGame(moment("takenBack"), decided())).toBe(false);
});

it("does not end it with a new deal", () => {
  expect(endsTheGame(moment("dealt"), decided())).toBe(false);
});

function moment(direction: ChangeDirection): GameMoment {
  return {id: 1, direction, transition: {kind: "passed", side: "han"}};
}

/** Stopped by two rested turns, which is decided on points. */
function decided(): GameState {
  return {...opening(), consecutivePasses: 2};
}

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
