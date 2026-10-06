/** A redirect, carrying whichever cookies the answer sets. */
export function respondRedirect(address: string, cookies: readonly string[] = []): Response {
  const headers = new Headers({Location: address});
  cookies.forEach(cookie => headers.append("Set-Cookie", cookie));

  return new Response(undefined, {status: 302, headers});
}
