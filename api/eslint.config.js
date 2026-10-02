import {baseConfig, restrictedImports} from "@janggi/shared/config/eslint.base.js";

const allowedPackages = ["@janggi/shared"];

// The Worker may import the janggi vocabulary from `@janggi/shared` and nothing else in the workspace.
// The webapp may not import this package at all — it is denied by default, there is no allow-list entry for it.
export default [
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages}),
  {
    // The database is the bottom of the Worker, kept apart from everything else: the rest of the Worker reaches into it,
    // and it reaches into nothing — not the handlers, not the environment, not even `@janggi/shared`. What it takes in
    // and gives back is spelled out in its own `types/`, so it can be understood, and tested, on its own.
    files: ["src/database/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        allowedPackages: [],
        patterns: [
          {
            regex: "^@src/(?!database/)",
            message: "The database may import only itself: nothing outside src/database/.",
          },
        ],
      }),
    },
  },
];
