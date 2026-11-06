import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import type {Plugin} from "vite";
import {datedSitemap} from "./DatedSitemap.js";

/**
 * Serves and builds `sitemap.xml` from `sitemap.template.xml`, each address dated by the last commit to
 * change the page it names or the words it is written in. A date kept by hand goes stale, and a build date says every
 * page changed on every deploy — which a crawler soon learns to ignore.
 */
export function datedSitemapFile(): Plugin {
  return {
    name: "dated-sitemap",

    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== "/sitemap.xml") return next();

        response.setHeader("Content-Type", "application/xml");
        response.end(renderSitemap());
      });
    },

    generateBundle() {
      this.emitFile({type: "asset", fileName: "sitemap.xml", source: renderSitemap()});
    },
  };
}

/** The webapp folder, two above this one: what `sources` below are relative to. */
const WEBAPP_ROOT = join(import.meta.dirname, "..", "..");

interface SitemapPage {
  readonly address: string;
  /** What the page is made of, relative to the webapp folder: its entry, and the folder or file holding its words. */
  readonly sources: readonly string[];
}

const SITEMAP_PAGES: readonly SitemapPage[] = [
  // A language's words are in an offshoot of every area; the guide's and the references' are dated with their own pages.
  {
    address: "https://janggi.neilarmstrong.dev/",
    sources: [
      "index.html",
      ":(glob)src/language/**/english/**",
      ":(exclude)src/language/guide",
      ":(exclude)src/language/references",
    ],
  },
  {
    address: "https://janggi.neilarmstrong.dev/ko/",
    sources: [
      "ko/index.html",
      ":(glob)src/language/**/korean/**",
      ":(exclude)src/language/guide",
      ":(exclude)src/language/references",
    ],
  },
  {
    address: "https://janggi.neilarmstrong.dev/learn.html",
    sources: ["learn.html", "src/react/pages/learn", ":(glob)src/language/guide/**/english/**"],
  },
  {
    address: "https://janggi.neilarmstrong.dev/ko/learn.html",
    sources: ["ko/learn.html", "src/react/pages/learn", ":(glob)src/language/guide/**/korean/**"],
  },
  {
    address: "https://janggi.neilarmstrong.dev/references.html",
    sources: ["references.html", "src/react/pages/references", ":(glob)src/language/references/**/english/**"],
  },
  {
    address: "https://janggi.neilarmstrong.dev/ko/references.html",
    sources: ["ko/references.html", "src/react/pages/references", ":(glob)src/language/references/**/korean/**"],
  },
  {
    address: "https://janggi.neilarmstrong.dev/privacy.html",
    sources: ["privacy.html", "src/react/pages/legal/privacy", "src/react/pages/legal/LegalPage.tsx"],
  },
  {
    address: "https://janggi.neilarmstrong.dev/terms.html",
    sources: ["terms.html", "src/react/pages/legal/terms", "src/react/pages/legal/LegalPage.tsx"],
  },
];

function renderSitemap(): string {
  const template = readFileSync(join(import.meta.dirname, "sitemap.template.xml"), "utf8");

  return datedSitemap(template, address => {
    const page = SITEMAP_PAGES.find(candidate => candidate.address === address);
    if (!page) throw new Error(`${address} is in the sitemap but not in SITEMAP_PAGES, so it has no date`);

    return lastChangeOf(page.sources);
  });
}

/**
 * The day of the last commit that touched any of these. A checkout cut short, as CI's is unless it fetches the whole
 * history, names its one commit for everything, and a folder with no history at all (a tarball, a file not yet
 * committed) is dated today — both are valid dates, and the deploy asks for the whole history so the first is not
 * what ships.
 */
function lastChangeOf(sources: readonly string[]): string {
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...sources], {
      cwd: WEBAPP_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (date !== "") return date;
  } catch {
    // Not a clone: fall through to today.
  }

  return new Date().toISOString().slice(0, 10);
}
