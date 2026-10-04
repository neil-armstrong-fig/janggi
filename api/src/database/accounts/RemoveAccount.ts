import {database} from "@src/database/Database";
import {eq} from "drizzle-orm";
import {users} from "@src/database/schema/Users";

/** Deletes the account, and with it — by cascade — its sessions, its data and its open room. */
export async function removeAccount(userId: string): Promise<void> {
  await database.delete(users).where(eq(users.id, userId));
}
