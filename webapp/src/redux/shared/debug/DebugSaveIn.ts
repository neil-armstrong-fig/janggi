import type {Save} from "@src/redux/shared/saves/types/Save";
import {customStylesFrom} from "@src/redux/slices/custom-styles/custom-styles-from/CustomStylesFrom";
import {isObject} from "@src/redux/shared/untrusted/IsObject";
import {progressFromDebug} from "@src/redux/shared/debug/ProgressFromDebug";

/**
 * What a message posted to the page asks the app to become, or undefined where the message is not one of
 * ours — `{janggi: "debug", progress: {xp: 640}}`, optionally carrying styles as a save does.
 *
 * A debug message is a save by another route, so it is the same `Save` and lands through the same
 * `saveLoaded` every slice already answers. Anything else posted to the page is left alone: other
 * libraries, browser extensions and the dev server's own hot-reload all use `postMessage` too.
 */
export function debugSaveIn(data: unknown): Save | undefined {
  if (!isObject(data) || data["janggi"] !== "debug") return undefined;

  const progress = progressFromDebug(data["progress"]);
  if (!progress) return undefined;

  return {progress, customStyles: customStylesFrom(data["customStyles"])};
}
