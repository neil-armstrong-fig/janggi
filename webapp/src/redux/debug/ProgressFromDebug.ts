import type {ProgressSliceState} from "@src/redux/progress/types/ProgressSliceState";
import {progressFrom} from "@src/redux/progress/progress-from/ProgressFrom";

/**
 * The progress a debug setting asks the app to open at — `VITE_DEBUG_XP`, or a message posted to the
 * page — or undefined where nothing was asked for.
 *
 * It takes whichever shape is least trouble to write: a bare amount of XP, which is what a developer
 * types (`VITE_DEBUG_XP=640 pnpm start`); a whole progress as an object, for a test that needs bots
 * beaten as well; and that object as text, an environment variable carrying nothing else.
 *
 * What it is handed is untrusted like everything else read from outside — it goes through `progressFrom`,
 * which takes any amount of XP and drops a bot strength the app does not offer.
 */
export function progressFromDebug(asked: unknown): ProgressSliceState | undefined {
  if (asked === undefined || asked === null || asked === "") return undefined;
  if (typeof asked === "number") return progressFrom({xp: asked});
  if (typeof asked === "string") return progressFromText(asked);

  return progressFrom(asked);
}

function progressFromText(text: string): ProgressSliceState | undefined {
  const amount = Number(text);
  if (Number.isFinite(amount)) return progressFrom({xp: amount});

  try {
    return progressFrom(JSON.parse(text));
  } catch {
    return undefined;
  }
}
