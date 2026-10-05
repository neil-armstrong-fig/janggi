import {GUEST, HOST, NOW, startedRoom, withAway} from "@src/room/testing/StartedRoom";
import {reduceRoom} from "@src/room/answering/reducing/ReduceRoom";
import {turnNotificationFor} from "@src/room/notifying/TurnNotificationFor";
import type {ClientMessage} from "@janggi/shared/janggi/online/messages/ClientMessage";
import type {RoomState} from "@src/room/types/RoomState";

const SOLDIER_FORWARD: ClientMessage = {
  kind: "act",
  action: {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}},
};

function after(room: RoomState, accountId: string, message: ClientMessage): RoomState {
  return reduceRoom(room, {accountId, message, now: NOW}).state;
}

it("tells the player the turn passed to, naming who moved, when they are away", () => {
  const before = withAway(startedRoom(), GUEST, NOW - 1000);

  expect(turnNotificationFor(before, after(before, HOST, SOLDIER_FORWARD))).toEqual({
    accountId: GUEST,
    opponentName: "Host",
  });
});

it("tells no one when the player the turn passed to is connected", () => {
  const before = startedRoom();

  expect(turnNotificationFor(before, after(before, HOST, SOLDIER_FORWARD))).toBeUndefined();
});

it("tells no one when the mover is the one who is away: it is not their turn", () => {
  const before = withAway(startedRoom(), HOST, NOW - 1000);

  expect(turnNotificationFor(before, after(before, HOST, SOLDIER_FORWARD))).toBeUndefined();
});

it("tells no one of a move the room refused", () => {
  const before = withAway(startedRoom(), GUEST, NOW - 1000);

  expect(turnNotificationFor(before, after(before, GUEST, SOLDIER_FORWARD))).toBeUndefined();
});

it("tells no one of a draw offered, which leaves the turn where it was", () => {
  const before = withAway(startedRoom(), GUEST, NOW - 1000);

  expect(turnNotificationFor(before, after(before, HOST, {kind: "act", action: {kind: "offer-draw"}}))).toBeUndefined();
});

it("tells no one when the game has ended", () => {
  const before = withAway(startedRoom(), GUEST, NOW - 1000);

  expect(turnNotificationFor(before, after(before, HOST, {kind: "act", action: {kind: "resign"}}))).toBeUndefined();
});

it("tells no one before the game has begun", () => {
  const before = withAway(startedRoom(), GUEST, NOW - 1000);

  expect(turnNotificationFor({...before, game: undefined}, before)).toBeUndefined();
});
