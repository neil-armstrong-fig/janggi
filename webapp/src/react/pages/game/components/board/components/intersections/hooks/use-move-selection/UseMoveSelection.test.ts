// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {MoveSelection} from "@src/react/pages/game/components/board/components/intersections/hooks/use-move-selection/UseMoveSelection";
import type {Position} from "@src/game/board/types/Position";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {act, renderHook} from "@testing-library/react";
import {applyMove} from "@src/game/ApplyMove";
import {beforeEach, describe, expect, it} from "vitest";
import {isCheckmate} from "@src/game/check/IsCheckmate";
import {newGame} from "@src/game/NewGame";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {useMoveSelection} from "@src/react/pages/game/components/board/components/intersections/hooks/use-move-selection/UseMoveSelection";

/**
 * A hook is the one thing in `src/react/` worth unit testing: it has inputs, state transitions and
 * a return value, and none of that is reachable from an acceptance test except by driving a whole
 * page. The acceptance specs cover that a tap moves a piece on screen; this covers the transitions
 * underneath, including the ones no spec would think to reach.
 *
 * Nested rather than flat, each `describe` doing one thing to the position its parent left behind,
 * so a test says only what that step changed. The two at the top level are the two starting states
 * — the hook behaves as a mirror of itself once the turn has passed — and that is a genuine split
 * rather than a wrapper restating the filename.
 */

/** What the hook is re-rendered on, so a test can change the board out from under it. */
interface Shown {
  readonly game: GameState;
  readonly playable: boolean;
}

const CHO_SOLDIER: Position = {file: 1, rank: 7};
const ANOTHER_CHO_SOLDIER: Position = {file: 3, rank: 7};
const FORWARD: Position = {file: 1, rank: 6};
const SIDEWAYS: Position = {file: 2, rank: 7};
const EMPTY_POINT: Position = {file: 5, rank: 5};

/** Hemmed in at the start of an inner elephant opening, with its own soldier on its one landing point. */
const CHO_ELEPHANT: Position = {file: 3, rank: 10};
const ITS_OWN_SOLDIER: Position = {file: 5, rank: 7};

const MATED_GENERAL: Position = {file: 5, rank: 9};
const MATED_CHARIOT: Position = {file: 9, rank: 10};

/** Forward is `rank + 1` for han, against cho's `rank - 1`. See docs/rules.md §1. */
const HAN_SOLDIER: Position = {file: 1, rank: 4};
const HAN_FORWARD: Position = {file: 1, rank: 5};
const HAN_SIDEWAYS: Position = {file: 2, rank: 4};

let selection: Rendered;
let played: Move[];
let showing: (game: GameState, playable?: boolean) => void;

describe("with cho to move", () => {
  beforeEach(() => {
    selection = renderOn(openingGame());
  });

  it("holds nothing until a piece is picked up", () => {
    expect(selection.current.selected).toBeUndefined();
    expect(selection.current.destinations).toEqual([]);
  });

  it("will not pick up a piece belonging to the other army", () => {
    act(() => selection.current.tap(HAN_SOLDIER));

    expect(selection.current.selected).toBeUndefined();
  });

  describe("when a soldier is picked up", () => {
    beforeEach(() => {
      act(() => selection.current.tap(CHO_SOLDIER));
    });

    it("holds it", () => {
      expect(selection.current.selected).toEqual(CHO_SOLDIER);
    });

    it("offers everywhere it may go", () => {
      expect(points(selection.current.destinations)).toEqual(points([FORWARD, SIDEWAYS]));
    });

    describe("and it is tapped a second time", () => {
      beforeEach(() => {
        act(() => selection.current.tap(CHO_SOLDIER));
      });

      it("is put down again", () => {
        expect(selection.current.selected).toBeUndefined();
      });
    });

    describe("and somewhere it cannot reach is tapped", () => {
      beforeEach(() => {
        act(() => selection.current.tap(EMPTY_POINT));
      });

      it("is put down without a move being played", () => {
        expect(selection.current.selected).toBeUndefined();
        expect(played).toEqual([]);
      });
    });

    describe("and one of the points it may go to is tapped", () => {
      beforeEach(() => {
        act(() => selection.current.tap(FORWARD));
      });

      it("plays the move", () => {
        expect(played).toEqual([{from: CHO_SOLDIER, to: FORWARD}]);
      });

      /** The store owns the game, so the hook lets go and waits to be handed the new one. */
      it("empties its hand", () => {
        expect(selection.current.selected).toBeUndefined();
      });
    });

    describe("and the pointer wanders onto another piece", () => {
      beforeEach(() => {
        act(() => selection.current.hover(ANOTHER_CHO_SOLDIER));
      });

      /** Otherwise a move would change under a player whose pointer drifted on the way to it. */
      it("keeps the piece in hand, and its destinations with it", () => {
        expect(selection.current.selected).toEqual(CHO_SOLDIER);
        expect(points(selection.current.destinations)).toEqual(points([FORWARD, SIDEWAYS]));
      });
    });
  });

  describe("when the pointer merely rests on a piece", () => {
    beforeEach(() => {
      act(() => selection.current.hover(CHO_SOLDIER));
    });

    it("shows where it could go", () => {
      expect(points(selection.current.destinations)).toEqual(points([FORWARD, SIDEWAYS]));
    });

    it("does not pick it up", () => {
      expect(selection.current.selected).toBeUndefined();
    });

    describe("and then leaves", () => {
      beforeEach(() => {
        act(() => selection.current.hover(undefined));
      });

      it("stops showing anything", () => {
        expect(selection.current.destinations).toEqual([]);
      });
    });
  });

  describe("when the pointer rests on a piece hemmed in by its own army", () => {
    beforeEach(() => {
      act(() => selection.current.hover(CHO_ELEPHANT));
    });

    it("offers it nowhere to go", () => {
      expect(selection.current.destinations).toEqual([]);
    });

    it("shows the point of its own army it would otherwise land on", () => {
      expect(points(selection.current.covered)).toEqual(points([ITS_OWN_SOLDIER]));
    });

    describe("and then leaves", () => {
      beforeEach(() => {
        act(() => selection.current.hover(undefined));
      });

      it("stops showing that too", () => {
        expect(selection.current.covered).toEqual([]);
      });
    });
  });

  describe("when a piece hemmed in by its own army is picked up", () => {
    beforeEach(() => {
      act(() => selection.current.tap(CHO_ELEPHANT));
    });

    it("shows the point of its own army it would otherwise land on", () => {
      expect(points(selection.current.covered)).toEqual(points([ITS_OWN_SOLDIER]));
    });

    describe("and that point is tapped", () => {
      beforeEach(() => {
        act(() => selection.current.tap(ITS_OWN_SOLDIER));
      });

      /** A covered point is shown and never offered, so tapping it is tapping any piece of the army. */
      it("plays nothing, and picks up the soldier instead", () => {
        expect(played).toEqual([]);
        expect(selection.current.selected).toEqual(ITS_OWN_SOLDIER);
      });
    });
  });

  describe("when the pointer rests on the other army's piece", () => {
    beforeEach(() => {
      act(() => selection.current.hover(HAN_SOLDIER));
    });

    /** `movesFrom` answers for either army, so the board can explain a piece it is not your turn
     * to move. */
    it("answers for that army too", () => {
      expect(selection.current.destinations).not.toEqual([]);
    });
  });

  describe("when the pointer rests on an empty point", () => {
    beforeEach(() => {
      act(() => selection.current.hover(EMPTY_POINT));
    });

    it("shows nothing", () => {
      expect(selection.current.destinations).toEqual([]);
    });
  });
});

describe("with han to move", () => {
  beforeEach(() => {
    selection = renderOn(afterChoOpens());
  });

  it("will not pick up a cho piece, now that the turn has passed", () => {
    act(() => selection.current.tap(ANOTHER_CHO_SOLDIER));

    expect(selection.current.selected).toBeUndefined();
  });

  describe("when a han soldier is picked up", () => {
    beforeEach(() => {
      act(() => selection.current.tap(HAN_SOLDIER));
    });

    it("holds it", () => {
      expect(selection.current.selected).toEqual(HAN_SOLDIER);
    });

    it("offers everywhere it may go, which is the other way up the board", () => {
      expect(points(selection.current.destinations)).toEqual(points([HAN_FORWARD, HAN_SIDEWAYS]));
    });

    describe("and one of those points is tapped", () => {
      beforeEach(() => {
        act(() => selection.current.tap(HAN_FORWARD));
      });

      it("plays han's move", () => {
        expect(played).toEqual([{from: HAN_SOLDIER, to: HAN_FORWARD}]);
      });
    });
  });
});

describe("with the side to move mated", () => {
  beforeEach(() => {
    selection = renderOn(matedGame());
  });

  describe("when the mated general is picked up", () => {
    beforeEach(() => {
      act(() => selection.current.tap(MATED_GENERAL));
    });

    /** Nothing special happens at mate: `movesFrom` filters out every move that leaves the general
     * attacked, and at mate that is all of them. The board refuses the game for free. */
    it("is offered nowhere to go", () => {
      expect(selection.current.destinations).toEqual([]);
    });
  });

  describe("when a piece far from the mate is picked up", () => {
    beforeEach(() => {
      act(() => selection.current.tap(MATED_CHARIOT));
    });

    it("is offered nowhere either, no piece being able to answer the check", () => {
      expect(selection.current.destinations).toEqual([]);
    });
  });
});

/**
 * The opposite of a mate, and the reason `gameIsOver` exists: two rested turns stop the game while
 * the board is still full of legal moves, so nothing here filters itself out for free.
 */
describe("with the game stopped by two rested turns", () => {
  beforeEach(() => {
    selection = renderOn({...openingGame(), consecutivePasses: 2});
  });

  describe("when a piece the army to move owns is reached for", () => {
    beforeEach(() => {
      act(() => selection.current.tap(CHO_SOLDIER));
    });

    it("does not pick it up", () => {
      expect(selection.current.selected).toBeUndefined();
    });

    it("offers it nowhere to go", () => {
      expect(selection.current.destinations).toEqual([]);
    });

    it("reports no move", () => {
      expect(played).toEqual([]);
    });
  });

  describe("when the pointer merely rests on a piece", () => {
    beforeEach(() => {
      act(() => selection.current.hover(CHO_SOLDIER));
    });

    it("shows nowhere, the game being over", () => {
      expect(selection.current.destinations).toEqual([]);
    });
  });
});

/**
 * A scored board still being laid out: `docs/rules.md` §6.6. `gameIsOver` cannot see this one at
 * all — the position is an ordinary opening full of legal moves, and what makes it untouchable is
 * that nobody has finished arranging it.
 */
describe("with the board still being laid out", () => {
  beforeEach(() => {
    selection = renderOn(openingGame(), false);
  });

  describe("when a piece the army to move owns is reached for", () => {
    beforeEach(() => {
      act(() => selection.current.tap(CHO_SOLDIER));
    });

    it("does not pick it up, there being no game to play yet", () => {
      expect(selection.current.selected).toBeUndefined();
    });

    it("offers it nowhere to go", () => {
      expect(selection.current.destinations).toEqual([]);
    });

    it("reports no move", () => {
      expect(played).toEqual([]);
    });
  });

  describe("when the pointer merely rests on a piece", () => {
    beforeEach(() => {
      act(() => selection.current.hover(CHO_SOLDIER));
    });

    it("shows nowhere, there being nothing to teach about a game nobody has arranged", () => {
      expect(selection.current.destinations).toEqual([]);
    });
  });

  describe("when the pointer rests on a piece hemmed in by its own army", () => {
    beforeEach(() => {
      act(() => selection.current.hover(CHO_ELEPHANT));
    });

    it("shows nothing it covers either", () => {
      expect(selection.current.covered).toEqual([]);
    });
  });
});

/**
 * The board is replaced wholesale by every reducer in `GameSlice`, so a piece can still be held
 * when the position it was picked up on has gone. Undo is the sharp case: it hands back a board on
 * which it is the *other* army's turn, and `movesFrom` deliberately answers for either army — so a
 * held piece that is no longer anybody's to move would light up points `applyMove` then throws on.
 */
describe("when the board changes under a piece being held", () => {
  beforeEach(() => {
    selection = renderOn(afterChoOpens());
    act(() => selection.current.tap(HAN_SOLDIER));
  });

  describe("and the move that gave han the turn is taken back", () => {
    beforeEach(() => {
      showing(openingGame());
    });

    it("holds nothing, the turn having passed back to cho", () => {
      expect(selection.current.selected).toBeUndefined();
    });

    it("offers the soldier nowhere, though it still stands there", () => {
      expect(selection.current.destinations).toEqual([]);
    });

    it("plays nothing when a point that soldier could have reached is tapped", () => {
      act(() => selection.current.tap(HAN_FORWARD));

      expect(played).toEqual([]);
    });
  });

  describe("and the board is handed back with no game on it to play", () => {
    beforeEach(() => {
      showing(afterChoOpens(), false);
    });

    it("holds nothing, so nothing is drawn as picked up on a board nobody may touch", () => {
      expect(selection.current.selected).toBeUndefined();
    });
  });
});

/**
 * What `renderHook` hands back, named here because the type that names it cannot be imported: the
 * lint rule allows only `renderHook`, `act`, `waitFor` and `cleanup` from `@testing-library/react`.
 */
interface Rendered {
  readonly current: MoveSelection;
}

/**
 * Renders the hook on a position, recording any move it reports rather than applying one.
 *
 * `playable` is what a finished setup phase would have said. Every block but the last is about a
 * board with a game on it, so it defaults to that and only the laying-out block passes otherwise.
 */
function renderOn(game: GameState, playable = true): Rendered {
  played = [];

  const {result, rerender} = renderHook(
    (shown: Shown) => useMoveSelection(shown.game, move => played.push(move), shown.playable),
    {initialProps: {game, playable}},
  );

  showing = (next, stillPlayable = true) => act(() => rerender({game: next, playable: stillPlayable}));

  return result;
}

function openingGame(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

/** The opening with cho's first move played, so it is han's turn. */
function afterChoOpens(): GameState {
  return applyMove(openingGame(), {from: CHO_SOLDIER, to: FORWARD});
}

/**
 * A position cho is mated in: han's chariots hold the two palace corners and the third has come
 * down file 5. Constructed rather than played, a mate being far deeper than any readable move list,
 * and checked here so that a change to the rules cannot quietly turn it back into a game.
 */
function matedGame(): GameState {
  const game: GameState = {
    sideToMove: "cho",
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
    pieces: [
      {piece: {side: "cho", type: "general"}, position: MATED_GENERAL},
      {piece: {side: "cho", type: "chariot"}, position: MATED_CHARIOT},
      {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
      {piece: {side: "han", type: "chariot"}, position: {file: 4, rank: 1}},
      {piece: {side: "han", type: "chariot"}, position: {file: 6, rank: 1}},
      {piece: {side: "han", type: "chariot"}, position: {file: 5, rank: 3}},
    ],
  };

  if (!isCheckmate(game, "cho")) throw new Error("The position this test is built on is no longer a mate");

  return game;
}

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
