/**
 * The settings of a deploy that are not secret, read from the environment with the defaults for this game's own account.
 * Someone standing the game up on their own account sets what differs.
 */
export const environment = {
  /** Comma-separated origins allowed to call the API with credentials: the site, and the local dev server. */
  allowedOrigins: process.env["SITE_ORIGINS"] ?? "https://janggi.neilarmstrong.dev,http://localhost:3000",
};
