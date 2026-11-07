import type {TutorialProgress} from "@src/redux/slices/tutorial/types/TutorialProgress";
import {TUTORIAL_STORAGE_KEY} from "@src/redux/slices/tutorial/storage/TutorialStorageKey";
import {isObject} from "@src/redux/shared/untrusted/IsObject";
import {NOT_STARTED} from "@src/redux/slices/tutorial/progress/NotStarted";
import {readJson} from "@src/redux/shared/device-storage/ReadJson";

/**
 * How far the player has come through the tutorial, as kept on the device — read by the game as it opens, and by the
 * guide for its link, which only reads. Anything that does not check out is a tutorial not started: the worst that
 * costs is a Resume not offered. A scene past the last is let through, and resumes nowhere (`tutorialEntryOf`).
 */
export function loadTutorialProgress(storage: Pick<Storage, "getItem"> | undefined): TutorialProgress {
  const stored = readJson(storage, TUTORIAL_STORAGE_KEY);
  if (!isObject(stored)) return NOT_STARTED;

  const {reached, completed} = stored;
  if (!isSceneNumber(reached) || typeof completed !== "boolean") return NOT_STARTED;

  return {reached, completed};
}

function isSceneNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
