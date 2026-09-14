// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {useRolledNumber} from "@src/react/pages/game/components/status/components/player-plaque/hooks/use-rolled-number/UseRolledNumber";

/**
 * Time is faked, frames and clock together, so a roll can be stopped half way and looked at.
 *
 * Nested, each level doing one thing to the number its parent left behind.
 */

let hook: Rendered;

beforeEach(() => {
  vi.useFakeTimers({toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"]});
});

afterEach(() => {
  vi.useRealTimers();
});

describe("a number that rolls", () => {
  beforeEach(() => {
    hook = renderOn(73.5, true);
  });

  it("shows the number it starts on", () => {
    expect(hook.result.current).toBe(73.5);
  });

  describe("when the number falls", () => {
    beforeEach(() => {
      hook.rerender({value: 60.5, rolling: true});
    });

    it("has not jumped there yet", () => {
      expect(hook.result.current).toBe(73.5);
    });

    it("is part way there a moment later", () => {
      act(() => vi.advanceTimersByTime(150));

      expect(hook.result.current).toBeLessThan(73.5);
      expect(hook.result.current).toBeGreaterThan(60.5);
    });

    it("only ever shows whole or half points on the way", () => {
      for (let elapsed = 0; elapsed < 500; elapsed += 16) {
        act(() => vi.advanceTimersByTime(16));

        expect(Number.isInteger(hook.result.current * 2)).toBe(true);
      }
    });

    it("comes to rest exactly on the new number", () => {
      act(() => vi.advanceTimersByTime(1_000));

      expect(hook.result.current).toBe(60.5);
    });
  });
});

describe("a number that does not roll", () => {
  it("shows a new number at once", () => {
    hook = renderOn(72, false);
    hook.rerender({value: 70, rolling: false});

    expect(hook.result.current).toBe(70);
  });
});

interface Rendered {
  readonly result: {readonly current: number};
  readonly rerender: (props: {value: number; rolling: boolean}) => void;
}

function renderOn(value: number, rolling: boolean): Rendered {
  return renderHook(({value: shown, rolling: rolls}) => useRolledNumber(shown, rolls), {
    initialProps: {value, rolling},
  });
}
