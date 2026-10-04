import {originsFrom} from "@src/router/shared/origin/origins/OriginsFrom";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** The origins allowed to call the API with credentials: the site, plus the dev server locally (`ALLOWED_ORIGINS`). */
export function allowedOrigins(): readonly string[] {
  return originsFrom(workerEnvironment.ALLOWED_ORIGINS);
}
