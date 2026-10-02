import {handleApiRequest} from "@src/handler/HandleApiRequest";
import {missingSecrets} from "@src/env/MissingSecrets";
import {servicesFor} from "@src/env/ServicesFor";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

// Cloudflare requires the Worker module to be the default export.
export default {
  async fetch(request: Request): Promise<Response> {
    const missing = missingSecrets(workerEnvironment);
    if (missing.length > 0) {
      console.error(`The API is missing a secret: set ${missing.join(" and ")} with \`wrangler secret put\`.`);

      return Response.json({}, {status: 500});
    }

    return handleApiRequest(request, servicesFor(request));
  },
} satisfies ExportedHandler;
