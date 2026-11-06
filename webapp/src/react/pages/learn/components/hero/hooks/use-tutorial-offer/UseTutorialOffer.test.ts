// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {afterEach, expect, it} from "vitest";
import {TUTORIAL_STORAGE_KEY} from "@src/redux/tutorial/storage/TutorialStorageKey";
import {renderHook} from "@testing-library/react";
import {useTutorialOffer} from "@src/react/pages/learn/components/hero/hooks/use-tutorial-offer/UseTutorialOffer";

afterEach(() => {
  localStorage.clear();
});

it("offers to start where the device has kept nothing of the tutorial", () => {
  const {result} = renderHook(() => useTutorialOffer());

  expect(result.current).toBe("start");
});

it("offers to resume where the device kept a scene reached", () => {
  localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify({reached: 2, completed: false}));

  const {result} = renderHook(() => useTutorialOffer());

  expect(result.current).toBe("resume");
});
