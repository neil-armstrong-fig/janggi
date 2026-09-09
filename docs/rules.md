# The rules of janggi — implementation reference

Research date: 2026-09-08. Written to be read alongside the engine in
`webapp/src/game/`, which encodes the movement rules in §4.

**What this is for.** The rules a piece moves by are settled and every source
agrees on them. The rules that end a game are *not*: bikjang, repetition and the
pass move are described differently by the Korea Janggi Association's own
regulations, by en.wikipedia and by pychess, and the differences are not
cosmetic. This document records both — the settled movement rules the code
implements today, and the contested endgame rules it does not — so that neither
has to be re-derived, and so the contested ones are met with a decision rather
than a guess.

For the pre-game arrangement of the back rank — the four 차림, whose left "왼상"
means, and 맞상 vs 엇상 — see `opening-setups.md`. This document takes a setup as
given and starts from the first move.

---

## 1. Coordinates — read this first

**This document uses the repository's coordinate system, which is _not_ the one
`opening-setups.md` uses.**

- **Files 1–9, left to right** as the board is drawn. Same in both documents.
- **Ranks 1–10, top to bottom.** `opening-setups.md` numbers them **bottom to
  top**.
- **Han (한, red) occupies ranks 1–4** — the top of the board. **Cho (초,
  blue-green) occupies ranks 7–10** — the bottom, nearest the player.
- A point is written `(file, rank)`.

To carry a coordinate across from `opening-setups.md`:

```
rank_here = 11 − rank_there        file is unchanged
```

Cho's left chariot is `(1,1)` there and `(1,10)` here. Getting this wrong puts a
piece on the wrong army's half of the board and every derived move with it.

This matches `webapp/src/game/board/types/Position.ts` and the `HOME_RANKS`
table in `StartingPieces.ts`, and it is the order a CSS grid fills in, which is
why the code is that way round.

**Forward** — the direction a soldier advances — is therefore:

| Side | Home ranks | Forward is |
| ---- | ---------- | ---------- |
| Han  | 1–4        | `rank + 1` |
| Cho  | 7–10       | `rank − 1` |

---

## 2. The board and the palace

Janggi is played on the **90 intersections** of 9 files and 10 ranks. Pieces
stand on the intersections, not in the squares, so the board is 9×10 points
rather than 8×9 cells.

> "The board consists of 90 intersections of 9 vertical files and 10 horizontal
> rows." — en.wikipedia

Each army has a **palace (궁성)**, three points by three, against its own edge
and centred on file 5:

| Side | Palace files | Palace ranks | Centre  |
| ---- | ------------ | ------------ | ------- |
| Han  | 4–6          | 1–3          | (5,2)   |
| Cho  | 4–6          | 8–10         | (5,9)   |

Four diagonals are drawn inside each palace, from the centre out to the four
corners, forming an X. **Only five of the nine palace points carry a diagonal**
— the centre and the four corners. The four mid-edge points carry none.

| Side | Diagonal points                       |
| ---- | ------------------------------------- |
| Han  | (5,2), (4,1), (6,1), (4,3), (6,3)     |
| Cho  | (5,9), (4,8), (6,8), (4,10), (6,10)   |

This matters more than it looks: **a piece may only move diagonally where a
diagonal is actually drawn.** en.wikipedia states it explicitly for the general
— "the blue general can move diagonally … but the red general cannot, since
there are no diagonal markings at that point."

`webapp/src/game/board/utils/PalaceDiagonals.ts` is the single place this
geometry is computed, and `react/…/board/utils/CellShapes.ts` draws the lines
from the same source, so what is painted and what is legal cannot drift apart.

**There is no river.** Unlike xiangqi, nothing divides the board, and no piece
is confined to its own half — the elephant in particular crosses freely.

---

## 3. Turn order

**Cho moves first.** Han is compensated with 1.5 points (덤, *deom*); see §6.5.

The Korea Janggi Association's 대국규칙 also fixes how the sides are drawn and
the order the two players lay their back ranks out — Han places first and may
not then revise. That is quoted and sourced in `opening-setups.md` §4 and is not
repeated here.

---

## 4. The seven pieces — settled, and what the engine implements

The authoritative short statement of all seven is the Korea Janggi Association's
own 기물행마법 page. It is quoted per piece below, with en.wikipedia and pychess
as cross-checks. All three agree throughout this section.

Two rules apply to every piece and are not repeated:

- **A piece may never land on a point held by its own army.**
- **Capture is by displacement**: you capture by moving onto the piece, which
  leaves the board. There is no other way to take a piece, and no piece is ever
  captured in passing.

### 4.1 General (궁 / 장)

> "궁은 '궁성'이라고 불리는 정사각형의 작은 공간을 벗어날 수 없으며, 오직 이
> 안에서만 자유롭게 한수에 한칸식, 모든 방향으로 선을 타고 이동할 수 있다."
> — 대한장기협회, 기물행마법
>
> _The general may not leave the small square space called the palace, and only
> within it may it move freely, one point per move, in every direction, along
> the lines._

One step per move to an adjacent point **along a drawn line**, and **never
outside its own palace**. From the palace centre that is eight destinations
(four orthogonal, four diagonal); from a corner, three; from a mid-edge point,
three — all orthogonal, because no diagonal is drawn there.

The general starts on the **palace centre**, not on the back edge as in xiangqi.

### 4.2 Guard (사)

> "士의 행마법은 궁과 동일하다." — _The guard's movement is identical to the
> general's._

Identical in every respect, including palace confinement. The engine implements
both from one function, `PalaceMoves.ts`.

### 4.3 Horse (마)

> "馬는 항상 장기판의 선을 타고 한칸 이동한 뒤 (단, 궁성의 대각선 제외) 그 다음
> 대각선으로 한칸 이동한다. 이 이동경로 사이에 다른 기물이 있어 길이 막혔을
> 경우는 이동이 불가능하다."
>
> _The horse always moves one point along a board line (excluding the palace
> diagonals), then one point diagonally. If another piece stands on that path
> and blocks the way, the move is not possible._

**One orthogonal step, then one diagonal step continuing outward.** Net
displacement `(±1,±2)` or `(±2,±1)` — the chess knight's move.

**Blocking:** if the orthogonal step point is occupied **by anything, either
army's**, that whole direction is barred. This is the 멱 point. There is one
blocking point per direction and the horse does not jump.

The parenthesis in the Korean is worth keeping: the first step is along an
orthogonal line, never along a palace diagonal. The palace diagonals are for the
general, guard, chariot, cannon and soldier only.

### 4.4 Elephant (상)

> "象은 먼저 한칸 선을 타고(역시 궁성의 대각선은 제외) 움직인뒤, 대각선으로
> 두칸 움직인다. 역시 다른 기물이 이동경로 사이에 자리한다면 이동이 불가능하다."
>
> _The elephant first moves one point along a line (again excluding the palace
> diagonals), then two points diagonally. Again, if another piece sits on the
> path, the move is not possible._

**One orthogonal step, then two diagonal steps continuing outward.** Net
displacement `(±2,±3)` or `(±3,±2)`.

**Blocking:** **two** intervening points, and either one blocks — the orthogonal
step point, and the first of the two diagonal points. This is why the elephant
is so often stuck in the opening.

This is not the xiangqi elephant. It is far longer-ranged, and **it crosses to
the enemy half freely** — there is no river.

### 4.5 Chariot (차)

> "車는 가로막는 다른 기물만 없다면 전후좌우로 또는 궁성의 대각선을 타고
> 몇칸이든 가고 싶은 곳으로 질주할 수 있다. 단, 한수에 한방향으로만 이동이
> 가능하다."
>
> _So long as no other piece blocks the way, the chariot may charge as many
> points as it likes forward, back, left or right, or along a palace diagonal.
> It may move in only one direction per move._

Slides any distance along a file or a rank, stopping before the first piece it
meets, and capturing that piece if it belongs to the enemy.

**In a palace**, from a diagonal point, it also slides along the drawn diagonal
under the same rules — corner to centre, centre to corner, or corner straight
through the centre to the opposite corner when the centre is empty.

> "the chariot may move along the diagonal lines inside **either** palace, but
> only in a straight line" — en.wikipedia

Note **either** palace: a chariot that has invaded the enemy palace uses that
palace's diagonals too.

The chariot is the strongest piece on the board (13 points, §6.5).

### 4.6 Cannon (포)

The awkward one. Four separate restrictions, and getting any of them wrong
produces an engine that looks right until it does not.

> "包는 車와 같이 전후좌우 이동과 궁성안에서 대각선 이동이 가능하나, 반드시
> 다른 기물 하나를 넘어야만 이동할 수 있다는 특색이 있다. 자기편이든 상대편이든
> 뛰어넘을 수 있는 기물을 가리지 않으나, 단지 같은 포끼리는 서로 넘을 수도 없고
> 또한 서로 취할 수도 없다."
>
> _The cannon can move forward, back, left and right like the chariot, and
> diagonally within the palace, but has the peculiarity that it can only move by
> jumping exactly one other piece. It does not mind whether the piece it jumps
> is its own or the opponent's — only that cannons may neither jump one another
> nor capture one another._

1. **It must jump exactly one piece**, called the **screen**. Not zero, not two.
   > "Unlike xiangqi, the Cannon cannot move without a screen." — pychess
2. **The screen may be either army's** — but **it may not be a cannon**.
3. **A cannon may not capture a cannon.**
4. **It moves and captures identically**: over the screen, then to any empty
   point beyond, or onto the first piece beyond if that piece is an enemy
   non-cannon.

In a palace, the same applies along the drawn diagonal. Because the only point
between two opposite palace corners is the centre, this reduces to one concrete
case:

> "the cannon must be on one corner, where it can move or attack the opposite
> corner if a non-cannon piece is in the center." — pychess

**Consequence worth knowing before writing a test:** in the opening position
**neither side has a single legal cannon move.** en.wikipedia says so outright —
"janggi cannons require jumps to move and capture, meaning no valid cannon moves
exist in the starting position" — and §5 works out why point by point.

### 4.7 Soldier (졸 for Cho / 병 for Han)

> "卒과 兵은 한수에 한칸을 이동하며 전진과 좌우 이동이 가능하나 후퇴는 할 수
> 없다. … 상대편의 궁성안으로 진입하였을 경우 궁성의 대각선을 탈 수 있지만
> 이또한 대각선을 타고 전진(자신의 진영을 기준으로 1시반과 10시반 방향)만 할 수
> 있다."
>
> _Soldiers move one point per move, forward or to the left or right, but may
> not retreat. … On entering the opponent's palace they may use the palace
> diagonals, but here too only forward along the diagonal — the one-thirty and
> ten-thirty directions relative to their own camp._

One step **forward or sideways. Never backwards.** Sideways from the first move
— unlike xiangqi, there is no river to cross first.

**Inside the enemy palace**, on a diagonal point, it may also take a drawn
diagonal, but only in the two forward directions. The Korean names them by the
clock: 1:30 and 10:30 from the soldier's own point of view.

**No promotion.** A soldier that reaches the far edge simply has no forward
move left and can only go sideways for the rest of the game.

Captures exactly as it moves.

---

## 5. Every legal first move

Cho moves first. From the standard opening with **both** players on 안상차림
(Inner Elephant, the app's default), Cho has **31 legal moves**. The table is in
this document's coordinates and is what `webapp/src/game/` is tested against.

Occupied points at the start, for working the table through by hand:

```
rank  1   R H E G . G E H R      Han back rank
rank  2   . . . . K . . . .      Han general on the palace centre
rank  3   . C . . . . . C .      Han cannons
rank  4   P . P . P . P . P      Han soldiers
rank  5   . . . . . . . . .
rank  6   . . . . . . . . .
rank  7   P . P . P . P . P      Cho soldiers
rank  8   . C . . . . . C .      Cho cannons
rank  9   . . . . K . . . .      Cho general
rank 10   R H E G . G E H R      Cho back rank
```

| Piece    | From   | Legal destinations                           | Count |
| -------- | ------ | -------------------------------------------- | ----- |
| Chariot  | (1,10) | (1,9) (1,8)                                  | 2     |
| Chariot  | (9,10) | (9,9) (9,8)                                  | 2     |
| Horse    | (2,10) | (1,8) (3,8)                                  | 2     |
| Horse    | (8,10) | (7,8) (9,8)                                  | 2     |
| Elephant | (3,10) | —                                            | 0     |
| Elephant | (7,10) | —                                            | 0     |
| Guard    | (4,10) | (5,10) (4,9)                                 | 2     |
| Guard    | (6,10) | (5,10) (6,9)                                 | 2     |
| General  | (5,9)  | (4,9) (6,9) (5,8) (5,10) (4,8) (6,8)         | 6     |
| Cannon   | (2,8)  | —                                            | 0     |
| Cannon   | (8,8)  | —                                            | 0     |
| Soldier  | (1,7)  | (1,6) (2,7)                                  | 2     |
| Soldier  | (3,7)  | (3,6) (2,7) (4,7)                            | 3     |
| Soldier  | (5,7)  | (5,6) (4,7) (6,7)                            | 3     |
| Soldier  | (7,7)  | (7,6) (6,7) (8,7)                            | 3     |
| Soldier  | (9,7)  | (9,6) (8,7)                                  | 2     |
|          |        | **total**                                    | 31    |

The three zeroes are the interesting rows, and each one exercises a different
rule:

**The elephants are blocked.** From (3,10) the only unoccupied first step is
north to (3,9). Continuing outward, one branch runs (3,9) → (2,8), which is
Cho's own cannon — blocked at the second point. The other runs (3,9) → (4,8) →
(5,7), and (5,7) is Cho's own centre soldier — reached, but occupied by its own
army. Nothing else: west is its own horse, east its own guard, south is off the
board. Sweeping a soldier is what frees an elephant, which is exactly the
opening advice in `opening-setups.md` §3.

**The general has six, not eight.** Four orthogonal points inside the palace are
empty, and two of the four diagonals from the centre lead to (4,8) and (6,8),
also empty. The other two diagonals lead to (4,10) and (6,10) — its own guards.

**The cannons have none at all.** Take Cho's cannon on (2,8), line by line:

| Direction    | First piece met | Why it yields nothing                          |
| ------------ | --------------- | ---------------------------------------------- |
| up file 2    | horse (2,10)    | a legal screen, but the board ends behind it   |
| down file 2  | cannon (2,3)    | a cannon may not be jumped                     |
| west rank 8  | none            | the board edge — no screen                     |
| east rank 8  | cannon (8,8)    | a cannon may not be jumped                     |

(2,8) is not in a palace, so the diagonal case does not arise. The same holds
mirrored for (8,8), and for both of Han's.

**No capture is possible on move one.** The armies' nearest pieces are the two
soldier ranks, 4 and 7, three ranks apart, and nothing reaches that far. Capture
behaviour therefore has to be tested from small hand-built positions rather than
from the opening.

---

## 6. Rules the engine does not implement yet

Everything above is encoded in `webapp/src/game/`. Everything below is not, and
each item says why it is not simply a matter of typing it in.

### 6.1 Check and checkmate

> "The game is won by checkmating the opposing general. This is called
> weh-tong." — en.wikipedia

The 대국규칙 adds two procedural rules with no equivalent in chess: 묵장
(both players overlook a check — it is not treated as a check retroactively,
only from the point at which it is noticed), and 자장 (moving your own general
into check hands the decision to the opponent). Both are human-tournament rules
about mistakes, not engine rules.

**Implemented.** `webapp/src/game/IsInCheck.ts` asks whether any enemy piece
attacks the general, `IsCheckmate.ts` is that plus having no legal reply, and
`MovesFrom.ts` no longer offers a move that would leave its own general
attacked — so a general can no longer be captured.

**Shown.** The turn line above the board says "Han is in check" and, once there
is no reply, "Han wins"; `react/…/turn-indicator/utils/GameStatusOf.ts` derives
both from the two predicates above rather than storing them. Neither 묵장 nor
자장 can arise on screen, because a move that overlooks a check is not offered
in the first place.

Not implemented from this section: 묵장 and 자장, which are rules about human
mistakes rather than about the position. Note that 자장 does **not** say moving
into check is illegal — it says the mistake hands the decision to the opponent.
Filtering the move out is a deliberate departure from the KJA text, and the same
one every engine makes.

### 6.2 Bikjang (빅장) — **the sources genuinely disagree**

Every English source describes bikjang as: the generals come to face each other
down an open file, and that is a draw.

> "If the generals come to face each other across the board, and the player to
> move does not move away, this is _bikjang_—a draw." — en.wikipedia
>
> "The next player to move has two choices: make a move to break bikjang … or
> pass the turn, causing the game to end in a draw." — pychess

**The Korea Janggi Association's own 대국규정 says something much narrower:**

> "빅장 규정: 기물의 총 점수가 각각 30점 미만일 때만 양 대국자는 빅장을 부를 수
> 있다."
>
> _Bikjang rule: only when each side's total piece score is below 30 points may
> either player call bikjang._

Under the KJA regulation bikjang is **a draw the players may call, and only in a
low-material endgame** — not an automatic consequence of the two generals seeing
each other at any point in the game. That is a different rule, not a different
wording of the same one, and it changes whether a mid-game bikjang is a draw or
simply a position.

**Decided: build both, and let the player choose in settings.** The two
readings are different rules rather than different wordings, so picking one
silently decides the game for everyone; a setting says which game is being
played. The KJA reading makes material scoring a prerequisite, since it gates
on each side holding under 30 points.

**Validated, 2026-09-09 — and the apparent contradiction resolves.** Three
findings, all from primary sources.

**1. The KJA rule is current, not a 2013 relic.** The identical text is on the
association's live site today, and it carries an exception this document was
missing:

> "빅장 규정: 기물이 각 30점 미만일 경우에 한하여 빅장을 부를 수 있다. (단,
> 궁으로 상대 기물 취하면서 빅장이 되는 경우는 예외로 한다)"
>
> _Bikjang may be called only when each side is under 30 points. **Except where
> the bikjang arises from the general capturing an enemy piece.**_

**2. The 30-point threshold is a rule of the _points_ format, not of janggi.**
This is what reconciles the sources. The KJA runs two match formats — 승부제
(a friendly, decisive game) and 점수제 (the scored tournament game) — and says
so explicitly of both bikjang and repetition:

> "(단, 점수제방식에서는 동일수는 각 30점 미만에서 가능하다)"
>
> _Except that in the points format, a repeated move is only allowed below 30
> points each._

So there is no contradiction with en.wikipedia and pychess. **They describe the
casual format, where bikjang is simply a draw; the KJA's threshold governs the
scored tournament format.** An online game is the former, which is why no
online implementation applies it.

**3. A second federation has since abolished draws outright.** 대한장기연맹
(`kojf.net`, distinct from the 대한장기협회 quoted above) revised its rules
effective **2020-01-01**:

> "(사)대한장기연맹에서 주관하는 모든 대회는 점수제 방식을 적용하여 무승부를
> 없애고 완승 및 점수승 등으로 승부를 가린다."
>
> _Every tournament run by the federation applies the points format, abolishing
> the draw and deciding by complete win or points win._

Under those rules a bikjang cannot be a draw at all — it resolves on material.
League points are 완승 7, 점수승 4, 점수패 2, 완패 0.

**What this means for the setting.** The two options are not "correct vs
popular" but **casual vs scored**, which is a better thing to put in front of a
player. Label them that way. The scored option needs material scoring, and with
it the 30-point threshold and the general-capture exception above.

**Do not confuse a third body with either.** 한국장기연맹
(`kingjanggi.or.kr`) publishes rules for **궁장기**, a reformed variant with
piece promotion (진급) and a 왕장 general that can capture the enemy general. It
is explicitly not the same game — it rejects "속국 문화인 한,초장기의 점수제" —
and its regulations must not be read as janggi's.

### 6.3 The pass move (한수쉼)

A player may decline to move. The KJA describes the gesture:

> "자기 차례에 둘 것이 없어 한 수 쉬고자 할 경우에는 궁을 반상위로 올렸다가
> 내려 놓는다."
>
> _When you have nothing to play on your turn and wish to rest a move, lift the
> general off the board and set it back down._

Note "둘 것이 없어" — *having nothing to play*. en.wikipedia and pychess both
describe passing as unrestricted:

> "there is no restriction on when or how many times one can pass during the
> game" — en.wikipedia

A second real disagreement, and the same decision applies.

**The 대한장기연맹 settled it for its own tournaments in 2022**, and the answer
is neither of the above:

> "한수 쉼은 행마(수)에 해당하지 않으며, 서로 연속으로 한수 쉼을 할 경우
> 대국종료 후 점수로 승패 결정"
>
> _A pass is not a move, and if both players pass consecutively the game ends
> and is decided on points._

That makes two consecutive passes a terminating condition — which is the
mechanism a scored format needs in place of a draw.

**Its one settled consequence: stalemate does not exist.** A player with no
legal move passes and the game continues.

> "Stalemate does not result in the end of a game in janggi; if a player has no
> legal move left, he is just forced to pass." — en.wikipedia

**Implemented.** `webapp/src/game/Pass.ts` rests a turn and `CanPass.ts` says
whether one may be rested. Three decisions are encoded, and each is a choice
rather than a transcription:

- **A pass is not a `Move`.** `Move` stays a `from`/`to` pair and `pass(state)`
  is its own entry point beside `applyMove` — "한수 쉼은 행마(수)에 해당하지
  않으며", a pass is not a move. It is therefore not in `legalMovesFor`, which
  is what leaves the 31 openings of §5 and `isCheckmate` saying what they said
  before.

- **Passing is unrestricted, except while in check.** The unrestricted half is
  en.wikipedia's and pychess's reading, taken over the KJA's narrower "자기
  차례에 둘 것이 없어". The check half is in **no source** and is derived: were a
  player allowed to rest out of check, a mated general would simply sit still
  and 외통 could not exist.

- **Two passes in a row stop the game, and it is settled on points**, per the
  대한장기연맹 revision quoted above. `OutcomeOf.ts` reads the count that
  `GameState.consecutivePasses` keeps; any move puts it back to nought, in
  `positionAfter`. This is the first ending that reaches the 덤 of §6.5, and the
  reason that half point exists.

Stalemate accordingly cannot end a game: `isCheckmate` asks for a check as well
as an empty move list, and `PlayingAGame.test.ts` builds a position with neither
a legal move nor a check and rests the turn out of it.

**Shown.** A Pass control sits beside New game and greys out when the turn may
not be rested; the turn line says "Han wins on points" once both players have
rested one. A control rather than a gesture on the board, because resting a turn
is the one thing a player does that touches no intersection.
`acceptance-tests/…/game/PassingATurn.test.ts` plays the whole of it by tapping,
including the ending — which, from the opening position, hands the game to Han
on the 덤 alone.

### 6.4 Repetition

> "① 동일한 수를 3회 이상 반복할 수 없다. 단, 기물의 총 점수가 각각 30점 미만일
> 때에는 동일수(반복장군 포함)를 반복할 수 있다. ② 반복수를 악용하여 이득을
> 취할 수 없다." — 대한장기협회, 대국규정
>
> _① The same move may not be repeated three times or more. Except: when each
> side's total piece score is below 30 points, repetition (including perpetual
> check) is allowed. ② Repetition may not be abused for advantage._

Adjudicated by a referee in tournament play, per en.wikipedia — "if a position
repeats three times, a referee is called to determine who is at fault". pychess
resolves it mechanically instead: perpetual check loses for the checking player
after the third repetition, other repetitions go to material counting.

Not implemented, and it needs a position history, which `GameState` deliberately
does not carry yet.

**Decided, 2026-09-09: report it, do not adjudicate.** `isRepetition` will say
that a position has come round for the third time and `applyMove` will refuse
the move that makes it, exempt below 30 points a side as clause ① has it. Who
is at fault stays a referee's call, because clause ② — "반복수를 악용하여 이득을
취할 수 없다" — is a judgement about intent and the engine has no referee.
pychess's mechanical resolution (perpetual check loses for the checking side,
everything else goes to material) is pychess's decision and not any
federation's, so it is not taken.

### 6.5 Scoring, piece values and the 덤

Used to decide a game that reaches the time limit or a drawn-material ending,
rather than a checkmate.

> "① 기물의 점수: 차-13점, 포-7점, 마-5점, 상·사-3점, 병(졸)-2점 (총72점)
> ② 덤의 적용: 후수자(漢)는 선수자(楚)로부터 1.5점의 덤을 받는다. 초는 72점,
> 한은 73.5점으로 대국이 시작된다." — 대한장기협회, 대국규정

| Piece    | 차  | 포  | 마  | 상  | 사  | 졸/병 | 궁  |
| -------- | --- | --- | --- | --- | --- | ----- | --- |
| Points   | 13  | 7   | 5   | 3   | 3   | 2     | 0   |

Each army's pieces total **72**. Han receives **1.5 points (덤, deom)** in
compensation for Cho moving first and choosing its setup last, so Han starts on
**73.5** — the half point exists so a scored game cannot tie.

**Implemented.** `webapp/src/game/MaterialFor.ts` holds the table and sums one
army's remaining pieces; `ScoreFor.ts` adds Han's 덤 on top, so a new game stands
at 72 against 73.5. `OutcomeOf.ts` decides a stopped game by comparing the two.

**Nothing keeps captured pieces, and nothing needs to.** Every setup deals the
same sixteen, so what an army is missing is exactly what has been taken from it
and the board is a complete record. A captured *pile* — the pieces themselves,
to draw beside the board — is a display, and would want the starting army to
subtract from; the score does not.

**Shown.** A line under the turn reads "Cho 72 · Han 73.5" from the first move,
Han's 덤 folded into the figure rather than shown apart, so the two are directly
comparable — which is the whole point of a half point that cannot be tied.

Not implemented from this section: the 30-point threshold the piece score exists
to serve belongs to bikjang in §6.2, which is not modelled.

### 6.6 The setup phase

Han lays out its back rank first and may not revise; Cho then answers and moves
first. Quoted and sourced in `opening-setups.md` §4. The app lets both armies be
arranged freely and independently, which reaches every position the rule does,
but does not model the order or the prohibition on revising.

---

## 7. Sources

| Source                                     | URL                                                                                          | Used for                                                              | Weight                                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| 대한장기협회, 기물행마법 (archived)         | `web.archive.org/web/2013/http://kja.or.kr/janggi_intro/c.php`                                | all seven pieces, quoted in §4                                        | **Authoritative** — the national federation's own |
| 대한장기협회, 대국규칙 / 대국규정 (archived) | `…/janggi_intro/e.php`, `…/janggi_intro/f.php`                                                | bikjang's 30-point condition, repetition, the pass gesture, scoring     | **Authoritative**, and the outlier on bikjang     |
| en.wikipedia, Janggi                       | <https://en.wikipedia.org/wiki/Janggi>                                                        | board, per-piece cross-check, no cannon move at the start, values, 덤   | Good, and the fullest English text                |
| pychess janggi documentation               | <https://github.com/gbtami/pychess-variants/blob/master/static/docs/janggi.md>                 | the cannon's palace-diagonal case; how a working engine adjudicates      | Good for implementation, weaker on nomenclature   |
| 대한장기협회, live 대국규정                 | <http://www.kja.or.kr/business/business5.php>                                                 | the 30-point bikjang and repetition rules **as currently published**, and the general-capture exception | **Authoritative and current** — validated 2026-09-09 |
| 대한장기연맹, 장기규칙 개정 (2020-01-01)    | <https://kojf.net/bbs/board.php?bo_table=board_notice&wr_id=478>                               | a second federation abolishing the draw outright; piece values; league points | **Authoritative** for that federation |
| 대한장기연맹, 2022년도 대국규칙 개정        | <http://kojf.net/bbs/board.php?bo_table=board_notice&wr_id=706>                                | a pass is not a move; two consecutive passes end the game on points | **Authoritative** for that federation |
| `docs/opening-setups.md`                   | this repository                                                                                | the setup phase, setup order, 맞상/엇상, opening advice                 | See its own confidence table                      |

**Retrieval notes for anyone repeating this.** The KJA archive is **EUC-KR** —
decode as cp949 or you get mojibake. `web.archive.org` refuses the WebFetch tool
but serves `curl` fine. en.wikipedia's article truncates when fetched whole;
pull one section at a time through
`api.php?action=parse&page=Janggi&prop=wikitext&section=N`. namu.wiki is
Cloudflare-blocked by every route tried — `opening-setups.md` §9 lists them all,
do not spend the time again.

---

## 8. Confidence

| Claim                                                                                        | Confidence                                                                                    |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| The movement, blocking and capture rules of all seven pieces (§4)                             | **High** — the KJA's own page, en.wikipedia and pychess agree on every clause                  |
| Only the five palace points with a drawn diagonal may be used diagonally                       | **High** — stated outright by en.wikipedia, implied by every other source                       |
| A cannon needs exactly one non-cannon screen, and may not capture a cannon                     | **High** — the KJA states both halves in one sentence                                           |
| Neither side has a legal cannon move in the opening position                                   | **High** — asserted by en.wikipedia, and derived point by point in §5                          |
| The 31 legal first moves in §5                                                                 | **High** — derived from the rules above; it is what the engine's tests assert                  |
| Piece values, the 72-point total and Han's 1.5 덤                                              | **High** — the KJA's 대국규정, corroborated by en.wikipedia                                     |
| Bikjang is a draw in casual play, and gated on 30 points a side in the scored tournament format | **High** — the KJA's live site carries both, and the split by match format is what reconciles it with the English sources. See §6.2 |
| A player may pass at any time, without restriction                                             | **Moderate** — en.wikipedia and pychess say so; the KJA implies "when you have nothing", and 대한장기연맹 made two consecutive passes end the game in 2022. The engine takes the unrestricted reading, and bars a pass only while in check — a rule no source states, derived in §6.3 |
| Stalemate cannot occur, because a player with no move passes                                   | **High** — en.wikipedia states it, and it follows from the pass rule under either reading      |
