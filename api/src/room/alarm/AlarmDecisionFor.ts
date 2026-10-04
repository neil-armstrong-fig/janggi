import type {AlarmDecision} from "@src/room/alarm/types/AlarmDecision";
import type {RoomState} from "@src/room/types/RoomState";
import {roomTimingsFor} from "@src/room/alarm/RoomTimingsFor";

/**
 * What a room does when its alarm rings at `now`:
 * - one nobody joined is deleted once the friend has had a day to come;
 * - a finished one is deleted after a short grace, so a player who reconnects is still told how it ended;
 * - one whose players have all gone is let go once the later of them has been away as long as the host allowed — nobody wins
 *   it, since nobody is waiting;
 * - otherwise somebody is here, and there is nothing to wait for.
 */
export function alarmDecisionFor(state: RoomState, now: number): AlarmDecision {
  const timings = roomTimingsFor(state.awayDays);

  if (state.finishedAt !== undefined) return decided(state.finishedAt + timings.finished, now);

  if (state.seats.length < 2) return decided(state.createdAt + timings.unjoined, now);

  const goneAt = state.seats.map(seat => seat.goneSince);
  if (goneAt.some(since => since === undefined)) return {kind: "idle"};

  return decided(Math.max(...(goneAt as number[])) + timings.away, now);
}

function decided(deadline: number, now: number): AlarmDecision {
  if (now >= deadline) return {kind: "delete"};

  return {kind: "keep", wakeAt: deadline};
}
