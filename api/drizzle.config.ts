import {defineConfig} from "drizzle-kit";

// Drizzle only writes the SQL; Wrangler applies it (`wrangler d1 migrations apply janggi`). Never run
// `drizzle-kit migrate` or `push` against D1 as well: two things tracking one database's migrations disagree.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/database/schema/*.ts",
  out: "./migrations",
});
