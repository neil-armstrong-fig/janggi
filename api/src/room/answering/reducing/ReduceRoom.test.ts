import {GUEST, HOST, NOW, roomAfter, seatedRoom, startedRoom, withAway} from "@src/room/testing/StartedRoom";
import {expect, it} from "vitest";
import type {ClientMessage} from "@janggi/shared/janggi/online/messages/ClientMessage";
import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";
import {newRoom} from "@src/room/opening/NewRoom";
import {reduceRoom} from "@src/room/answering/reducing/ReduceRoom";

const HOST_INTRO: ClientMessage = {kind: "introduce", introduction: {displayName: "Host", boardKey: "board-key"}};
const GUEST_INTRO: ClientMessage = {kind: "introduce", introduction: {displayName: "Guest"}};
const SOLDIER_FORWARD: ClientMessage = {
  kind: "act",
  action: {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}},
};

function send(state: RoomState, accountId: string, message: ClientMessage): RoomStep {
  return reduceRoom(state, {accountId, message, now: NOW});
}

it("seats the first account as the host and tells them to wait", () => {
  const step = send(newRoom("han", NOW, 3), HOST, HOST_INTRO);

  expect(step.state.seats).toEqual([{accountId: HOST, side: "han", introduction: HOST_INTRO["introduction" as never]}]);
  expect(step.deliveries).toEqual([{to: HOST, message: {kind: "waiting"}}]);
});

it("seats the second account on the other army and tells each who they are playing", () => {
  const first = send(newRoom("han", NOW, 3), HOST, HOST_INTRO).state;
  const step = send(first, GUEST, GUEST_INTRO);

  expect(step.state.seats.map(seat => seat.side)).toEqual(["han", "cho"]);
  expect(step.deliveries).toEqual([
    {to: HOST, message: {kind: "matched", side: "han", opponent: {displayName: "Guest"}}},
    {to: GUEST, message: {kind: "matched", side: "cho", opponent: {displayName: "Host", boardKey: "board-key"}}},
  ]);
});

it("turns away the host's own account sitting twice, as a reconnection and not a second seat", () => {
  const first = send(newRoom("cho", NOW, 3), HOST, HOST_INTRO).state;

  expect(send(first, HOST, HOST_INTRO).state.seats).toHaveLength(1);
});

it("turns away a third account", () => {
  const step = send(seatedRoom(), "third", GUEST_INTRO);

  expect(step.deliveries).toEqual([{to: "third", message: {kind: "rejected", reason: "out-of-order"}}]);
  expect(step.state.seats).toHaveLength(2);
});

it("keeps the first setup hidden until the second is chosen", () => {
  const step = send(seatedRoom(), HOST, {kind: "choose-setup", setup: "Outer Elephant"});

  expect(step.deliveries).toEqual([]);
  expect(step.state.game).toBeUndefined();
});

it("shows both setups to both at once, and deals the game", () => {
  const afterHost = send(seatedRoom(), HOST, {kind: "choose-setup", setup: "Outer Elephant"}).state;
  const step = send(afterHost, GUEST, {kind: "choose-setup", setup: "Left Elephant"});
  const started = {kind: "started", hanSetup: "Left Elephant", choSetup: "Outer Elephant"};

  expect(step.deliveries).toEqual([
    {to: HOST, message: started},
    {to: GUEST, message: started},
  ]);
  expect(step.state.game?.sideToMove).toBe("cho");
});

it("refuses a setup chosen twice, or before the friend has come", () => {
  const alone = send(newRoom("cho", NOW, 3), HOST, HOST_INTRO).state;
  const chosen = send(seatedRoom(), HOST, {kind: "choose-setup", setup: "Outer Elephant"}).state;

  expect(send(alone, HOST, {kind: "choose-setup", setup: "Outer Elephant"}).deliveries[0]?.message).toEqual({
    kind: "rejected",
    reason: "out-of-order",
  });
  expect(send(chosen, HOST, {kind: "choose-setup", setup: "Left Elephant"}).deliveries[0]?.message).toEqual({
    kind: "rejected",
    reason: "out-of-order",
  });
});

it("refuses a move before the game has begun", () => {
  expect(send(seatedRoom(), HOST, SOLDIER_FORWARD).deliveries[0]?.message).toEqual({
    kind: "rejected",
    reason: "out-of-order",
  });
});

it("accepts a legal move on its owner's turn, and tells both players", () => {
  const step = send(startedRoom(), HOST, SOLDIER_FORWARD);
  const acted = {kind: "acted", by: "cho", action: SOLDIER_FORWARD["action" as never]};

  expect(step.deliveries).toEqual([
    {to: HOST, message: acted},
    {to: GUEST, message: acted},
  ]);
  expect(step.state.game?.sideToMove).toBe("han");
  expect(step.state.history).toHaveLength(1);
});

it("refuses a move out of turn, and changes nothing", () => {
  const room = startedRoom();
  const step = send(room, GUEST, {
    kind: "act",
    action: {kind: "move", move: {from: {file: 1, rank: 4}, to: {file: 1, rank: 5}}},
  });

  expect(step.deliveries).toEqual([{to: GUEST, message: {kind: "rejected", reason: "not-your-turn"}}]);
  expect(step.state).toBe(room);
});

it("refuses a move the piece cannot make, and changes nothing", () => {
  const room = startedRoom();
  const step = send(room, HOST, {
    kind: "act",
    action: {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 5, rank: 3}}},
  });

  expect(step.deliveries).toEqual([{to: HOST, message: {kind: "rejected", reason: "illegal"}}]);
  expect(step.state).toBe(room);
});

it("refuses to move a piece that is not there, or is the other army's", () => {
  const empty = send(startedRoom(), HOST, {
    kind: "act",
    action: {kind: "move", move: {from: {file: 1, rank: 5}, to: {file: 1, rank: 4}}},
  });
  const theirs = send(startedRoom(), HOST, {
    kind: "act",
    action: {kind: "move", move: {from: {file: 1, rank: 4}, to: {file: 1, rank: 5}}},
  });

  expect(empty.deliveries[0]?.message).toEqual({kind: "rejected", reason: "illegal"});
  expect(theirs.deliveries[0]?.message).toEqual({kind: "rejected", reason: "illegal"});
});

it("accepts a pass on the player's own turn only", () => {
  const onTurn = send(startedRoom(), HOST, {kind: "act", action: {kind: "pass"}});
  const offTurn = send(startedRoom(), GUEST, {kind: "act", action: {kind: "pass"}});

  expect(onTurn.state.game?.consecutivePasses).toBe(1);
  expect(onTurn.state.game?.sideToMove).toBe("han");
  expect(offTurn.deliveries[0]?.message).toEqual({kind: "rejected", reason: "not-your-turn"});
});

it("refuses a bikjang call when the generals do not face each other", () => {
  const step = send(startedRoom(), HOST, {kind: "act", action: {kind: "call-bikjang"}});

  expect(step.deliveries[0]?.message).toEqual({kind: "rejected", reason: "illegal"});
});

it("ends the game for both when a player resigns, and then refuses anything more", () => {
  const step = send(startedRoom(), GUEST, {kind: "act", action: {kind: "resign"}});

  expect(step.deliveries.map(delivery => delivery.to)).toEqual([HOST, GUEST]);
  expect(step.state.result).toEqual({kind: "resigned", winner: "cho"});
  expect(step.state.finishedAt).toBe(NOW);
  expect(send(step.state, HOST, SOLDIER_FORWARD).deliveries[0]?.message).toEqual({
    kind: "rejected",
    reason: "game-over",
  });
});

it("lets a player resign on the other's turn", () => {
  expect(send(startedRoom(), GUEST, {kind: "act", action: {kind: "resign"}}).state.result).toBeDefined();
});

it("ends the game in a draw only when the other accepts the offer", () => {
  const offered = send(startedRoom(), HOST, {kind: "act", action: {kind: "offer-draw"}});
  const accepted = send(offered.state, GUEST, {kind: "act", action: {kind: "accept-draw"}});

  expect(offered.state.drawOfferedBy).toBe("cho");
  expect(offered.state.result).toBeUndefined();
  expect(accepted.state.result).toEqual({kind: "played", outcome: {kind: "agreement"}});
});

it("refuses to accept a draw nobody offered, or one the player offered themselves", () => {
  const offered = send(startedRoom(), HOST, {kind: "act", action: {kind: "offer-draw"}}).state;

  expect(send(startedRoom(), GUEST, {kind: "act", action: {kind: "accept-draw"}}).deliveries[0]?.message).toEqual({
    kind: "rejected",
    reason: "illegal",
  });
  expect(send(offered, HOST, {kind: "act", action: {kind: "accept-draw"}}).deliveries[0]?.message).toEqual({
    kind: "rejected",
    reason: "illegal",
  });
});

it("declines a draw on offer when a move is played instead", () => {
  const offered = send(startedRoom(), GUEST, {kind: "act", action: {kind: "offer-draw"}}).state;

  expect(send(offered, HOST, SOLDIER_FORWARD).state.drawOfferedBy).toBeUndefined();
});

it("brings a returning player up to date, and tells the other they are back", () => {
  const played = send(startedRoom(), HOST, SOLDIER_FORWARD).state;
  const gone = withAway(played, GUEST, NOW);
  const step = send(gone, GUEST, GUEST_INTRO);

  expect(step.deliveries).toEqual([
    {
      to: GUEST,
      message: {
        kind: "snapshot",
        side: "han",
        opponent: {displayName: "Host"},
        hanSetup: "Inner Elephant",
        choSetup: "Inner Elephant",
        history: played.history,
      },
    },
    {to: HOST, message: {kind: "opponent-back"}},
  ]);
  expect(step.state.seats.find(seat => seat.accountId === GUEST)?.goneSince).toBeUndefined();
});

it("does not reveal a setup in a snapshot before the game is dealt", () => {
  const chosen = roomAfter([
    [HOST, HOST_INTRO],
    [GUEST, GUEST_INTRO],
    [HOST, {kind: "choose-setup", setup: "Outer Elephant"}],
  ]);
  const message = send(chosen, HOST, HOST_INTRO).deliveries[0]?.message;

  expect(message).toEqual({kind: "snapshot", side: "cho", opponent: {displayName: "Guest"}, history: []});
});

it("tells a host who reconnects before the friend has come to go on waiting", () => {
  const alone = send(newRoom("cho", NOW, 3), HOST, HOST_INTRO).state;

  expect(send(alone, HOST, HOST_INTRO).deliveries).toEqual([{to: HOST, message: {kind: "waiting"}}]);
});

it("refuses a second draw offer while one is waiting to be answered", () => {
  const offered = send(startedRoom(), HOST, {kind: "act", action: {kind: "offer-draw"}}).state;

  expect(send(offered, GUEST, {kind: "act", action: {kind: "offer-draw"}}).deliveries[0]?.message).toEqual({
    kind: "rejected",
    reason: "illegal",
  });
});

it("keeps a changed look on the seat and passes it to the other player", () => {
  const step = send(seatedRoom(), HOST, {kind: "update-look", look: {boardKey: "new-board"}});

  expect(step.state.seats[0]?.introduction).toEqual({displayName: "Host", boardKey: "new-board"});
  expect(step.deliveries).toEqual([{to: GUEST, message: {kind: "opponent-look", look: {boardKey: "new-board"}}}]);
});

it("takes a look back when the update names no keys", () => {
  const worn = send(seatedRoom(), HOST, {kind: "update-look", look: {boardKey: "a", piecesKey: "b"}}).state;
  const step = send(worn, HOST, {kind: "update-look", look: {}});

  expect(step.state.seats[0]?.introduction).toEqual({displayName: "Host"});
  expect(step.deliveries).toEqual([{to: GUEST, message: {kind: "opponent-look", look: {}}}]);
});

it("turns away a look from an account that is not seated", () => {
  const step = send(seatedRoom(), "third", {kind: "update-look", look: {}});

  expect(step.deliveries).toEqual([{to: "third", message: {kind: "rejected", reason: "out-of-order"}}]);
});
