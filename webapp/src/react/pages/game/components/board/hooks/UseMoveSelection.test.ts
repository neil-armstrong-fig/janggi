// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {MoveSelection} from "@src/react/pages/game/components/board/hooks/UseMoveSelection";
import type {Position} from "@src/game/board/types/Position";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {act, renderHook} from "@testing-library/react";
import {applyMove} from "@src/game/ApplyMove";
import {beforeEach, describe, expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";
import {useMoveSelection} from "@src/react/pages/game/components/board/hooks/UseMoveSelection";

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

const CHO_SOLDIER: Position = {file: 1, rank: 7};
const ANOTHER_CHO_SOLDIER: Position = {file: 3, rank: 7};
const FORWARD: Position = {file: 1, rank: 6};
const SIDEWAYS: Position = {file: 2, rank: 7};
const EMPTY_POINT: Position = {file: 5, rank: 5};

/** Forward is `rank + 1` for han, against cho's `rank - 1`. See docs/rules.md §1. */
const HAN_SOLDIER: Position = {file: 1, rank: 4};
const HAN_FORWARD: Position = {file: 1, rank: 5};
const HAN_SIDEWAYS: Position = {file: 2, rank: 4};

let selection: Rendered;
let played: Move[];

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

/**
 * What `renderHook` hands back, named here because the type that names it cannot be imported: the
 * lint rule allows only `renderHook`, `act`, `waitFor` and `cleanup` from `@testing-library/react`.
 */
interface Rendered {
  readonly current: MoveSelection;
}

/** Renders the hook on a position, recording any move it reports rather than applying one. */
function renderOn(game: GameState): Rendered {
  played = [];

  return renderHook(() => useMoveSelection(game, move => played.push(move))).result;
}

function openingGame(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"));
}

/** The opening with cho's first move played, so it is han's turn. */
function afterChoOpens(): GameState {
  return applyMove(openingGame(), {from: CHO_SOLDIER, to: FORWARD});
}

function points(positions: readonly Position[]): string[] {
  return positions.map(toPositionKey).sort();
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
