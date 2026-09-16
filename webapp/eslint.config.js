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

/**
 * The bot in `src/bot/` is the opponent's decision and nothing else: a position in, what to play out,
 * with Fairy-Stockfish asked through the one interface in `engine/`. No React and no store, so every
 * choice it makes is a plain function a test can call, and the engine can be swapped for a fake.
 */
const botIsHeadless = [
  {name: "react", message: "The bot must not import React. It decides a turn; it does not draw one."},
  {name: "react-dom", message: "The bot must not import React. It decides a turn; it does not draw one."},
  {
    name: "react-redux",
    message: "The bot must not import Redux. It is handed a position; it does not go looking in the store.",
  },
  {
    name: "@reduxjs/toolkit",
    message: "The bot must not import Redux. It is handed a position; it does not go looking in the store.",
  },
];

/**
 * The sound in `src/audio/` is playback and nothing else. It is handed cues and a mood and plays them;
 * it draws nothing, and holds nothing the page could come to lean on. It knows nothing of janggi —
 * not the engine and not the shared vocabulary — because what a change sounds like is the page's
 * decision, made from the game state the page already holds. It must stay runnable, and its pure
 * parts testable, with no React around it.
 */
const audioIsIsolated = [
  {name: "react", message: "The sound must not import React. It hears the game; it does not draw it."},
  {name: "react-dom", message: "The sound must not import React. It hears the game; it does not draw it."},
  {
    name: "react-redux",
    message: "The sound must not import Redux. It is told what changed; it does not go looking in the store.",
  },
  {
    name: "@reduxjs/toolkit",
    message: "The sound must not import Redux. It is told what changed; it does not go looking in the store.",
  },
  {
    name: "@testing-library/react",
    message: "There is nothing to render here — a sound test calls the function and reads what comes back.",
  },
  {
    name: "@testing-library/dom",
    message: "There is nothing to render here — a sound test calls the function and reads what comes back.",
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
    // What a board and its pieces look like, as plain data. The store keeps a player's own styles, so
    // the shapes sit below both layers that use them, and reach up into neither.
    files: ["src/styles/**"],
    rules: {
      // As above: flat config replaces this rule rather than merging it.
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        paths: hookTestingOnly,
        patterns: [
          {
            group: ["@src/react", "@src/react/**", "@src/redux", "@src/redux/**", "@src/audio", "@src/audio/**"],
            message:
              "Styles are plain data. They must not import from react/, redux/ or audio/ — both the page and the store read them.",
          },
        ],
      }),
    },
  },
  {
    // The sound plays what the page hands it. It reads nothing of the game — not the engine and not
    // the shared vocabulary — and never reaches back into the page or the store.
    files: ["src/audio/**"],
    rules: {
      // As below: flat config replaces this rule rather than merging it, so everything the blocks
      // higher up would have contributed has to be listed here too.
      "no-restricted-imports": restrictedImports({
        allowedPackages: [],
        paths: audioIsIsolated,
        patterns: [
          {
            group: ["@src/react", "@src/react/**", "@src/redux", "@src/redux/**"],
            message:
              "The sound must not import from react/ or redux/. It is handed cues and a mood and plays them; nothing else is its job.",
          },
          {
            group: ["@src/game", "@src/game/**"],
            message:
              "The sound must not import the engine. The page decides what a change sounds like and hands over cues and a mood.",
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
  {
    // The bot asks the engine for a move and hands it back. It reads the rules to know what it may
    // play, and never reaches into the page or the store — the page decides when it is asked.
    files: ["src/bot/**"],
    rules: {
      // As above: flat config replaces this rule rather than merging it.
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        paths: botIsHeadless,
        patterns: [
          {
            group: ["@src/react", "@src/react/**", "@src/redux", "@src/redux/**", "@src/audio", "@src/audio/**"],
            message:
              "The bot must not import from react/, redux/ or audio/. It is handed a position and returns what to play; the page decides when to ask and what to do with the answer.",
          },
        ],
      }),
    },
  },
];
