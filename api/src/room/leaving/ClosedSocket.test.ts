import {GUEST, HOST, NOW, seatedRoom, startedRoom} from "@src/room/testing/StartedRoom";
import {closedSocket} from "@src/room/leaving/ClosedSocket";
import {expect, it} from "vitest";

it("is the player leaving, when it was their last socket", () => {
  const step = closedSocket({room: startedRoom(), accountId: GUEST, stillConnected: false, now: NOW + 5});

  expect(step.state.seats.find(seat => seat.accountId === GUEST)?.goneSince).toBe(NOW + 5);
  expect(step.deliveries).toEqual([{to: HOST, message: {kind: "opponent-left"}}]);
});

it("is nothing, when the player has another socket open", () => {
  const room = startedRoom();
  const step = closedSocket({room, accountId: GUEST, stillConnected: true, now: NOW + 5});

  expect(step.state).toBe(room);
  expect(step.deliveries).toEqual([]);
});

it("notes when a player left and tells the other", () => {
  const step = closedSocket({room: seatedRoom(), accountId: GUEST, stillConnected: false, now: NOW + 5});

  expect(step.state.seats.find(seat => seat.accountId === GUEST)?.goneSince).toBe(NOW + 5);
  expect(step.deliveries).toEqual([{to: HOST, message: {kind: "opponent-left"}}]);
});

it("keeps the first time a player left when a second close follows", () => {
  const first = closedSocket({room: seatedRoom(), accountId: GUEST, stillConnected: false, now: NOW + 5}).state;
  const second = closedSocket({room: first, accountId: GUEST, stillConnected: false, now: NOW + 50});

  expect(second.state).toBe(first);
  expect(second.deliveries).toEqual([]);
});

it("says nothing to the other once the game is over", () => {
  const over = {...startedRoom(), result: {kind: "resigned", winner: "cho"} as const, finishedAt: NOW};

  expect(closedSocket({room: over, accountId: GUEST, stillConnected: false, now: NOW + 5}).deliveries).toEqual([]);
});

it("ignores a socket that was never seated", () => {
  expect(closedSocket({room: seatedRoom(), accountId: "stranger", stillConnected: false, now: NOW}).deliveries).toEqual(
    [],
  );
});
