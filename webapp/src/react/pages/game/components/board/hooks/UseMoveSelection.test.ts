// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {GameState} from "@src/game/types/GameState";
import type {Position} from "@src/game/board/types/Position";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {act, renderHook} from "@testing-library/react";
import {expect, it, vi} from "vitest";
import {newGame} from "@src/game/NewGame";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";
import {useMoveSelection} from "@src/react/pages/game/components/board/hooks/UseMoveSelection";

/**
 * A hook is the one thing in `src/react/` worth unit testing: it has inputs, state transitions and
 * a return value, and none of that is reachable from an acceptance test except by driving a whole
 * page. The acceptance specs cover that a tap moves a piece on screen; this covers the transitions
 * underneath, including the ones no spec would think to reach.
 */

const CHO_SOLDIER: Position = {file: 1, rank: 7};
const HAN_SOLDIER: Position = {file: 1, rank: 4};
const FORWARD: Position = {file: 1, rank: 6};
const SIDEWAYS: Position = {file: 2, rank: 7};
const EMPTY_POINT: Position = {file: 5, rank: 5};

it("holds nothing until a piece is picked up", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  expect(result.current.selected).toBeUndefined();
  expect(result.current.destinations).toEqual([]);
});

it("picks up a piece belonging to the army whose turn it is", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.tap(CHO_SOLDIER));

  expect(result.current.selected).toEqual(CHO_SOLDIER);
});

it("will not pick up a piece belonging to the other army", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.tap(HAN_SOLDIER));

  expect(result.current.selected).toBeUndefined();
});

it("offers everywhere the piece in hand may go", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.tap(CHO_SOLDIER));

  expect(points(result.current.destinations)).toEqual(points([FORWARD, SIDEWAYS]));
});

it("puts the piece down again when it is tapped a second time", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.tap(CHO_SOLDIER));
  act(() => result.current.tap(CHO_SOLDIER));

  expect(result.current.selected).toBeUndefined();
});

it("puts the piece down when somewhere it cannot reach is tapped", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.tap(CHO_SOLDIER));
  act(() => result.current.tap(EMPTY_POINT));

  expect(result.current.selected).toBeUndefined();
});

it("plays the move when one of those points is tapped", () => {
  const game = openingGame();
  const onMove = vi.fn();

  const {result} = renderHook(() => useMoveSelection(game, onMove));

  act(() => result.current.tap(CHO_SOLDIER));
  act(() => result.current.tap(FORWARD));

  expect(onMove).toHaveBeenCalledWith({from: CHO_SOLDIER, to: FORWARD});
});

/** The store owns the game, so the hook lets go of the piece and waits to be handed the new one. */
it("empties its hand once the move has been played", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, vi.fn()));

  act(() => result.current.tap(CHO_SOLDIER));
  act(() => result.current.tap(FORWARD));

  expect(result.current.selected).toBeUndefined();
});

it("shows where a piece could go while the pointer merely rests on it", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.hover(CHO_SOLDIER));

  expect(points(result.current.destinations)).toEqual(points([FORWARD, SIDEWAYS]));
});

it("does not pick a piece up just because the pointer is on it", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.hover(CHO_SOLDIER));

  expect(result.current.selected).toBeUndefined();
});

/** `movesFrom` answers for either army, so the board can explain a piece it is not this side's
 * turn to move. */
it("answers for the army whose turn it is not", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.hover(HAN_SOLDIER));

  expect(result.current.destinations).not.toEqual([]);
});

it("shows nothing for an empty point", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.hover(EMPTY_POINT));

  expect(result.current.destinations).toEqual([]);
});

/** Otherwise a move would change under a player whose pointer drifted on the way to a destination. */
it("keeps the piece in hand when the pointer wanders onto another", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.tap(CHO_SOLDIER));
  act(() => result.current.hover({file: 3, rank: 7}));

  expect(result.current.selected).toEqual(CHO_SOLDIER);
  expect(points(result.current.destinations)).toEqual(points([FORWARD, SIDEWAYS]));
});

it("stops showing anything once the pointer leaves", () => {
  const game = openingGame();

  const {result} = renderHook(() => useMoveSelection(game, noop));

  act(() => result.current.hover(CHO_SOLDIER));
  act(() => result.current.hover(undefined));

  expect(result.current.destinations).toEqual([]);
});

/** The hook only reports a finished move; applying it is the store's job, so most tests ignore it. */
function noop(): void {
  return undefined;
}

function openingGame(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"));
}

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
