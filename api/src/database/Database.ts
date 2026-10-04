import {drizzle} from "drizzle-orm/d1";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * The Drizzle client over the Worker's D1 binding: the one thing every database function shares, so it is made once, here, when
 * the module is first loaded, and not in each function. A test that needs the real database replaces this module with one over
 * its own local D1 (`vi.mock`); every other test replaces the functions themselves.
 *
 * D1 has no `BEGIN`/`COMMIT`, so nothing that uses it relies on two statements being one: each rule that must hold under two
 * devices writing at once is a single statement that is conditional on the state it expects — an `INSERT` that does nothing if
 * the row is there, an `UPDATE` that matches only the version that was read.
 */
export const database = drizzle(workerEnvironment.DB);
