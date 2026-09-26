# AGENTS.md — shared

Two jobs: `config/` holds the base tool configuration every package extends, and `src/` holds what
more than one package needs.

## The janggi vocabulary

`src/janggi/` is the words the game is described in, here rather than in the webapp because **the
acceptance tests need the same words** — a spec that asserted `"cho-elphant"` instead of
`{side: "cho", type: "elephant"}` would compile, run, and quietly never match.

```
src/janggi/pieces/      Side, PieceType, Piece, PieceKey, and the two functions that convert
src/janggi/settings/    BoardStyleName, PieceSetName, SetupName, MovableHighlightName, BikjangHintName,
                        MatchFormat, ElephantPairing, StyleKind — the built-ins, by name
src/janggi/results/     DrawnBy — the three ways a casual game is drawn, named by the turn line and the specs
src/janggi/share-keys/  the share key codec: `janggi-<kind>:` and base64url JSON
src/janggi/progress/    the four ladders a player climbs, and the JSON a save key carries
src/janggi/onboarding/  the welcome's and tour's stages and targets, and the storage key and "done" record
                        the acceptance tests keep for a returning player
```

**A wire contract is shared on purpose — a tool, not a rule.** Two copies of a format (the share-key
codec, the save schema) are two chances to drift apart, so the app and the acceptance tests build keys
with the same functions against the same `SaveKeyJson`. Reach for `shared` where the thing is a
contract between packages, not wherever code happens to repeat — behaviour belongs in the engine (see
the vocabulary-vs-rules split below), not here.

**Within `shared`, one folder reaches another by the package's own name** —
`@janggi/shared/janggi/settings/BotElo` — and a sibling as `./X.js`. `../` is refused everywhere, and
an `@src` alias cannot work here: this package is compiled as raw source by whichever package imports
it, so `@src` would resolve into that package's tree.

The settings unions are the **built-ins only**. A `BoardStyle`'s own `name` stays a plain string
because a user-authored style may be called anything; the union is what a built-in must be called, so
the webapp cannot ship one that is not listed and a spec cannot ask for one that does not exist.
`ElephantPairing` is the one entry here that names something nobody picks — 맞상/엇상 are read off the
two chosen setups, not chosen themselves — but it is vocabulary for the same reason as the rest: a
line under the pickers shows the name and a spec asserts it, while `elephantPairingOf`, which decides
which of the two a board has come to, stays in the engine.

**Vocabulary, not rules.** Types, names and the conversions between them belong here. The engine —
move generation, check detection, bikjang — does **not**, however tempting. `MatchFormat` is the line
drawn exactly: the two names a player picks between are vocabulary and live here, while what casual
and scored actually _do_ to a bikjang or a repetition is the engine's, in `webapp/src/game/`.
`acceptance-tests` can import anything in this package, and a spec that recomputed its expected
outcome from the same code under test would agree with it no matter what either of them did — the
engine needs a home the tests cannot reach.

- **Change a lint/format/tsconfig/vitest rule here, not in a package.** Packages extend these files;
  editing a package copy makes the rule inconsistent.
- `src/` is consumed as raw TypeScript through the `exports` map — there is no build step. Do not add
  one.
- Anything here is imported as `@janggi/shared/<path>`.
- Pure functions and plain types only. Nothing that touches the DOM, Playwright, or Redux.
- **This package may not import any other workspace package** — it is the bottom of the dependency
  graph, and a lint error enforces that. If something here needs `webapp` or `acceptance-tests`, it
  does not belong in `shared`.
