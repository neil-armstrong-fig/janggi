// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {Move} from "@src/game/types/Move";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {changeBetween} from "@src/game/record/ChangeBetween";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
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

  renderHook(() => useHaptics(played, moment, true));

  expect(vibrate).toHaveBeenCalledWith([8]);
});

it("does not buzz before anything has happened", () => {
  renderHook(() => useHaptics(opening(), undefined, true));

  expect(vibrate).not.toHaveBeenCalled();
});

it("does not buzz while effects are reduced", () => {
  const {played, moment} = afterAMove();

  renderHook(() => useHaptics(played, moment, false));

  expect(vibrate).not.toHaveBeenCalled();
});

it("buzzes once for a change, however often the page is drawn again", () => {
  const {played, moment} = afterAMove();

  const rendered = renderHook(({enabled}: {enabled: boolean}) => useHaptics(played, moment, enabled), {
    initialProps: {enabled: true},
  });
  rendered.rerender({enabled: false});
  rendered.rerender({enabled: true});

  expect(vibrate).toHaveBeenCalledTimes(1);
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
