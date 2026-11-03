import {execFileSync} from "node:child_process";

/**
 * Which build this is, for the You tab: the short hash of the commit it was made from, so a player on
 * an installed copy can tell whether a release has reached them. Left out when there is no commit to
 * name, and the page then says "dev".
 */
export function buildIdDefine(): Record<string, string> {
  const commitHash = shortCommitHash();
  if (commitHash === undefined) return {};

  return {"import.meta.env.VITE_BUILD_ID": JSON.stringify(commitHash)};
}

/** CI says which commit it checked out; a local build asks git, and has nothing to name outside a clone. */
function shortCommitHash(): string | undefined {
  const fromCi = process.env["GITHUB_SHA"];
  if (fromCi) return fromCi.slice(0, 7);

  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {encoding: "utf8", stdio: ["ignore", "pipe", "ignore"]})
      .trim()
      .slice(0, 7);
  } catch {
    return undefined;
  }
}
