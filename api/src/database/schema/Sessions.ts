import {index, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

import {users} from "@src/database/schema/Users";

// Only a hash of the session token is stored, so a leaked table cannot be replayed as cookies.
export const sessions = sqliteTable(
  "sessions",
  {
    idHash: text("id_hash").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    expiresAt: integer("expires_at", {mode: "timestamp"}).notNull(),
  },
  table => [index("sessions_user_id").on(table.userId)],
);
