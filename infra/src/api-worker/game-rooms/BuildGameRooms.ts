import {DurableObjectNamespace} from "alchemy/cloudflare";

/**
 * The friend-code rooms: one `GameRoom` Durable Object for each code. **SQLite-backed**, which is the only kind the
 * free plan has (`docs/online-play.md`); Alchemy writes the `new_sqlite_classes` migration for it. The class name must be
 * the one `api/src/ApiWorker.ts` exports, and the binding name the one `api/src/env/WorkerEnvironment.ts` reads.
 */
export function buildGameRooms(): DurableObjectNamespace {
  return DurableObjectNamespace("game-rooms", {className: "GameRoom", sqlite: true});
}
