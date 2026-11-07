import {expect, it} from "vitest";
import {playGroupFrom} from "@src/react/pages/game/components/settings/tabs/play-pane/hooks/use-play-group/storage/PlayGroupFrom";

it("restores only a known group", () => {
  expect(playGroupFrom({open: "Setup"})).toBe("Setup");
  expect(playGroupFrom({open: "Opponent"})).toBe("Opponent");
  expect(playGroupFrom({open: "Format"})).toBe("Format");
});

it("defaults to collapsed for absent, collapsed or untrusted storage", () => {
  for (const value of [undefined, null, {}, {open: "Clock"}, "Setup", {open: 1}]) {
    expect(playGroupFrom(value)).toBeUndefined();
  }
});
