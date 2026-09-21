import type {BikjangHint} from "@src/react/pages/game/types/BikjangHint";
import {BIKJANG_HINTS} from "@src/react/pages/game/utils/BikjangHints";
import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import {bikjangHintShown} from "@src/react/pages/game/components/board/components/intersections/bikjang-hint/BikjangHintShown";
import {expect, it} from "vitest";

it("shows the hint in a game against a person at the same device", () => {
  expect(bikjangHintShown(SHOWN, opponent("Human", 2850))).toBe(true);
});

it("shows the hint against the 800 bot", () => {
  expect(bikjangHintShown(SHOWN, opponent("Bot", 800))).toBe(true);
});

it("shows the hint against the 1000 bot", () => {
  expect(bikjangHintShown(SHOWN, opponent("Bot", 1000))).toBe(true);
});

it.each(BOT_ELOS.filter(elo => elo > 1000))("never shows the hint against the %i bot", elo => {
  expect(bikjangHintShown(SHOWN, opponent("Bot", elo))).toBe(false);
});

it("leaves the hint hidden against a person when the player has hidden it", () => {
  expect(bikjangHintShown(HIDDEN, opponent("Human", 800))).toBe(false);
});

it.each([800, 1000] as const)("leaves the hint hidden against the %i bot when the player has hidden it", elo => {
  expect(bikjangHintShown(HIDDEN, opponent("Bot", elo))).toBe(false);
});

/**
 * The strength a player last chose is kept while the opponent is a person, so it says nothing about
 * this game: a person is offered the hint whatever the bot was last set to.
 */
it("takes no notice of a bot strength kept while the opponent is a person", () => {
  expect(bikjangHintShown(SHOWN, opponent("Human", 1900))).toBe(true);
});

const SHOWN = hintNamed("Shown");
const HIDDEN = hintNamed("Hidden");

function hintNamed(name: BikjangHint["name"]): BikjangHint {
  const found = BIKJANG_HINTS.find(hint => hint.name === name);
  if (!found) throw new Error(`BikjangHints no longer offers "${name}"`);

  return found;
}

function opponent(name: OpponentName, botElo: BotElo): Opponent {
  return {name, botElo, sideChoice: "Cho", playerSide: "cho"};
}
