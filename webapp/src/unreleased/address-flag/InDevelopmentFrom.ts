/** Whether work not yet in production is on: as the address says if it says, and otherwise only at the development server. */
export function inDevelopmentFrom(query: string, atDevelopmentServer: boolean): boolean {
  const flag = new URLSearchParams(query).get("IN_DEVELOPMENT");
  if (flag === "true") return true;

  if (flag === "false") return false;

  return atDevelopmentServer;
}
