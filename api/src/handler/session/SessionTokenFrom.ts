import {SESSION_COOKIE} from "@src/handler/session/SessionCookieName";

/** The session token in a request's `Cookie` header, or undefined where it carries none. */
export function sessionTokenFrom(cookieHeader: string | null): string | undefined {
  const pairs = (cookieHeader ?? "").split(";").map(pair => pair.trim());
  const session = pairs.find(pair => pair.startsWith(`${SESSION_COOKIE}=`));
  const token = session?.slice(SESSION_COOKIE.length + 1);

  return token ? token : undefined;
}
