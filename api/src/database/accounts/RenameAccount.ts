import {database} from "@src/database/Database";
import {eq} from "drizzle-orm";
import {users} from "@src/database/schema/Users";

export async function renameAccount(userId: string, displayName: string): Promise<void> {
  await database.update(users).set({displayName}).where(eq(users.id, userId));
}
