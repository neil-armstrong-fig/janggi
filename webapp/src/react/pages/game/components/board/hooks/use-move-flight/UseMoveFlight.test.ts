// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {Move} from "@src/game/types/Move";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import {act, renderHook} from "@testing-library/react";
import {expect, it} from "vitest";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {useMoveFlight} from "@src/react/pages/game/components/board/hooks/use-move-flight/UseMoveFlight";

/** What the hook is re-rendered on, so a test can hand it the next change. */
interface Shown {
  readonly moment: GameMoment | undefined;
}

const STEP: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};
const SOLDIER: Piece = {side: "han", type: "soldier"};

it("flies nothing before the game has changed", () => {
  const {result} = renderHook(() => useMoveFlight(undefined, true));

  expect(result.current).toMatchObject({flight: undefined, flying: false, landing: false, concealed: undefined});
});

it("flies a move played, hiding the piece where it lands until it touches down", () => {
  const {result} = renderHook(() => useMoveFlight(moved(1, undefined), true));

  expect(result.current.flying).toBe(true);
  expect(result.current.concealed).toBe(toPositionKey(STEP.to));

  act(() => result.current.land());

  expect(result.current.flying).toBe(false);
  expect(result.current.concealed).toBeUndefined();
});

it("keeps a capture landing after the piece touches down, until what it knocked off has settled", () => {
  const {result} = renderHook(() => useMoveFlight(moved(1, SOLDIER), true));

  act(() => result.current.land());
  expect(result.current.landing).toBe(true);

  act(() => result.current.settle());
  expect(result.current.landing).toBe(false);
});

it("lands nothing for a move that took nothing", () => {
  const {result} = renderHook(() => useMoveFlight(moved(1, undefined), true));

  expect(result.current.landing).toBe(false);
});

it("flies the next change from its start, whatever became of the last", () => {
  const {result, rerender} = renderHook((shown: Shown) => useMoveFlight(shown.moment, true), {
    initialProps: {moment: moved(1, SOLDIER)},
  });

  act(() => result.current.land());
  act(() => result.current.settle());
  rerender({moment: moved(2, SOLDIER)});

  expect(result.current).toMatchObject({flying: true, landing: true, concealed: toPositionKey(STEP.to)});
});

it("flies nothing while effects are reduced", () => {
  const {result} = renderHook(() => useMoveFlight(moved(1, SOLDIER), false));

  expect(result.current).toMatchObject({flight: undefined, flying: false, landing: false, concealed: undefined});
});

function moved(id: number, taken: Piece | undefined): GameMoment {
  return {
    id,
    direction: "advanced",
    transition: {kind: "moved", move: STEP, mover: {side: "cho", type: "soldier"}, taken},
  };
}
