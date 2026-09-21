import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {agreeADrawIn} from "@src/game/record/AgreeADrawIn";
import {expect, it} from "vitest";
import {outcomeOf} from "@src/game/OutcomeOf";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {undo} from "@src/game/record/Undo";
import {placed} from "@src/testing/Placed";

/** 합의 무승부 recorded — `agreeADraw`'s counterpart to `playMove`. See `docs/rules.md` §6.4. */

it("agrees the draw on the position the game stands at", () => {
  const played = agreeADrawIn(playedGameFrom(bare()));

  expect(outcomeOf(played.present)).toEqual({kind: "agreement"});
});

it("keeps the position the agreement was made from", () => {
  const state = bare();

  expect(agreeADrawIn(playedGameFrom(state)).past).toEqual([state]);
});

it("leaves every piece where it stood, an agreement moving nothing", () => {
  const state = bare();

  expect(agreeADrawIn(playedGameFrom(state)).present.pieces).toEqual(state.pieces);
});

/** The reason the agreement is recorded at all: undo is what a player reaches for once a game has ended. */
it("puts the game back to where it was when the agreement is taken back", () => {
  const state = bare();

  const back = undo(agreeADrawIn(playedGameFrom(state)));

  expect(back.present).toEqual(state);
  expect(outcomeOf(back.present)).toEqual({kind: "undecided"});
});

it("throws exactly as agreeADraw does, in a game with no draw to agree", () => {
  expect(() => agreeADrawIn(playedGameFrom({...bare(), format: "Scored"}))).toThrow(/casual game/);
});

function bare(): GameState {
  return {
    pieces: [cho("general", 5, 9), han("general", 4, 2)],
    sideToMove: "cho",
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
    drawAgreed: false,
  };
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}
