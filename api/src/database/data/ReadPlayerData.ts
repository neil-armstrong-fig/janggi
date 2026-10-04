import {database} from "@src/database/Database";
import {eq} from "drizzle-orm";
import type {PlayerData} from "@src/database/types/PlayerData";
import {playerData} from "@src/database/schema/PlayerData";

export async function readPlayerData(userId: string): Promise<PlayerData | undefined> {
  const [data] = await database
    .select({version: playerData.version, blob: playerData.blob})
    .from(playerData)
    .where(eq(playerData.userId, userId));

  return data;
}
