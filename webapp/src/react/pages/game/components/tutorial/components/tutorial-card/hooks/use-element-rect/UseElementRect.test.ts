// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import type {TargetRect} from "@src/react/pages/game/hooks/use-target-rect/UseTargetRect";
import {useElementRect} from "@src/react/pages/game/components/tutorial/components/tutorial-card/hooks/use-element-rect/UseElementRect";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function elementAt(rect: TargetRect): HTMLElement {
  const element = document.createElement("section");
  element.getBoundingClientRect = () => ({...rect, x: rect.left, y: rect.top, right: 0, bottom: 0, toJSON: () => ({})});

  return element;
}

function nextFrame(): void {
  act(() => {
    vi.advanceTimersByTime(20);
  });
}

it("measures the element where it stands", () => {
  const ref = {current: elementAt({top: 12, left: 12, width: 366, height: 200})};

  const {result} = renderHook(() => useElementRect(ref));
  nextFrame();

  expect(result.current).toEqual({top: 12, left: 12, width: 366, height: 200});
});

it("follows the element as it moves", () => {
  const ref = {current: elementAt({top: 12, left: 12, width: 366, height: 200})};
  const {result} = renderHook(() => useElementRect(ref));
  nextFrame();

  ref.current = elementAt({top: 620, left: 12, width: 366, height: 200});
  nextFrame();

  expect(result.current?.top).toBe(620);
});

it("is unmeasured until the element is drawn", () => {
  const {result} = renderHook(() => useElementRect({current: null}));
  nextFrame();

  expect(result.current).toBeUndefined();
});
