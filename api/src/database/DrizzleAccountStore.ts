import {and, eq, gt} from "drizzle-orm";
import type {Account} from "@src/database/types/Account";
import type {AccountStore} from "@src/database/AccountStore";
import type {DataToWrite} from "@src/database/types/DataToWrite";
import type {DataWrite} from "@src/database/types/DataWrite";
import type {DrizzleD1Database} from "drizzle-orm/d1";
import type {NewAccount} from "@src/database/types/NewAccount";
import type {NewSession} from "@src/database/types/NewSession";
import type {PlayerData} from "@src/database/types/PlayerData";
import {playerData} from "@src/database/schema/PlayerData";
import {sessions} from "@src/database/schema/Sessions";
import {users} from "@src/database/schema/Users";

/**
 * The `AccountStore` over D1. D1 has no `BEGIN`/`COMMIT`, so nothing here relies on two statements being one: each
 * rule that must hold under two devices writing at once is a single statement that is conditional on the state it
 * expects — an `INSERT` that does nothing if the row is there, an `UPDATE` that matches only the version that was read.
 */
export class DrizzleAccountStore implements AccountStore {
  private readonly database: DrizzleD1Database;

  constructor(database: DrizzleD1Database) {
    this.database = database;
  }

  async findOrCreateAccount(googleSub: string, newAccount: NewAccount): Promise<Account> {
    await this.database
      .insert(users)
      .values({id: newAccount.id, googleSub, displayName: newAccount.displayName, createdAt: newAccount.now})
      .onConflictDoNothing({target: users.googleSub});

    const [account] = await this.database
      .select({id: users.id, displayName: users.displayName})
      .from(users)
      .where(eq(users.googleSub, googleSub));

    if (!account) throw new Error("The account that was just made is not there.");

    return account;
  }

  async createSession(session: NewSession): Promise<void> {
    await this.database.insert(sessions).values(session);
  }

  async accountOfSession(idHash: string, now: Date): Promise<Account | undefined> {
    const [account] = await this.database
      .select({id: users.id, displayName: users.displayName})
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.idHash, idHash), gt(sessions.expiresAt, now)));

    return account;
  }

  async deleteSession(idHash: string): Promise<void> {
    await this.database.delete(sessions).where(eq(sessions.idHash, idHash));
  }

  async renameAccount(userId: string, displayName: string): Promise<void> {
    await this.database.update(users).set({displayName}).where(eq(users.id, userId));
  }

  async readData(userId: string): Promise<PlayerData | undefined> {
    const [data] = await this.database
      .select({version: playerData.version, blob: playerData.blob})
      .from(playerData)
      .where(eq(playerData.userId, userId));

    return data;
  }

  async writeData({userId, blob, expectedVersion, now}: DataToWrite): Promise<DataWrite> {
    const written =
      expectedVersion === 0
        ? await this.database
            .insert(playerData)
            .values({userId, blob, version: 1, updatedAt: now})
            .onConflictDoNothing()
            .returning({version: playerData.version})
        : await this.database
            .update(playerData)
            .set({blob, version: expectedVersion + 1, updatedAt: now})
            .where(and(eq(playerData.userId, userId), eq(playerData.version, expectedVersion)))
            .returning({version: playerData.version});

    if (written[0]) return {outcome: "written", version: written[0].version};

    return {outcome: "conflict", version: (await this.readData(userId))?.version ?? 0};
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.database.delete(users).where(eq(users.id, userId));
  }
}
