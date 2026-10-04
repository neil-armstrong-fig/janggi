/** An answer with no body — for what only needs to say how it went. */
export function respondEmpty(status: number): Response {
  return new Response(null, {status});
}
