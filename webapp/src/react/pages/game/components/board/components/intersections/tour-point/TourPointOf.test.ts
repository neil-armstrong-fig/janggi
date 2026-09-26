import type {GameState} from "@src/game/types/GameState";
import {SETUPS} from "@src/game/setups/Setups";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {tourPointOf} from "@src/react/pages/game/components/board/components/intersections/tour-point/TourPointOf";

const OPENING: GameState = newGame(SETUPS[0]!, SETUPS[0]!, "Casual");

it("points at a soldier of the army to move, to begin with", () => {
  const point = tourPointOf({step: "pick-up", game: OPENING, playable: true, selected: undefined, destinations: []});
  const placed = OPENING.pieces.find(({position}) => toPositionKey(position) === point);

  expect(placed?.piece).toEqual({side: "cho", type: "soldier"});
});

it("points at the step to the right of the piece in hand, ahead of one forward", () => {
  const selected = {file: 1, rank: 7} as const;
  const destinations = [
    {file: 1, rank: 6},
    {file: 2, rank: 7},
  ] as const;

  expect(tourPointOf({step: "move", game: OPENING, playable: true, selected, destinations})).toBe(
    toPositionKey({file: 2, rank: 7}),
  );
});

it("points at where else the piece in hand may go, where it cannot go to its right", () => {
  const selected = {file: 9, rank: 7} as const;
  const destinations = [{file: 9, rank: 6}] as const;

  expect(tourPointOf({step: "move", game: OPENING, playable: true, selected, destinations})).toBe(
    toPositionKey({file: 9, rank: 6}),
  );
});

it("points at the piece again for a player who went on without picking one up", () => {
  const begun = tourPointOf({step: "pick-up", game: OPENING, playable: true, selected: undefined, destinations: []});

  expect(tourPointOf({step: "move", game: OPENING, playable: true, selected: undefined, destinations: []})).toBe(begun);
});

it("points at nothing on a step that is not about the board", () => {
  expect(
    tourPointOf({step: "controls", game: OPENING, playable: true, selected: undefined, destinations: []}),
  ).toBeUndefined();
  expect(
    tourPointOf({step: undefined, game: OPENING, playable: true, selected: undefined, destinations: []}),
  ).toBeUndefined();
});

it("points at nothing while the board is closed to the player", () => {
  expect(
    tourPointOf({step: "pick-up", game: OPENING, playable: false, selected: undefined, destinations: []}),
  ).toBeUndefined();
});
