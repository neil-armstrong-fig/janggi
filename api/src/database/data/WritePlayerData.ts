import {and, eq} from "drizzle-orm";
import {database} from "@src/database/Database";
import type {DataToWrite} from "@src/database/types/DataToWrite";
import type {DataWrite} from "@src/database/types/DataWrite";
import {playerData} from "@src/database/schema/PlayerData";
import {readPlayerData} from "@src/database/data/ReadPlayerData";

/**
 * Keeps the player's document if nobody has written since the version the writer read (`expectedVersion`, 0 for a first
 * write), and otherwise says which version was in the way. Each branch is one statement that is conditional on that version.
 */
export async function writePlayerData({userId, blob, expectedVersion, now}: DataToWrite): Promise<DataWrite> {
  if (expectedVersion === 0) {
    const first = await database
      .insert(playerData)
      .values({userId, blob, version: 1, updatedAt: now})
      .onConflictDoNothing()
      .returning({version: playerData.version});

    return writeOutcome(first, userId);
  }

  const next = await database
    .update(playerData)
    .set({blob, version: expectedVersion + 1, updatedAt: now})
    .where(and(eq(playerData.userId, userId), eq(playerData.version, expectedVersion)))
    .returning({version: playerData.version});

  return writeOutcome(next, userId);
}

/** Written where a row came back; otherwise somebody wrote first, and the version that was in the way is read. */
async function writeOutcome(written: readonly {readonly version: number}[], userId: string): Promise<DataWrite> {
  if (written[0]) return {outcome: "written", version: written[0].version};

  return {outcome: "conflict", version: (await readPlayerData(userId))?.version ?? 0};
}
