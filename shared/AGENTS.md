# AGENTS.md — shared

Two jobs: `config/` holds the base tool configuration every package extends, and `src/` holds what
more than one package needs.

## The janggi vocabulary

`src/janggi/` is the words the game is described in, and the reason it is here rather than in the
webapp is that **the acceptance tests need the same words**. A spec that asserts
`{side: "cho", type: "elephant"}` cannot typo either half; one that asserted `"cho-elphant"` would
compile, run, and quietly never match.

```
src/janggi/pieces/      Side, PieceType, Piece, PieceKey, and the two functions that convert
src/janggi/settings/    BoardStyleName, PieceSetName, SetupName, MovableHighlightName,
                        MatchFormat — the built-ins, by name
```

The settings unions are the **built-ins only**. A `BoardStyle`'s own `name` stays a plain string
because a user-authored style may be called anything; the union is what a built-in must be called,
so the webapp cannot ship one that is not listed and a spec cannot ask for one that does not exist.

**Vocabulary, not rules.** Types, names and the conversions between them belong here. The engine —
move generation, check detection, bikjang — does **not**, however tempting. `MatchFormat` is the
line drawn exactly: the two names a player picks between are vocabulary and live here, while what
casual and scored actually _do_ to a bikjang or a repetition is the engine's, in `webapp/src/game/`.
The reason is the one below: `acceptance-tests` can
import anything in this package, and a spec that recomputed its expected outcome from the same code
under test would agree with it no matter what either of them did. The engine needs a home the tests
cannot reach.

- **Change a lint/format/tsconfig/vitest rule here, not in a package.** Packages extend these files;
  editing a package copy makes the rule inconsistent.
- `src/` is consumed as raw TypeScript through the `exports` map — there is no build step. Do not
  add one.
- Anything here is imported as `@janggi/shared/<path>`.
- Pure functions and plain types only. Nothing that touches the DOM, Playwright, or Redux.
- **This package may not import any other workspace package** — it is the bottom of the dependency
  graph, and a lint error enforces that. If something here needs `webapp` or `acceptance-tests`, it
  does not belong in `shared`.
