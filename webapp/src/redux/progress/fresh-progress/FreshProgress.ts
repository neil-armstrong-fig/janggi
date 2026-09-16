import type {ProgressSliceState} from "@src/redux/progress/types/ProgressSliceState";

/** Where a newcomer starts: no XP, and every ladder at the bottom. */
export function freshProgress(): ProgressSliceState {
  return {
    xp: 0,
    beaten: {
      Casual: {cho: [], han: []},
      Scored: {cho: [], han: []},
    },
  };
}
