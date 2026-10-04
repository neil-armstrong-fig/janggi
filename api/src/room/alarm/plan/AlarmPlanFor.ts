import type {AlarmDecision} from "@src/room/alarm/types/AlarmDecision";
import type {AlarmPlan} from "@src/room/alarm/types/AlarmPlan";

/**
 * What to do with the Durable Object's one alarm, given what the room decided: ring when it is next due; ring never, since
 * somebody is here; or ring now, to have the room let go straight away — a room's let-go is its own alarm, so that it is
 * done in the one place, with the room's storage in hand.
 */
export function alarmPlanFor(decision: AlarmDecision, now: number): AlarmPlan {
  switch (decision.kind) {
    case "keep":
      return {kind: "ring-at", at: decision.wakeAt};
    case "idle":
      return {kind: "never"};
    case "delete":
      return {kind: "ring-at", at: now};
  }
}
