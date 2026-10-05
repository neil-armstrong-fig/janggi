import alchemy from "alchemy";
import {Worker} from "alchemy/cloudflare";
import type {D1Database} from "alchemy/cloudflare";
import {buildDataLimiter} from "@src/api-worker/rate-limiters/BuildDataLimiter";
import {buildGameRooms} from "@src/api-worker/game-rooms/BuildGameRooms";
import {buildLoginLimiter} from "@src/api-worker/rate-limiters/BuildLoginLimiter";
import {buildRoomLimiter} from "@src/api-worker/rate-limiters/BuildRoomLimiter";
import {apiPath} from "@src/paths/ApiPath";
import {environment} from "@src/api-worker/settings/Environment";
import {secrets} from "@src/secrets/Secrets";

/**
 * The API's Worker, bound to the database it is given, to the three rate limiters it makes for itself (`rate-limiters/`), to the Durable Object namespace for the friend-code rooms (`game-rooms/`) to the Google client's secrets and to the key its turn notifications are signed with. Given
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
    // Persist only the closed, privacy-safe application events emitted by the API. Cloudflare's automatic invocation logs and
    // traces carry request metadata this Worker deliberately does not retain.
    observability: {
      enabled: true,
      logs: {enabled: true, headSamplingRate: 1, invocationLogs: false, persist: true},
      traces: {enabled: false},
    },
    bindings: {
      DB: database,
      LOGIN_LIMITER: buildLoginLimiter(),
      DATA_LIMITER: buildDataLimiter(),
      ROOM_LIMITER: buildRoomLimiter(),
      GAME_ROOMS: buildGameRooms(),
      ALLOWED_ORIGINS: environment.allowedOrigins,
      GOOGLE_CLIENT_ID: alchemy.secret(secrets.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: alchemy.secret(secrets.GOOGLE_CLIENT_SECRET),
      VAPID_PRIVATE_KEY: alchemy.secret(secrets.VAPID_PRIVATE_KEY),
      VAPID_SUBJECT: environment.vapidSubject,
    },
  });
}
