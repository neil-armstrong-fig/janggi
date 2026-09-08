import {baseConfig, restrictedImports} from "@janggi/shared/config/eslint.base.js";
import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import {globalIgnores} from "eslint/config";

/**
 * Hook tests are welcome; component tests are not — see `AGENTS.md`. These are the only
 * `@testing-library/react` exports a unit test has any business importing. Everything else on that
 * package exists to render a component, and component behaviour is covered by the Playwright specs
 * in `acceptance-tests/`.
 *
 * Deny-by-default: a helper added to the library later is denied until it is named here.
 */
const hookTestingOnly = [
  {
    name: "@testing-library/react",
    allowImportNames: ["renderHook", "act", "waitFor", "cleanup"],
    message:
      "Do not render a component in a unit test — that behaviour belongs in acceptance-tests/. Hook tests may use renderHook, act, waitFor and cleanup.",
  },
  {
    name: "@testing-library/dom",
    message:
      "Nothing imports the DOM queries directly; they only serve rendered components. Hook tests take what they need from '@testing-library/react'.",
  },
];

/**
 * The engine in `src/game/` is the rules of janggi and nothing else. It has to stay runnable and
 * testable with no React, no store and no DOM around it — that is what makes exhaustive
 * move-generation tests cheap to write, and what would let it move to its own package, or to a
 * server, without being unpicked first.
 *
 * Denying the packages and not only the folders is what makes "pure TypeScript" a rule rather than
 * an intention: `@src/react` is already unreachable, but `import {useMemo} from "react"` would not
 * be.
 */
const engineIsPure = [
  {name: "react", message: "The engine must not import React. The rules do not depend on how they are drawn."},
  {name: "react-dom", message: "The engine must not import React. The rules do not depend on how they are drawn."},
  {
    name: "react-redux",
    message: "The engine must not import Redux. Where the state is kept is the store's problem, not the rules'.",
  },
  {
    name: "@reduxjs/toolkit",
    message: "The engine must not import Redux. Where the state is kept is the store's problem, not the rules'.",
  },
  {
    name: "@testing-library/react",
    message: "There is nothing to render here — an engine test calls the function and reads what comes back.",
  },
  {
    name: "@testing-library/dom",
    message: "There is nothing to render here — an engine test calls the function and reads what comes back.",
  },
];

export default [
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages: ["@janggi/shared"]}),
  globalIgnores(["scripts/*"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {jsx: true},
      },
    },
    plugins: {
      ...eslintReact.configs["recommended-typescript"].plugins,
      "react-hooks": reactHooks,
    },
    settings: eslintReact.configs["recommended-typescript"].settings,
    rules: {
      ...eslintReact.configs["recommended-typescript"].rules,
      ...reactHooks.configs.recommended.rules,
      // eslint-plugin-react-hooks owns these; letting both report would double up.
      ...eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"].rules,
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        paths: hookTestingOnly,
      }),
    },
  },
  {
    // State must not depend on views. Components read state through the typed hooks; a slice that
    // reaches back into `react/` would make the store impossible to test or reason about alone.
    files: ["src/redux/**"],
    rules: {
      // Flat config replaces this rule rather than merging it, so a file matching both this block
      // and the one above gets only what is listed here — `hookTestingOnly` has to be repeated.
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        paths: hookTestingOnly,
        patterns: [
          {
            group: ["@src/react", "@src/react/**"],
            message:
              "The redux layer must not import from react/. Components depend on state, not the other way round.",
          },
        ],
      }),
    },
  },
  {
    // The rules of janggi do not depend on how they are drawn or on where the state is kept.
    // Components and the store read the engine; the engine never reaches back into either.
    files: ["src/game/**"],
    rules: {
      // As above: flat config replaces this rule rather than merging it, so everything the blocks
      // higher up would have contributed has to be listed here too.
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        paths: engineIsPure,
        patterns: [
          {
            group: ["@src/react", "@src/react/**", "@src/redux", "@src/redux/**"],
            message:
              "The engine must not import from react/ or redux/. It takes a game state and returns one; everything else is somebody else's job.",
          },
        ],
      }),
    },
  },
];
