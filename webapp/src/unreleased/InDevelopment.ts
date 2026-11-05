import {inDevelopmentFrom} from "@src/unreleased/address-flag/InDevelopmentFrom";

/**
 * Whether the work not yet in production is on, all of it together: at the development server unless the address says
 * otherwise, and anywhere else only with `?IN_DEVELOPMENT=true`. It is read once as the page opens and is not kept, so it
 * lasts as long as the address has it. The work ships in every build, so this hides it and does not protect it, and
 * anyone may switch it on. See `webapp/AGENTS.md`.
 */
export const IN_DEVELOPMENT: boolean = inDevelopmentFrom(queryOfThisPage(), import.meta.env.DEV);

/** Nothing where there is no page, as when a page is rendered ahead of time. */
function queryOfThisPage(): string {
  if (!("location" in globalThis)) return "";

  return globalThis.location.search;
}
