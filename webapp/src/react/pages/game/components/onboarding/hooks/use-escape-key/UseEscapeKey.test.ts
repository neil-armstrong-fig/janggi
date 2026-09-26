// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it, vi} from "vitest";
import {renderHook} from "@testing-library/react";
import {useEscapeKey} from "@src/react/pages/game/components/onboarding/hooks/use-escape-key/UseEscapeKey";

function press(key: string): void {
  document.dispatchEvent(new KeyboardEvent("keydown", {key}));
}

it("calls back when Escape is pressed", () => {
  const onEscape = vi.fn();
  renderHook(() => useEscapeKey(onEscape));

  press("Escape");

  expect(onEscape).toHaveBeenCalledTimes(1);
});

it("ignores every other key", () => {
  const onEscape = vi.fn();
  renderHook(() => useEscapeKey(onEscape));

  press("Enter");
  press("e");

  expect(onEscape).not.toHaveBeenCalled();
});

it("stops listening once the caller has left the page", () => {
  const onEscape = vi.fn();
  const {unmount} = renderHook(() => useEscapeKey(onEscape));
  unmount();

  press("Escape");

  expect(onEscape).not.toHaveBeenCalled();
});
