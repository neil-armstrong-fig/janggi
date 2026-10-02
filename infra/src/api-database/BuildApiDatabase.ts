import {D1Database} from "alchemy/cloudflare";
import {apiPath} from "@src/paths/ApiPath";

/**
 * The D1 database the API keeps accounts and synced data in, with the migrations Drizzle generated applied to it
 * (`api/migrations/`, written by `drizzle-kit generate` and never by hand). Adopted by name where it already exists, so
 * running this against an account that has it takes it over rather than failing on the clash.
 *
 * A function, called from `ApiInfrastructure.ts`: Alchemy tells which app a resource belongs to by the scope the call
 * runs in, and that scope belongs to the module that created the app.
 */
export async function buildApiDatabase(): Promise<D1Database> {
  return D1Database("database", {
    name: "janggi",
    migrationsDir: apiPath("migrations"),
    adopt: true,
  });
}
