import type {Locator} from "@playwright/test";
import type {ClockReading} from "@src/dsl/janggi/components/types/ClockReading";

/** The visible clock's figures, independent of the words around them. */
export async function clockReadingOf(clock: Locator): Promise<ClockReading> {
  await clock.waitFor({state: "visible"});
  return {
    seconds: clockFigure((await clock.getAttribute("data-seconds")) ?? undefined),
    periods: clockFigure((await clock.getAttribute("data-periods")) ?? undefined),
  };
}

function clockFigure(value?: string): number {
  if (value === undefined || value.trim() === "") return Number.NaN;
  return Number(value);
}
