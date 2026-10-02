import {corsHeadersFor} from "@src/handler/cors/CorsHeadersFor";
import {deleteAccount} from "@src/handler/routes/DeleteAccount";
import {finishSignIn} from "@src/handler/routes/FinishSignIn";
import {isTrustedOrigin} from "@src/handler/cors/IsTrustedOrigin";
import {logOut} from "@src/handler/routes/LogOut";
import {readData} from "@src/handler/routes/ReadData";
import {writeData} from "@src/handler/routes/WriteData";
import {readMe} from "@src/handler/routes/ReadMe";
import {renameMe} from "@src/handler/routes/RenameMe";
import {respondEmpty} from "@src/handler/respond/RespondEmpty";
import {signedInAccount} from "@src/handler/session/SignedInAccount";
import {startSignIn} from "@src/handler/routes/StartSignIn";
import type {RouteServices} from "@src/handler/services/RouteServices";

/** The methods that change something, and so must come from the site and not from a page somebody else wrote. */
const CHANGING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

/**
 * Answers a request to the API: CORS first, then a check that anything that changes state came from the site (CSRF —
 * `SameSite=Lax` is a second line, and this is the first), then the route.
 *
 * Routes that need a player check the session cookie here, once, so a route is only ever handed an account. An answer
 * from a route has the CORS headers added to it last, so none can forget them.
 */
export async function handleApiRequest(request: Request, services: RouteServices): Promise<Response> {
  const origin = request.headers.get("Origin");
  const cors = corsHeadersFor(origin, services.allowedOrigins);

  if (request.method === "OPTIONS") {
    cors.set("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    cors.set("Access-Control-Allow-Headers", "Content-Type, If-Match");
    // A sync write is JSON with an `If-Match`, so the browser asks first; without this it asks again within seconds, and
    // every sync costs the free plan a third request. Browsers cap the time at two hours.
    cors.set("Access-Control-Max-Age", "7200");

    return new Response(null, {status: 204, headers: cors});
  }

  const answered =
    CHANGING_METHODS.includes(request.method) && !isTrustedOrigin(origin, services.allowedOrigins)
      ? respondEmpty(403)
      : await routed(request, services);

  cors.forEach((value, name) => answered.headers.set(name, value));

  return answered;
}

async function routed(request: Request, services: RouteServices): Promise<Response> {
  const route = `${request.method} ${new URL(request.url).pathname}`;

  if (route === "GET /api/auth/google") return startSignIn(request, services);
  if (route === "GET /api/auth/google/callback") return finishSignIn(request, services);
  if (route === "POST /api/auth/logout") return logOut(request, services);

  if (!ROUTES_FOR_A_PLAYER.includes(route)) return respondEmpty(404);

  const account = await signedInAccount(request, services);
  if (account === undefined) return respondEmpty(401);

  if (route === "GET /api/me") return readMe(account);
  if (route === "PATCH /api/me") return renameMe(request, account, services);
  if (route === "GET /api/data") return readData(account, services);
  if (route === "PUT /api/data") return writeData(request, account, services);

  return deleteAccount(account, services);
}

const ROUTES_FOR_A_PLAYER = ["GET /api/me", "PATCH /api/me", "GET /api/data", "PUT /api/data", "DELETE /api/account"];
