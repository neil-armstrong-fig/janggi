import {expect, it} from "vitest";
import {lockBehindXp} from "@src/react/pages/game/components/settings/tabs/look-pane/locks/LockBehindXp";

it("is no lock once the player has as much XP as it costs", () => {
  expect(lockBehindXp(60, 60, "en")).toBeUndefined();
  expect(lockBehindXp(0, 0, "en")).toBeUndefined();
});

it("says what it costs while the player has less", () => {
  expect(lockBehindXp(60, 59, "en")).toBe("60 XP");
});

it("writes a large price the way it is read", () => {
  expect(lockBehindXp(1_000_000, 0, "en")).toBe("1,000,000 XP");
});
