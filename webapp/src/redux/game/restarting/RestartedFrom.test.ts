import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {place} from "@src/game/setups/Place";
import {playMove} from "@src/game/record/PlayMove";
import {restartedFrom} from "@src/redux/game/restarting/RestartedFrom";

it("clears what was played", () => {
  const begun = {
    ...firstGame(),
    played: playMove(firstGame().played, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}),
  };

  expect(restartedFrom(begun, "han").played.past).toEqual([]);
});

it("keeps both arrangements where the player stays on the same army", () => {
  const laidOut = arranged("Left Elephant", "Outer Elephant");

  const again = restartedFrom(laidOut, "han");

  expect(again.phase.hanSetup?.name).toBe("Left Elephant");
  expect(again.phase.choSetup?.name).toBe("Outer Elephant");
});

it("ignores the roll where the side was chosen rather than left to chance", () => {
  const asCho = {
    ...firstGame(),
    opponent: {...firstGame().opponent, sideChoice: "Cho" as const, playerSide: "cho" as const},
  };

  expect(restartedFrom(asCho, "han").opponent.playerSide).toBe("cho");
});

it("takes the roll where the side is Random", () => {
  expect(restartedFrom(random("cho"), "han").opponent.playerSide).toBe("han");
});

/** The arrangements were each laid out by whoever held that army, and the player now holds the other one. */
it("hands the arrangements back when a roll moves the player to the other army", () => {
  const laidOut = {...arranged("Left Elephant", "Outer Elephant"), opponent: random("cho").opponent};

  const again = restartedFrom(laidOut, "han");

  expect(again.phase.hanSetup?.name).toBe("Inner Elephant");
  expect(again.phase.choSetup?.name).toBe("Inner Elephant");
});

it("keeps them when the roll lands the player on the army they already held", () => {
  const laidOut = {...arranged("Left Elephant", "Outer Elephant"), opponent: random("cho").opponent};

  expect(restartedFrom(laidOut, "cho").phase.hanSetup?.name).toBe("Left Elephant");
});

function arranged(han: string, cho: string): GameSliceState {
  const laidOut = place(place(firstGame().phase, "han", setup(han)), "cho", setup(cho));

  return {...firstGame(), phase: laidOut};
}

function random(playerSide: "cho" | "han"): GameSliceState {
  return {...firstGame(), opponent: {...firstGame().opponent, sideChoice: "Random", playerSide}};
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
