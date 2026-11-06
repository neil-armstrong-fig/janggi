// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {beforeEach, describe, expect, it} from "vitest";
import type {AppStore} from "@src/redux/Store";
import {CLOCK_STORAGE_KEY} from "@src/redux/clock/storage/ClockStorageKey";
import {GAME_STORAGE_KEY} from "@src/redux/game/storage/GameStorageKey";
import {clockStarted, timeControlChosen} from "@src/redux/clock/ClockSlice";
import {createStore} from "@src/redux/Store";
import {leaveTheTutorial} from "@src/redux/tutorial/actions/LeaveTheTutorial";
import {botStrengthChosen, moved} from "@src/redux/game/GameSlice";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";
import {saveLoaded} from "@src/redux/saves/actions/SaveLoaded";
import {ratedGameStarted} from "@src/redux/ratings/RatingsSlice";
import {startTheTutorial} from "@src/redux/tutorial/actions/StartTheTutorial";
import {startTheTutorialScene} from "@src/redux/tutorial/actions/StartTheTutorialScene";
import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import {newGame} from "@janggi/engine/NewGame";
import type {GameState} from "@janggi/engine/types/GameState";
import {tourStarted} from "@src/redux/onboarding/OnboardingSlice";
import {friendConnecting} from "@src/redux/online/FriendSlice";
import {closeTheTutorial} from "@src/redux/tutorial/actions/CloseTheTutorial";
import {TUTORIAL_XP} from "@src/redux/progress/xp/TutorialXp";
import {TUTORIAL_STORAGE_KEY} from "@src/redux/tutorial/storage/TutorialStorageKey";

const SCENE_START: GameState = {
  ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
  pieces: [
    {piece: {side: "han", type: "general"}, position: {file: 4, rank: 1}},
    {piece: {side: "cho", type: "general"}, position: {file: 6, rank: 9}},
    {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}},
  ],
};

let kept: Map<string, string>;
let store: AppStore;

beforeEach(() => {
  kept = new Map<string, string>();
  const storage = {
    getItem: () => null,
    setItem: (key: string, text: string) => {
      kept.set(key, text);
    },
  } as unknown as Storage;
  store = createStore(storage);
  store.dispatch(moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));
});

describe("once the tutorial is started over a game under way", () => {
  beforeEach(() => {
    store.dispatch(startTheTutorial());
  });

  it("puts a fresh board up, against a person at the same device", () => {
    const {game} = store.getState();

    expect(game.played.past).toHaveLength(0);
    expect(game.opponent.name).toBe("Human");
    expect(store.getState().clock.name).toBe("Off");
  });

  it("keeps the player's own game on the device, not the tutorial's", () => {
    const written = JSON.parse(kept.get(GAME_STORAGE_KEY) ?? "{}") as {played?: {past?: unknown[]}};

    expect(written.played?.past).toHaveLength(1);
  });

  it("is not started a second time over itself", () => {
    const parked = store.getState().tutorial.parked;
    store.dispatch(startTheTutorial());

    expect(store.getState().tutorial.parked).toBe(parked);
  });

  it("starts a scene on the position it is handed, and says which scene it is", () => {
    store.dispatch(startTheTutorialScene(2, SCENE_START));

    expect(store.getState().tutorial.scene).toBe(2);
    expect(store.getState().game.played.present.pieces).toEqual(SCENE_START.pieces);
    expect(store.getState().game.opponent.name).toBe("Human");
  });

  it("starts again from its first scene", () => {
    store.dispatch(startTheTutorialScene(2, SCENE_START));
    store.dispatch(leaveTheTutorial());
    store.dispatch(startTheTutorial());

    expect(store.getState().tutorial.scene).toBe(0);
  });

  it("closes on the card after its last scene, leaving that scene's board as it is", () => {
    store.dispatch(startTheTutorialScene(4, SCENE_START));
    store.dispatch(closeTheTutorial(5));

    expect(store.getState().tutorial.scene).toBe(5);
    expect(store.getState().game.played.present.pieces).toEqual(SCENE_START.pieces);
  });

  it("is completed by closing, which earns its XP", () => {
    store.dispatch(closeTheTutorial(5));

    expect(store.getState().tutorial.progress.completed).toBe(true);
    expect(store.getState().progress.xp).toBe(TUTORIAL_XP);
  });

  it("earns its XP only the first time it is completed", () => {
    store.dispatch(closeTheTutorial(5));
    store.dispatch(leaveTheTutorial());
    store.dispatch(startTheTutorial());
    store.dispatch(closeTheTutorial(5));

    expect(store.getState().progress.xp).toBe(TUTORIAL_XP);
  });

  it("keeps how far the player came on the device, and nothing of the board", () => {
    store.dispatch(startTheTutorialScene(2, SCENE_START));

    expect(JSON.parse(kept.get(TUTORIAL_STORAGE_KEY) ?? "{}")).toEqual({reached: 2, completed: false});
  });

  it("opens again on how far the player came, with the player's own game on the board", () => {
    store.dispatch(startTheTutorialScene(2, SCENE_START));
    const reopened = createStore({getItem: (key: string) => kept.get(key) ?? null} as unknown as Storage);

    expect(reopened.getState().tutorial.progress.reached).toBe(2);
    expect(reopened.getState().tutorial.parked).toBeUndefined();
  });

  it("resumes on the scene it is handed", () => {
    store.dispatch(leaveTheTutorial());
    store.dispatch(startTheTutorial({scene: 2, start: SCENE_START}));

    expect(store.getState().tutorial.scene).toBe(2);
    expect(store.getState().game.played.present.pieces).toEqual(SCENE_START.pieces);
  });

  it("puts the player's own game back when it is left", () => {
    store.dispatch(leaveTheTutorial());

    expect(store.getState().game.played.past).toHaveLength(1);
    expect(store.getState().tutorial.parked).toBeUndefined();
  });
});

it("parks a timed turn holding what it had spent, so the clock asks to be resumed on coming back", () => {
  store.dispatch(timeControlChosen("5 min"));
  store.dispatch(clockStarted(Date.now()));
  store.dispatch(startTheTutorial());
  expect(JSON.parse(kept.get(CLOCK_STORAGE_KEY) ?? "{}")).toHaveProperty("name", "5 min");
  store.dispatch(leaveTheTutorial());

  const {clock} = store.getState();
  expect(clock.name).toBe("5 min");
  expect(clock.turnStartedAt).toBeUndefined();
  expect(clock.heldMs).toBeGreaterThanOrEqual(0);
});

it("does not start over a rated game against the bot", () => {
  store.dispatch(
    ratedGameStarted({format: "Casual", botElo: 800, playerSide: "cho", startedAt: "2026-11-06T00:00:00Z"}),
  );
  store.dispatch(startTheTutorial());

  expect(store.getState().tutorial.parked).toBeUndefined();
  expect(store.getState().game.played.past).toHaveLength(1);
});

it("does not start while the player holds a friend room, whose game would be dealt over it", () => {
  store.dispatch(friendConnecting("ABCD2345"));
  store.dispatch(startTheTutorial());

  expect(store.getState().tutorial.parked).toBeUndefined();
});

it("ends the welcome and the tour, which would otherwise stand over it", () => {
  store.dispatch(tourStarted());
  store.dispatch(startTheTutorial());

  expect(store.getState().onboarding.stage).toBe("done");
});

it("keeps the game put aside within reach of a save loaded meanwhile, which has less in it", () => {
  store.dispatch(botStrengthChosen(1600));
  store.dispatch(startTheTutorial());
  store.dispatch(saveLoaded({progress: freshProgress(), customStyles: noCustomStyles()}));
  store.dispatch(leaveTheTutorial());

  expect(store.getState().game.opponent.botElo).toBe(800);
});

it("closes nothing outside the tutorial, and earns nothing", () => {
  store.dispatch(closeTheTutorial(5));

  expect(store.getState().tutorial.progress.completed).toBe(false);
  expect(store.getState().progress.xp).toBe(0);
});

it("starts no scene outside the tutorial", () => {
  store.dispatch(startTheTutorialScene(2, SCENE_START));

  expect(store.getState().tutorial.scene).toBe(0);
  expect(store.getState().game.played.past).toHaveLength(1);
});
