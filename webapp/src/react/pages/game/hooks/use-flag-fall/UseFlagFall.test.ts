// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {renderHook} from "@testing-library/react";
import {useFlagFall} from "@src/react/pages/game/hooks/use-flag-fall/UseFlagFall";

/** What the hook is handed: the army out of time, if one is. */
interface Props {
  readonly outOfTime: Side | undefined;
}

it("counts nothing while no army has run out of time", () => {
  const {result} = renderFrom(undefined);

  expect(result.current).toBe(0);
});

it("counts a flag that falls while the page is up", () => {
  const {result, rerender} = renderFrom(undefined);

  rerender({outOfTime: "han"});

  expect(result.current).toBe(1);
});

it("counts a flag once, however often the page is drawn again", () => {
  const {result, rerender} = renderFrom(undefined);

  rerender({outOfTime: "han"});
  rerender({outOfTime: "han"});

  expect(result.current).toBe(1);
});

it("counts none for a game that opens already lost on time", () => {
  const {result, rerender} = renderFrom("cho");

  rerender({outOfTime: "cho"});

  expect(result.current).toBe(0);
});

it("counts the flag in the next game too, after a new deal", () => {
  const {result, rerender} = renderFrom(undefined);

  rerender({outOfTime: "han"});
  rerender({outOfTime: undefined});
  rerender({outOfTime: "cho"});

  expect(result.current).toBe(2);
});

function renderFrom(outOfTime: Side | undefined): ReturnType<typeof renderHook<number, Props>> {
  return renderHook(({outOfTime: side}: Props) => useFlagFall(side), {initialProps: {outOfTime}});
}
