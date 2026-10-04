import type {HttpRoute} from "@src/router/http/routes/types/HttpRoute";
import {HTTP_ROUTES} from "@src/router/http/routes/types/HttpRoute";

/**
 * Which of the API's HTTP routes a method and path are for, or undefined where they are for none. The one place a route is
 * recognised: what is not matched here is answered 404 and nothing else about it is looked at, so a route in `HTTP_ROUTES` is the
 * only way for a handler to be reached. The method is compared as sent (`GET`, not `get`), and the path exactly.
 */
export function httpRouteOf(method: string, pathname: string): HttpRoute | undefined {
  return HTTP_ROUTES.find(route => route === `${method} ${pathname}`);
}
