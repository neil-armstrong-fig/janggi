import type {TutorialOffer} from "@janggi/shared/janggi/tutorial/TutorialOffer";
import {loadTutorialProgress} from "@src/redux/tutorial/storage/LoadTutorialProgress";
import {tutorialOfferOf} from "@src/redux/tutorial/progress/TutorialOfferOf";
import {useSyncExternalStore} from "react";

/**
 * What the guide's link to the tutorial offers, read off how far the player came, as the game keeps it on the device:
 * only read, the guide never writing the game's state. "start" as the page is rendered and hydrated, which knew no
 * device, and the device's answer once it is in the browser — so hydration never disagrees. Where the link goes does
 * not change with it: the game decides between starting and resuming, so the two cannot disagree either.
 */
export function useTutorialOffer(): TutorialOffer {
  return useSyncExternalStore(subscribe, inTheBrowser, aheadOfTime);
}

function subscribe(): () => void {
  return () => {};
}

function inTheBrowser(): TutorialOffer {
  return tutorialOfferOf(loadTutorialProgress(deviceStorage()));
}

function aheadOfTime(): TutorialOffer {
  return "start";
}

/** `localStorage`, where there is one to reach — reading the property itself throws where it is blocked. */
function deviceStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
