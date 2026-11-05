import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {useState} from "react";

/**
 * How many times a flag has fallen (시간패) while the page has been up: a count that goes up once each time an army
 * runs out of time in front of the players, for the sound and the buzz to answer once, as they do a moment.
 *
 * A flag is a clock dispatch, not a change to the record, so no `GameMoment` carries it. **A game that opens already
 * lost on time counts as none**, as a game reloaded on a checkmate sounds nothing: the loss happened before the page.
 */
export function useFlagFall(outOfTime: Side | undefined): number {
  const [seen, setSeen] = useState(outOfTime);
  const [fallen, setFallen] = useState(0);

  if (outOfTime !== seen) {
    setSeen(outOfTime);

    if (outOfTime) setFallen(fallen + 1);
  }

  return fallen;
}
