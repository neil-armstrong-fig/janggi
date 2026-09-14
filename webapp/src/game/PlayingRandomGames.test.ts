import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Position} from "@src/game/board/types/Position";
import {FILES, RANKS} from "@src/game/board/BoardDimensions";
import {MATCH_FORMATS} from "@janggi/shared/janggi/settings/MatchFormat";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {applyMove} from "@src/game/ApplyMove";
import {attackersOf} from "@src/game/check/AttackersOf";
import {isInCheck} from "@src/game/check/IsInCheck";
import {takenFrom} from "@src/game/scoring/TakenFrom";
import {transitionBetween} from "@src/game/record/TransitionBetween";
import {canPlace} from "@src/game/setups/CanPlace";
import {canUndo} from "@src/game/record/CanUndo";
import {describe, expect, it} from "vitest";
import fc from "fast-check";
import {isInPalace} from "@src/game/board/palaces/Palaces";
import {isArranged} from "@src/game/setups/IsArranged";
import {isRepetition} from "@src/game/repetition/IsRepetition";
import {legalMovesFor} from "@src/game/LegalMovesFor";
import {materialFor} from "@src/game/scoring/MaterialFor";
import {movesFrom} from "@src/game/MovesFrom";
import {newGame} from "@src/game/NewGame";
import {newGameFrom} from "@src/game/setups/NewGameFrom";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {place} from "@src/game/setups/Place";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {redo} from "@src/game/record/Redo";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";
import {standingOf} from "@src/game/utils/StandingOf";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {undo} from "@src/game/record/Undo";

/**
 * The rules asserted against games nobody wrote down.
 *
 * `PlayingAGame.test.ts` plays one scripted game and says what each move should do; this plays
 * thousands of random legal ones and says what must be true of *every* move, whatever it was. The
 * two catch different things — a scripted test only ever reaches positions someone thought of, and
 * a rule can be right in the opening and wrong six moves in.
 *
 * Chess settles this with a **perft**: from one position, generate every legal move, recurse to a
 * fixed depth, and count the positions you end up with. The count is exquisitely sensitive — one
 * wrong rule anywhere changes it — and chess has published tables to compare against. **Janggi has
 * none**: the Chess Programming Wiki carries perft tables for chess, shogi and xiangqi and nothing
 * for janggi. With no external oracle to check a count against, invariants that must hold in every
 * position are the strongest tool available rather than a supplement to one.
 *
 * A game is generated as **indices into the legal move list**, so every game is legal by
 * construction and there is nothing to discard. When a property fails, fast-check shrinks those
 * indices to the shortest sequence that still breaks it and reports a seed and path to replay it.
 *
 * The describes group the properties by what they claim about — a transition, a position, or a
 * whole game — because those need different setup. They do **not** nest the way
 * `PlayingAGame.test.ts` does: there each level plays a move onto its parent's position, whereas
 * every property here generates its own games from scratch, so there is no state to build up.
 */

/**
 * One move of a game and the positions either side of it. Chess would call this a **ply** — a single
 * move by a single player, as opposed to the everyday sense of "move" that means one from each side.
 *
 * Every `before` is kept, so a property may look back at a position several moves old, which is how
 * mutation is caught.
 */
interface PlayedMove {
  readonly before: GameState;
  readonly move: Move;
  readonly after: GameState;
}

/**
 * How many random games each property is put through. Turned up by the scheduled workflow, whose
 * whole value is exploring seeds nobody has tried; the default is what a laptop should pay.
 */
const RUNS = Number(process.env["PROPERTY_TEST_RUNS"] ?? 100);

const MOVES_PER_GAME = 40;

/**
 * An index is taken modulo the number of legal moves, so this only has to sit comfortably above the
 * widest a position ever gets. Keeping it small keeps a shrunk counterexample readable.
 */
const MOST_MOVES_ON_OFFER = 255;

describe("after every move of a random game", () => {
  it("hands the turn to the other army", () => {
    afterEveryMove(({before, after}) => {
      expect(after.sideToMove).toBe(opponentOf(before.sideToMove));
    });
  });

  it("has taken at most one piece, and only where an enemy was standing", () => {
    afterEveryMove(({before, move, after}) => {
      const taken = pieceOn(before, move.to);

      expect(after.pieces).toHaveLength(before.pieces.length - (taken ? 1 : 0));
      if (taken) expect(taken.side).toBe(opponentOf(before.sideToMove));
    });
  });

  /** Janggi has no promotion, so a piece that moves is the same piece when it arrives. */
  it("has moved the piece that was standing there, and left nothing behind", () => {
    afterEveryMove(({before, move, after}) => {
      expect(pieceOn(after, move.to)).toEqual(pieceOn(before, move.from));
      expect(pieceOn(after, move.from)).toBeUndefined();
    });
  });

  /**
   * Material is seven numbers read off a board, which is the shape of thing that is right where
   * somebody checked it and wrong two ranks over. It can only fall, only for the army that lost a
   * piece, and only by what that piece was worth.
   */
  it("has left the moving army's material alone, and the other's down by exactly what it lost", () => {
    afterEveryMove(({before, move, after}) => {
      const moving = before.sideToMove;
      const losing = opponentOf(moving);
      const taken = pieceOn(before, move.to);

      expect(materialFor(after, moving)).toBe(materialFor(before, moving));
      expect(materialFor(after, losing)).toBe(materialFor(before, losing) - (taken ? worthOf(taken) : 0));
    });
  });

  /** The same fact as the material, told as pieces: the tray a board draws can only gain what was taken. */
  it("has added to the other army's losses exactly the piece it took, and nothing to its own", () => {
    afterEveryMove(({before, move, after}) => {
      const moving = before.sideToMove;
      const losing = opponentOf(moving);
      const taken = pieceOn(before, move.to);

      expect(takenFrom(after, moving)).toEqual(takenFrom(before, moving));
      expect([...takenFrom(after, losing)].sort()).toEqual(
        [...takenFrom(before, losing), ...(taken ? [taken.type] : [])].sort(),
      );
    });
  });

  /**
   * A record keeps positions, and a board animating a turn has only those to go on — so the move
   * and its capture must be recoverable from the two positions for every move a game can play.
   */
  it("can be read back from the positions either side of it", () => {
    afterEveryMove(({before, move, after}) => {
      expect(transitionBetween(before, after)).toEqual({
        kind: "moved",
        move,
        mover: pieceOn(before, move.from),
        taken: pieceOn(before, move.to),
      });
    });
  });

  /**
   * `seen` is the history repetition is measured against, and a capture empties it because nothing
   * from before one can ever come round again. Nothing else may empty it, and nothing may lose an
   * entry — a game that forgot where it had been would let a barred repetition through.
   */
  it("has remembered the position it left, unless the move took a piece", () => {
    afterEveryMove(({before, move, after}) => {
      const taken = pieceOn(before, move.to);

      expect(after.seen).toEqual(taken ? [] : [...before.seen, standingOf(before)]);
    });
  });

  /**
   * "동일한 수를 3회 이상 반복할 수 없다", exempt below thirty points a side — `docs/rules.md` §6.4.
   * A random game plays only moves the engine offered, so reaching a barred third standing means
   * the filter in `movesFrom` let one through.
   */
  it("has never stood a third time in a position, while either army is on thirty or more", () => {
    afterEveryMove(({before, after}) => {
      const exempt = materialFor(before, "cho") < 30 && materialFor(before, "han") < 30;

      if (!exempt) expect(isRepetition(after)).toBe(false);
    });
  });

  it("has never let a soldier lose ground", () => {
    afterEveryMove(({before, move}) => {
      const marching = pieceOn(before, move.from);
      if (marching?.type !== "soldier") return;

      const towardsTheEnemy = marching.side === "han" ? 1 : -1;

      expect((move.to.rank - move.from.rank) * towardsTheEnemy).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("in every position a random game reaches", () => {
  it("stands at most one piece on each point", () => {
    afterEveryMove(({after}) => {
      const occupied = after.pieces.map(({position}) => toPositionKey(position));

      expect(new Set(occupied).size).toBe(occupied.length);
    });
  });

  /**
   * A standing is what two positions are compared by, so it has to answer for the position and
   * nothing else about the game that reached it — including the history hanging off it.
   */
  it("tells a position from the one before it, and reads nothing of how the game got there", () => {
    afterEveryMove(({before, after}) => {
      expect(standingOf(after)).not.toBe(standingOf(before));
      expect(standingOf(after)).toBe(standingOf({...after, seen: [], consecutivePasses: 1}));
    });
  });

  /** A check line drawn on screen comes from `attackersOf`, so it must never disagree with the rule. */
  it("names an attacker of a general exactly when that general is in check", () => {
    afterEveryMove(({after}) => {
      for (const side of ["cho", "han"] as const) {
        expect(attackersOf(after, side).length > 0).toBe(isInCheck(after, side));
      }
    });
  });

  it("keeps both generals inside their own palaces", () => {
    afterEveryMove(({after}) => {
      for (const {piece, position} of after.pieces) {
        if (piece.type === "general") expect(isInPalace(position, piece.side)).toBe(true);
      }
    });
  });
});

describe("looking back over a game already played", () => {
  /**
   * Read once the whole game is over, so a position several moves old is still intact. Had
   * `applyMove` mutated what it was given, the piece would have left this point long ago.
   */
  it("finds every position it was played from untouched", () => {
    afterEveryMove(({before, move}) => {
      expect(pieceOn(before, move.from)).toBeDefined();
    });
  });

  it("reproduces the same game exactly when the same moves are replayed", () => {
    fc.assert(
      fc.property(gameChoices(), choices => {
        const played = playRandomGame(choices).map(({after}) => after);
        const again = playRandomGame(choices).map(({after}) => after);

        expect(again).toEqual(played);
      }),
      {numRuns: RUNS},
    );
  });

  /**
   * Taken back to the start one ply at a time, every position handed back is the one the game was
   * played from at that point. A record that dropped a position, kept the wrong one or took two
   * steps at once would part company from the played game somewhere along the way.
   */
  it("walks back through the very positions it was played from", () => {
    fc.assert(
      fc.property(gameChoices(), choices => {
        const moves = playRandomGame(choices);
        let played = recordOf(moves);

        for (const {before} of [...moves].reverse()) {
          played = undo(played);

          expect(played.present).toEqual(before);
        }

        expect(canUndo(played)).toBe(false);
        expect(played.present).toEqual(startingPosition());
      }),
      {numRuns: RUNS},
    );
  });

  /** Undo and redo are each other's inverse, so a game taken back and played again is the same game. */
  it("comes back to exactly where it was when every move taken back is played again", () => {
    fc.assert(
      fc.property(gameChoices(), choices => {
        const moves = playRandomGame(choices);
        const played = recordOf(moves);

        const takenBack = moves.reduce(sofar => undo(sofar), played);
        const playedAgain = moves.reduce(sofar => redo(sofar), takenBack);

        expect(playedAgain).toEqual(played);
      }),
      {numRuns: RUNS},
    );
  });
});

describe("when asked for a move it never offered", () => {
  it("refuses it, wherever the game had got to", () => {
    fc.assert(
      fc.property(gameChoices(), fc.nat(), fc.nat(), (choices, whichPiece, whereTo) => {
        const position = finalPositionOf(choices);
        const own = position.pieces.filter(({piece}) => piece.side === position.sideToMove);

        const from = own[whichPiece % own.length]?.position;
        const to = EVERY_POINT[whereTo % EVERY_POINT.length];
        if (!from || !to) return;

        const offered = movesFrom(position, from).map(toPositionKey);
        if (offered.includes(toPositionKey(to))) return;

        expect(() => applyMove(position, {from, to})).toThrow();
      }),
      {numRuns: RUNS},
    );
  });
});

/**
 * The count of games that follow each opening move, checked against its own mirror image rather
 * than against a recorded number. In chess this breakdown is called a *perft divide*, and it is how
 * a wrong count is bisected: it says which opening move has the wrong number of continuations.
 *
 * Both armies open on Inner Elephant, which is left-right symmetric, so the whole position is. Every
 * opening move therefore has a mirror image that must be legal too, and the two positions they lead
 * to are mirrors, so they must have the same number of replies. Any asymmetry in the rules — a horse
 * fanning out the wrong way, a palace diagonal drawn on one side only — breaks it.
 *
 * This only holds for a symmetric setup. Left and Right Elephant are asymmetric by definition, and
 * the same assertion is false for them; it was checked against the engine rather than assumed.
 */
it("counts the same replies to an opening move as to its mirror image", () => {
  const position = startingPosition();
  const replies = new Map<string, number>();

  for (const move of legalMovesFor(position)) {
    replies.set(nameOf(move), legalMovesFor(applyMove(position, move)).length);
  }

  expect(replies.size).toBe(31);
  for (const [name, count] of replies) {
    expect({[mirrorOf(name)]: replies.get(mirrorOf(name))}).toEqual({[mirrorOf(name)]: count});
  }
});

/**
 * The setup phase, put through orderings nobody scripted.
 *
 * `setups/CanPlace.test.ts` walks the four states the scored rule has by hand. What it cannot do is
 * try them in an arbitrary order — and the one thing that must hold however the two players poke at
 * it is that the question and the act agree: `place` throws exactly when `canPlace` said no, and
 * `newGameFrom` succeeds exactly when `isArranged` said yes. A `place` that stopped consulting
 * `canPlace` would still pass every scripted test of `canPlace` itself.
 */
describe("a setup phase laid out in any order at all", () => {
  it("throws from place exactly when canPlace said no", () => {
    fc.assert(
      fc.property(formats(), placements(), (format, placements) => {
        let phase = setupPhaseFor(format);

        for (const {side, setup} of placements) {
          const allowed = canPlace(phase, side);

          if (!allowed) {
            expect(() => place(phase, side, setup)).toThrow();
            continue;
          }

          phase = place(phase, side, setup);
          expect(phase[side === "han" ? "hanSetup" : "choSetup"]).toBe(setup);
        }
      }),
      {numRuns: RUNS},
    );
  });

  it("starts a game exactly when both armies have laid out", () => {
    fc.assert(
      fc.property(formats(), placements(), (format, placements) => {
        const phase = placements.reduce(
          (so_far, {side, setup}) => (canPlace(so_far, side) ? place(so_far, side, setup) : so_far),
          setupPhaseFor(format),
        );

        if (!isArranged(phase)) {
          expect(() => newGameFrom(phase)).toThrow();

          return;
        }

        expect(newGameFrom(phase).pieces).toHaveLength(32);
      }),
      {numRuns: RUNS},
    );
  });
});

/**
 * Runs `check` after every move of many randomly played, wholly legal games.
 *
 * A failure is rethrown naming the moves that led to it. Without that, a counterexample is the list
 * of raw numbers fast-check shrank to, which says nothing about the game they produced.
 */
function afterEveryMove(check: (played: PlayedMove) => void): void {
  fc.assert(
    fc.property(gameChoices(), choices => {
      const game = playRandomGame(choices);

      game.forEach((played, index) => {
        try {
          check(played);
        } catch (failure) {
          throw new Error(`After ${movesUpTo(game, index)}`, {cause: failure});
        }
      });
    }),
    {numRuns: RUNS},
  );
}

function movesUpTo(game: readonly PlayedMove[], index: number): string {
  return game
    .slice(0, index + 1)
    .map(({move}) => nameOf(move))
    .join(", ");
}

/**
 * Plays a game, taking one legal move per number handed in.
 *
 * The numbers index into the legal move list rather than naming points, so every game generated is
 * legal and nothing has to be thrown away. A game stops early if the side to move has nothing legal
 * — the pass move janggi really has is not modelled yet, so there is nowhere for it to go.
 */
function playRandomGame(choices: readonly number[]): PlayedMove[] {
  const game: PlayedMove[] = [];
  let position = startingPosition();

  for (const choice of choices) {
    const legal = legalMovesFor(position);

    const move = legal[choice % legal.length];
    if (!move) break;

    const after = applyMove(position, move);
    game.push({before: position, move, after});
    position = after;
  }

  return game;
}

/**
 * The same game again, this time recorded. It replays the moves rather than folding the positions
 * `playRandomGame` already has, so what comes back is a record built the only way a caller can build
 * one — through `playMove`, with every position it keeps put there by the engine.
 */
function recordOf(moves: readonly PlayedMove[]): PlayedGame {
  return moves.reduce((played, {move}) => playMove(played, move), playedGameFrom(startingPosition()));
}

function finalPositionOf(choices: readonly number[]): GameState {
  return playRandomGame(choices).at(-1)?.after ?? startingPosition();
}

function gameChoices(): fc.Arbitrary<number[]> {
  return fc.array(fc.nat({max: MOST_MOVES_ON_OFFER}), {maxLength: MOVES_PER_GAME});
}

/** What one piece of that kind counts for, weighed on a board with nothing else standing on it. */
function worthOf(piece: Piece): number {
  const alone: GameState = {
    pieces: [{piece, position: {file: 1, rank: 1}}],
    sideToMove: piece.side,
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };

  return materialFor(alone, piece.side);
}

function pieceOn(state: GameState, position: Position): Piece | undefined {
  return pieceAt(piecesByPosition(state.pieces), position);
}

function nameOf({from, to}: Move): string {
  return `${toPositionKey(from)}-${toPositionKey(to)}`;
}

function mirrorOf(name: string): string {
  return name.replace(/f(\d)/g, (_whole, file: string) => `f${FILES.length + 1 - Number(file)}`);
}

function startingPosition(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

/** Either match format, so the scored ordering and the casual free-for-all are both exercised. */
function formats(): fc.Arbitrary<MatchFormat> {
  return fc.constantFrom(...MATCH_FORMATS);
}

/** Any run of "this army chooses that arrangement", in any order, repeats and all. */
function placements(): fc.Arbitrary<{side: Side; setup: Setup}[]> {
  return fc.array(fc.record({side: fc.constantFrom<Side>("han", "cho"), setup: fc.constantFrom(...SETUPS)}), {
    maxLength: 8,
  });
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

const EVERY_POINT: readonly Position[] = FILES.flatMap(file => RANKS.map(rank => ({file, rank})));
