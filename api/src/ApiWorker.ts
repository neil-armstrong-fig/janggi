import {handleApiRequest} from "@src/HandleApiRequest";

// Cloudflare finds a Durable Object by its class being exported from the Worker module.
export {GameRoom} from "@src/room/GameRoom";

// Cloudflare requires the Worker module to be the default export.
export default {
  fetch(request: Request): Promise<Response> {
    return handleApiRequest(request);
  },
} satisfies ExportedHandler;
