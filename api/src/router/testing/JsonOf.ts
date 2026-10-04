/** The JSON an answer carries, for a test to compare. */
export async function jsonOf(response: Response): Promise<unknown> {
  return response.json();
}
