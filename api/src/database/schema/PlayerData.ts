import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

import {users} from "@src/database/schema/Users";

// One JSON blob per user; `version` is the optimistic-concurrency counter behind `If-Match`.
export const playerData = sqliteTable("player_data", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, {onDelete: "cascade"}),
  blob: text("blob").notNull(),
  version: integer("version").notNull(),
  updatedAt: integer("updated_at", {mode: "timestamp"}).notNull(),
});
