// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {beforeEach, expect, it} from "vitest";
import type {AppStore} from "@src/redux/Store";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {ServerMessage} from "@janggi/shared/janggi/online/messages/ServerMessage";
import {createStore} from "@src/redux/Store";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {localGameStashed} from "@src/redux/online/FriendSlice";
import {positionOf} from "@src/redux/online/testing/PositionOf";
import {receiveFromFriendRoom} from "@src/redux/online/actions/playing/ReceiveFromFriendRoom";

const FRIEND = {displayName: "Yi Sun-sin"};
const SOLDIER_FORWARD: RoomAction = {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}};

let store: AppStore;

beforeEach(() => {
  store = createStore(undefined);
});

function hear(...messages: readonly ServerMessage[]): void {
  messages.forEach(message => store.dispatch(receiveFromFriendRoom(message)));
}

function dealt(): readonly ServerMessage[] {
  return [
    {kind: "matched", side: "han", opponent: FRIEND},
    {kind: "started", hanSetup: "Inner Elephant", choSetup: "Outer Elephant"},
  ];
}

it("is waiting for a friend once the room says so", () => {
  hear({kind: "waiting"});

  expect(store.getState().friend.state).toBe("waiting-for-a-friend");
});

it("knows its army and its friend once matched, and has yet to deal a game", () => {
  const before = store.getState().game;

  hear({kind: "matched", side: "han", opponent: FRIEND});

  expect(store.getState().friend).toMatchObject({
    state: "choosing-setups",
    ownSide: "han",
    opponent: {displayName: "Yi Sun-sin"},
  });
  expect(store.getState().game).toBe(before);
});

it("deals the game as a casual one between two people when the room says it has started, with both arrangements", () => {
  hear(...dealt());

  const {game, friend} = store.getState();

  expect(friend.state).toBe("playing");
  expect(game.opponent).toMatchObject({name: "Human", playerSide: "han"});
  expect(game.played.present.format).toBe("Casual");
  expect(game.phase.hanSetup?.name).toBe("Inner Elephant");
  expect(game.phase.choSetup?.name).toBe("Outer Elephant");
});

it("sets the player's own game aside as the friend game is dealt", () => {
  const own = store.getState().game;

  hear(...dealt());

  expect(store.getState().friend.parkedGame).toBe(own);
});

it("plays a move the room says was made, for either player", () => {
  hear(...dealt(), {kind: "acted", by: "cho", action: SOLDIER_FORWARD});

  expect(store.getState().game.played.present.sideToMove).toBe("han");
  expect(positionOf(store.getState().game.played.present, 1, 6)).toBe("cho-soldier");
});

it("plays a rest, a call and a draw as the same actions the board's own controls make", () => {
  hear(...dealt(), {kind: "acted", by: "cho", action: {kind: "pass"}});
  expect(store.getState().game.played.present.consecutivePasses).toBe(1);

  hear({kind: "acted", by: "han", action: {kind: "offer-draw"}});
  expect(store.getState().game.drawOffer).toEqual({by: "han", declined: false});

  hear({kind: "acted", by: "cho", action: {kind: "accept-draw"}});
  expect(store.getState().game.played.present.drawAgreed).toBe(true);
});

it("is over once a player resigns, and says who", () => {
  hear(...dealt(), {kind: "acted", by: "han", action: {kind: "resign"}});

  expect(store.getState().friend).toMatchObject({state: "over", resignedBy: "han"});
});

it("drops a move the engine will not play, and carries on", () => {
  hear(...dealt(), {
    kind: "acted",
    by: "cho",
    action: {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 5, rank: 3}}},
  });

  expect(store.getState().game.played.present.sideToMove).toBe("cho");
  expect(store.getState().friend.state).toBe("playing");
});

it("drops a move off the board", () => {
  hear(...dealt(), {
    kind: "acted",
    by: "cho",
    action: {kind: "move", move: {from: {file: 0, rank: 7}, to: {file: 1, rank: 6}}},
  });

  expect(store.getState().game.played.present.sideToMove).toBe("cho");
});

it("tells of a friend leaving and coming back", () => {
  hear(...dealt(), {kind: "opponent-left"});
  expect(store.getState().friend.state).toBe("opponent-left");

  hear({kind: "opponent-back"});
  expect(store.getState().friend.state).toBe("playing");
});

it("does nothing about a rejection", () => {
  hear(...dealt());
  const before = store.getState();

  hear({kind: "rejected", reason: "illegal"});

  expect(store.getState()).toBe(before);
});

it("puts a game back together from a snapshot: the deal, then everything done since, once", () => {
  const snapshot: ServerMessage = {
    kind: "snapshot",
    side: "han",
    opponent: FRIEND,
    hanSetup: "Inner Elephant",
    choSetup: "Outer Elephant",
    history: [{by: "cho", action: SOLDIER_FORWARD}],
  };

  hear(snapshot, snapshot);

  const {game, friend} = store.getState();
  expect(friend).toMatchObject({state: "playing", ownSide: "han"});
  expect(game.played.present.sideToMove).toBe("han");
  expect(positionOf(game.played.present, 1, 6)).toBe("cho-soldier");
  expect(game.played.past).toHaveLength(1);
});

it("keeps the player's own game, not a friend game, as the one set aside, when a snapshot comes during one", () => {
  const own = firstGame();
  store.dispatch(localGameStashed(own));

  hear(...dealt());
  hear({
    kind: "snapshot",
    side: "han",
    opponent: FRIEND,
    hanSetup: "Inner Elephant",
    choSetup: "Outer Elephant",
    history: [],
  });

  expect(store.getState().friend.parkedGame).toBe(own);
});

it("is over from a snapshot of a game that ended in a resignation", () => {
  hear({
    kind: "snapshot",
    side: "han",
    opponent: FRIEND,
    hanSetup: "Inner Elephant",
    choSetup: "Outer Elephant",
    history: [{by: "cho", action: {kind: "resign"}}],
  });

  expect(store.getState().friend).toMatchObject({state: "over", resignedBy: "cho"});
});

it("is still choosing arrangements from a snapshot taken before the game was dealt", () => {
  hear({kind: "snapshot", side: "cho", opponent: FRIEND, history: []});

  expect(store.getState().friend.state).toBe("choosing-setups");
});
