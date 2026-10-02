import alchemy from "alchemy";
import {buildApiDatabase} from "@src/api-database/BuildApiDatabase";
import {buildApiWorker} from "@src/api-worker/BuildApiWorker";
import {secrets} from "@src/secrets/Secrets";

/**
 * Everything the API needs on a Cloudflare account, and nothing else, so what is infrastructure here is plain to see: the
 * database, and the Worker bound to it. How each is built is in a folder of its own, so one can be read, changed and
 * reasoned about alone.
 *
 * **Not here, on purpose:** the domain. The Worker is given its `workers.dev` address and the custom domain
 * (`janggi-api.neilarmstrong.dev`) is attached by hand in the dashboard, since which domain, and where its DNS lives, is
 * the owner's. Nor is the Google OAuth client, which Google lets nobody create from code.
 *
 * `pnpm --filter @janggi/infra provision` runs it against the account `CLOUDFLARE_API_TOKEN` is for; see `infra/AGENTS.md`
 * for what to set first. Resources are adopted by name where they exist, so running it against an account that already
 * has them takes them over rather than failing on the clash.
 */
const app = await alchemy("janggi", {password: secrets.ALCHEMY_PASSWORD});

const apiDatabase = await buildApiDatabase();
const apiWorker = await buildApiWorker(apiDatabase);

// A deploy script's whole output is what it made, so the address is printed.
// eslint-disable-next-line no-console
console.log(`The API is at ${apiWorker.url}`);

await app.finalize();
