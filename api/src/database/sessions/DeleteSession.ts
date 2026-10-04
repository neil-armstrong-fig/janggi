import {database} from "@src/database/Database";
import {eq} from "drizzle-orm";
import {sessions} from "@src/database/schema/Sessions";

export async function deleteSession(idHash: string): Promise<void> {
  await database.delete(sessions).where(eq(sessions.idHash, idHash));
}
