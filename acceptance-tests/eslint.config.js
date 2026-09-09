import {baseConfig, restrictedImports} from "@janggi/shared/config/eslint.base.js";

const acceptanceCriteriaMapping = "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const playwrightPackages = ["@playwright/test", "playwright", "playwright-core"];

export default [
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages: ["@janggi/shared"]}),
  {
    // Specs see the mapping, `src/shared/` and `@janggi/shared` — nothing else. That keeps them
    // readable as acceptance criteria and stops them reaching into the DSL, or Playwright, behind
    // the mapping's back, while still letting an assertion be typed in the game's own vocabulary.
    files: ["src/tests/**"],
    rules: {
      // A `then` states one criterion and asserts it. Anything done TO the app before that
      // assertion is the arrangement its `given` or `when` already names, and belongs in a
      // `beforeEach` there — otherwise every sibling criterion repeats it and the one line the spec
      // is about is buried.
      //
      // The DSL splits cleanly by name, which is what makes this checkable at all: an action is a
      // verb (`tap`, `hover`, `setBoardTo`), a query is not (`pieceAt`, `isSelected`). Adding an
      // action to the DSL means adding it here too — the list cannot be derived.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'CallExpression[callee.name="then"] CallExpression[callee.property.name=/^(tap|hover|resizeWindowTo|navigateToPage|setTo|set[A-Z].*To|startNewGame|pass|callBikjang|undo|redo)$/]',
          message:
            "Arrange in a beforeEach on the given or when, not inside a then. A criterion asserts; it does not set up.",
        },
      ],
      "no-restricted-imports": restrictedImports({
        // The janggi vocabulary is the point of `shared/`: a spec that names a piece type or a
        // setting should be checked against the same union the app is.
        allowedPackages: ["@janggi/shared"],
        paths: playwrightPackages.map(name => ({
          name,
          message: "Specs talk to the DSL, never to Playwright. Ask for what you need as a fixture instead.",
        })),
        patterns: [
          {
            // The mapping module itself is the one file specs may see; its neighbours are not.
            group: [
              "@src/acceptance-criteria-mapping/**",
              `!${acceptanceCriteriaMapping}`,
              "@src/dsl/**",
              "@src/tests/**",
            ],
            message: `A spec may import only '${acceptanceCriteriaMapping}' and '@src/shared/*'. Anything else belongs on the mapping's exports, or on the DSL reached through a fixture.`,
          },
        ],
      }),
    },
  },
  {
    // The mapping wires the DSL into Playwright, so it reaches down into `dsl/` — never back up.
    files: ["src/acceptance-criteria-mapping/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        patterns: [
          {
            group: ["@src/tests/**"],
            message: "Imports run tests -> acceptance-criteria-mapping -> dsl -> shared, never back up.",
          },
        ],
      }),
    },
  },
  {
    // The DSL knows about the app, and nothing about how tests are declared.
    files: ["src/dsl/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        patterns: [
          {
            group: ["@src/tests/**", "@src/acceptance-criteria-mapping/**"],
            message: "Imports run tests -> acceptance-criteria-mapping -> dsl -> shared, never back up.",
          },
        ],
      }),
    },
  },
  {
    // Playwright lives in `playwright/` folders and nowhere else. Every DSL object is a pair — the
    // `*Dsl` that says what a test may do, and the `*Playwright` beside it that drives the browser
    // — and this is what stops the halves growing back together: a locator, a click or a wait
    // outside a `playwright/` folder cannot even be written.
    //
    // `AcceptanceTestFixtures` is the one exception, and is exempt only because it is not under
    // `src/dsl/`: handing the browser to the DSL has to happen somewhere.
    files: ["src/dsl/**"],
    ignores: ["src/dsl/**/playwright/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        paths: playwrightPackages.map(name => ({
          name,
          message:
            "Only a `playwright/` folder may import Playwright. Put the locator work in the *Playwright beside this file and call it from here.",
        })),
        patterns: [
          {
            group: ["@src/tests/**", "@src/acceptance-criteria-mapping/**"],
            message: "Imports run tests -> acceptance-criteria-mapping -> dsl -> shared, never back up.",
          },
        ],
      }),
    },
  },
  {
    // The bottom of the stack: helpers more than one layer needs. Empty for now — the rule is here
    // ahead of the folder so the boundary exists the moment something is put in it.
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        allowedPackages: ["@janggi/shared"],
        patterns: [
          {
            group: ["@src/tests/**", "@src/acceptance-criteria-mapping/**", "@src/dsl/**"],
            message: "`src/shared/` is the bottom of the stack and may not import the layers above it.",
          },
        ],
      }),
    },
  },
];
