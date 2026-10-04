import {database} from "@src/database/Database";
import type {NewSession} from "@src/database/types/NewSession";
import {sessions} from "@src/database/schema/Sessions";

export async function createSession(session: NewSession): Promise<void> {
  await database.insert(sessions).values(session);
}
