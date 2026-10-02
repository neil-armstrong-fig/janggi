/** Who is asking, as far as a limit goes: the address Cloudflare saw the request come from. */
export function clientOf(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}
