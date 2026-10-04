import {isAllowed} from "@src/router/http/routes/rate-limit/IsAllowed";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** Whether one more request is allowed. Sign-in attempts, counted by the address they came from. */
export function loginAllowed(key: string): Promise<boolean> {
  return isAllowed(workerEnvironment.LOGIN_LIMITER, key);
}
