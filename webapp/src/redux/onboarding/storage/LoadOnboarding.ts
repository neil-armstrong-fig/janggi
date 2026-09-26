import type {OnboardingSliceState} from "@src/redux/onboarding/types/OnboardingSliceState";
import {CUSTOM_STYLES_STORAGE_KEY} from "@src/redux/custom-styles/storage/CustomStylesStorageKey";
import {GAME_STORAGE_KEY} from "@src/redux/game/storage/GameStorageKey";
import {ONBOARDING_STAGES} from "@janggi/shared/janggi/onboarding/OnboardingStage";
import {ONBOARDING_STORAGE_KEY} from "@janggi/shared/janggi/onboarding/OnboardingStorage";
import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import {PROGRESS_STORAGE_KEY} from "@src/redux/progress/storage/ProgressStorageKey";
import {RATINGS_STORAGE_KEY} from "@src/redux/ratings/storage/RatingsStorageKey";
import {TOUR_STEP_COUNT} from "@src/redux/onboarding/touring/TourStepCount";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isObject} from "@src/redux/untrusted/IsObject";
import {readJson} from "@src/redux/device-storage/ReadJson";

/**
 * Where the player is in being shown around, as kept on the device.
 *
 * **A device that holds anything else of the player's is a returning player**, and is done: the app was
 * played here before it had a welcome, and being greeted as a stranger by a game with their record in it
 * would be a poor way to meet them. Only a device with nothing at all gets the welcome.
 *
 * A stage the app does not have, or a step off the tour, is the tour's start rather than a guess at
 * where they were.
 */
export function loadOnboarding(storage: Pick<Storage, "getItem"> | undefined): OnboardingSliceState {
  const stored = readJson(storage, ONBOARDING_STORAGE_KEY);
  if (!isObject(stored)) return hasPlayedBefore(storage) ? DONE : WELCOME;

  const {stage, tourStep} = stored;
  if (!isAmong(ONBOARDING_STAGES, stage)) return hasPlayedBefore(storage) ? DONE : WELCOME;
  if (stage !== "tour") return {stage, tourStep: 0};

  return {stage, tourStep: isStepOfTheTour(tourStep) ? tourStep : 0};
}

const WELCOME: OnboardingSliceState = {stage: "welcome", tourStep: 0};
const DONE: OnboardingSliceState = {stage: "done", tourStep: 0};

const KEPT_BY_A_PLAYER = [
  GAME_STORAGE_KEY,
  PREFERENCES_STORAGE_KEY,
  RATINGS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  CUSTOM_STYLES_STORAGE_KEY,
];

function hasPlayedBefore(storage: Pick<Storage, "getItem"> | undefined): boolean {
  return KEPT_BY_A_PLAYER.some(key => readJson(storage, key) !== undefined);
}

function isStepOfTheTour(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < TOUR_STEP_COUNT;
}
