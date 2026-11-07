// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
import {createStore} from "@src/redux/Store";
import {moved, opponentChosen} from "@src/redux/slices/game/GameSlice";
import {tourStarted, onboardingSkipped} from "@src/redux/slices/onboarding/OnboardingSlice";
import {clockStarted, timeControlChosen} from "@src/redux/slices/clock/ClockSlice";
import {startTheTutorial} from "@src/redux/slices/tutorial/actions/StartTheTutorial";
import {ratedGameStarted} from "@src/redux/slices/ratings/RatingsSlice";

it("parks a real game and its running clock while practice has the board", () => {
  const store = createStore();
  store.dispatch(opponentChosen("Human"));
  store.dispatch(moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));
  store.dispatch(timeControlChosen("5 min"));
  store.dispatch(clockStarted(Date.now() - 1000));
  const game = store.getState().game;
  store.dispatch(tourStarted());
  expect(store.getState().game.played.past).toHaveLength(0);
  expect(store.getState().clock.name).toBe("Off");
  store.dispatch(onboardingSkipped());
  expect(store.getState().game).toEqual(game);
  expect(store.getState().clock.heldMs).toBeGreaterThanOrEqual(1000);
  expect(store.getState().clock.turnStartedAt).toBeUndefined();
});

it("keeps the real game in storage and resumes the saved tour card on reload", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } as unknown as Storage;
  const store = createStore(storage);
  store.dispatch(opponentChosen("Human"));
  store.dispatch(moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));
  const game = store.getState().game;
  store.dispatch(tourStarted());
  store.dispatch(moved({from: {file: 3, rank: 7}, to: {file: 3, rank: 6}}));
  window.dispatchEvent(new Event("pagehide"));
  const reloaded = createStore(storage);
  expect(reloaded.getState().tourPractice.parked?.game).toEqual(game);
  expect(reloaded.getState().game.played.past).toHaveLength(0);
  reloaded.dispatch(onboardingSkipped());
  expect(reloaded.getState().game).toEqual(game);
});

it("hands the original game to the guided game rather than parking the demonstration", () => {
  const store = createStore();
  const game = store.getState().game;
  store.dispatch(tourStarted());
  store.dispatch(moved({from: {file: 3, rank: 7}, to: {file: 3, rank: 6}}));
  store.dispatch(startTheTutorial());
  expect(store.getState().tourPractice.parked).toBeUndefined();
  expect(store.getState().tutorial.parked?.game).toEqual(game);
  expect(store.getState().onboarding.stage).toBe("done");
});

it("retains the rated game through practice and refuses a guided-game handoff over it", () => {
  const store = createStore();
  store.dispatch(
    ratedGameStarted({format: "Casual", botElo: 800, playerSide: "cho", startedAt: new Date().toISOString()}),
  );
  const ratings = store.getState().ratings;
  store.dispatch(tourStarted());
  store.dispatch(startTheTutorial());
  expect(store.getState().tutorial.parked).toBeUndefined();
  expect(store.getState().ratings).toEqual(ratings);
  expect(store.getState().tourPractice.parked).toBeDefined();
});
