import {isAllowed} from "@src/router/http/routes/rate-limit/IsAllowed";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** Whether one more request is allowed. Opening a room, counted by account. */
export function roomOpeningAllowed(key: string): Promise<boolean> {
  return isAllowed(workerEnvironment.ROOM_LIMITER, key);
}
