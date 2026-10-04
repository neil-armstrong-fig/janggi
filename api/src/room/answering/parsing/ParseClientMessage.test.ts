import {MAX_CLIENT_MESSAGE_LENGTH} from "@src/room/answering/parsing/limits/MaxClientMessageLength";
import {parseClientMessage} from "@src/room/answering/parsing/ParseClientMessage";
import {expect, it} from "vitest";

const MOVE = {kind: "act", action: {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}}};

it("reads each kind of message", () => {
  expect(parseClientMessage(JSON.stringify(MOVE))).toEqual(MOVE);
  expect(parseClientMessage('{"kind":"choose-setup","setup":"Left Elephant"}')).toEqual({
    kind: "choose-setup",
    setup: "Left Elephant",
  });
  expect(parseClientMessage('{"kind":"act","action":{"kind":"resign"}}')).toEqual({
    kind: "act",
    action: {kind: "resign"},
  });
  expect(
    parseClientMessage(
      '{"kind":"introduce","introduction":{"displayName":"Admiral Yi","boardKey":"b","piecesKey":"p"}}',
    ),
  ).toEqual({kind: "introduce", introduction: {displayName: "Admiral Yi", boardKey: "b", piecesKey: "p"}});
});

it.each([
  ["not JSON", "{"],
  ["not an object", "[]"],
  ["an unknown kind", '{"kind":"cheat"}'],
  ["a setup that does not exist", '{"kind":"choose-setup","setup":"Mine"}'],
  ["an action that does not exist", '{"kind":"act","action":{"kind":"teleport"}}'],
  [
    "a move off the board (file)",
    JSON.stringify({kind: "act", action: {kind: "move", move: {from: {file: 10, rank: 1}, to: {file: 1, rank: 1}}}}),
  ],
  [
    "a move off the board (rank)",
    JSON.stringify({kind: "act", action: {kind: "move", move: {from: {file: 1, rank: 0}, to: {file: 1, rank: 1}}}}),
  ],
  [
    "a fractional point",
    JSON.stringify({kind: "act", action: {kind: "move", move: {from: {file: 1.5, rank: 1}, to: {file: 1, rank: 1}}}}),
  ],
  [
    "a point of text",
    JSON.stringify({kind: "act", action: {kind: "move", move: {from: {file: "1", rank: 1}, to: {file: 1, rank: 1}}}}),
  ],
  [
    "a move with no destination",
    JSON.stringify({kind: "act", action: {kind: "move", move: {from: {file: 1, rank: 1}}}}),
  ],
  ["an introduction with no name", '{"kind":"introduce","introduction":{}}'],
  ["an introduction with a blank name", '{"kind":"introduce","introduction":{"displayName":"   "}}'],
  [
    "an introduction with a key that is not text",
    '{"kind":"introduce","introduction":{"displayName":"A","boardKey":5}}',
  ],
])("turns away %s", (_what, text) => {
  expect(parseClientMessage(text)).toBeUndefined();
});

it("turns away an introduction whose key is longer than the other end will read", () => {
  const key = "x".repeat(64_001);

  expect(
    parseClientMessage(JSON.stringify({kind: "introduce", introduction: {displayName: "A", piecesKey: key}})),
  ).toBeUndefined();
});

it("turns away a message longer than any the room can be sent", () => {
  expect(parseClientMessage(" ".repeat(MAX_CLIENT_MESSAGE_LENGTH + 1) + JSON.stringify(MOVE))).toBeUndefined();
});

it("cleans the name the way a player's own is", () => {
  const message = parseClientMessage('{"kind":"introduce","introduction":{"displayName":"  Yi   Sun-sin "}}');

  expect(message).toEqual({kind: "introduce", introduction: {displayName: "Yi Sun-sin"}});
});

it("reads an update of the look", () => {
  expect(parseClientMessage(JSON.stringify({kind: "update-look", look: {boardKey: "k"}}))).toEqual({
    kind: "update-look",
    look: {boardKey: "k"},
  });
});

it("refuses an update of the look whose key is not text", () => {
  expect(parseClientMessage(JSON.stringify({kind: "update-look", look: {boardKey: 3}}))).toBeUndefined();
});
