# The `data-testid` contract, written out

Locate by `data-testid` — that attribute is the contract with the webapp. Rename any of these in the
webapp and specs break. Listed rather than counted, because a count of them went stale twice while it
was being kept. See `AGENTS.md` in this folder for how the DSL locates by these.

- **`data-testid`, fixed** — `board`, `turn`, `piece`, `settings`, `elephant-pairing`, `result`,
  `guide`, `guide-play`, `guide-install`, `guide-rules-source`, `guide-fairy-stockfish-source`,
  `guide-piece-style-traditional`, `guide-piece-style-hangul`, `guide-piece-style-modern` and
  `guide-movement-destination`; `record` (the record sheet, `inert` while closed) with `record-elo`
  carrying `data-elo`; and the
  controls `new-game`, `result-new-game`, `pass`, `bikjang`, `undo`, `redo`, `settings-open`,
  `settings-close`, `settings-install`, `record-open`, `record-close`, `record-reset`, `guide-open`,
  `references-open`,
  and the question reset opens, `record-reset-confirm` and `record-reset-cancel`. The progress section:
  `progress-xp` and `progress-next-unlock` carrying `data-xp`, `progress-xp-bar` carrying `data-percent`
  (absent once everything is unlocked), `save-copy` and the `save-key` it shows,
  and `save-load-input`, `save-load-submit` and `save-load-message` carrying `data-accepted`. The styles
  sheet: `styles` (`inert` while closed), `styles-open`, `styles-close`, `style-import-input`,
  `-submit` and `-message` (`data-accepted`), and the editor's `style-editor-kind`, `-from`, `-name`,
  `-json`, `-save` and `-message` (`data-accepted`), or `style-editor-locked` in their place. On the
  result, `result-xp` carrying `data-xp`, `result-xp-bar` carrying `data-percent`, `result-unlocked` and,
  shown only when a bikjang decided the game, `result-explanation` carrying `data-called-by`. On
  `pass`, `bikjang`, `undo` and `redo` the `disabled` attribute is part of the contract: they are
  disabled rather than hidden. `move-flight` and `impact` are drawn over the board only while motion
  is shown, and only the effects specs look for them. `bot-go-ahead` and `repetition-notice` are
  drawn over the board too, each shown only while its own condition holds.
- **`data-testid`, composed** — `cell-f<file>r<rank>`; `score-<side>`, `taken-<side>` and
  `plaque-<side>`, whose `plaque-player-<side>` carries `data-player` and `data-elo`, whose
  `plaque-xp-<side>` carries `data-xp` and whose `plaque-next-unlock-<side>` shows the army's next
  unlock (the player's own plaque only, and the words are shortened — read the attribute);
  `record-tab-<format>` and `record-row-<elo>`, a row carrying `data-played`,
  `data-won`, `data-drawn` and `data-lost`; and `<id>-picker` with an `<id>-option-<slug>` for each
  option. The eleven picker ids are `board-style`, `piece-style`, `movable-highlight`, `bikjang-hint`,
  `match-format`, `opponent`, `bot-strength`, `your-side`, `han-setup`, `cho-setup` and `effects`. A
  picker that explains itself — `match-format` and `bikjang-hint` — adds an `<id>-explain` toggle, never disabled, and
  an `<id>-explanation` panel present only while unfolded. A picker of two options is a row of buttons, the chosen one carrying
  `aria-pressed`; one of more is a native `<id>-select`, whose `<option>`s carry the option ids and
  are chosen and read by their `value` — a locked option's text carries a padlock and a reason, its
  `value` never does. A locked option carries `data-locked`. Grow a picker past two options and its
  `*Playwright` must switch shape. Each of the player's own styles is a `custom-style` row carrying
  `data-kind` and `data-name`, holding `custom-style-copy`, `custom-style-key` and
  `custom-style-delete`. The two volumes, `sound-effects` and `music`, are an `<id>-volume` range input and an
  `<id>-mute` button whose `aria-pressed` is what "muted" means to a spec.
- **On a piece** — `data-piece`, written `<side>-<type>` and parsed back into a `Piece` by
  `@janggi/shared`. The pieces in a `taken-<side>` tray carry it too.
- **On a cell** — `aria-pressed` (the piece in hand), `data-can-move-to` (a legal destination),
  `data-can-be-moved` (a piece its owner may move now; the value is the emphasis, `full` or `faint`,
  and no spec asserts on which), `data-covered` (a point the piece in hand would land on a piece of
  its own army), `data-last-move` (`from` or `to`; `getLastMove` reads the two cells' ids back into a move), and `data-under-attack` and
  `data-attacking` (the general in check, and each piece giving it). A destination where the move would
  leave the opponent a bikjang to call holds a `bikjang-risk` label reading 빅장 — text, so the question
  reads the word a player sees and not a flag beside it.
- **On the turn line** — `data-side` always, plus `data-in-check`, `data-winner`, `data-drawn`,
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
- **On a settings section** — every folding section in the sheet is a `settings-section` carrying
  `data-section` with its title, and a `settings-section-toggle` folds and unfolds it — the fold
  behaviour `inSheet` drives (see the DSL `AGENTS.md`) is these two.
- **On the Janggi guide** — `guide-piece-<type>` is an expandable movement card, and `guide-section`
  is every top-level section of the reading page. `guide` wraps the page and carries
  `data-guide-ready` once it has finished rendering, `guide-play` is its primary route into the game,
  and `guide-install` is shown only when a phone browser offers to save it. Its link in Settings is
  `guide-open`.

The turn line's attributes are written by `TurnIndicator` from `gameStatusOf()`; nothing stores them.
`BoardPlaywright` composes the cell id to find a piece.

**An attribute that is absent and an element that is absent read the same.** A DSL question reading
`data-pairing` off a missing element gets "no pairing", which is indistinguishable from a blank row
being drawn — which is exactly how a mutation that always rendered the pairing line failed to fell
anything. Where that matters, add an `is…Shown()` question beside the value one.
