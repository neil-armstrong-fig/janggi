import {and, eq, gt} from "drizzle-orm";
import type {Account} from "@src/database/types/Account";
import {database} from "@src/database/Database";
import {sessions} from "@src/database/schema/Sessions";
import {users} from "@src/database/schema/Users";

/** The account a session belongs to, if the session is there and has not expired by `now`. */
export async function accountOfSession(idHash: string, now: Date): Promise<Account | undefined> {
  const [account] = await database
    .select({id: users.id, displayName: users.displayName})
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.idHash, idHash), gt(sessions.expiresAt, now)));

  return account;
}
