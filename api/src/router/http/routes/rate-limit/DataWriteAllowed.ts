import {isAllowed} from "@src/router/http/routes/rate-limit/IsAllowed";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** Whether one more request is allowed. Writes of a player's data, counted by account. */
export function dataWriteAllowed(key: string): Promise<boolean> {
  return isAllowed(workerEnvironment.DATA_LIMITER, key);
}
