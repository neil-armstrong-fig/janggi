import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {File, Rank} from "@src/game/board/types/Position";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {applyMove} from "@src/game/ApplyMove";
import {beforeEach, describe, expect, it} from "vitest";
import {movesFrom} from "@src/game/MovesFrom";
import {newGame} from "@src/game/NewGame";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";

/**
 * End to end test for the entire game engine.
 *
 * Nested the way an acceptance spec is: each `describe` plays one move onto the position its parent
 * left behind, and asserts what that move alone changed. Branching two ways from the same position
 * is what makes it cheap to ask "and what if han had answered differently instead" without replaying
 * the opening by hand each time.
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
    expect(movesFor(game)).toHaveLength(31);
  });

  it("offers only moves it will then accept", () => {
    expect(() => movesFor(game).forEach(candidate => applyMove(game, candidate))).not.toThrow();
  });

  it("refuses to let han open", () => {
    expect(() => applyMove(game, move(1, 4, 1, 5))).toThrow(/cho to move/);
  });

  describe("when every opening cho has is played", () => {
    let openings: GameState[];

    beforeEach(() => {
      openings = movesFor(game).map(candidate => applyMove(game, candidate));
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
      expect(openings.flatMap(movesFor)).toHaveLength(31 * 31);
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
      });
    });
  });
});

/** Every move the army to move may make, asked for one piece at a time, as a caller would. */
function movesFor(state: GameState): Move[] {
  return state.pieces
    .filter(({piece}) => piece.side === state.sideToMove)
    .flatMap(({position}) => movesFrom(state, position).map(to => ({from: position, to})));
}

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
