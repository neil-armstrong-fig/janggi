import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export const ignores = ["**/build/**", "**/dist/**", "**/dev-dist/**", "**/coverage/**", "**/screenshots/**"];

const workspaceScope = "@janggi";

// Reach for the `@src/*` alias instead of climbing out of a folder. Same-folder `./x` is fine.
// This is also what makes the workspace boundary below airtight: with `../` unavailable, the only
// way into another package is by its name, which the boundary pattern covers.
const noParentImports = {
  group: ["../*"],
  message: "Import via the '@src/*' alias rather than a relative path out of this folder.",
};

/**
 * Builds the `no-restricted-imports` rule, always including the workspace boundary.
 *
 * Flat config replaces a rule outright rather than merging it, so any override that needs extra
 * restrictions must be built here too — declaring `no-restricted-imports` directly in an override
 * silently drops the boundary for those files.
 *
 * @param allowedPackages workspace packages this code may import; everything else in the scope is
 *   denied, so a package added later is denied by default rather than quietly allowed.
 */
export function restrictedImports({allowedPackages = [], paths = [], patterns = []} = {}) {
  const permitted = allowedPackages.flatMap(name => [`!${name}`, `!${name}/**`]);

  const workspaceBoundary = {
    group: [`${workspaceScope}/*`, ...permitted],
    message:
      allowedPackages.length > 0
        ? `This package may only import ${allowedPackages.join(", ")} from the workspace.`
        : "This package may not import other workspace packages.",
  };

  return ["error", {paths, patterns: [noParentImports, workspaceBoundary, ...patterns]}];
}

/** The rules every package in the workspace shares. */
export function baseConfig({allowedPackages = []} = {}) {
  return tseslint.config(
    {ignores},
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        globals: {
          ...globals.es2022,
          ...globals.node,
        },
      },
      rules: {
        eqeqeq: ["error", "smart"],
        "no-multiple-empty-lines": ["error", {max: 1}],
        "no-console": ["warn", {allow: ["warn", "error"]}],
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/explicit-function-return-type": ["error", {allowExpressions: true}],
        "@typescript-eslint/explicit-module-boundary-types": ["error", {allowArgumentsExplicitlyTypedAsAny: true}],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern: "^_", varsIgnorePattern: "^_"}],
        "no-restricted-imports": restrictedImports({allowedPackages}),
      },
    },
    // Config files and build scripts are plain modules rather than app source. The TypeScript rules
    // below do not apply to them — and in a `.mjs` file cannot be satisfied at all, since a return
    // type annotation is not legal JavaScript.
    {
      files: ["*.{js,mjs,ts}", "config/**/*.{js,mjs,ts}", "scripts/**/*.{js,mjs,ts}"],
      rules: {
        "no-restricted-imports": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
    prettierConfig,
  );
}
