# AGENTS.md — shared

Two jobs: `config/` holds the base tool configuration every package extends, and `src/` holds code
used by more than one package.

- **Change a lint/format/tsconfig/vitest rule here, not in a package.** Packages extend these files;
  editing a package copy makes the rule inconsistent.
- `src/` is consumed as raw TypeScript through the `exports` map — there is no build step. Do not
  add one.
- Anything here is imported as `@janggi/shared/<path>`.
- Pure functions only. Nothing that touches the DOM, Playwright, or Redux belongs here.
- **This package may not import any other workspace package** — it is the bottom of the dependency
  graph, and a lint error enforces that. If something here needs `webapp` or `acceptance-tests`, it
  does not belong in `shared`.
