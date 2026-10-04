import {and, eq, lt, sql} from "drizzle-orm";
import {database} from "@src/database/Database";
import type {RoomOpening} from "@src/database/types/RoomOpening";
import type {RoomToOpen} from "@src/database/types/RoomToOpen";
import {rooms} from "@src/database/schema/Rooms";

/**
 * Records an open room against its host, which is how a player is held to one at a time and the rooms to a few overall. A host's
 * record older than `staleAfter` is a room that never reported closing, and is cleared first so it cannot lock them out.
 */
export async function openRoomRecord({code, hostId, now, limit, staleAfter}: RoomToOpen): Promise<RoomOpening> {
  await database
    .delete(rooms)
    .where(and(eq(rooms.hostId, hostId), lt(rooms.createdAt, new Date(now.getTime() - staleAfter))));

  // One statement, so two requests at once cannot both pass the checks: it inserts only if there is space, and does
  // nothing where the host already has a room or the code is taken (each column is unique).
  const opened = await database
    .insert(rooms)
    .select(
      database
        .select({
          code: sql<string>`${code}`.as("code"),
          hostId: sql<string>`${hostId}`.as("host_id"),
          createdAt: sql<number>`${Math.floor(now.getTime() / 1000)}`.as("created_at"),
        })
        .from(sql`(SELECT 1)`)
        .where(sql`(SELECT count(*) FROM rooms) < ${limit}`),
    )
    .onConflictDoNothing()
    .returning({code: rooms.code});

  if (opened[0]) return {kind: "opened"};

  const [held] = await database.select({code: rooms.code}).from(rooms).where(eq(rooms.hostId, hostId));
  if (held) return {kind: "already-open", code: held.code};

  const [taken] = await database.select({code: rooms.code}).from(rooms).where(eq(rooms.code, code));
  if (taken) return {kind: "code-taken"};

  return {kind: "full"};
}
