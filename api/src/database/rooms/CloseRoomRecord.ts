import {database} from "@src/database/Database";
import {eq} from "drizzle-orm";
import {rooms} from "@src/database/schema/Rooms";

/** The room is over and gone; a code nobody has open is nothing to do. */
export async function closeRoomRecord(code: string): Promise<void> {
  await database.delete(rooms).where(eq(rooms.code, code));
}
