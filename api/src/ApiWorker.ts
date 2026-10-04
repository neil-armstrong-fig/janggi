import {routeRequest} from "@src/router/RouteRequest";
import {missingSecrets} from "@src/env/MissingSecrets";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

// Cloudflare finds a Durable Object by its class being exported from the Worker module.
export {GameRoom} from "@src/room/GameRoom";

// Cloudflare requires the Worker module to be the default export.
export default {
  async fetch(request: Request): Promise<Response> {
    const missing = missingSecrets(workerEnvironment);
    if (missing.length > 0) {
      console.error(`The API is missing a secret: set ${missing.join(" and ")} with \`wrangler secret put\`.`);

      return Response.json({}, {status: 500});
    }

    return routeRequest(request);
  },
} satisfies ExportedHandler;
