// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it, vi} from "vitest";
import {renderHook} from "@testing-library/react";
import {useAdvanceOnMove} from "@src/react/pages/game/components/onboarding/hooks/use-advance-on-move/UseAdvanceOnMove";

interface Situation {
  active: boolean;
  moveCount: number;
}

function rendered(onMove: () => void, start: Situation): ReturnType<typeof renderHook<void, Situation>> {
  return renderHook(({active, moveCount}: Situation) => useAdvanceOnMove(active, moveCount, onMove), {
    initialProps: start,
  });
}

it("calls back when a move is made while active", () => {
  const onMove = vi.fn();
  const {rerender} = rendered(onMove, {active: true, moveCount: 0});

  rerender({active: true, moveCount: 1});

  expect(onMove).toHaveBeenCalledTimes(1);
});

it("ignores a move made while not active", () => {
  const onMove = vi.fn();
  const {rerender} = rendered(onMove, {active: false, moveCount: 0});

  rerender({active: false, moveCount: 1});

  expect(onMove).not.toHaveBeenCalled();
});

it("does not count the moves made before it became active", () => {
  const onMove = vi.fn();
  const {rerender} = rendered(onMove, {active: false, moveCount: 0});

  rerender({active: false, moveCount: 3});
  rerender({active: true, moveCount: 3});

  expect(onMove).not.toHaveBeenCalled();
});

it("ignores the record getting shorter", () => {
  const onMove = vi.fn();
  const {rerender} = rendered(onMove, {active: true, moveCount: 2});

  rerender({active: true, moveCount: 1});

  expect(onMove).not.toHaveBeenCalled();
});
