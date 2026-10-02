import {OAuth4WebapiGoogleSignIn} from "@src/google/OAuth4WebapiGoogleSignIn";
import {BindingRateLimiter} from "@src/handler/services/BindingRateLimiter";
import {DrizzleAccountStore} from "@src/database/DrizzleAccountStore";
import type {RouteServices} from "@src/handler/services/RouteServices";
import {drizzle} from "drizzle-orm/d1";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * What a request is answered with, built from the Worker's environment for this request and not before. Nothing is
 * held between requests: a binding, variable or secret is read where it is used, since a serverless isolate can outlive
 * a change to one.
 *
 * Google is told to send the player back to this API's own callback, on whichever host the request arrived — which is
 * the one registered with Google, so there is no second copy of the address to fall out of step with it. Local dev
 * gives it outright (`GOOGLE_REDIRECT_URI`), since `wrangler dev` reports the custom domain as the host.
 *
 * Untested, like `WorkerEnvironment`: it only joins the real pieces, each of which is tested apart.
 */
export function servicesFor(request: Request): RouteServices {
  return {
    store: new DrizzleAccountStore(drizzle(workerEnvironment.DB)),
    google: new OAuth4WebapiGoogleSignIn(
      workerEnvironment.GOOGLE_CLIENT_ID,
      workerEnvironment.GOOGLE_CLIENT_SECRET,
      workerEnvironment.GOOGLE_REDIRECT_URI ?? `${new URL(request.url).origin}/api/auth/google/callback`,
    ),
    allowedOrigins: workerEnvironment.ALLOWED_ORIGINS.split(","),
    loginLimiter: new BindingRateLimiter(workerEnvironment.LOGIN_LIMITER),
    dataLimiter: new BindingRateLimiter(workerEnvironment.DATA_LIMITER),
    now: () => new Date(),
    random: Math.random,
  };
}
