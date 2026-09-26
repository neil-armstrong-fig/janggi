import {GAME_STORAGE_KEY} from "@src/redux/game/storage/GameStorageKey";
import {ONBOARDING_DONE_JSON, ONBOARDING_STORAGE_KEY} from "@janggi/shared/janggi/onboarding/OnboardingStorage";
import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import {TOUR_STEP_COUNT} from "@src/redux/onboarding/touring/TourStepCount";
import {expect, it} from "vitest";
import {loadOnboarding} from "@src/redux/onboarding/storage/LoadOnboarding";

function storageHolding(kept: Record<string, string>): Pick<Storage, "getItem"> {
  return {getItem: key => kept[key] ?? null};
}

function onboardingKept(value: unknown): Pick<Storage, "getItem"> {
  return storageHolding({[ONBOARDING_STORAGE_KEY]: JSON.stringify(value)});
}

it("welcomes a device with nothing kept on it", () => {
  expect(loadOnboarding(storageHolding({}))).toEqual({stage: "welcome", tourStep: 0});
});

it("welcomes where there is no storage at all", () => {
  expect(loadOnboarding(undefined)).toEqual({stage: "welcome", tourStep: 0});
});

it("reads what the acceptance tests keep for a returning player as done", () => {
  expect(loadOnboarding(storageHolding({[ONBOARDING_STORAGE_KEY]: ONBOARDING_DONE_JSON}))).toEqual({
    stage: "done",
    tourStep: 0,
  });
});

it("comes back to the step of the tour it was left on", () => {
  expect(loadOnboarding(onboardingKept({stage: "tour", tourStep: 3}))).toEqual({stage: "tour", tourStep: 3});
});

it("comes back to the welcome when that is where it was left", () => {
  expect(loadOnboarding(onboardingKept({stage: "welcome", tourStep: 0}))).toEqual({stage: "welcome", tourStep: 0});
});

it("takes a returning player, kept from before there was a welcome, as done", () => {
  expect(loadOnboarding(storageHolding({[GAME_STORAGE_KEY]: "{}"}))).toEqual({stage: "done", tourStep: 0});
  expect(loadOnboarding(storageHolding({[PREFERENCES_STORAGE_KEY]: "{}"}))).toEqual({stage: "done", tourStep: 0});
});

it("trusts what it kept about the onboarding over what else is kept", () => {
  const kept = {[ONBOARDING_STORAGE_KEY]: JSON.stringify({stage: "welcome", tourStep: 0}), [GAME_STORAGE_KEY]: "{}"};

  expect(loadOnboarding(storageHolding(kept))).toEqual({stage: "welcome", tourStep: 0});
});

it("starts the tour over when its step is not one of its steps", () => {
  expect(loadOnboarding(onboardingKept({stage: "tour", tourStep: TOUR_STEP_COUNT}))).toEqual({
    stage: "tour",
    tourStep: 0,
  });
  expect(loadOnboarding(onboardingKept({stage: "tour", tourStep: -1}))).toEqual({stage: "tour", tourStep: 0});
  expect(loadOnboarding(onboardingKept({stage: "tour", tourStep: 1.5}))).toEqual({stage: "tour", tourStep: 0});
  expect(loadOnboarding(onboardingKept({stage: "tour", tourStep: "2"}))).toEqual({stage: "tour", tourStep: 0});
});

it("puts a step nobody is on back to zero", () => {
  expect(loadOnboarding(onboardingKept({stage: "done", tourStep: 4}))).toEqual({stage: "done", tourStep: 0});
});

it("falls back as though nothing were kept for a stage the app does not have", () => {
  expect(loadOnboarding(onboardingKept({stage: "quiz", tourStep: 0}))).toEqual({stage: "welcome", tourStep: 0});
  expect(loadOnboarding(onboardingKept("done"))).toEqual({stage: "welcome", tourStep: 0});
});
