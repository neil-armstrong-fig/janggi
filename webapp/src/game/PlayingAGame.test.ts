import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Move} from "@src/game/types/Move";
import type {File, Position, Rank} from "@src/game/board/types/Position";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {applyMove} from "@src/game/ApplyMove";
import {beforeEach, describe, expect, it} from "vitest";
import {callBikjang} from "@src/game/bikjang/CallBikjang";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {canPass} from "@src/game/passing/CanPass";
import {canPlace} from "@src/game/setups/CanPlace";
import {canRedo} from "@src/game/record/CanRedo";
import {elephantPairingOf} from "@src/game/setups/ElephantPairingOf";
import {isArranged} from "@src/game/setups/IsArranged";
import {canUndo} from "@src/game/record/CanUndo";
import {isBikjang} from "@src/game/bikjang/IsBikjang";
import {isCheckmate} from "@src/game/check/IsCheckmate";
import {isInCheck} from "@src/game/check/IsInCheck";
import {isRepetition} from "@src/game/repetition/IsRepetition";
import {legalMovesFor} from "@src/game/LegalMovesFor";
import {materialFor} from "@src/game/scoring/MaterialFor";
import {movesFrom} from "@src/game/MovesFrom";
import {newGame} from "@src/game/NewGame";
import {newGameFrom} from "@src/game/setups/NewGameFrom";
import {outcomeOf} from "@src/game/OutcomeOf";
import {pass} from "@src/game/passing/Pass";
import {place} from "@src/game/setups/Place";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {redo} from "@src/game/record/Redo";
import {restTurn} from "@src/game/record/RestTurn";
import {scoreFor} from "@src/game/scoring/ScoreFor";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";
import {undo} from "@src/game/record/Undo";

/**
 * End to end test for the entire game engine.
 *
 * Nested the way an acceptance spec is: each `describe` plays one move onto the position its parent
 * left behind, and asserts what that move alone changed. Branching two ways from the same position
 * is what makes it cheap to ask "and what if han had answered differently instead" without replaying
 * the opening by hand each time.
 *
 * Every top-level block is a starting point of its own: a real opening, and endgames built piece by
 * piece. An endgame has to be constructed — searching the engine confirms no check exists before ply
 * three and a mate is far deeper than that, so playing to one from the opening is neither possible
 * in a readable number of moves nor worth the run time.
 *
 * The last three blocks play through a `PlayedGame` rather than a bare `GameState`, because taking a
 * game back is the one thing the rules alone cannot show.
 *
 * The root `AGENTS.md` ban on a wrapper `describe` does not apply here. That rule stops a unit test
 * file restating the one export it is named after; this file is named after no export, and every
 * level below has a genuinely different setup — which is the grouping the same rule calls earned.
 */
describe("a new game", () => {
  let game: GameState;

  beforeEach(() => {
    game = newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
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
    expect(() => applyMove(game, move({file: 1, rank: 4}, {file: 1, rank: 5}))).toThrow(/cho to move/);
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
      game = applyMove(game, move({file: 1, rank: 7}, {file: 1, rank: 6}));
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
      expect(() => applyMove(game, move({file: 3, rank: 7}, {file: 3, rank: 6}))).toThrow(/han to move/);
    });

    it("leaves the position it was played from untouched, so a game can be replayed", () => {
      expect(before.pieces).toHaveLength(32);
      expect(before.sideToMove).toBe("cho");
      expect(pieceOn(before, 1, 7)).toEqual({side: "cho", type: "soldier"});
    });

    describe("and han answers on the far wing", () => {
      beforeEach(() => {
        game = applyMove(game, move({file: 9, rank: 4}, {file: 9, rank: 5}));
      });

      it("hands the turn back to cho", () => {
        expect(game.sideToMove).toBe("cho");
      });

      describe("and cho brings its chariot down the file the soldier opened", () => {
        beforeEach(() => {
          game = applyMove(game, move({file: 1, rank: 10}, {file: 1, rank: 7}));
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
        game = applyMove(game, move({file: 1, rank: 4}, {file: 1, rank: 5}));
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
          game = applyMove(game, move({file: 3, rank: 7}, {file: 3, rank: 6}));
        });

        describe("and han takes instead", () => {
          beforeEach(() => {
            game = applyMove(game, move({file: 1, rank: 5}, {file: 1, rank: 6}));
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
          game = applyMove(game, move({file: 1, rank: 6}, {file: 1, rank: 5}));
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
      game = applyMove(game, move({file: 1, rank: 8}, {file: 4, rank: 8}));
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
        game = applyMove(game, move({file: 4, rank: 2}, {file: 5, rank: 2}));
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
      game = applyMove(game, move({file: 1, rank: 3}, {file: 5, rank: 3}));
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
      game = applyMove(game, move({file: 4, rank: 5}, {file: 5, rank: 5}));
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
        expect(() => applyMove(game, move({file: 1, rank: 3}, {file: 1, rank: 8}))).toThrow();
      });

      it("refuses a third pass once it is over", () => {
        expect(() => pass(game)).toThrow();
      });
    });

    describe("and han takes the chariot instead", () => {
      beforeEach(() => {
        game = applyMove(game, move({file: 1, rank: 3}, {file: 1, rank: 8}));
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

/**
 * Taking a game back, which is not a rule of janggi at all — no source has anything to say about it,
 * and this engine allows it unconditionally. What makes it worth playing out end to end is that
 * nothing new has to be remembered to do it: `applyMove` and `pass` already hand back a fresh
 * `GameState` and leave the one they were given alone, so a record has only to keep them.
 */
describe("a game being taken back", () => {
  let played: PlayedGame;
  let opening: GameState;

  beforeEach(() => {
    opening = newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
    played = playedGameFrom(opening);
  });

  it("stands on the position it was started from", () => {
    expect(played.present).toEqual(opening);
  });

  it("has nothing to take back before anyone has played", () => {
    expect(canUndo(played)).toBe(false);
    expect(canRedo(played)).toBe(false);
  });

  it("refuses to take back a game nobody has played", () => {
    expect(() => undo(played)).toThrow();
  });

  describe("when cho sweeps its edge soldier", () => {
    beforeEach(() => {
      played = playMove(played, move({file: 1, rank: 7}, {file: 1, rank: 6}));
    });

    it("stands on the position the move reached", () => {
      expect(played.present).toEqual(applyMove(opening, move({file: 1, rank: 7}, {file: 1, rank: 6})));
    });

    it("keeps the position it was played from", () => {
      expect(played.past).toEqual([opening]);
    });

    it("can be taken back, and has nothing yet to play again", () => {
      expect(canUndo(played)).toBe(true);
      expect(canRedo(played)).toBe(false);
    });

    describe("and the move is taken back", () => {
      let afterTheMove: GameState;

      beforeEach(() => {
        afterTheMove = played.present;
        played = undo(played);
      });

      it("puts every piece back where it stood", () => {
        expect(played.present).toEqual(opening);
      });

      it("gives cho the move again", () => {
        expect(played.present.sideToMove).toBe("cho");
      });

      it("has nothing left to take back", () => {
        expect(canUndo(played)).toBe(false);
        expect(() => undo(played)).toThrow();
      });

      it("offers the move again", () => {
        expect(canRedo(played)).toBe(true);
      });

      describe("and it is played again", () => {
        beforeEach(() => {
          played = redo(played);
        });

        it("reaches the very position it left", () => {
          expect(played.present).toEqual(afterTheMove);
        });

        it("has nothing left to play again", () => {
          expect(canRedo(played)).toBe(false);
          expect(() => redo(played)).toThrow();
        });
      });

      /** The branch that was taken back is gone, not kept beside the one actually played. */
      describe("and cho sweeps the other edge soldier instead", () => {
        beforeEach(() => {
          played = playMove(played, move({file: 9, rank: 7}, {file: 9, rank: 6}));
        });

        it("forgets the move that was taken back", () => {
          expect(canRedo(played)).toBe(false);
        });

        it("stands on the move that was actually played", () => {
          expect(pieceOn(played.present, 9, 6)).toEqual({side: "cho", type: "soldier"});
          expect(pieceOn(played.present, 1, 6)).toBeUndefined();
        });
      });
    });

    describe("and the two soldiers meet and cho takes", () => {
      beforeEach(() => {
        played = playMove(played, move({file: 1, rank: 4}, {file: 1, rank: 5}));
        played = playMove(played, move({file: 1, rank: 6}, {file: 1, rank: 5}));
      });

      it("has the han soldier off the board", () => {
        expect(played.present.pieces).toHaveLength(31);
        expect(materialFor(played.present, "han")).toBe(70);
      });

      describe("and the capture is taken back", () => {
        beforeEach(() => {
          played = undo(played);
        });

        it("stands the taken soldier back on the board", () => {
          expect(played.present.pieces).toHaveLength(32);
          expect(pieceOn(played.present, 1, 5)).toEqual({side: "han", type: "soldier"});
        });

        it("gives han back the two points it cost", () => {
          expect(materialFor(played.present, "han")).toBe(72);
        });

        it("gives cho the move it took with", () => {
          expect(played.present.sideToMove).toBe("cho");
        });
      });
    });

    /** A rested turn is a position like any other, so one ply of undo covers it without knowing. */
    describe("and han rests the turn", () => {
      beforeEach(() => {
        played = restTurn(played);
      });

      it("counts the rested turn", () => {
        expect(played.present.consecutivePasses).toBe(1);
      });

      describe("and the rested turn is taken back", () => {
        beforeEach(() => {
          played = undo(played);
        });

        it("forgets the rest", () => {
          expect(played.present.consecutivePasses).toBe(0);
        });

        it("hands han back the turn it rested", () => {
          expect(played.present.sideToMove).toBe("han");
        });
      });
    });
  });
});

/**
 * The case undo exists for, and the one every other entry point refuses: `applyMove` and `pass` both
 * throw once `outcomeOf` has decided the game. Undo must not, because the move worth taking back is
 * usually the one that ended it.
 *
 * The position is the one "an endgame both players agree to stop" plays out, at the point where the
 * second rested turn has just settled it on points.
 */
describe("a game taken back after it was settled on points", () => {
  let played: PlayedGame;

  beforeEach(() => {
    played = playedGameFrom(
      position(
        "cho",
        cho("general", 5, 9),
        cho("chariot", 1, 8),
        cho("soldier", 5, 7),
        han("general", 4, 2),
        han("chariot", 1, 3),
      ),
    );
    played = restTurn(restTurn(played));
  });

  it("is over, with no turn left to rest", () => {
    expect(outcomeOf(played.present)).toEqual({kind: "pointsWin", winner: "cho", scores: {cho: 15, han: 14.5}});
    expect(() => pass(played.present)).toThrow();
  });

  it("can still be taken back, the game being over only for playing on", () => {
    expect(canUndo(played)).toBe(true);
  });

  describe("when the second rested turn is taken back", () => {
    beforeEach(() => {
      played = undo(played);
    });

    it("carries the game on again", () => {
      expect(outcomeOf(played.present)).toEqual({kind: "undecided"});
    });

    it("hands han back the turn it rested", () => {
      expect(played.present.sideToMove).toBe("han");
      expect(played.present.consecutivePasses).toBe(1);
    });

    it("lets han take the chariot instead", () => {
      expect(() => applyMove(played.present, move({file: 1, rank: 3}, {file: 1, rank: 8}))).not.toThrow();
    });
  });
});

/** The other ending, taken back the same way: a mate is a position, and undo does not read it. */
describe("a game taken back after mate", () => {
  let played: PlayedGame;

  beforeEach(() => {
    played = playedGameFrom(
      position(
        "han",
        cho("general", 5, 9),
        han("general", 5, 2),
        han("chariot", 4, 1),
        han("chariot", 6, 1),
        han("chariot", 1, 3),
      ),
    );
    played = playMove(played, move({file: 1, rank: 3}, {file: 5, rank: 3}));
  });

  it("is mate, with nothing at all for cho to play", () => {
    expect(isCheckmate(played.present, "cho")).toBe(true);
    expect(legalMovesFor(played.present)).toEqual([]);
  });

  describe("when the mating move is taken back", () => {
    beforeEach(() => {
      played = undo(played);
    });

    it("is no longer mate", () => {
      expect(isCheckmate(played.present, "cho")).toBe(false);
    });

    it("stands the chariot back on the point it came from", () => {
      expect(pieceOn(played.present, 1, 3)).toEqual({side: "han", type: "chariot"});
      expect(pieceOn(played.present, 5, 3)).toBeUndefined();
    });

    it("leaves the mate there to be played again", () => {
      expect(canRedo(played)).toBe(true);
    });
  });
});

/**
 * "동일한 수를 3회 이상 반복할 수 없다. 단, 기물의 총 점수가 각각 30점 미만일 때에는 동일수를
 * 반복할 수 있다" — the same position may not stand a third time unless each side is under thirty
 * points. See `docs/rules.md` §6.4.
 *
 * Played from the real opening rather than a built endgame, because the exemption is measured on
 * material and a new game stands at seventy-two a side. Both generals step off their palace centres
 * and back onto them, which is the shortest circuit that changes nothing: four plies return the
 * opening position, and a second circuit would stand it there a third time.
 */
describe("a game shuffling back and forth", () => {
  let game: GameState;

  beforeEach(() => {
    game = newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
  });

  it("has left no position behind before anyone has played", () => {
    expect(game.seen).toEqual([]);
  });

  it("bars nothing while both armies stand at seventy-two", () => {
    expect(legalMovesFor(game)).toHaveLength(31);
  });

  describe("when both generals step off their palace centres and back", () => {
    beforeEach(() => {
      game = applyMove(game, move({file: 5, rank: 9}, {file: 5, rank: 10}));
      game = applyMove(game, move({file: 5, rank: 2}, {file: 5, rank: 1}));
      game = applyMove(game, move({file: 5, rank: 10}, {file: 5, rank: 9}));
      game = applyMove(game, move({file: 5, rank: 1}, {file: 5, rank: 2}));
    });

    it("stands on the opening position again, with cho to move", () => {
      expect(game.sideToMove).toBe("cho");
      expect(pieceOn(game, 5, 9)).toEqual({side: "cho", type: "general"});
      expect(pieceOn(game, 5, 2)).toEqual({side: "han", type: "general"});
    });

    it("has kept the four positions it left behind, no piece having been taken", () => {
      expect(game.seen).toHaveLength(4);
    });

    it("is no repetition yet, a position standing twice being allowed", () => {
      expect(isRepetition(game)).toBe(false);
    });

    it("still offers the step that would bring it round again", () => {
      expect(movesFrom(game, {file: 5, rank: 9})).toContainEqual({file: 5, rank: 10});
    });

    describe("and the two shuffle round once more", () => {
      beforeEach(() => {
        game = applyMove(game, move({file: 5, rank: 9}, {file: 5, rank: 10}));
        game = applyMove(game, move({file: 5, rank: 2}, {file: 5, rank: 1}));
        game = applyMove(game, move({file: 5, rank: 10}, {file: 5, rank: 9}));
      });

      it("stands one ply from the opening position for the third time", () => {
        expect(game.seen).toHaveLength(7);
        expect(game.sideToMove).toBe("han");
      });

      /** Its guards hold the two corners beside it, so the barred step is the whole of its choice. */
      it("leaves han's general nowhere to go, its only step being the one that would repeat", () => {
        expect(movesFrom(game, {file: 5, rank: 1})).toEqual([]);
      });

      it("refuses that step when it is played anyway", () => {
        expect(() => applyMove(game, move({file: 5, rank: 1}, {file: 5, rank: 2}))).toThrow(/cannot move/);
      });

      it("offers only moves it will then accept", () => {
        expect(() => legalMovesFor(game).forEach(candidate => applyMove(game, candidate))).not.toThrow();
      });

      it("is no ending — han has a whole army left to play", () => {
        expect(legalMovesFor(game).length).toBeGreaterThan(0);
        expect(outcomeOf(game)).toEqual({kind: "undecided"});
      });

      describe("and han plays something else", () => {
        beforeEach(() => {
          game = applyMove(game, move({file: 1, rank: 4}, {file: 1, rank: 5}));
        });

        it("carries the game on with the circuit broken", () => {
          expect(game.sideToMove).toBe("cho");
          expect(isRepetition(game)).toBe(false);
        });
      });
    });
  });
});

/**
 * Clause ①'s exemption: under thirty points a side, a position may be repeated, and nothing refuses
 * the third standing. Two bare generals and a chariot each is thirteen apiece, so the same circuit
 * that was barred from the opening is allowed here — and, with nothing to refuse it, is what ends the
 * game: a casual one as a draw, since nothing else would ever stop two armies that cannot make
 * progress. `isRepetition` still reports the plain fact. See `docs/rules.md` §6.4.
 */
describe("an endgame where repeating is allowed", () => {
  let game: GameState;

  beforeEach(() => {
    game = position("cho", cho("general", 4, 9), cho("chariot", 1, 5), han("general", 6, 2), han("chariot", 9, 5));
  });

  it("has both armies under thirty points", () => {
    expect(materialFor(game, "cho")).toBe(13);
    expect(materialFor(game, "han")).toBe(13);
  });

  describe("when the two generals shuffle round twice", () => {
    beforeEach(() => {
      game = shuffled(shuffled(game));
    });

    it("stands on the position it started from for the third time", () => {
      expect(isRepetition(game)).toBe(true);
    });

    it("was offered the move that brought it there rather than barring it, and the game ends on it", () => {
      expect(outcomeOf(game)).toEqual({kind: "repetition"});
    });

    it("refuses the turn after it, there being nothing left to play", () => {
      expect(() => applyMove(game, move({file: 4, rank: 9}, {file: 4, rank: 10}))).toThrow();
    });

    it("would still offer the move, the exemption not running out — it is the ending that stops the game", () => {
      expect(movesFrom(game, {file: 4, rank: 9})).toContainEqual({file: 4, rank: 10});
    });
  });
});

/**
 * 빅장. The two generals come to face each other down an open file, and in a **casual** game either
 * player may call it and take the draw — en.wikipedia's and pychess's reading. It is a call rather
 * than an automatic ending, which is why the position alone leaves the game undecided. See
 * `docs/rules.md` §6.2.
 */
describe("an endgame where the generals face each other", () => {
  let game: GameState;

  beforeEach(() => {
    game = position("cho", cho("general", 5, 9), cho("chariot", 1, 8), han("general", 5, 2), han("chariot", 9, 3));
  });

  it("stands the two generals down an open file", () => {
    expect(isBikjang(game)).toBe(true);
  });

  it("is undecided all the same, a bikjang being called rather than befalling anyone", () => {
    expect(outcomeOf(game)).toEqual({kind: "undecided"});
  });

  it("lets cho call it", () => {
    expect(canCallBikjang(game)).toBe(true);
  });

  describe("when cho calls it", () => {
    let before: GameState;

    beforeEach(() => {
      before = game;
      game = callBikjang(game);
    });

    it("ends the game as a draw", () => {
      expect(outcomeOf(game)).toEqual({kind: "bikjang"});
    });

    it("leaves every piece where it stood, a call moving nothing", () => {
      expect(game.pieces).toEqual(before.pieces);
    });

    it("refuses a move once it is over", () => {
      expect(() => applyMove(game, move({file: 1, rank: 8}, {file: 1, rank: 7}))).toThrow(/game is over/);
    });

    it("refuses a rested turn once it is over", () => {
      expect(canPass(game)).toBe(false);
      expect(() => pass(game)).toThrow(/game is over/);
    });
  });

  describe("and cho steps its general aside instead", () => {
    beforeEach(() => {
      game = applyMove(game, move({file: 5, rank: 9}, {file: 4, rank: 9}));
    });

    it("breaks the bikjang", () => {
      expect(isBikjang(game)).toBe(false);
    });

    it("leaves han nothing to call", () => {
      expect(canCallBikjang(game)).toBe(false);
    });
  });
});

/**
 * The same position under the KJA's scored format, where bikjang may only be called with each side
 * under thirty points — "기물이 각 30점 미만일 경우에 한하여 빅장을 부를 수 있다" — and where the
 * ending is 점수승 rather than a draw, a scored game having no draw to reach. See `docs/rules.md`
 * §6.2.
 */
describe("an endgame where the generals face each other in a scored game", () => {
  let game: GameState;

  beforeEach(() => {
    game = scored(
      "han",
      cho("general", 5, 9),
      cho("chariot", 1, 8),
      cho("chariot", 2, 8),
      cho("cannon", 3, 8),
      han("general", 5, 2),
      han("chariot", 1, 3),
    );
  });

  it("stands the two generals down an open file all the same", () => {
    expect(isBikjang(game)).toBe(true);
  });

  it("has cho still over thirty points", () => {
    expect(materialFor(game, "cho")).toBe(33);
    expect(materialFor(game, "han")).toBe(13);
  });

  it("does not let it be called, the threshold being the scored format's whole point", () => {
    expect(canCallBikjang(game)).toBe(false);
  });

  describe("and han's chariot takes one of cho's", () => {
    beforeEach(() => {
      game = applyMove(game, move({file: 1, rank: 3}, {file: 1, rank: 8}));
    });

    it("brings cho under thirty", () => {
      expect(materialFor(game, "cho")).toBe(20);
    });

    it("lets cho call it now", () => {
      expect(canCallBikjang(game)).toBe(true);
    });

    describe("and cho calls it", () => {
      beforeEach(() => {
        game = callBikjang(game);
      });

      it("settles it on points rather than drawing it", () => {
        expect(outcomeOf(game)).toEqual({
          kind: "pointsWin",
          winner: "cho",
          scores: {cho: 20, han: 14.5},
        });
      });
    });
  });
});

/**
 * "단, 궁으로 상대 기물 취하면서 빅장이 되는 경우는 예외로 한다" — the one exception the KJA's live
 * site carries: a bikjang the general took its way into may not be called. It lasts exactly the one
 * ply, the way a pass count is put back by a move. See `docs/rules.md` §6.2.
 */
describe("a scored endgame where a general takes its way into a bikjang", () => {
  let game: GameState;

  beforeEach(() => {
    game = scored(
      "han",
      cho("general", 5, 9),
      cho("soldier", 5, 3),
      cho("chariot", 1, 8),
      han("general", 5, 2),
      han("chariot", 9, 3),
    );
  });

  it("is no bikjang while the soldier stands between them", () => {
    expect(isBikjang(game)).toBe(false);
  });

  describe("when han's general takes the soldier", () => {
    beforeEach(() => {
      game = applyMove(game, move({file: 5, rank: 2}, {file: 5, rank: 3}));
    });

    it("brings the two generals face to face", () => {
      expect(isBikjang(game)).toBe(true);
    });

    it("has both armies under thirty points", () => {
      expect(materialFor(game, "cho")).toBe(13);
      expect(materialFor(game, "han")).toBe(13);
    });

    it("does not let cho call it, the general having taken its way there", () => {
      expect(canCallBikjang(game)).toBe(false);
    });

    describe("and cho plays elsewhere", () => {
      beforeEach(() => {
        game = applyMove(game, move({file: 1, rank: 8}, {file: 1, rank: 7}));
      });

      it("still stands the generals face to face", () => {
        expect(isBikjang(game)).toBe(true);
      });

      it("lets han call it now, the exception having lasted one ply", () => {
        expect(canCallBikjang(game)).toBe(true);
      });
    });
  });
});

describe("a scored game being laid out", () => {
  let phase: SetupPhase;

  beforeEach(() => {
    phase = setupPhaseFor("Scored");
  });

  it("lets han lay out first", () => {
    expect(canPlace(phase, "han")).toBe(true);
  });

  it("makes cho wait, because cho answers what han has done", () => {
    expect(canPlace(phase, "cho")).toBe(false);
    expect(() => place(phase, "cho", setup("Inner Elephant"))).toThrow(/han lays out first/);
  });

  it("is not a game yet", () => {
    expect(isArranged(phase)).toBe(false);
    expect(() => newGameFrom(phase)).toThrow(/both armies/);
  });

  describe("when han has laid out", () => {
    beforeEach(() => {
      phase = place(phase, "han", setup("Left Elephant"));
    });

    it("refuses han a second thought", () => {
      expect(canPlace(phase, "han")).toBe(false);
      expect(() => place(phase, "han", setup("Right Elephant"))).toThrow(/may not lay out again/);
    });

    it("lets cho answer, now that there is something to answer", () => {
      expect(canPlace(phase, "cho")).toBe(true);
    });

    it("is still not a game", () => {
      expect(isArranged(phase)).toBe(false);
      expect(() => newGameFrom(phase)).toThrow(/both armies/);
    });

    describe("when cho has answered", () => {
      beforeEach(() => {
        phase = place(phase, "cho", setup("Inner Elephant"));
      });

      it("lets cho think again, which is part of what the deom pays for", () => {
        expect(canPlace(phase, "cho")).toBe(true);
        expect(place(phase, "cho", setup("Right Elephant")).choSetup).toBe(setup("Right Elephant"));
      });

      it("still refuses han", () => {
        expect(canPlace(phase, "han")).toBe(false);
      });

      it("is laid out", () => {
        expect(isArranged(phase)).toBe(true);
      });

      describe("and the game it lays out", () => {
        let game: GameState;

        beforeEach(() => {
          game = newGameFrom(phase);
        });

        it("stands thirty-two pieces on the board", () => {
          expect(game.pieces).toHaveLength(32);
        });

        it("gives cho the first move, paid for with the deom", () => {
          expect(game.sideToMove).toBe("cho");
          expect(scoreFor(game, "han") - scoreFor(game, "cho")).toBe(1.5);
        });

        it("plays the scored game the phase was laid out for", () => {
          expect(game.format).toBe("Scored");
        });

        it("arranges each army by its own choice", () => {
          expect(pieceOn(game, 2, 1)).toEqual({side: "han", type: "elephant"});
          expect(pieceOn(game, 3, 10)).toEqual({side: "cho", type: "elephant"});
        });

        it("offers cho thirty-one of them, exactly as any opening does", () => {
          expect(legalMovesFor(game)).toHaveLength(31);
        });

        it("is an ordinary game, and plays on", () => {
          expect(applyMove(game, move({file: 1, rank: 7}, {file: 1, rank: 6})).sideToMove).toBe("han");
        });
      });
    });
  });
});

describe("a casual game being laid out", () => {
  let phase: SetupPhase;

  beforeEach(() => {
    phase = setupPhaseFor("Casual");
  });

  it("lets either army lay out first, the order being a rule of the scored game alone", () => {
    expect(canPlace(phase, "han")).toBe(true);
    expect(canPlace(phase, "cho")).toBe(true);
  });

  it("is not a game yet", () => {
    expect(isArranged(phase)).toBe(false);
    expect(() => newGameFrom(phase)).toThrow(/both armies/);
  });

  describe("when cho has laid out first, which a scored game would have refused", () => {
    beforeEach(() => {
      phase = place(phase, "cho", setup("Outer Elephant"));
    });

    it("is still not a game", () => {
      expect(isArranged(phase)).toBe(false);
    });

    it("lets cho think again", () => {
      expect(canPlace(phase, "cho")).toBe(true);
    });

    describe("when han has answered", () => {
      beforeEach(() => {
        phase = place(phase, "han", setup("Inner Elephant"));
      });

      it("lets han think again too, where a scored game would not", () => {
        expect(canPlace(phase, "han")).toBe(true);
        expect(place(phase, "han", setup("Central Chariot")).hanSetup).toBe(setup("Central Chariot"));
      });

      it("lays out the casual game the phase was for", () => {
        const game = newGameFrom(phase);

        expect(game.format).toBe("Casual");
        expect(game.pieces).toHaveLength(32);
        expect(legalMovesFor(game)).toHaveLength(31);
      });
    });
  });
});

describe("two armies choosing where their elephants stand", () => {
  it("calls the same choice twice over eotsang, both armies developing on one wing", () => {
    expect(elephantPairingOf(setup("Left Elephant"), setup("Left Elephant"))).toBe("eotsang");
    expect(elephantPairingOf(setup("Right Elephant"), setup("Right Elephant"))).toBe("eotsang");
  });

  it("calls opposite choices matsang, the outer elephants coming to face each other", () => {
    expect(elephantPairingOf(setup("Left Elephant"), setup("Right Elephant"))).toBe("matsang");
    expect(elephantPairingOf(setup("Right Elephant"), setup("Left Elephant"))).toBe("matsang");
  });

  it("classifies nothing unless both armies chose a gwima setup", () => {
    expect(elephantPairingOf(setup("Inner Elephant"), setup("Left Elephant"))).toBeUndefined();
    expect(elephantPairingOf(setup("Left Elephant"), setup("Outer Elephant"))).toBeUndefined();
    expect(elephantPairingOf(setup("Inner Elephant"), setup("Outer Elephant"))).toBeUndefined();
    expect(elephantPairingOf(setup("Central Chariot"), setup("Central Chariot"))).toBeUndefined();
  });

  it("bars nothing: a matsang is laid out and played like any other game", () => {
    const laidOut = place(
      place(setupPhaseFor("Scored"), "han", setup("Left Elephant")),
      "cho",
      setup("Right Elephant"),
    );

    expect(elephantPairingOf(setup("Left Elephant"), setup("Right Elephant"))).toBe("matsang");
    expect(isArranged(laidOut)).toBe(true);
    expect(legalMovesFor(newGameFrom(laidOut))).toHaveLength(31);
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
function move(from: Position, to: Position): Move {
  return {from, to};
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

/** A board built piece by piece, for a state no opening reaches in a readable number of moves. */
function position(sideToMove: Side, ...pieces: readonly PlacedPiece[]): GameState {
  return constructed("Casual", sideToMove, pieces);
}

/** The same, playing the KJA's scored format — where bikjang is gated and there is no draw. */
function scored(sideToMove: Side, ...pieces: readonly PlacedPiece[]): GameState {
  return constructed("Scored", sideToMove, pieces);
}

function constructed(format: MatchFormat, sideToMove: Side, pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
    format,
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
    drawAgreed: false,
  };
}

/**
 * One circuit of the shortest thing that changes nothing: each general steps off its point and back
 * onto it. Four plies, and the position handed in is the position handed back.
 */
function shuffled(game: GameState): GameState {
  return [
    move({file: 4, rank: 9}, {file: 4, rank: 10}),
    move({file: 6, rank: 2}, {file: 6, rank: 1}),
    move({file: 4, rank: 10}, {file: 4, rank: 9}),
    move({file: 6, rank: 1}, {file: 6, rank: 2}),
  ].reduce(applyMove, game);
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return {piece: {side: "cho", type}, position: {file, rank}};
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return {piece: {side: "han", type}, position: {file, rank}};
}
