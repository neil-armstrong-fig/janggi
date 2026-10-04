import {expect, it} from "vitest";
import {serverMessageFrom} from "@src/redux/online/wire/ServerMessageFrom";

const MOVE = {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}};
const FRIEND = {displayName: "Yi Sun-sin"};

function read(message: unknown): ReturnType<typeof serverMessageFrom> {
  return serverMessageFrom(JSON.stringify(message));
}

it.each([["waiting"], ["opponent-left"], ["opponent-back"]])("reads %s", kind => {
  expect(read({kind})).toEqual({kind});
});

it("reads who a player is matched with, and the keys they sent", () => {
  expect(read({kind: "matched", side: "han", opponent: {...FRIEND, boardKey: "b", piecesKey: "p"}})).toEqual({
    kind: "matched",
    side: "han",
    opponent: {...FRIEND, boardKey: "b", piecesKey: "p"},
  });
});

it("reads the game being dealt", () => {
  expect(read({kind: "started", hanSetup: "Inner Elephant", choSetup: "Left Elephant"})).toEqual({
    kind: "started",
    hanSetup: "Inner Elephant",
    choSetup: "Left Elephant",
  });
});

it("reads what was done, whether a move or a plain action", () => {
  expect(read({kind: "acted", by: "cho", action: MOVE})).toEqual({kind: "acted", by: "cho", action: MOVE});
  expect(read({kind: "acted", by: "han", action: {kind: "resign"}})).toEqual({
    kind: "acted",
    by: "han",
    action: {kind: "resign"},
  });
});

it("reads a snapshot with its history, with the setups only once they are dealt", () => {
  const history = [{by: "cho", action: MOVE}];

  expect(read({kind: "snapshot", side: "cho", opponent: FRIEND, history})).toEqual({
    kind: "snapshot",
    side: "cho",
    opponent: FRIEND,
    history,
  });
  expect(
    read({
      kind: "snapshot",
      side: "cho",
      opponent: FRIEND,
      hanSetup: "Inner Elephant",
      choSetup: "Left Elephant",
      history,
    }),
  ).toMatchObject({hanSetup: "Inner Elephant", choSetup: "Left Elephant"});
});

it("reads a rejection and its reason", () => {
  expect(read({kind: "rejected", reason: "illegal"})).toEqual({kind: "rejected", reason: "illegal"});
});

it.each([
  ["text that is not JSON", "{"],
  ["something that is not an object", "[]"],
  ["a kind there is not", JSON.stringify({kind: "teleport"})],
  ["a match with no side", JSON.stringify({kind: "matched", opponent: FRIEND})],
  ["a match with a side that is not one", JSON.stringify({kind: "matched", side: "blue", opponent: FRIEND})],
  ["a match with no name", JSON.stringify({kind: "matched", side: "han", opponent: {}})],
  ["a key that is not text", JSON.stringify({kind: "matched", side: "han", opponent: {...FRIEND, boardKey: 4}})],
  ["a setup there is not", JSON.stringify({kind: "started", hanSetup: "Mine", choSetup: "Left Elephant"})],
  ["an action there is not", JSON.stringify({kind: "acted", by: "cho", action: {kind: "teleport"}})],
  [
    "a move with a point of text",
    JSON.stringify({
      kind: "acted",
      by: "cho",
      action: {kind: "move", move: {from: {file: "1", rank: 7}, to: {file: 1, rank: 6}}},
    }),
  ],
  [
    "a move with no destination",
    JSON.stringify({kind: "acted", by: "cho", action: {kind: "move", move: {from: {file: 1, rank: 7}}}}),
  ],
  ["an action by nobody", JSON.stringify({kind: "acted", by: "nobody", action: {kind: "resign"}})],
  [
    "a snapshot whose history is not a list",
    JSON.stringify({kind: "snapshot", side: "cho", opponent: FRIEND, history: 1}),
  ],
  [
    "a snapshot with one setup",
    JSON.stringify({kind: "snapshot", side: "cho", opponent: FRIEND, hanSetup: "Inner Elephant", history: []}),
  ],
  [
    "a snapshot with a bad entry",
    JSON.stringify({kind: "snapshot", side: "cho", opponent: FRIEND, history: [{by: "cho", action: {kind: "x"}}]}),
  ],
  ["a rejection for no reason there is", JSON.stringify({kind: "rejected", reason: "because"})],
])("turns away %s", (_what, text) => {
  expect(serverMessageFrom(text)).toBeUndefined();
});
