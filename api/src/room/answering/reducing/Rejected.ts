import type {RejectionReason} from "@janggi/shared/janggi/online/messages/RejectionReason";
import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";

/** Nothing changes, and the sender is told so. */
export function rejected(state: RoomState, accountId: string, reason: RejectionReason): RoomStep {
  return {state, deliveries: [{to: accountId, message: {kind: "rejected", reason}}]};
}
