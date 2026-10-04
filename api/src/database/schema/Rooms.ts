import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

import {users} from "@src/database/schema/Users";

// The rooms that are open, and whose they are: only what it takes to allow one room to an account and a few overall.
// The game itself lives in the room's Durable Object, never here.
export const rooms = sqliteTable("rooms", {
  code: text("code").primaryKey(),
  hostId: text("host_id")
    .notNull()
    .unique()
    .references(() => users.id, {onDelete: "cascade"}),
  createdAt: integer("created_at", {mode: "timestamp"}).notNull(),
});
