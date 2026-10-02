import {requiredEnvironment} from "@src/secrets/required-environment/RequiredEnvironment";

/**
 * The secrets a deploy needs, read from the environment once and available to whatever needs them: the Google OAuth
 * client's id and secret, which become Worker secrets, and the password Alchemy encrypts them with in its state.
 *
 * Importing this is what checks they are set — all of them, named together — so a deploy with one missing fails before it
 * has made anything. They are never written down here or passed through arguments; see `infra/AGENTS.md` for where they
 * come from.
 */
export const secrets = requiredEnvironment(process.env, [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "ALCHEMY_PASSWORD",
]);
