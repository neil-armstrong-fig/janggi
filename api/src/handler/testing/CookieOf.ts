/** The `name=value` of the cookie an answer sets, ready to be sent back; empty where it sets none or clears it. */
export function cookieOf(response: Response, name: string): string {
  const set = response.headers.getSetCookie().find(cookie => cookie.startsWith(`${name}=`));
  const pair = set?.split(";")[0] ?? "";

  return pair === `${name}=` ? "" : pair;
}
