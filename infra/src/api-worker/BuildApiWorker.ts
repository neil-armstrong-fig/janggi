import alchemy from "alchemy";
import {Worker} from "alchemy/cloudflare";
import type {D1Database} from "alchemy/cloudflare";
import {buildDataLimiter} from "@src/api-worker/rate-limiters/BuildDataLimiter";
import {buildLoginLimiter} from "@src/api-worker/rate-limiters/BuildLoginLimiter";
import {apiPath} from "@src/paths/ApiPath";
import {environment} from "@src/api-worker/settings/Environment";
import {secrets} from "@src/secrets/Secrets";

/**
 * The API's Worker, bound to the database it is given, to the two rate limiters it makes for itself (`rate-limiters/`) and to the Google client's secrets. Given
 * its own `workers.dev` address (`janggi-api.<account>.workers.dev`); the custom domain is the owner's to attach by hand.
 * Adopted by name where it already exists.
 *
 * The binding names are what `api/src/env/WorkerEnvironment.ts` reads: change one there and here together.
 */
export async function buildApiWorker(database: D1Database): ReturnType<typeof Worker> {
  return Worker("api", {
    name: "janggi-api",
    entrypoint: apiPath("src", "ApiWorker.ts"),
    compatibilityDate: "2026-09-01",
    adopt: true,
    url: true,
    bindings: {
      DB: database,
      LOGIN_LIMITER: buildLoginLimiter(),
      DATA_LIMITER: buildDataLimiter(),
      ALLOWED_ORIGINS: environment.allowedOrigins,
      GOOGLE_CLIENT_ID: alchemy.secret(secrets.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: alchemy.secret(secrets.GOOGLE_CLIENT_SECRET),
    },
  });
}
