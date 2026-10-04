import {GUEST, HOST, NOW, startedRoom} from "@src/room/testing/StartedRoom";
import {answerFrame} from "@src/room/answering/AnswerFrame";
import {expect, it} from "vitest";

const MOVE = JSON.stringify({
  kind: "act",
  action: {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}},
});

it("reduces a frame that is a message, as the room would", () => {
  const step = answerFrame(startedRoom(), {accountId: HOST, data: MOVE, now: NOW});

  expect(step.state.history).toHaveLength(1);
  expect(step.deliveries).toHaveLength(2);
});

it.each([
  ["text that is not JSON", "{"],
  ["a message there is not", '{"kind":"cheat"}'],
])("tells the sender %s is malformed, and changes nothing", (_what, data) => {
  const room = startedRoom();
  const step = answerFrame(room, {accountId: GUEST, data, now: NOW});

  expect(step.state).toBe(room);
  expect(step.deliveries).toEqual([{to: GUEST, message: {kind: "rejected", reason: "malformed"}}]);
});

it("tells the sender bytes are malformed, even bytes that spell a message", () => {
  const bytes = new TextEncoder().encode(MOVE).slice().buffer as ArrayBuffer;
  const step = answerFrame(startedRoom(), {accountId: HOST, data: bytes, now: NOW});

  expect(step.deliveries).toEqual([{to: HOST, message: {kind: "rejected", reason: "malformed"}}]);
});
