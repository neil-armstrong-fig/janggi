import react from "@vitejs/plugin-react";
import {join} from "node:path";
import {createElement, StrictMode} from "react";
import type {ComponentType} from "react";
import {renderToString} from "react-dom/server";
import {createServer} from "vite";
import type {Plugin} from "vite";

/** The reading pages stay crawlable without maintaining a second, non-React copy of their content. */
export function prerenderedPages(): Plugin {
  return {
    name: "prerendered-pages",
    transformIndexHtml: {
      order: "pre",
      async handler(html, context) {
        const page = PRERENDERED_PAGES.find(candidate => context.filename.endsWith(candidate.file));
        if (!page) return;

        const markup = context.server
          ? markupFor(page, await context.server.ssrLoadModule(page.module))
          : await renderPrerenderedPage(page);

        return html.replace(PAGE_MARKER, markup);
      },
    },
  };
}

const PAGE_MARKER = "<!--page-content-->";

/** The webapp folder, two above this one: where the pages and `src/` are. */
const WEBAPP_ROOT = join(import.meta.dirname, "..", "..");

interface PrerenderedPage {
  readonly file: string;
  readonly module: string;
  readonly component: string;
}

const PRERENDERED_PAGES: readonly PrerenderedPage[] = [
  {file: "learn.html", module: "/src/react/pages/learn/LearnPage.tsx", component: "LearnPage"},
  {
    file: "privacy.html",
    module: "/src/react/pages/legal/privacy/PrivacyPolicy.tsx",
    component: "PrivacyPolicy",
  },
  {file: "references.html", module: "/src/react/pages/references/ReferencesPage.tsx", component: "ReferencesPage"},
  {
    file: "terms.html",
    module: "/src/react/pages/legal/terms/TermsOfService.tsx",
    component: "TermsOfService",
  },
];

async function renderPrerenderedPage(page: PrerenderedPage): Promise<string> {
  const renderingServer = await createServer({
    appType: "custom",
    configFile: false,
    root: WEBAPP_ROOT,
    server: {hmr: false, middlewareMode: true, ws: false},
    resolve: {tsconfigPaths: true},
    plugins: [react(), serviceWorkerRegistrationStub()],
  });

  try {
    return markupFor(page, await renderingServer.ssrLoadModule(page.module));
  } finally {
    await renderingServer.close();
  }
}

/** The PWA plugin's virtual module only exists in the real build; a render for markup never registers a worker. */
function serviceWorkerRegistrationStub(): Plugin {
  const id = "virtual:pwa-register/react";

  return {
    name: "service-worker-registration-stub",
    resolveId: source => (source === id ? `\0${id}` : undefined),
    load: resolved => {
      if (resolved === `\0${id}`) {
        return "export function useRegisterSW() { return {needRefresh: [false, () => {}], updateServiceWorker: () => {}}; }";
      }

      return undefined;
    },
  };
}

function markupFor(page: PrerenderedPage, pageModule: Record<string, unknown>): string {
  const component = pageModule[page.component] as ComponentType;

  return renderToString(createElement(StrictMode, undefined, createElement(component)));
}
