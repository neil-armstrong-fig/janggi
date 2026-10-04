/**
 * What a room does when its alarm rings: sleep on until the next deadline, have nothing to wait for (somebody is here, so no
 * alarm is set until the last of them leaves), or go. **A room never ends a game against a player for being away** — these
 * are friends, and a game may wait for days.
 */
export type AlarmDecision =
  {readonly kind: "keep"; readonly wakeAt: number} | {readonly kind: "idle"} | {readonly kind: "delete"};
