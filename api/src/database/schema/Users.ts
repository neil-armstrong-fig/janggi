import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

// Google is the only provider, so its stable subject id sits on the user. No email and no real name: the display name is
// one the server made up at sign-up (`generatedDisplayName`) or the player chose, so it is only as real as they make it.
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  googleSub: text("google_sub").notNull().unique(),
  displayName: text("display_name").notNull(),
  createdAt: integer("created_at", {mode: "timestamp"}).notNull(),
});
