import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {standingOf} from "@src/game/utils/StandingOf";

/**
 * A standing is opaque, so every test here compares one with another rather than reading either. It
 * is what repetition is measured in — see `docs/rules.md` §6.4.
 */

it("gives the same standing to the same board with the same army to move", () => {
  const pieces = [cho("general", 5, 9), han("general", 5, 2)];

  expect(standingOf(toMove("cho", ...pieces))).toBe(standingOf(toMove("cho", ...pieces)));
});

it("gives the same standing however the pieces happen to be ordered", () => {
  const one = toMove("cho", cho("general", 5, 9), cho("chariot", 1, 8), han("general", 5, 2));
  const other = toMove("cho", han("general", 5, 2), cho("general", 5, 9), cho("chariot", 1, 8));

  expect(standingOf(one)).toBe(standingOf(other));
});

it("tells two positions apart by the army to move", () => {
  const pieces = [cho("general", 5, 9), han("general", 5, 2)];

  expect(standingOf(toMove("cho", ...pieces))).not.toBe(standingOf(toMove("han", ...pieces)));
});

it("tells two positions apart by where a piece stands", () => {
  const here = toMove("cho", cho("general", 5, 9), han("general", 5, 2));
  const there = toMove("cho", cho("general", 4, 9), han("general", 5, 2));

  expect(standingOf(here)).not.toBe(standingOf(there));
});

it("tells two positions apart by whose piece is standing there", () => {
  const ours = toMove("cho", cho("general", 5, 9), cho("chariot", 5, 5), han("general", 5, 2));
  const theirs = toMove("cho", cho("general", 5, 9), han("chariot", 5, 5), han("general", 5, 2));

  expect(standingOf(ours)).not.toBe(standingOf(theirs));
});

it("tells two positions apart by what has been taken", () => {
  const whole = toMove("cho", cho("general", 5, 9), cho("chariot", 1, 8), han("general", 5, 2));
  const short = toMove("cho", cho("general", 5, 9), han("general", 5, 2));

  expect(standingOf(whole)).not.toBe(standingOf(short));
});

/**
 * The rested turns are the position's history rather than the position, and history is what a
 * standing is compared *against* — folding it in would mean no position ever matched an older one.
 */
it("is unmoved by how the game got there", () => {
  const played = toMove("cho", cho("general", 5, 9), han("general", 5, 2));
  const rested: GameState = {...played, consecutivePasses: 1, seen: [standingOf(played)]};

  expect(standingOf(rested)).toBe(standingOf(played));
});

function toMove(sideToMove: Side, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
    format: "Casual",
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
