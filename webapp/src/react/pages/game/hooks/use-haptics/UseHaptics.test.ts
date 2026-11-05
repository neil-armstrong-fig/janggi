// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {Haptics} from "@src/react/pages/game/hooks/use-haptics/UseHaptics";
import type {Move} from "@janggi/engine/types/Move";
import type {PlayedGame} from "@src/record/types/PlayedGame";
import {SETUPS} from "@janggi/engine/setups/Setups";
import type {Setup} from "@janggi/engine/setups/types/Setup";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {changeBetween} from "@src/record/change/ChangeBetween";
import {newGame} from "@janggi/engine/NewGame";
import {playMove} from "@src/record/moving/PlayMove";
import {playedGameFrom} from "@src/record/PlayedGameFrom";
import {renderHook} from "@testing-library/react";
import {useHaptics} from "@src/react/pages/game/hooks/use-haptics/UseHaptics";

/**
 * Which buzz a change gives is `vibrationFor`'s to decide and is tested beside it. What is tested here
 * is only when the page asks the phone to buzz — so `navigator.vibrate`, which jsdom does not have, is
 * stood in for by one that remembers what it was asked.
 */

const SOLDIER_STEP: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};

const vibrate = vi.fn();

beforeEach(() => {
  Object.defineProperty(navigator, "vibrate", {value: vibrate, configurable: true});
});

afterEach(() => {
  vibrate.mockReset();
});

it("buzzes a phone when a piece is set down", () => {
  const {played, moment} = afterAMove();

  renderHook(() => useHaptics({played, moment, flagFall: 0, enabled: true}));

  expect(vibrate).toHaveBeenCalledWith([8]);
});

it("does not buzz before anything has happened", () => {
  renderHook(() => useHaptics({played: opening(), moment: undefined, flagFall: 0, enabled: true}));

  expect(vibrate).not.toHaveBeenCalled();
});

it("does not buzz while effects are reduced", () => {
  const {played, moment} = afterAMove();

  renderHook(() => useHaptics({played, moment, flagFall: 0, enabled: false}));

  expect(vibrate).not.toHaveBeenCalled();
});

it("buzzes once for a change, however often the page is drawn again", () => {
  const {played, moment} = afterAMove();

  const rendered = renderHook((haptics: Haptics) => useHaptics(haptics), {
    initialProps: {played, moment, flagFall: 0, enabled: true},
  });
  rendered.rerender({played, moment, flagFall: 0, enabled: false});
  rendered.rerender({played, moment, flagFall: 0, enabled: true});

  expect(vibrate).toHaveBeenCalledTimes(1);
});

it("buzzes the end of a game when a flag falls, once", () => {
  const played = opening();
  const rendered = renderHook((haptics: Haptics) => useHaptics(haptics), {
    initialProps: {played, moment: undefined, flagFall: 0, enabled: true},
  });

  rendered.rerender({played, moment: undefined, flagFall: 1, enabled: true});
  rendered.rerender({played, moment: undefined, flagFall: 1, enabled: true});

  expect(vibrate).toHaveBeenCalledTimes(1);
  expect(vibrate).toHaveBeenCalledWith([60, 60, 120]);
});

it("does not buzz a flag while effects are reduced", () => {
  renderHook(() => useHaptics({played: opening(), moment: undefined, flagFall: 1, enabled: false}));

  expect(vibrate).not.toHaveBeenCalled();
});

function afterAMove(): {played: PlayedGame; moment: GameMoment} {
  const before = opening();
  const played = playMove(before, SOLDIER_STEP);

  return {played, moment: {id: 1, ...changeBetween(before, played)}};
}

function opening(): PlayedGame {
  return playedGameFrom(newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual"));
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
