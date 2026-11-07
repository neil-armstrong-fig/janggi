import {expect} from "@playwright/test";

/** A bounded observation window: false expires it; page errors still belong to the calling DSL. */
export async function pollUntil(ask: () => Promise<boolean>, within: number): Promise<boolean> {
  let failed = false;
  let cause: unknown;
  try {
    await expect
      .poll(
        async () => {
          try {
            return await ask();
          } catch (error) {
            failed = true;
            cause = error;
            return true;
          }
        },
        {timeout: within, intervals: [50]},
      )
      .toBe(true);
  } catch {
    return false;
  }

  if (failed) throw cause;
  return true;
}
