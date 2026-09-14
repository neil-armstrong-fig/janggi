// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {GameState} from "@src/game/types/GameState";
import type {Mock} from "vitest";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Vector} from "@src/react/pages/game/components/board/types/Vector";
import {expect, it, vi} from "vitest";
import {newGame} from "@src/game/NewGame";
import {renderHook} from "@testing-library/react";
import {useEndingShake} from "@src/react/pages/game/components/board/hooks/use-ending-shake/UseEndingShake";

/**
 * Which changes end a game is `endsTheGame`'s to say, and tested beside it. What is tested here is
 * what the hook does with that answer: shake once per ending change, and not at all with effects reduced.
 */

/** What the hook is re-rendered on, so a test can hand it the next change. */
interface Shown {
  readonly moment: GameMoment | undefined;
  readonly game: GameState;
  readonly animated: boolean;
}

interface Rendered {
  readonly shake: Mock<(impulse: Vector) => void>;
  readonly show: (next: Shown) => void;
}

it("shakes the board once, straight down, as a game ends", () => {
  const {shake} = renderOn({moment: ending(1), game: decided(), animated: true});

  expect(shake).toHaveBeenCalledOnce();
  expect(shake.mock.calls[0]?.[0]).toMatchObject({x: 0});
  expect(shake.mock.calls[0]?.[0].y).toBeGreaterThan(0);
});

it("does not shake again when handed the same change a second time", () => {
  const {shake, show} = renderOn({moment: ending(1), game: decided(), animated: true});

  show({moment: {...ending(1)}, game: decided(), animated: true});

  expect(shake).toHaveBeenCalledOnce();
});

it("shakes again when a later change ends the game again", () => {
  const {shake, show} = renderOn({moment: ending(1), game: decided(), animated: true});

  show({moment: ending(2), game: decided(), animated: true});

  expect(shake).toHaveBeenCalledTimes(2);
});

it("does not shake for a change that leaves the game going", () => {
  const {shake} = renderOn({moment: ending(1), game: opening(), animated: true});

  expect(shake).not.toHaveBeenCalled();
});

it("does not shake while effects are reduced", () => {
  const {shake} = renderOn({moment: ending(1), game: decided(), animated: false});

  expect(shake).not.toHaveBeenCalled();
});

function renderOn(initial: Shown): Rendered {
  const shake = vi.fn<(impulse: Vector) => void>();
  const {rerender} = renderHook((shown: Shown) => useEndingShake(shown.moment, shown.game, shown.animated, shake), {
    initialProps: initial,
  });

  return {shake, show: next => rerender(next)};
}

function ending(id: number): GameMoment {
  return {id, direction: "advanced", transition: {kind: "passed", side: "han"}};
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
