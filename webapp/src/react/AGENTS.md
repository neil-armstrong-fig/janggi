# AGENTS.md — react

Components, nested by who uses them, following the locality rule from the root `AGENTS.md`. The same
folder set recurses at every level, and a folder only appears once something needs it:

```
src/react/
  App.tsx                    the shell — routing and providers
  pages/<page>/<Page>.tsx
    components/<thing>/<Thing>.tsx
      components/            components only <Thing> renders, each in its own folder
      hooks/<use-thing>/<UseThing>.ts   hooks only <Thing> calls, types/ and utils/ beneath it
      <subject>/             plain functions on one subject — intersections/ has
                              movable-pieces/, last-move/ and motion/
      types/  utils/         utils/ is the last resort: a plain function no subject claims
```

**A hook gets its own folder exactly as a component does.** Anything shared by two siblings moves up
to the folder that contains them both, and no higher: `cuesFor`, called by `useGameAudio` and
`useHaptics`, sits in `pages/game/hooks/utils/`.

**A page is divided into sections before it is divided into components.** `pages/game/` is `Status`,
`Board`, `Settings` and `RecordSheet`, and every control lives under whichever draws it —
`status/components/controls/components/pass-button/`, `settings/components/option-picker/`. That
matches how `acceptance-tests/` already names the page, whose DSL is `components/{board,settings,status}`
— split or rename a section on one side and do the same on the other. Reach for a new section when a
page grows a region that is genuinely its own, not to file loose components.

`Status` **frames** the board rather than sitting above it: handed the board as `children`, it puts
Han's plaque above and Cho's below, the herald under Han's and the controls under Cho's. The frame is
layout only — each part reads and dispatches for itself, and their shared question about what the
game is doing goes through `useGameStatus`. `Settings` is the same shape; whether the sheet is open is
`GamePage`'s state, since the button that opens it is drawn by `Status`.

`Settings` is divided into tabs, and `settings/tabs/<tab>-pane/` holds each one: its root
(`GamePane.tsx`) and whatever only that tab uses, in the same `components/`, `locks/` and `utils/`
folders as anywhere else. What two tabs share (`option-picker/`, `settings-pane/`, `explanation-toggle/`)
sits in `settings/components/`, and what a tab shares with a sibling sheet rises to `pages/game/components/`
(`paste-key/`, which the Progress tab and the styles sheet both use).

Naming a folder for its subject rather than its shape bites here in one particular way: Tailwind means
presentation lives in the JSX, so a folder called `styles/` reads as CSS and is almost always wrong —
`board/cell-styles/` and `board/piece-styles/` hold the data describing how cells and pieces are
painted, and say so.

## Conventions

- **Mobile first.** This is played on phones; touch is the primary input. Assume a small viewport and
  check any layout work against the `mobile` acceptance-test project.
- **React owns the whole interactive page.** An HTML entry contains metadata and one root; render one
  component tree into it. Do not progressively enhance hand-written page markup with `querySelector`,
  `addEventListener` or several React roots. If search engines need the initial HTML, render and
  hydrate that same component tree rather than keeping a second copy of its markup.
- **Use Tailwind in components for page and component presentation.** Add CSS only for genuinely
  global rules, shared theme tokens or behaviour Tailwind cannot express cleanly — never a page-sized
  stylesheet alongside JSX.
- **No negative margins.** A note or bar that belongs with its neighbour is grouped with it in its own
  `flex flex-col` container with the tighter `gap-*`, rather than pulled up with `-mt-*` against the
  parent's gap. Widen a tap target with an `after:` pseudo-element, not padding taken back by `-m-*`.
- **Every component gets its own file, in its own folder** — `components/<thing>/<Thing>.tsx` — no
  matter how small it is or how few callers it has. This is the one place the root `AGENTS.md` rule
  about declaring functions below their callers does not apply: that's for plain functions. Inline a
  component only where extracting it would be actively misleading, and leave a comment saying why.
- **A component's props interface is called `Props`, and is not exported.** A generic component
  constrains it against a named type rather than an inline one — `Props<Option extends WithName>`,
  never `Option extends {name: string}`.
- **Every element an acceptance test needs gets a `data-testid`.** That attribute is the contract with
  `acceptance-tests/` — renaming one breaks specs.
- **A component reads what it draws from the store and dispatches what it does for itself.** A section
  such as `Status` or `Settings` is layout, not a place to select a dozen values and thread them down.
  Where several siblings ask the same derived question, one hook keeps their answer together
  (`useGameStatus`) rather than restoring the prop tunnel at their parent. Props carry only what the
  store does not hold: page-owned sound/sheet state; a `GameMoment`; a component's coordinated
  animation state; identity, such as which side a plaque draws; and whatever differs from one instance
  of a generic or repeated component to the next (`OptionPicker`, `VolumeSlider`, `Cell`, `Piece`,
  `ResultBanner`) — a `Cell`'s marks are worked out once from the whole board and handed down a point
  at a time. What is the same for every instance and held by the store, the player's preferences, a
  component repeated by only one parent reads itself (`Cell` wears the styles), rather than being
  handed it 90 times. Do not make a generic leaf used in several places (`Piece`) know the application
  store just to save its callers a prop.
- **Something a player does that touches no intersection is a control, not a gesture.** Resting a turn,
  calling a bikjang and offering a draw are the three, so `PassButton`, `BikjangButton` and `DrawButton`
  sit in `Status`, in the row under the board — each enabled off a pure question the engine answers
  (`canPass`, `canCallBikjang`, `canAgreeADraw`), and disabled rather than hidden so the row does not
  reflow under a thumb. A draw is a question to the other player, so what follows the tap — Accept and
  Decline between two people, a note where the bot declined — is drawn by `BoardOverlay`.
- **Motion and sound key off one moment.** `useGameMoment` compares the record the page last drew with
  the one it holds now, through the engine's `changeBetween`, and hands out a `GameMoment` whose `id`
  changes once per change. The board's flights, the ending shake, the sound and the haptics all read
  that one moment and remember the last id they answered, so none runs twice and none can disagree
  about what the change was. Nothing dispatches an event.

  **What that moment sounds like is decided here, not in `src/audio/`.** `cuesFor`
  (`pages/game/hooks/utils/`, also used by `useHaptics`) turns it into cues, and `moodOf`
  (`use-game-audio/`) turns the position into a mood — the director only plays what it is handed. A
  new sound for a new rule is a change to `cuesFor` only.

- **A blank line between sibling JSX elements.** Two elements pressed together read as one block; a
  line between them makes the structure visible at a glance. Prettier **preserves** these but will
  never add one, and nothing in the toolchain can insert them — `@eslint-react` has no stylistic
  rules, and the legacy `eslint-plugin-react` (which has `jsx-newline`) is deliberately not used. This
  is on you.
- **Two conditionals rather than a ternary** when picking between JSX elements — a ternary forces a
  reader to hold both branches at once. A discriminated union narrows correctly in each branch, so
  nothing is lost. A ternary is still right for a value (a class name, a colour), just not for
  choosing a component.

## Decided against

Written down so it is not re-opened as though it were an oversight.

- **Keyboard navigation.** Mouse and touch are the interaction model here. A consequence worth knowing
  before you "fix" it: a board cell is a `<button>`, and an occupied one takes its accessible name
  from the piece's own `aria-label`, so an **empty cell is a button with no accessible name**. That is
  known and accepted, not a defect.

`board/AGENTS.md` has one more of these, about visual regression testing.
