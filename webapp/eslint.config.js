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
];
