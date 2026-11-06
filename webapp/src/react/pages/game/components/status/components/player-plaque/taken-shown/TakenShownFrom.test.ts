import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import {expect, it} from "vitest";
import {newGame} from "@janggi/engine/NewGame";
import {takenShownFrom} from "@src/react/pages/game/components/status/components/player-plaque/taken-shown/TakenShownFrom";

const EMPTIED = {...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"), pieces: []};

it("shows what is missing from a full army, for a game played to", () => {
  expect(takenShownFrom({game: EMPTIED, side: "han", posed: false})).not.toEqual([]);
});

it("shows nothing for a posed position, whatever it leaves out", () => {
  expect(takenShownFrom({game: EMPTIED, side: "han", posed: true})).toEqual([]);
});
