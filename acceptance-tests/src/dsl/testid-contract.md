# The `data-testid` contract, written out

Locate by `data-testid` — that attribute is the contract with the webapp. Rename any of these in the
webapp and specs break. Listed rather than counted, because a count of them went stale twice while it
was being kept. See `AGENTS.md` in this folder for how the DSL locates by these.

- **`data-testid`, fixed** — `board`, `turn`, `piece`, `settings`, `elephant-pairing`, `result`,
  `guide`, `guide-play`, `guide-install`, `guide-rules-source`, `guide-fairy-stockfish-source`,
  `guide-piece-style-traditional`, `guide-piece-style-hangul`, `guide-piece-style-modern` and
  `guide-movement-destination`; `record` (the record sheet, `inert` while closed) with `record-elo`
  carrying `data-elo`; and the
  controls `new-game`, `result-new-game`, `pass`, `bikjang`, `draw`, `undo`, `redo`, `settings-open`,
  `settings-close`, `settings-install`, `record-open`, `record-close`, `record-reset`, `guide-open`,
  `references-open`,
  and the question reset opens, `record-reset-confirm` and `record-reset-cancel`. The progress section:
  `progress-xp` and `progress-next-unlock` carrying `data-xp`, `progress-xp-bar` carrying `data-percent`
  (absent once everything is unlocked), `save-copy` and the `save-key` it shows,
  and `save-load-input`, `save-load-submit` and `save-load-message` carrying `data-accepted`. The styles
  sheet: `styles` (`inert` while closed), `styles-open`, `styles-close`, `style-import-input`,
  `-submit` and `-message` (`data-accepted`), and starting one of their own: `style-editor-locked` where
  XP has not unlocked it, or `style-editor-kind`, `-from` and `-start` where it has — the editor itself,
  once started, has its own entry below ("Making a style"). On the
  result, `result-xp` carrying `data-xp`, `result-xp-bar` carrying `data-percent`, `result-unlocked` and,
  shown only when a bikjang or a repetition decided the game, `result-explanation` (carrying
  `data-called-by` for a bikjang). On `pass`, `bikjang`, `draw`, `undo` and `redo` the `disabled` attribute is part of
  the contract: they are disabled rather than hidden. `move-flight` and `impact` are drawn over the
  board only while motion is shown, and only the effects specs look for them. `bot-go-ahead`,
  `repetition-notice`, `draw-offer` (carrying `data-offered-by`, with `draw-accept` and `draw-decline`
  inside it) and `draw-declined` (carrying `data-declined-by`) are drawn over the board too, each
  shown only while its own condition holds. `board-bottom-surface` is Cho's half of the surface,
  painted over the board's own; the style editor's preview has no half to draw, so it never renders one.
- **`data-testid`, composed** — `cell-f<file>r<rank>`; `score-<side>`, `taken-<side>` and
  `plaque-<side>`, whose `plaque-player-<side>` carries `data-player` and `data-elo`, whose
  `plaque-xp-<side>` carries `data-xp` and whose `plaque-next-unlock-<side>` shows the army's next
  unlock (the player's own plaque only, and the words are shortened — read the attribute);
  `record-tab-<format>` and `record-row-<elo>`, a row carrying `data-played`,
  `data-won`, `data-drawn` and `data-lost`; and `<id>-picker` with an `<id>-option-<slug>` for each
  option. The picker ids are `board-style`, `piece-style`, `movable-highlight`, `bikjang-hint`,
  `match-format`, `opponent`, `bot-strength`, `your-side`, `han-setup`, `cho-setup` and `effects`.
  `board-style` and `piece-style` can each split apart into one picker per army —
  `han-board-style`/`cho-board-style` and `han-piece-style`/`cho-piece-style` — behind an `<id>-split`
  toggle (`aria-pressed` is whether it's split); split or not, the combined picker keeps its own id
  and shows Cho's choice. A picker that explains itself — `match-format` and `bikjang-hint` — adds an
  `<id>-explain` toggle, never disabled, and
  an `<id>-explanation` panel present only while unfolded. A picker of two options is a row of buttons, the chosen one carrying
  `aria-pressed`; one of more is a native `<id>-select`, whose `<option>`s carry the option ids and
  are chosen and read by their `value` — a locked option's text carries a padlock and a reason, its
  `value` never does. A locked option carries `data-locked`. Grow a picker past two options and its
  `*Playwright` must switch shape. Each of the player's own styles is a `custom-style` row carrying
  `data-kind` and `data-name`, holding `custom-style-copy`, `custom-style-key` and
  `custom-style-delete`. The two volumes, `sound-effects` and `music`, are an `<id>-volume` range input and an
  `<id>-mute` button whose `aria-pressed` is what "muted" means to a spec. The settings sheet's own
  opacity is the same range-input shape, without a mute: `sheet-opacity`.
- **On a piece** — `data-piece`, written `<side>-<type>` and parsed back into a `Piece` by
  `@janggi/shared`. The pieces in a `taken-<side>` tray carry it too.
- **On a cell** — `aria-pressed` (the piece in hand), `data-can-move-to` (a legal destination),
  `data-can-be-moved` (a piece its owner may move now; the value is the emphasis, `full` or `faint`,
  and no spec asserts on which), `data-covered` (a point the piece in hand would land on a piece of
  its own army), `data-last-move` (`from` or `to`; `getLastMove` reads the two cells' ids back into a move), and `data-under-attack` and
  `data-attacking` (the general in check, and each piece giving it). A destination where the move would
  leave the opponent a bikjang to call holds a `bikjang-risk` label reading 빅장 — text, so the question
  reads the word a player sees and not a flag beside it.
- **On the turn line** — `data-side` always, plus `data-in-check`, `data-winner`, `data-drawn` (the
  `DrawnBy` word: `bikjang`, `repetition` or `agreement`),
  `data-laying-out`, `data-bot-loading` and `data-bot-unavailable` (the bot's engine is still being
  started, or could not be — both **beside** `data-bot-to-move`, never in place of it, so a wait for the
  bot cannot pass before it has played) and `data-bot-to-move`, each present only while it applies.
  Over the board the engine's notice is `bot-engine-notice`, with `bot-engine-loading`,
  `bot-engine-reason` and the `bot-engine-retry` button. `waitForTheBot` waits on `data-bot-to-move`,
  and `waitForTheBotToLoad` on `data-bot-loading`.
- **On a score** — `data-score`, that army's score with the 덤 folded in. The words beside it roll to
  a new value with motion on; the attribute never does.
- **On the pairing line** — `data-pairing`.
- **On the references page** — `references`, `references-repository`,
  `references-<section>-jump`, `references-<section>-heading`, and `reference-<source>`. Its link in
  Settings is `references-open`.
- **On the release notice** — `release-update`, `release-update-refresh` and `release-update-later`.
- **On a settings tab** — the sheet is divided into tabs, each a `settings-tab` carrying `data-tab`
  with its label and `aria-selected`, and each pane is a `settings-pane` carrying `data-pane` with the
  same label, `hidden` unless its tab is showing. The tab-switching `inSheet` drives (see the DSL
  `AGENTS.md`) is these two. In the Game pane, `setup-army-han` and `setup-army-cho` are the
  `aria-pressed` buttons choosing which army's setup grid is showing.
- **On the Janggi guide** — `guide-piece-<type>` is an expandable movement card, and `guide-section`
  is every top-level section of the reading page. `guide` wraps the page and carries
  `data-guide-ready` once it has finished rendering, `guide-play` is its primary route into the game,
  and `guide-install` is shown only when a phone browser offers to save it. Its link in Settings is
  `guide-open`.
- **Making a style** — `style-editor` wraps the whole editor, on a board of its own. At the top,
  `style-editor-back`, `-name`, `-save` and `-message` (`data-accepted`); `style-editor-controls` and
  `style-editor-raw` (`aria-pressed`) choose what is shown beneath — the controls, or
  `style-editor-json` and `-raw-message` for the raw JSON. `style-editor-companion` picks what the
  preview is shown against; `style-editor-target` names what the controls are changing, with
  `style-editor-target-reset` once a single point or piece has a style of its own; and
  `style-editor-tools` folds away `style-editor-reset`, `style-editor-copy-from`,
  `style-editor-copy-scope`, `style-editor-copy`, and a key box of its own
  (`style-editor-import-input`/`-submit`/`-message`). The board is `style-preview` — a `BoardGrid`
  whose cells carry the same `cell-f<file>r<rank>` ids the real board's do — `style-preview-marked`
  rings the point or piece in question, and `style-preview-scene-<name>` switches the position it is
  shown in (`opening`, `hints`, `check` or `bikjang`). Every value inside the controls carries
  `style-control-<id>`: a colour (plus `-alpha` where it may be translucent, or `-plain` to drop typed
  CSS back to a plain one), a number (plus `-slider`), a choice (`style-control-<id>-<option>`), a
  switch, typed text, or, for a piece's own drawing, `style-control-pictograph-<type>` with a
  `-message` beside it for a file refused.

The turn line's attributes are written by `TurnIndicator` from `gameStatusOf()`; nothing stores them.
`BoardPlaywright` composes the cell id to find a piece.

**An attribute that is absent and an element that is absent read the same.** A DSL question reading
`data-pairing` off a missing element gets "no pairing", which is indistinguishable from a blank row
being drawn — which is exactly how a mutation that always rendered the pairing line failed to fell
anything. Where that matters, add an `is…Shown()` question beside the value one.
