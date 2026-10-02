import type {
  BeatenBySide,
  BeatenElos,
  BeatenLadders,
  ProgressSliceState,
} from "@src/redux/progress/types/ProgressSliceState";

/**
 * Two players' progress as one: the larger XP, and every strength beaten on either side.
 *
 * Progress only ever climbs, so neither device's is wrong and the one that has gone further is the one that
 * stands — taking the larger and the union means no device's play is lost by signing in on another.
 */
export function mergedProgress(local: ProgressSliceState, remote: ProgressSliceState): ProgressSliceState {
  return {xp: Math.max(local.xp, remote.xp), beaten: mergedLadders(local.beaten, remote.beaten)};
}

function mergedLadders(local: BeatenLadders, remote: BeatenLadders): BeatenLadders {
  return {Casual: mergedSides(local.Casual, remote.Casual), Scored: mergedSides(local.Scored, remote.Scored)};
}

function mergedSides(local: BeatenBySide, remote: BeatenBySide): BeatenBySide {
  // In the order `freshProgress` writes them, so a merge that adds nothing writes the same key and is not mistaken
  // for a change.
  return {cho: union(local.cho, remote.cho), han: union(local.han, remote.han)};
}

/** Each strength once, in the order it was first beaten: this device's, then any the other adds. */
function union(local: BeatenElos, remote: BeatenElos): BeatenElos {
  return [...new Set([...local, ...remote])];
}
