# AGENTS.md — redux

Use `useAppSelector` / `useAppDispatch` from `@src/redux/Hooks`, never the untyped `react-redux`
hooks. Add state as a slice via `createSlice`.

## Conventions

- **A slice is wiring; what its actions mean lives beneath it.** A reducer says which rule an action
  runs and on what, and the rule itself is a plain function in a folder under the slice, with its own
  test beside it — `game/within-reach/`, `custom-styles/joining/`, `ratings/recording/`. A helper
  private to a slice file can only be reached by dispatching, which makes the case it covers hard to
  name and its edges hard to reach; the same function one folder down is testable directly. **State
  more than one section reads belongs in a slice, not in `useState` on the page** — `useState` is for
  what one component owns, like the piece in hand. Which sheet is up over the game, and the settings tab, are
  the `settings` slice — the button under the board, the sheets and the tour all open, close and turn them —
  and it is not kept on the device, a page opening with none up.
- **A fact the engine can work out is derived where it is shown, never stored.** Check, the winner and
  each army's score are not fields on `GameState` and not slices — `GameStatusOf.ts` asks the engine
  on every render and returns one discriminated union, and it relays the engine's own `outcomeOf`
  rather than deciding a result here, adding only the one state the engine has no opinion about — a
  general under attack while the game goes on. Storing any of it would mean a second copy of the
  position's truth to keep in step with the position.

  `playHasBegun` in `pages/game/utils/` is the same rule applied late: the store used to carry a
  `turnsTaken` counter to lock the setup pickers, and a counter that only ever climbs went wrong the
  moment a game could be taken back. It reads `played.past` instead, so it falls again as the game
  does.

- **The store holds the setup phase, not two loose setups.** `state.game.phase` is the engine's
  `SetupPhase` — the format and what each army has chosen, where "has not chosen" is a real state and
  not a default. A scored game sits in it until both have laid out, and while it does there is no game
  on the board: `isArranged` gates the board, Pass, Bikjang and Draw, and `canPlace` locks each picker. A
  casual game is dealt already arranged and never sits there, because the order is a regulation of
  official play (`docs/rules.md` §6.6). `redux/game/dealing/board-shown-for/BoardShownFor.ts` is the
  one seam worth knowing: a half-laid-out board still has to be drawn, so it stands `DEFAULT_SETUP` in
  for the army that has not chosen — a display decision that stays on this side of the line, since the
  engine refuses to know about a default.
- **The store holds a `PlayedGame`, not a `GameState`.** `state.game.played.present` is the position,
  and everything drawn takes that. The record beside it is what `UndoButton` and `RedoButton` act on,
  and those two are the only controls **not** gated on the game still being undecided — taking back
  the turn that ended a game is the ordinary reason to reach for one. `game/AGENTS.md` says why the
  engine keeps it that way.
- **A setting that is part of the game is dealt, not applied.** The two setups and the match format go
  through `dealtGame`, which starts a fresh game rather than changing the one under way, and all three
  pickers lock on `playHasBegun`. Contrast the board style, piece set, movable-piece mark, bikjang hint,
  effects, sound effects, music and the sheet's own opacity — preferences about how a game is drawn or
  heard, applied the moment they are chosen.
- **Preferences are stored by name.** `state.preferences` holds names, never style objects —
  `src/redux/` may not import `src/react/`, and a name is also what a picker shows, a spec asks for
  and storage keeps. The board style and piece set are plain strings, since either may name one of the
  player's own styles. `usePreferences` (`pages/game/hooks/use-preferences/`) is the one place a name
  becomes what it names — and where a locked or removed style falls back to the default — so read
  through it rather than selecting `state.preferences` directly.
  **Han's pieces are a name of their own only where the player chose them apart** (`hanPieceSet`,
  undefined otherwise): choosing a set dresses both armies, and `usePreferences` puts each army's set
  together with `combinedPieceSet` (`src/styles/piece-sets/`) — so what the board draws is still one
  `PieceSetStyle`, and `Piece` never learns there are two. **Han's board is the same** (`hanBoardStyle`,
  `combinedBoardStyle`, `src/styles/board-halves/`) — a board has no `sides.han`/`sides.cho` to take a
  whole half from at once the way a piece set's `sides` does, so `withHalfOf` writes Han's half out as
  explicit per-point overrides on Cho's board rather than filtering existing ones.
- **Progress is stored, not derived from the record.** `state.progress` is XP and the bot strengths
  each army has beaten, earned in `useRatedGame` alongside the rating. It is a number of its own
  because resetting the record must not take unlocks away, and because editing it by hand is a way to
  the Hacker theme the game means to leave open — `progressFrom` takes any amount. What XP opens is
  `UNLOCK_PRICES`. A bot rung opens off `openBotElos`, which climbs **four ladders kept apart** — each
  army in each format — one rung at a time: a strength opens only once the one beneath it has been
  beaten on that ladder, so a save naming a high rung with the lower ones missing climbs no further
  than the gap. A game not yet begun is never left set against a bot out of reach
  (`botKeptWithinReach`, on load and on `saveLoaded`), and choosing another army or format drops the
  strength the same way.
- **Saves and styles travel as keys, never through a server.** The codec and the save schema live in
  `@janggi/shared`, so the acceptance tests build keys with the app's own code. A key is
  `janggi-<save|board|pieces>:` and base64url JSON — plain and unsigned on purpose, so a player can
  decode and edit their own save. `state.customStyles` holds a player's imported and made styles.
  Everything pasted is checked all the way down by `BoardStyleFrom`/`PieceSetStyleFrom`, and
  `isCssValue` refuses any value that could load from elsewhere (`url(https://…)`, `image-set`) or
  climb out of its property: nobody moderates shared styles, so a style must not be able to fetch a
  picture or tell its author who is looking.
- **The bot's engine has a status of its own, and is not kept.** `state.botEngine` says whether the
  engine the page started is `idle`, `loading`, `ready` or `failed` (with why). `useBotEngine` starts it
  once the bot is the opponent, and `botEngineHoldsPlay` closes the board and the controls — with a notice
  over the board saying why — until it is `ready`, so no rated game can begin against a bot that never
  came. Retrying is the status going back to `idle`. It is left out of `keptOnTheDevice`'s list, being what
  this page has managed to start rather than part of a game.
- **Onboarding is kept, and a device that has been played on is never welcomed.** `state.onboarding` is the
  stage (`welcome`, `tour`, `done`) and the tour's step, so a reload comes back to where the player was and a
  skip is not undone. `loadOnboarding` treats a device with any other kept key but no onboarding one as
  `done`: people who played before there was a welcome are not greeted as strangers. The key and the "done"
  record are in `@janggi/shared` because the acceptance fixture keeps the same bytes to start every spec as
  a returning player. The steps are named (`TOUR_STEP_NAMES`), so the page's card for each is a record over
  them and the board can ask which is up.
- **The rest of the store is kept on the device.** `Store.ts` loads every other slice from `localStorage`
  and writes each back when it changes, so a closed page reopens on the same game, preferences and record.
  **What is read back is untrusted**: each slice has a loader under its own `storage/` that checks
  every field against the vocabulary it claims — `redux/untrusted/` — and falls back to a fresh start.
  The game is refused whole if any position fails (a crash in `applyMove` is what a half-trusted board
  buys); the ratings keep what they can. A new field on a slice needs its loader taught about it, and a
  change to a slice's shape needs its storage key's version raised. A style key somebody shares is a
  different matter — one from an older copy of the app still has to import — so `BoardStyleFrom` and
  `PieceSetStyleFrom` fill a missing new group with its default rather than refuse it.

## Testing

**One door is open, and only because it opens onto nothing new.** `redux/debug/` lets a posted message
set the player's progress — `{janggi: "debug", progress: {xp: 640}}` — and `VITE_DEBUG_XP` does the
same at startup (`webapp/AGENTS.md` has the exact command form). A save key already does all of it,
being plain, unsigned and pasteable by design, so this hands a player nothing they did not have; what
it saves is the sheet and the typing, which is why the acceptance fixture opens every spec at a million
XP through it rather than pasting a key before each one. **It is a door onto what a player has
_earned_, never onto the game itself** — no spec may use it to stand a position up or skip a screen,
and the save box it stands in for keeps its own criteria in
`acceptance-tests/src/tests/progress/MovingYourProgress.test.ts`. It is left in the production build
on purpose: a spec then behaves the same against the dev server, a preview build and the deployed
site, and CI runs it against all three.
