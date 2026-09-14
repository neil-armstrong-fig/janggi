import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {RecordChange} from "@src/game/record/types/RecordChange";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {cuesFor} from "@src/react/pages/game/hooks/utils/CuesFor";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";

/**
 * Changes are written out by hand, because what is under test is which sounds a change makes, not
 * whether the engine can tell one change from another — `game/record/ChangeBetween.test.ts` covers
 * that. The positions they arrive at are built by hand too, as a check or a mate is a shape on the
 * board.
 */

const STEP = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}} as const;

it("sets a piece down on a quiet move, and nothing more", () => {
  expect(names(cuesFor(moved(), opening()))).toEqual(["piecePlaced"]);
});

it("strikes a capture harder than a quiet move", () => {
  const quiet = cuesFor(moved(), opening())[0]?.weight ?? 0;
  const capture = cuesFor(moved("soldier"), opening())[0]?.weight ?? 0;

  expect(capture).toBeGreaterThan(quiet);
});

it("strikes a capture harder the more the taken piece was worth", () => {
  const soldier = cuesFor(moved("soldier"), opening())[0]?.weight ?? 0;
  const chariot = cuesFor(moved("chariot"), opening())[0]?.weight ?? 0;

  expect(names(cuesFor(moved("chariot"), opening()))).toEqual(["pieceTaken"]);
  expect(chariot).toBeGreaterThan(soldier);
});

it("rests a turn with a sound of its own", () => {
  const change: RecordChange = {direction: "advanced", transition: {kind: "passed", side: "cho"}};

  expect(names(cuesFor(change, opening()))).toEqual(["turnRested"]);
});

it("sounds a check after the move that gives one", () => {
  expect(names(cuesFor(moved(), check()))).toEqual(["piecePlaced", "check"]);
});

it("sounds a checkmate, and not a check, once nothing answers it", () => {
  expect(names(cuesFor(moved(), mate()))).toEqual(["piecePlaced", "checkmate"]);
});

it("sounds the call of a casual bikjang once, and nothing after it", () => {
  const change: RecordChange = {direction: "advanced", transition: {kind: "bikjangCalled"}};

  expect(names(cuesFor(change, calledBikjang("Casual")))).toEqual(["bikjang"]);
});

it("sounds a win on points after a scored bikjang, which the call settles", () => {
  const change: RecordChange = {direction: "advanced", transition: {kind: "bikjangCalled"}};

  expect(names(cuesFor(change, calledBikjang("Scored")))).toEqual(["bikjang", "pointsWin"]);
});

it("plays a move replayed the way it played the first time", () => {
  expect(names(cuesFor({...moved("soldier"), direction: "replayed"}, check()))).toEqual(["pieceTaken", "check"]);
});

/** A take-back steps out of whatever it undid, and must not sound that again. */
it("makes one quiet sound for a turn taken back, whatever the position it returns to", () => {
  expect(cuesFor({...moved("chariot"), direction: "takenBack"}, check())).toEqual([{name: "turnTakenBack", weight: 1}]);
});

it("makes one sound for a fresh deal", () => {
  expect(cuesFor({direction: "dealt", transition: undefined}, opening())).toEqual([{name: "dealt", weight: 1}]);
});

function moved(taken?: PieceType): RecordChange {
  return {
    direction: "advanced",
    transition: {
      kind: "moved",
      move: STEP,
      mover: {side: "cho", type: "soldier"},
      taken: taken ? {side: "han", type: taken} : undefined,
    },
  };
}

function names(cues: readonly {name: string}[]): string[] {
  return cues.map(({name}) => name);
}

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

/** Cho to move, its general attacked down file 5, with somewhere to step out to. */
function check(): GameState {
  return position("Casual", cho("general", 5, 9), han("chariot", 5, 5), han("general", 4, 2));
}

/**
 * Cho to move and mated: its general on (5,10) is attacked down file 5, and the only points it could
 * step to — (4,10), (6,10) and (5,9) — are each covered by a chariot of Han's.
 */
function mate(): GameState {
  return position(
    "Casual",
    cho("general", 5, 10),
    han("chariot", 4, 5),
    han("chariot", 5, 5),
    han("chariot", 6, 5),
    han("general", 5, 2),
  );
}

/** The two generals facing down an open file, with next to nothing else left, and the call made. */
function calledBikjang(format: MatchFormat): GameState {
  return {
    ...position(format, cho("general", 5, 9), han("general", 5, 2), cho("soldier", 1, 7)),
    bikjangCalled: true,
  };
}

function position(format: MatchFormat, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove: "cho",
    format,
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
}

function cho(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("cho", type, file, rank);
}

function han(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("han", type, file, rank);
}

function placed(side: Side, type: PieceType, file: number, rank: number): PlacedPiece {
  return {piece: {side, type}, position: {file, rank} as PlacedPiece["position"]};
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
