import {baseConfig, restrictedImports} from "@janggi/shared/config/eslint.base.js";

const acceptanceCriteriaMapping = "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

export default [
  ...baseConfig({allowedPackages: ["@janggi/shared"]}),
  {
    // Specs see the mapping and `src/shared/` — nothing else. That keeps them readable as acceptance
    // criteria and stops them reaching into the DSL, or Playwright, behind the mapping's back.
    files: ["src/tests/**"],
    rules: {
      "no-restricted-imports": restrictedImports({
        paths: [
          {
            name: "@playwright/test",
            message: "Specs talk to the DSL, never to Playwright. Ask for what you need as a fixture instead.",
          },
          {
            name: "playwright",
            message: "Specs talk to the DSL, never to Playwright. Ask for what you need as a fixture instead.",
          },
          {
            name: "playwright-core",
            message: "Specs talk to the DSL, never to Playwright. Ask for what you need as a fixture instead.",
          },
        ],
        patterns: [
          {
            // The mapping module itself is the one file specs may see; its neighbours are not.
            group: [
              "@src/acceptance-criteria-mapping/**",
              `!${acceptanceCriteriaMapping}`,
              "@src/dsl/**",
              "@src/tests/**",
            ],
            message: `A spec may import only '${acceptanceCriteriaMapping}' and '@src/shared/*'. Anything else belongs on the mapping's exports, or on a page object reached through a fixture.`,
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
    // Page objects and components: they know about the app, and nothing about how tests are declared.
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
