# AGENTS.md — board

Two style systems, the same shape, side by side:

```
cell-styles/     how an intersection is painted — BoardStyle over CellStyle
piece-styles/    how a piece is painted — PieceSetStyle over PieceStyle
  builtin/       one folder per set, each with its own marks/ beside it
```

Both are **plain data**: a default plus a map of per-position or per-piece overrides, with one
component that turns that data into pixels.

## Marks and motion

A cell can carry **several marks**, and none of them is a `CellStyle` field — a board style is plain
data a user may author, and whose turn it is has no business written into one. They are overlay
elements in `Cell`: `MovableMark` rings a piece its owner may move this turn, the selected wash fills
the cell of the piece in hand, `MoveHint` puts a dot or a ring where that piece may go — and writes a
small 빅장 on it where the move would leave the opponent a bikjang to call (`canCallBikjangAfter`, so
the format's own answer) — `CoverHint` a dashed ring on each own-army piece the piece in hand would
land on, `LastMoveMark` brackets the last move's two points, and `ThreatMark` rings a general in check
and each attacker. Two are switchable. `MovableMark` has the "Movable pieces" picker, since in the
opening it marks most of an army, and earns itself in check and against a pin. The 빅장 label has
"Bikjang hint", and is offered only against a person at the same device or the 800 and 1000 bots — a
teaching aid, so `bikjangHintShown` decides it from the preference _and_ the opponent, and the
stronger bots never get it whatever the picker says.

**Marks are information; motion is an effect.** A mark is drawn regardless of motion state; motion
(a flight, a capture landing, a shake, a deal, a lift, a rolling score, a haptic buzz) is drawn only
while `effects.full` — the default acceptance projects run with effects reduced and assert on marks,
and the specs under `acceptance-tests/src/tests/effects/` assert on motion. Motion is drawn **over**
the cells, as overlays inside the grid or a piece's own wrappers, never by moving a cell — every cell
stays exactly where the game says it is, and a tap mid-flight lands on the point under it.

A mark's _colours_ may still belong to the board — whether it is drawn never does. The last move is
the case: a `BoardStyle` carries `lastMove` (`LastMoveStyle` has why), because one warm wash vanished
into Classic's pale wood, and a wash alone is hidden under the piece that arrived — the brackets sit
in the corners, the one part of a cell no piece set reaches.

## Rendering gotchas and style contract

**The cell `<svg>` is `preserveAspectRatio="none"`**, so it stretches with the cell and a `<circle>`
inside it comes out an ellipse — that's why `Piece` and `MoveHint` use a square overlay `div` rather
than another svg element; anything that must stay round has to sit outside it.

`MovableMark` is a **ring at the edge of the cell, not a disc behind the piece** — a disc was tried
first and the modern sets killed it, their pieces being discs of nearly the same size, so the mark
was hidden by the thing it marked. A set may draw a piece at up to 0.94 of the cell.

Everything a style needs travels inside the style, including the marks — a `CharacterGlyphStyle`
carries its own `CharacterSet`, a `PictographGlyphStyle` its own `PictographSet`, so the renderer
never needs to know hanja or hangul exist, and a set someone writes can bring its own writing or
drawings without a code change.

Built-ins are named from the unions in `@janggi/shared/janggi/settings/`; renaming or dropping one
breaks the acceptance tests at compile time. Each also needs a price in `UNLOCK_PRICES` (won't compile
without one), and `BuiltInStyles.test.ts` holds every built-in to the check an imported style must
pass.

A set's marks live in a `marks/` folder beside it, except where sets share one (several write the
same hanja or hangul) — those rise to `builtin/marks/` and no further. `builtin/modern/marks/JanggiPictographs.ts`
carries a provenance note — keep it accurate: those paths were hand-written, not traced, which is the
only reason there's no licence attached.

## Current placeholders and decided-against

- No Korean font is bundled, so the character sets fall back to the device's, and the traditional set
  approximates Cho's cursive script by leaning it. A self-hosted subset face would fix both.
- **Decided against visual regression snapshots** — the board's pixels churn constantly while it's
  being designed, and a suite red on every restyle teaches people to ignore it. Piece sets are tested
  by character and size instead; Traditional and Hanja aren't fully separable by acceptance test at
  all (same characters, told apart by setting + size), and the wood-versus-disc difference goes
  uncovered. (`react/AGENTS.md` has the other decided-against entry, on keyboard navigation.)
