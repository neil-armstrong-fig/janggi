import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

import {users} from "@src/database/schema/Users";

// One row per browser or installed app that asked to be told when it is its player's turn. The endpoint is the push service's
// own address for that device, and the two keys are what a message to it must be encrypted with; with the endpoint they are
// all it takes to reach the device, so they are kept for no one else and go with the account.
export const pushSubscriptions = sqliteTable("push_subscriptions", {
  endpoint: text("endpoint").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {onDelete: "cascade"}),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: integer("created_at", {mode: "timestamp"}).notNull(),
});
