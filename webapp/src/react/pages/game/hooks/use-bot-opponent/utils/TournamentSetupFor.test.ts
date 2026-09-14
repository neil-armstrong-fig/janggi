import {expect, it} from "vitest";
import {tournamentSetupFor} from "@src/react/pages/game/hooks/use-bot-opponent/utils/TournamentSetupFor";

it("reaches each of the four tournament setups across the roll", () => {
  const picked = [0, 0.25, 0.5, 0.75].map(roll => tournamentSetupFor(roll).name);

  expect(picked).toEqual(["Inner Elephant", "Outer Elephant", "Left Elephant", "Right Elephant"]);
});

it("never lays out the Central Chariot, which is casual play only", () => {
  expect(tournamentSetupFor(0.9999).name).not.toBe("Central Chariot");
});
