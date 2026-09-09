import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {File, Rank} from "@src/game/board/types/Position";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {applyMove} from "@src/game/ApplyMove";
import {beforeEach, describe, expect, it} from "vitest";
import {canPass} from "@src/game/CanPass";
import {isCheckmate} from "@src/game/IsCheckmate";
import {isInCheck} from "@src/game/IsInCheck";
import {legalMovesFor} from "@src/game/LegalMovesFor";
import {materialFor} from "@src/game/MaterialFor";
import {movesFrom} from "@src/game/MovesFrom";
import {newGame} from "@src/game/NewGame";
import {outcomeOf} from "@src/game/OutcomeOf";
import {pass} from "@src/game/Pass";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {scoreFor} from "@src/game/ScoreFor";

/**
 * End to end test for the entire game engine.
 *
 * Nested the way an acceptance spec is: each `describe` plays one move onto the position its parent
 * left behind, and asserts what that move alone changed. Branching two ways from the same position
 * is what makes it cheap to ask "and what if han had answered differently instead" without replaying
 * the opening by hand each time.
 *
 * Two starting points, both top-level: a real opening, and endgames built piece by piece. An
 * endgame has to be constructed — searching the engine confirms no check exists before ply three
 * and a mate is far deeper than that, so playing to one from the opening is neither possible in a
 * readable number of moves nor worth the run time.
 *
 * The root `AGENTS.md` ban on a wrapper `describe` does not apply here. That rule stops a unit test
 * file restating the one export it is named after; this file is named after no export, and every
 * level below has a genuinely different setup — which is the grouping the same rule calls earned.
 */
describe("a new game", () => {
  let game: GameState;

  beforeEach(() => {
    game = newGame(setup("Inner Elephant"), setup("Inner Elephant"));
  });

  it("stands thirty-two pieces on the board", () => {
    expect(game.pieces).toHaveLength(32);
  });

  it("gives cho the first move", () => {
    expect(game.sideToMove).toBe("cho");
  });

  it("offers cho thirty-one of them", () => {
    expect(legalMovesFor(game)).toHaveLength(31);
  });

  it("offers only moves it will then accept", () => {
    expect(() => legalMovesFor(game).forEach(candidate => applyMove(game, candidate))).not.toThrow();
  });

  it("refuses to let han open", () => {
    expect(() => applyMove(game, move(1, 4, 1, 5))).toThrow(/cho to move/);
  });

  describe("when every opening cho has is played", () => {
    let openings: GameState[];

    beforeEach(() => {
      openings = legalMovesFor(game).map(candidate => applyMove(game, candidate));
    });

    it("reaches thirty-one positions", () => {
      expect(openings).toHaveLength(31);
    });

    it("leaves han to move in every one of them", () => {
      expect(openings.every(position => position.sideToMove === "han")).toBe(true);
    });

    /**
     * A perft, and the assertion that exercises every rule at once. The product is derived rather
     * than recorded: han's own count is 31 by symmetry, and no opening cho has changes it, because
     * cho cannot reach past rank 6 in one move and nothing han owns reaches past rank 5.
     *
     * The near miss is worth knowing. A cho soldier stepping sideways to (2,7) does hand han's
     * cannon on (2,3) its first screen — but the only thing beyond it is cho's other cannon, and a
     * cannon may neither be jumped nor taken by one. See `docs/rules.md` §4.6.
     */
    it("offers han thirty-one replies to each, nine hundred and sixty-one in all", () => {
      expect(openings.flatMap(legalMovesFor)).toHaveLength(31 * 31);
    });
  });

  describe("when cho sweeps its edge soldier", () => {
    let before: GameState;

    beforeEach(() => {
      before = game;
      game = applyMove(game, move(1, 7, 1, 6));
    });

    it("stands the soldier a rank further up the board", () => {
      expect(pieceOn(game, 1, 6)).toEqual({side: "cho", type: "soldier"});
    });

    it("leaves nothing behind on the point it came from", () => {
      expect(pieceOn(game, 1, 7)).toBeUndefined();
    });

    it("hands the turn to han", () => {
      expect(game.sideToMove).toBe("han");
    });

    it("takes nothing, the armies being three ranks apart", () => {
      expect(game.pieces).toHaveLength(32);
    });

    it("refuses to let cho move twice running", () => {
      expect(() => applyMove(game, move(3, 7, 3, 6))).toThrow(/han to move/);
    });

    it("leaves the position it was played from untouched, so a game can be replayed", () => {
      expect(before.pieces).toHaveLength(32);
      expect(before.sideToMove).toBe("cho");
      expect(pieceOn(before, 1, 7)).toEqual({side: "cho", type: "soldier"});
    });

    describe("and han answers on the far wing", () => {
      beforeEach(() => {
        game = applyMove(game, move(9, 4, 9, 5));
      });

      it("hands the turn back to cho", () => {
        expect(game.sideToMove).toBe("cho");
      });

      describe("and cho brings its chariot down the file the soldier opened", () => {
        beforeEach(() => {
          game = applyMove(game, move(1, 10, 1, 7));
        });

        it("stands the chariot where the soldier had been", () => {
          expect(pieceOn(game, 1, 7)).toEqual({side: "cho", type: "chariot"});
        });

        it("leaves the corner it came from empty", () => {
          expect(pieceOn(game, 1, 10)).toBeUndefined();
        });

        it("still has every piece on the board", () => {
          expect(game.pieces).toHaveLength(32);
        });
      });
    });

    describe("and han advances into contact instead", () => {
      beforeEach(() => {
        game = applyMove(game, move(1, 4, 1, 5));
      });

      it("leaves the two soldiers facing each other down the file", () => {
        expect(pieceOn(game, 1, 6)).toEqual({side: "cho", type: "soldier"});
        expect(pieceOn(game, 1, 5)).toEqual({side: "han", type: "soldier"});
      });

      it("offers cho the capture", () => {
        expect(movesFrom(game, {file: 1, rank: 6})).toContainEqual({file: 1, rank: 5});
      });

      describe("and cho plays elsewhere, leaving the two soldiers touching", () => {
        beforeEach(() => {
          game = applyMove(game, move(3, 7, 3, 6));
        });

        describe("and han takes instead", () => {
          beforeEach(() => {
            game = applyMove(game, move(1, 5, 1, 6));
          });

          it("stands the han soldier on the point it took", () => {
            expect(pieceOn(game, 1, 6)).toEqual({side: "han", type: "soldier"});
          });

          it("leaves cho a piece down", () => {
            expect(game.pieces.filter(({piece}) => piece.side === "cho")).toHaveLength(15);
            expect(game.pieces.filter(({piece}) => piece.side === "han")).toHaveLength(16);
          });
        });
      });

      describe("and cho takes it", () => {
        beforeEach(() => {
          game = applyMove(game, move(1, 6, 1, 5));
        });

        it("stands the cho soldier on the point it took", () => {
          expect(pieceOn(game, 1, 5)).toEqual({side: "cho", type: "soldier"});
        });

        it("leaves han a piece down", () => {
          expect(game.pieces.filter(({piece}) => piece.side === "han")).toHaveLength(15);
          expect(game.pieces.filter(({piece}) => piece.side === "cho")).toHaveLength(16);
        });

        it("takes the piece off the board altogether", () => {
          expect(game.pieces).toHaveLength(31);
        });

        it("costs han the two points a soldier is worth", () => {
          expect(materialFor(game, "cho")).toBe(72);
          expect(materialFor(game, "han")).toBe(70);
        });

        /** The armies opened level on the board; the 덤 is why the scores were never level. */
        it("leaves han behind on points even with the 덤 counted in", () => {
          expect(scoreFor(game, "cho")).toBe(72);
          expect(scoreFor(game, "han")).toBe(71.5);
        });
      });
    });
  });
});

/**
 * Cho's general on its palace centre against a chariot that can reach it. Everything here is one
 * move from mattering, which is what makes it worth constructing rather than playing to.
 */
describe("an endgame of one chariot against a bare general", () => {
  let game: GameState;

  beforeEach(() => {
    game = position("cho", cho("general", 5, 9), cho("chariot", 1, 8), han("general", 4, 2));
  });

  it("has nobody in check to begin with", () => {
    expect(isInCheck(game, "han")).toBe(false);
    expect(isInCheck(game, "cho")).toBe(false);
  });

  describe("when the chariot swings onto the general's file", () => {
    beforeEach(() => {
      game = applyMove(game, move(1, 8, 4, 8));
    });

    it("gives check down the open file", () => {
      expect(isInCheck(game, "han")).toBe(true);
    });

    it("is not mate, because the general can still step aside", () => {
      expect(isCheckmate(game, "han")).toBe(false);
    });

    /** The whole of what the check filter is for: nothing on offer leaves the general taken. */
    it("offers han only moves that answer it", () => {
      const answers = legalMovesFor(game).map(candidate => applyMove(game, candidate));

      expect(answers.every(after => !isInCheck(after, "han"))).toBe(true);
    });

    /**
     * A check has to be answered, and resting a move does not answer it. Were a player allowed to
     * pass out of check there could be no 외통 at all, since a mated general would simply sit still.
     */
    it("does not let han rest the move instead of answering", () => {
      expect(canPass(game)).toBe(false);
      expect(() => pass(game)).toThrow();
    });

    describe("and the general steps off the file", () => {
      beforeEach(() => {
        game = applyMove(game, move(4, 2, 5, 2));
      });

      it("is out of check", () => {
        expect(isInCheck(game, "han")).toBe(false);
      });
    });
  });
});

/**
 * Three chariots cover the nine points of a palace between them, which is the shape of a mate. One
 * of them is a move away from taking its file, so the mate is played rather than asserted into
 * being.
 */
describe("an endgame one move from mate", () => {
  let game: GameState;

  beforeEach(() => {
    game = position(
      "han",
      cho("general", 5, 9),
      han("general", 5, 2),
      han("chariot", 4, 1),
      han("chariot", 6, 1),
      han("chariot", 1, 3),
    );
  });

  it("has cho not yet in check", () => {
    expect(isInCheck(game, "cho")).toBe(false);
  });

  describe("when the third chariot takes the middle file", () => {
    beforeEach(() => {
      game = applyMove(game, move(1, 3, 5, 3));
    });

    it("is checkmate", () => {
      expect(isCheckmate(game, "cho")).toBe(true);
    });

    it("leaves cho nothing at all to play", () => {
      expect(legalMovesFor(game)).toEqual([]);
    });

    it("leaves the general on the board, because a mated general is never actually taken", () => {
      expect(pieceOn(game, 5, 9)).toEqual({side: "cho", type: "general"});
    });
  });
});

/**
 * A cannon cannot move at all without exactly one piece to jump, so it gives check only once
 * something stands in the way — and the piece that provides the screen may be its own. There is no
 * way to reach this from an opening in a readable number of moves.
 */
describe("an endgame where a cannon has nothing to jump", () => {
  let game: GameState;

  beforeEach(() => {
    game = position("han", cho("general", 5, 9), han("general", 4, 2), han("cannon", 5, 1), han("soldier", 4, 5));
  });

  it("gives no check, the file being empty", () => {
    expect(isInCheck(game, "cho")).toBe(false);
  });

  describe("when a soldier steps across to screen it", () => {
    beforeEach(() => {
      game = applyMove(game, move(4, 5, 5, 5));
    });

    it("opens the cannon's line and gives check", () => {
      expect(isInCheck(game, "cho")).toBe(true);
    });

    it("is not mate — the general has the whole palace to leave by", () => {
      expect(isCheckmate(game, "cho")).toBe(false);
    });
  });
});

/**
 * Janggi has no stalemate: a player with nothing to play rests the move and the game goes on, which
 * is why `isCheckmate` asks for a check as well as an empty move list. See `docs/rules.md` §6.3.
 *
 * Cho's general is boxed into a palace corner by two chariots that cover its three exits without
 * attacking the corner itself — one holds file 5, which is (5,10) and (5,9), and the other rank 9,
 * which is (4,9) and (5,9) again. (3,10) is outside the palace, so nothing is left.
 */
describe("an endgame where the side to move has nothing to play", () => {
  let game: GameState;

  beforeEach(() => {
    game = position("cho", cho("general", 4, 10), han("general", 5, 2), han("chariot", 5, 5), han("chariot", 9, 9));
  });

  it("leaves cho nothing at all to play", () => {
    expect(legalMovesFor(game)).toEqual([]);
  });

  it("is not check, the corner lying on neither chariot's line", () => {
    expect(isInCheck(game, "cho")).toBe(false);
  });

  it("is not mate either, an empty move list being fatal only while in check", () => {
    expect(isCheckmate(game, "cho")).toBe(false);
  });

  it("lets cho rest the move", () => {
    expect(canPass(game)).toBe(true);
  });

  describe("when cho rests the move", () => {
    let before: GameState;

    beforeEach(() => {
      before = game;
      game = pass(game);
    });

    it("hands the turn to han", () => {
      expect(game.sideToMove).toBe("han");
    });

    it("leaves every piece where it stood, a pass moving nothing", () => {
      expect(game.pieces).toEqual(before.pieces);
    });

    it("carries the game on, one pass being no ending", () => {
      expect(outcomeOf(game)).toEqual({kind: "undecided"});
    });
  });
});

/**
 * Two passes in a row end the game and it is decided on points — 대한장기연맹's 2022 revision, and
 * the first ending in janggi that reaches the 덤. See `docs/rules.md` §6.3 and §6.5.
 *
 * Cho is a soldier up on the board and han has its 1.5, so the whole game hangs on half a point.
 * That is what the half point is for: a scored game cannot tie.
 */
describe("an endgame both players agree to stop", () => {
  let game: GameState;

  beforeEach(() => {
    game = position(
      "cho",
      cho("general", 5, 9),
      cho("chariot", 1, 8),
      cho("soldier", 5, 7),
      han("general", 4, 2),
      han("chariot", 1, 3),
    );
  });

  it("has cho a soldier up on the board", () => {
    expect(materialFor(game, "cho")).toBe(15);
    expect(materialFor(game, "han")).toBe(13);
  });

  it("has the 덤 leaving han half a point short rather than two", () => {
    expect(scoreFor(game, "cho")).toBe(15);
    expect(scoreFor(game, "han")).toBe(14.5);
  });

  it("is undecided while there is still a game to play", () => {
    expect(outcomeOf(game)).toEqual({kind: "undecided"});
  });

  describe("when cho rests the move", () => {
    beforeEach(() => {
      game = pass(game);
    });

    it("counts the one pass", () => {
      expect(game.consecutivePasses).toBe(1);
    });

    it("hands the turn to han", () => {
      expect(game.sideToMove).toBe("han");
    });

    it("is still undecided, one pass being only one player's agreement", () => {
      expect(outcomeOf(game)).toEqual({kind: "undecided"});
    });

    describe("and han rests the move as well", () => {
      beforeEach(() => {
        game = pass(game);
      });

      it("ends the game on points, won by the side ahead", () => {
        expect(outcomeOf(game)).toEqual({kind: "pointsWin", winner: "cho", scores: {cho: 15, han: 14.5}});
      });

      it("refuses a move once it is over", () => {
        expect(() => applyMove(game, move(1, 3, 1, 8))).toThrow();
      });

      it("refuses a third pass once it is over", () => {
        expect(() => pass(game)).toThrow();
      });
    });

    describe("and han takes the chariot instead", () => {
      beforeEach(() => {
        game = applyMove(game, move(1, 3, 1, 8));
      });

      it("puts han a chariot ahead", () => {
        expect(materialFor(game, "cho")).toBe(2);
        expect(materialFor(game, "han")).toBe(13);
      });

      it("forgets the pass, a move having come between", () => {
        expect(game.consecutivePasses).toBe(0);
      });

      describe("and the two then rest a move each", () => {
        beforeEach(() => {
          game = pass(pass(game));
        });

        it("ends it the other way, han being ahead on the board as well as the 덤", () => {
          expect(outcomeOf(game)).toEqual({kind: "pointsWin", winner: "han", scores: {cho: 2, han: 14.5}});
        });
      });
    });
  });
});

function pieceOn(state: GameState, file: File, rank: Rank): Piece | undefined {
  return pieceAt(piecesByPosition(state.pieces), {file, rank});
}

/**
 * Spelled out in `File` and `Rank` rather than `number`, so a coordinate off the edge of the board
 * is a compile error here exactly as it is everywhere else. A cast would have been shorter and
 * would have thrown that away.
 */
function move(fromFile: File, fromRank: Rank, toFile: File, toRank: Rank): Move {
  return {
    from: {file: fromFile, rank: fromRank},
    to: {file: toFile, rank: toRank},
  };
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

/** A board built piece by piece, for a state no opening reaches in a readable number of moves. */
function position(sideToMove: Side, ...pieces: readonly PlacedPiece[]): GameState {
  return {pieces, sideToMove, consecutivePasses: 0};
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return {piece: {side: "cho", type}, position: {file, rank}};
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return {piece: {side: "han", type}, position: {file, rank}};
}
