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
                        MatchFormat, ElephantPairing, StyleKind — the built-ins, by name
src/janggi/share-keys/  the share key codec: `janggi-<kind>:` and base64url JSON
src/janggi/progress/    the four ladders a player climbs, and the JSON a save key carries
```

**A wire contract is shared on purpose — a tool, not a rule.** The line below keeps behaviour out of
here, so a spec cannot agree with the code it tests. A format is different: the share key codec and the
save schema are what the app and the specs must both speak, and two copies of a format are only two
chances to drift apart. So the app writes and reads keys with `share-keys/`, and the acceptance tests
build theirs with the same functions against the same `SaveKeyJson` — a field renamed here fails to
compile in every package at once. Reach for it where the thing is a contract between packages, not
wherever code happens to repeat.

**Within `shared`, one folder reaches another by the package's own name** —
`@janggi/shared/janggi/settings/BotElo` — and a sibling as `./X.js`. `../` is refused everywhere, and an
`@src` alias cannot work here: this package is compiled as raw source by whichever package imports it,
so `@src` would resolve into that package's tree.

The settings unions are the **built-ins only**. A `BoardStyle`'s own `name` stays a plain string
because a user-authored style may be called anything; the union is what a built-in must be called,
so the webapp cannot ship one that is not listed and a spec cannot ask for one that does not exist.

`ElephantPairing` is the one entry here that names something nobody picks: 맞상 and 엇상 are read
off the two chosen setups rather than chosen themselves. It is here for the same reason as the rest
— a line under the pickers shows the name and a spec asserts it — while `elephantPairingOf`, which
decides which of the two a board has come to, stays in the engine.

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
