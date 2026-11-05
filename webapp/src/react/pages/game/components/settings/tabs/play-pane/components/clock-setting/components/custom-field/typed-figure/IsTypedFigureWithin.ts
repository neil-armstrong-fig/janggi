import type {FigureLimit} from "@src/redux/clock/time-controls/types/FigureLimit";

/** Whether what has been typed so far is a figure the store may have yet. A blank is not, though `Number` would read it as 0. */
export function isTypedFigureWithin(typed: string, {min, max}: FigureLimit): boolean {
  if (typed === "") return false;

  const figure = Number(typed);

  return figure >= min && figure <= max;
}
