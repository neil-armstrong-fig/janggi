import {expect, it} from "vitest";
import {markSourcesOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/MarkSourcesOf";
import {sceneOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/SceneOf";

it("marks the piece in hand, the points it may go to and the piece it would take", () => {
  const markSources = markSourcesOf(sceneOf("hints"));

  expect(markSources.heldKey).toBe("f1r10");
  expect(markSources.reachable.has("f1r9")).toBe(true);
  expect(markSources.reachable.has("f1r4")).toBe(true);
});

it("marks the piece of its own army the piece in hand would land on but for it", () => {
  expect(markSourcesOf(sceneOf("hints")).covered.has("f2r10")).toBe(true);
});

it("marks the pieces its owner may move", () => {
  expect(markSourcesOf(sceneOf("opening")).movable.size).toBeGreaterThan(0);
});

it("marks the general in check and the chariot giving it", () => {
  const markSources = markSourcesOf(sceneOf("check"));

  expect(markSources.threatenedKey).toBe("f4r2");
  expect([...markSources.attackerKeys]).toEqual(["f4r9"]);
});

it("marks no check where there is none, and no piece in hand", () => {
  const markSources = markSourcesOf(sceneOf("opening"));

  expect(markSources.threatenedKey).toBeUndefined();
  expect(markSources.attackerKeys.size).toBe(0);
  expect(markSources.heldKey).toBeUndefined();
  expect(markSources.reachable.size).toBe(0);
});

it("marks no bikjang risk, having no opponent to offer the hint against", () => {
  expect(markSourcesOf(sceneOf("hints")).bikjangRiskKeys.size).toBe(0);
});
