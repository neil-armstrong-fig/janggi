import {GAME_STORAGE_KEY} from "@src/redux/game/storage/GameStorageKey";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {
  botStrengthChosen,
  choSetupChosen,
  formatChosen,
  gameReducer,
  hanSetupChosen,
  moved,
  opponentChosen,
} from "@src/redux/game/GameSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {loadGame} from "@src/redux/game/storage/LoadGame";

/** A scored game against the bot, laid out and one move in — something worth coming back to. */
const underWay: GameSliceState = [
  opponentChosen("Bot"),
  botStrengthChosen(1600),
  formatChosen("Scored"),
  hanSetupChosen(setupNamed("Left Elephant")),
  choSetupChosen(setupNamed("Inner Elephant")),
  moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}),
].reduce(gameReducer, firstGame());

function storageHolding(value: unknown): Pick<Storage, "getItem"> {
  return {getItem: key => (key === GAME_STORAGE_KEY ? JSON.stringify(value) : null)};
}

it("deals the first game when nothing has been kept", () => {
  expect(loadGame({getItem: () => null})).toEqual(firstGame());
});

it("comes back to the game exactly as it was left", () => {
  expect(loadGame(storageHolding(underWay))).toEqual(underWay);
});

it("comes back remembering that the bot was let open", () => {
  expect(loadGame(storageHolding({...underWay, botMayOpen: true})).botMayOpen).toBe(true);
});

it("reads a game kept before the bot waited to be let open as one it has not been let open", () => {
  expect(loadGame(storageHolding({...underWay, botMayOpen: undefined})).botMayOpen).toBe(false);
});

it("comes back with the app's own setups, found by name, rather than whatever was kept beside the name", () => {
  const tampered = {
    ...underWay,
    phase: {...underWay.phase, hanSetup: {...underWay.phase.hanSetup, backRank: ["general"]}},
  };

  expect(loadGame(storageHolding(tampered)).phase.hanSetup).toBe(setupNamed("Left Elephant"));
});

it("deals the first game when a kept position has a piece off the board", () => {
  const offBoard = {
    ...underWay,
    played: {
      ...underWay.played,
      present: {
        ...underWay.played.present,
        pieces: [
          ...underWay.played.present.pieces,
          {piece: {side: "han", type: "soldier"}, position: {file: 10, rank: 5}},
        ],
      },
    },
  };

  expect(loadGame(storageHolding(offBoard))).toEqual(firstGame());
});

it("deals the first game when a kept position is missing a general", () => {
  const generalless = {
    ...underWay,
    played: {
      ...underWay.played,
      present: {
        ...underWay.played.present,
        pieces: underWay.played.present.pieces.filter(({piece}) => !(piece.side === "han" && piece.type === "general")),
      },
    },
  };

  expect(loadGame(storageHolding(generalless))).toEqual(firstGame());
});

it("deals the first game when two pieces were kept on one point", () => {
  const [first] = underWay.played.present.pieces;
  const crowded = {
    ...underWay,
    played: {
      ...underWay.played,
      present: {...underWay.played.present, pieces: [...underWay.played.present.pieces, first]},
    },
  };

  expect(loadGame(storageHolding(crowded))).toEqual(firstGame());
});

it("deals the first game when the kept game and its phase disagree on which game is being played", () => {
  const mismatched = {...underWay, phase: {...underWay.phase, format: "Casual"}};

  expect(loadGame(storageHolding(mismatched))).toEqual(firstGame());
});

it("deals the first game when the kept opponent is not one the app offers", () => {
  expect(loadGame(storageHolding({...underWay, opponent: {...underWay.opponent, botElo: 1234}}))).toEqual(firstGame());
});

function setupNamed(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
