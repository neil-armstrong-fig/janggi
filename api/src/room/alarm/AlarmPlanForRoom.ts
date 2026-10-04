import type {AlarmPlan} from "@src/room/alarm/types/AlarmPlan";
import type {RoomState} from "@src/room/types/RoomState";
import {alarmDecisionFor} from "@src/room/alarm/AlarmDecisionFor";
import {alarmPlanFor} from "@src/room/alarm/plan/AlarmPlanFor";

/** What the alarm should be set to for a room as it now stands: what it decides is due (`alarmDecisionFor`), as a plan for the alarm. */
export function alarmPlanForRoom(room: RoomState, now: number): AlarmPlan {
  return alarmPlanFor(alarmDecisionFor(room, now), now);
}
