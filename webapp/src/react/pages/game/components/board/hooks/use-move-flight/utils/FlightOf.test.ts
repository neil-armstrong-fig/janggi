import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {Move} from "@src/game/types/Move";
import {expect, it} from "vitest";
import {flightOf} from "@src/react/pages/game/components/board/hooks/use-move-flight/utils/FlightOf";

const CAPTURE: Move = {from: {file: 1, rank: 5}, to: {file: 1, rank: 6}};

const TAKING: GameMoment = {
  id: 3,
  direction: "advanced",
  transition: {
    kind: "moved",
    move: CAPTURE,
    mover: {side: "han", type: "soldier"},
    taken: {side: "cho", type: "soldier"},
  },
};

it("flies a move played from where it started, knocking off what it took", () => {
  expect(flightOf(TAKING)).toEqual({
    id: 3,
    piece: {side: "han", type: "soldier"},
    move: CAPTURE,
    taken: {side: "cho", type: "soldier"},
  });
});

it("flies a move played again the same way", () => {
  expect(flightOf({...TAKING, direction: "replayed"})).toMatchObject({move: CAPTURE, taken: {type: "soldier"}});
});

it("flies a move taken back from where it landed to where it started, knocking nothing off", () => {
  expect(flightOf({...TAKING, direction: "takenBack"})).toEqual({
    id: 3,
    piece: {side: "han", type: "soldier"},
    move: {from: CAPTURE.to, to: CAPTURE.from},
    taken: undefined,
  });
});

it("flies nothing for a rested turn", () => {
  expect(flightOf({id: 1, direction: "advanced", transition: {kind: "passed", side: "cho"}})).toBeUndefined();
});

it("flies nothing for a called bikjang", () => {
  expect(flightOf({id: 1, direction: "advanced", transition: {kind: "bikjangCalled"}})).toBeUndefined();
});

it("flies nothing for a new deal, or before anything has happened", () => {
  expect(flightOf({id: 1, direction: "dealt", transition: undefined})).toBeUndefined();
  expect(flightOf(undefined)).toBeUndefined();
});
