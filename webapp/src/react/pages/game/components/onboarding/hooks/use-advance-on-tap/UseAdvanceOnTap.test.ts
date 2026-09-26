// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {afterEach, expect, it, vi} from "vitest";
import {renderHook} from "@testing-library/react";
import {useAdvanceOnTap} from "@src/react/pages/game/components/onboarding/hooks/use-advance-on-tap/UseAdvanceOnTap";

afterEach(() => {
  document.body.replaceChildren();
});

function targetHolding(name: string): {target: HTMLElement; inside: HTMLElement; elsewhere: HTMLElement} {
  const target = document.createElement("button");
  target.dataset.tourTarget = name;
  const inside = document.createElement("span");
  target.append(inside);
  const elsewhere = document.createElement("button");
  document.body.append(target, elsewhere);

  return {target, inside, elsewhere};
}

it("calls back when the target is tapped, or something inside it", () => {
  const {target, inside} = targetHolding("point");
  const onTap = vi.fn();
  renderHook(() => useAdvanceOnTap("point", onTap));

  target.click();
  inside.click();

  expect(onTap).toHaveBeenCalledTimes(2);
});

it("ignores a tap anywhere else", () => {
  const {elsewhere} = targetHolding("point");
  const onTap = vi.fn();
  renderHook(() => useAdvanceOnTap("point", onTap));

  elsewhere.click();

  expect(onTap).not.toHaveBeenCalled();
});

it("has nothing to hear without a target", () => {
  const {target} = targetHolding("point");
  const onTap = vi.fn();
  renderHook(() => useAdvanceOnTap(undefined, onTap));

  target.click();

  expect(onTap).not.toHaveBeenCalled();
});

it("hears the tap before the element's own handler does", () => {
  const {target} = targetHolding("settings");
  const order: string[] = [];
  target.addEventListener("click", () => order.push("element"));
  renderHook(() => useAdvanceOnTap("settings", () => order.push("tour")));

  target.click();

  expect(order).toEqual(["tour", "element"]);
});
