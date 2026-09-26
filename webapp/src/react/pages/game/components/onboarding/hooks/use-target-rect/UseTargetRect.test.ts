// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {useTargetRect} from "@src/react/pages/game/components/onboarding/hooks/use-target-rect/UseTargetRect";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

function targetAt(name: string, rect: {top: number; left: number; width: number; height: number}): HTMLElement {
  const element = document.createElement("div");
  element.dataset.tourTarget = name;
  element.getBoundingClientRect = () => ({...rect, x: rect.left, y: rect.top, right: 0, bottom: 0, toJSON: () => ({})});
  document.body.append(element);

  return element;
}

function nextFrame(): void {
  act(() => {
    vi.advanceTimersByTime(20);
  });
}

it("finds the element wearing the target where it stands", () => {
  targetAt("controls", {top: 10, left: 20, width: 100, height: 40});

  const {result} = renderHook(() => useTargetRect("controls"));
  nextFrame();

  expect(result.current).toEqual({top: 10, left: 20, width: 100, height: 40});
});

it("has nothing to point at where nothing wears the target", () => {
  const {result} = renderHook(() => useTargetRect("xp"));
  nextFrame();

  expect(result.current).toBeUndefined();
});

it("has nothing to point at without a target", () => {
  targetAt("controls", {top: 10, left: 20, width: 100, height: 40});

  const {result} = renderHook(() => useTargetRect(undefined));
  nextFrame();

  expect(result.current).toBeUndefined();
});

it("has nothing to point at where the element is not drawn", () => {
  targetAt("styles", {top: 0, left: 0, width: 0, height: 0});

  const {result} = renderHook(() => useTargetRect("styles"));
  nextFrame();

  expect(result.current).toBeUndefined();
});

it("follows the element as it moves", () => {
  const element = targetAt("settings", {top: 500, left: 20, width: 60, height: 40});
  const {result} = renderHook(() => useTargetRect("settings"));
  nextFrame();
  element.getBoundingClientRect = () => ({top: 300, left: 20, width: 60, height: 40}) as DOMRect;

  nextFrame();

  expect(result.current?.top).toBe(300);
});
