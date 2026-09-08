# Janggi opening setups (차림) — research reference

Research date: 2026-09-07. Written for someone with no janggi background.

**The question this document answers:** in janggi each player arranges their own
back rank before play, choosing one of four setups. Two of those four are not
left-right symmetric. So when *both* players choose "the same" asymmetric setup,
is the resulting board symmetric under **180-degree rotation** (each army's
arrangement is defined relative to its own seat) or under **reflection across the
middle of the board** (both armies have the identical file-by-file arrangement)?

**Verdict: genuinely ambiguous — the naming conventions in the sources differ.**
The *physical* taxonomy, however, is fully settled, and it is the part worth
building on. Details below.

---

## 1. Background: board, pieces, and the coordinates used here

Janggi is played on a grid of **9 files by 10 ranks**, with pieces on the
intersections (like Go, not like chess squares). Two armies: **Cho** (초, blue or
green, cursive characters) and **Han** (한, red, regular-script characters).

**Coordinates used throughout this document** (my own working system, chosen for
clarity):

- **Files 1–9, numbered left to right** as the board is normally drawn, with
  **Cho at the bottom** and **Han at the top**.
- **Ranks 1–10, numbered bottom to top.** So Cho's back rank is rank 1 and Han's
  back rank is rank 10.
- A point is written `(file, rank)`.

Starting layout, per army:

| Piece | Cho | Han |
|---|---|---|
| Chariot 차 (rook) | (1,1), (9,1) | (1,10), (9,10) |
| Guard 사 (advisor) | (4,1), (6,1) | (4,10), (6,10) |
| General 궁/장 (king) | (5,2) | (5,9) |
| Cannon 포 | (2,3), (8,3) | (2,8), (8,8) |
| Pawn 졸 (Cho) / 병 (Han) | (1,4),(3,4),(5,4),(7,4),(9,4) | (1,7),(3,7),(5,7),(7,7),(9,7) |
| Horse 마 and Elephant 상 | the four **flank points**: files 2, 3, 7, 8 on the back rank | same |

The **palace** (궁성) is the 3x3 area with the diagonals drawn in: files 4–6,
ranks 1–3 for Cho, files 4–6 ranks 8–10 for Han.

Two palace points have their own names and matter a lot below:

- **귀 ("corner")** — the two palace corners nearest the enemy: **(4,3)** and
  **(6,3)** for Cho; **(4,8)** and **(6,8)** for Han.
- **면 ("face")** — the palace point directly in front of the general:
  **(5,3)** for Cho, **(5,8)** for Han.

Piece movement relevant here:

- **Horse (마)**: like a chess knight — displacement `(±1,±2)` or `(±2,±1)` —
  but blockable on the first orthogonal step (that blocking point is called 멱).
- **Elephant (상)**: one orthogonal step then **two** diagonal steps outward —
  net displacement **`(±2,±3)` or `(±3,±2)`** — blockable at any intervening
  point. This is *not* the xiangqi elephant; it is much longer-ranged and can
  cross to the enemy half.

**The four flank points split into two kinds.** Files **2** and **8** are the
**outer** flank points (adjacent to a chariot). Files **3** and **7** are the
**inner** ones (adjacent to a guard). This inner/outer distinction is what the
setup names are about.

### The official Korean notation (different from the above — beware)

The Korea Janggi Association's current (3rd revision) coordinate system, per
[ko.wikipedia 장기](https://ko.wikipedia.org/wiki/%EC%9E%A5%EA%B8%B0):

> 가로선은 각각 위에서부터 아래로 1부터 0까지 표기되어 있고, 세로줄은 각각
> 왼쪽에서 오른쪽으로 1부터 9까지 표기되어 있다. […] 가로선을 먼저 읽은 후
> 세로줄을 나중에 읽는다.

That is: **ranks 1,2,…,9,0 numbered top to bottom** (so `0` is the bottom rank),
**files 1–9 left to right**, written **rank-then-file**. Example given: the
generals start at **95** (Cho) and **25** (Han); a horse move is written
`03 馬 84`.

**Gotcha found during this research:** the 서산시대 newspaper columns cited below
use **file-then-rank** instead, and one of them draws the board with **Han at the
bottom**. Both were established by decoding their own move lists (see §5.3).
Do not assume a Korean janggi text uses the KJA notation.

---

## 2. The four setups — universally agreed

Before play, each player may swap the horse and elephant on either flank
independently. Since exactly one horse and one elephant go on each flank, there
are four arrangements. They are named after where the **elephants** sit, and are
also written as a four-character string reading the flank points 2, 3, 7, 8.

| Korean name | Gloss | Flank points (2,3,7,8) | Elephants on files | Leads to formation |
|---|---|---|---|---|
| **안상차림** | inner elephant | 마 상 상 마 | 3, 7 | 원앙마 (Mandarin-duck horse), 양귀상 |
| **바깥상차림** | outer elephant | 상 마 마 상 | 2, 8 | 양귀마 (both-corner horse) |
| **왼상차림** | left elephant | 상 마 상 마 | 2, 7 | 귀마 (corner horse), 면상 |
| **오른상차림** | right elephant | 마 상 마 상 | 3, 8 | 귀마, 면상 |

(The "elephants on files" column is written in board-absolute terms for a player
seated at the bottom. Whether it also holds for the top player is exactly the
disputed point — see §6.)

Sources agreeing on the names and strings: [Hangame janggi
glossary](https://janggi.hangame.com/tip.nhn?id=1), [BrainTV
column](https://www.braintv.co.kr/web_basic/board/view.asp?pagen=142&sno=3189),
[ko.wikipedia 장기](https://ko.wikipedia.org/wiki/%EC%9E%A5%EA%B8%B0),
[en.wikipedia Janggi](https://en.wikipedia.org/wiki/Janggi), namu.wiki.

**안상차림 and 바깥상차림 are left-right symmetric**, so if both players choose
one of those the resulting board is symmetric both ways and the question in this
document does not arise. Only **왼상차림 / 오른상차림** (the 귀마 setups) make it
meaningful. Those two account for the majority of real games.

### A fifth, non-standard setup

There is a traditional fifth arrangement, **기동차 차림** ("mobile chariot",
en.wikipedia calls it **Central Chariot Setup**), in which the elephants go on
files 1 and 9 and the chariots move inward. Per ko.wikipedia it is used in North
Korea and casual play but **is not officially recognised in South Korea**.
en.wikipedia: *"Traditionally, there is the fifth, Central Chariot Setup, which
is no longer used in modern tournament rule in South Korea, but may be still
found in casual games or in North Korea."* It is left-right symmetric, so it does
not bear on the question either.

---

## 3. Formation vocabulary (포진) — needed to read the sources

The **차림** is the pre-game arrangement; the **포진** is the formation you build
in the opening from it. Korean sources are emphatic that these are different
concepts (BrainTV: *"장기판 차림과 장기 포진은 초반전에 이어지는 단계일 뿐 엄연히
다른 개념이다"*). Five formations (5분법), per ko.wikipedia, BrainTV and Hangame:

- **귀마 (gwima, "corner horse")** — one horse goes to a palace corner 귀. From
  왼상차림 or 오른상차림. **The dominant formation: 60–70% of Korean players, and
  over 80% of professionals, use it.**
- **원앙마 (wonangma, "Mandarin-duck horse")** — from 안상차림; a horse advances to
  the point in front of the palace and the two horses defend each other.
- **양귀마 (yang-gwima, "both-corner horse")** — from 바깥상차림; both horses reach
  the two 귀.
- **면상 (myeonsang, "face elephant")** — an elephant, not a cannon, occupies the
  면 point. Usually from 왼상/오른상차림, occasionally 바깥상차림.
- **양귀상 (yang-gwisang)** — both elephants on the two 귀; from 안상차림; rarest.

A cruder two-way split (2분법) also exists: **면포포진** (cannon on the 면) vs
**면상포진** (elephant on the 면).

**Only the inner horse can become the 귀마.** Verified by hand: a Cho horse on
(3,1) reaches (4,3), a 귀, in one move (displacement `(+1,+2)`). A Cho horse on
(8,1) can reach (6,2) — displacement `(-2,+1)` — but (6,2) is the point beside the
general (called 결마), *not* a 귀. So in a 귀마 setup, the horse on file 3 or 7 is
the future 귀마, and the elephant on the same flank is therefore the **outer**
one. **The 귀마 and that flank's outer elephant are always on the same wing.**

**The outer elephant is the active one.** pychess's guide states it and the
geometry confirms it: an outer elephant on (2,1) can advance to (4,4), landing
between its own pawns on files 3 and 5; an inner elephant on (7,1) would want
(5,4) or (9,4), both occupied by its own pawns, so it is blocked. 장하영 프로 gives
the practical corollary: *"보통 차 옆에 상이 있는 쪽의 졸을 써야 이후에
외졸(外卒)이 생기지 않는다"* — sweep the edge pawn on the side where the elephant
sits next to the chariot, so you do not end up with a stranded pawn.

**귀윗상** (namu.wiki's term, "the elephant above the 귀") — the square that
active outer elephant lands on: **(4,4)** or **(6,4)** for Cho, **(4,7)** or
**(6,7)** for Han. Note (4,4) sits directly above Cho's 귀 at (4,3). This point is
the crux of the geometric argument in §5.

Sub-types of 귀마 포진 (namu.wiki, BrainTV, Hangame): **맞상포진**, **정형포진**,
**변형포진**. 정형 = the cannon on the side *away* from the 귀마 goes to 면포;
preferred by strong players. 변형 = the 귀마-side cannon goes to 면포; common among
amateurs. ko.wikibooks adds **구귀마 / 신귀마** (whether one or both elephants
advance to the centre).

---

## 4. Setup order — settled, authoritative

Korea Janggi Association official 대국규정, section "판차림의 순서"
([archived copy](https://web.archive.org/web/20131005190526/http://kja.or.kr/janggi_intro/f.php),
same text also at
[대국규칙](https://web.archive.org/web/20111124010550/http://www.kja.or.kr:80/janggi_intro/e.php)):

> 후수자가 먼저 기물을 차리고 선수자가 나중에 차린다. 이때 후수자는 馬와 象의
> 배치를 바꿔 다시 차릴 수 없다.

Translation: **the second player to move places their pieces first; the first
player to move places second; and the second player may not then re-arrange.**

Concretely: **Han (한, red) sets up first, then Cho (초, blue) sets up after
seeing Han's arrangement. Cho then moves first.**

Corroborated by:

- en.wikipedia Janggi, "Setting up": *"After that, Han places their pieces first,
  followed by Cho placing theirs. (The reason both sides are not placed
  simultaneously is because the positions of horse and elephant can be
  transposed, giving some strategical advantage to the player who places last.)"*
- namu.wiki: *"실전에서는 한이 먼저 기물차림을 하고, 초가 그것을 보고 기물차림을
  한다."*
- pychess docs list Cho's three compensated privileges: *"Cho's right to choose
  setup later; Cho's right to change setup before the game starts; Cho's right to
  move first"* — Han receives **1.5 points (덤)** in return. Starting material is
  Cho 72.0, Han 73.5.
- chessvariants: *"First, red makes his arrangement… After this, [blue] has the
  same choice of four arrangements… This results in 16 possible starting
  setups."*

**This does not affect the naming**, but it has a real consequence: **Cho is the
one who decides which of the two possible 귀마-vs-귀마 shapes the game becomes.**

Piece values used for the tie-break scoring, for completeness: 차 13, 포 7, 마 5,
상 3, 사 3, 졸/병 2, general 0; Han's 덤 is 1.5.

---

## 5. The physically meaningful distinction: 맞상 vs 엇상 — SETTLED

When *both* players choose a 귀마 setup, exactly two board shapes are possible,
and Korean janggi names both.

- **엇상포진 (eot-sang)** — both players' 귀마 (and hence both outer elephants) end
  up on the **same wing of the board**. The two back ranks are then **identical
  file by file**; the position is symmetric under **reflection across the middle**
  (translational symmetry). This is the ordinary, most common 귀마-vs-귀마 opening.
- **맞상포진 / 맞상장기 (mat-sang, "facing elephants")** — the outer elephants are
  on **opposite wings**. The position is symmetric under **180-degree rotation**.
  Nicknamed **동네장기 포진** ("neighbourhood-chess formation", i.e. a crude
  amateur opening).

### 5.1 The geometric argument for which is which

All sources define 맞상 the same way: the two players' elephants **face each other
diagonally and become mutual targets**, so that when they advance they must be
exchanged.

- Hangame: *"귀마 포진의 여러 유형 중에서 본인과 상대방의 상(象)이 **대각선으로
  마주 보는** 형태의 초반 진형을 말하는 것으로 일명 '동네장기 포진'이라고도
  불린다."*
- BrainTV: *"상이 **대각선으로 마주보는** 형태인 맞상 포진(일명 동네장기 포진)"*
- namu.wiki 귀마 포진: *"서로의 **귀윗상이 마주보고 쌍방 타겟**이 되기 때문에 붙은
  이름으로, 동네 장기 포진이라고도 한다."*
- 장하영 프로: *"'맞상장기'라고도 하는데 서로 상(象)이 바라보고 있기 때문에
  **진출하면 반드시 교환된다**."*

So 맞상 is defined by the two **귀윗상** mutually attacking. Now compute it.

The 귀윗상 points are **(4,4)** or **(6,4)** for Cho, and **(4,7)** or **(6,7)**
for Han. The elephant's displacement is `(±2,±3)` or `(±3,±2)`. Enumerate the four
pairings:

| Cho 귀윗상 | Han 귀윗상 | Displacement | Elephant move? |
|---|---|---|---|
| (4,4) | (4,7) | (0, 3) | **No** |
| (4,4) | (6,7) | (2, 3) | **Yes — mutual attack** |
| (6,4) | (4,7) | (2, 3) | **Yes — mutual attack** |
| (6,4) | (6,7) | (0, 3) | **No** |

The elephants attack each other **only when the two 귀윗상 are on opposite wings**
— i.e. Cho developing on files 1–4 while Han develops on files 6–9, or vice
versa. Since the 귀윗상 wing is determined by the outer elephant's wing, which is
determined by the 귀마's wing:

> **맞상 = outer elephants / 귀마 on opposite board wings = the 180-degree
> rotational board.**
> **엇상 = same board wing = the mirror/translational board.**

Sanity check on the initial position rather than the developed one: in the
translational board Cho's elephant on (2,1) and Han's on (2,10) are on the same
file, displacement (0,9), which is not an elephant move; nothing about the
starting position distinguishes the two cases. The distinction is genuinely about
where the elephants *land*, which is why every definition says "when they
advance".

Etymology as a supporting hint (not evidence): 맞- means "facing / head-on"
(맞서다), which fits mutual attack; 엇- means "crossed / at an angle / passing each
other by" (엇갈리다), which fits the same-wing case where the two elephants'
diagonals cross without meeting.

### 5.2 Cross-check 1 — every source's own statement is consistent with this

Each source states 맞상 in terms of setup *names*, and each is internally
consistent with "맞상 = opposite wings" **under that source's own naming
convention**:

- namu.wiki: 맞상 = same string on both sides; namu reads strings seat-relative,
  and seat-relative-same means opposite wings. Consistent.
- pychess: *"If Cho and Han choose the same setup among 3 or 4, it is called Mat
  Sang (Elephants facing each other)."* pychess is seat-relative. Consistent.
- 장하영 프로: 맞상 = **'상마상마-마상마상'** (different strings); he reads strings
  board-absolute, and absolute-different means opposite wings. Consistent.

Three sources, two opposite naming conventions, **one and the same physical
position.** That is the strongest single result of this research: the geometry is
agreed even where the vocabulary is not.

### 5.3 Cross-check 2 — decoding a professional's annotated game

장하영 프로 (a Korean janggi professional; his newspaper column ran to at least 49
instalments) wrote 「귀마 대 귀마 포진에서의 전형적 10수」, 서산시대, 2020-02-06:
<http://www.sstimes.kr/news/articleView.html?idxno=21698>. He analysed roughly
10,000 professional and amateur games:

> 그 결과 대략 50% 정도가 '귀마 대 귀마' 포진이었다. 그리고 이 중에서 절반 정도는
> 맞상포진이었다. 다시 말하자면 '상마상마-상마상마'는 전체 포진의 25%에
> 불과하였고 '상마상마-마상마상'도 25%에 달하였다. **'상마상마-마상마상'의 포진은
> 맞상장기라고 하여 공식대국에서는 금지하고 있는데도** 여전히 실전대국에서는
> 이루어지고 있어서 놀랐다.

His `<시작도>` is labelled **'상마상마-상마상마'** and is taught as *the ordinary,
most common* 귀마-vs-귀마 opening — explicitly not 맞상 (his summary says
*"맞상 포진은 피하는 것이 좋다"*). Decoding the article's coordinates
(**file-then-rank**, Cho at the bottom, established from the moves themselves):

- *"한에서 **31마**를 귀마로 진출시키니"* … *"**43**으로 진출하였던 귀마"* — Han's
  horse from file 3 on Han's back rank to Han's 귀 on file 4. (Only a horse on
  file 3 can reach the file-4 귀.) So **Han has 마 on file 3, therefore 상 on
  file 2.**
- *"**왼쪽 마**가 귀마로 진출하는 방법"* — listing Cho's options. Cho sits at the
  bottom, so Cho's own left is unambiguously the diagram's left, files 1–3.
  So **Cho's 귀마 horse is on file 3, therefore Cho's 상 is on file 2.**
- *"초는 **57졸**을 **67**로 쓸었다"* — Cho sweeps the central pawn off (5,4).
  Then *"초는 예상대로 상을 진출시켰다. 이렇게 되면 당장 **34병**이 위태롭게
  된다"* — the elephant move that immediately threatens Han's pawn on (3,7). The
  only elephant point attacking (3,7) that Cho can reach is **(5,4)**, reachable
  only from **(7,1)** (displacement `(-2,+3)`). So the pawn sweep was made
  precisely to open (5,4) for Cho's **inner elephant on file 7**. This confirms
  **Cho's elephants are on files 2 and 7.**
- Other coordinates in the piece all check out under this decoding: *"한도 54의
  병을 44 또는 64로 치울 것인가?"* (Han's central pawn on (5,7) sidestepping to
  file 4 or 6), *"34의 병을 54병을 합병"*, *"35로 한 칸 진출"* ((3,7) to (3,6),
  defended by the 귀마 on (4,8) — a legal horse move).

**Result:** in a game he labels **'상마상마-상마상마'**, both armies have elephants
on **files 2 and 7** — identical file by file, both 귀마 on the same (left) wing —
and it is **not** 맞상. That both confirms `맞상 = opposite wings` and shows that
*this author* reads the 마상 string off the board in absolute file order for both
players.

The direction of his file numbering is also pinned down by this, not assumed: if
files ran right-to-left, Han's 귀 at "43" would be on the board's right while
Cho's 귀마 is on the board's left, making the diagram opposite-wing, i.e. 맞상 —
which contradicts his own text labelling 맞상 as the *mixed*-string pairing. Only
left-to-right numbering makes the article self-consistent.

Independent confirmation of the notation from a second column in the same series,
「양귀마 대 귀마 포진에서 후수 귀마의 대응책」
(<http://www.sstimes.kr/news/articleView.html?idxno=21988>), which prints an
explicit move list (`한 97병 → 87`, `초 83포 → 53`, `한 20마 → 38`,
`초 21상 → 44`, `한 28포 → 58`, `초 54졸 → 55`, `한 37병 → 47`, then
`초 31마 → 43`). Every one of those is legal and sensible under **file-then-rank
with the diagram drawn Han-at-the-bottom** (Cho's cannon (8,·) to its own 면; Cho's
outer elephant from its back rank to the (4,·) 귀윗상; both of Cho's horses to the
two 귀, as 양귀마 requires) — and under no other reading. It also contains
*"먼저 **왼쪽의 47병**을 한 칸 진출 시킨 후 중앙 57을 진출시켜"*, confirming that
file 4 is left of the central file 5, i.e. files increase left to right in the
diagram as drawn.

### 5.4 맞상 is reportedly barred from official play

장하영 프로 says so in two separate columns:

- 21698: *"'상마상마-마상마상'의 포진은 맞상장기라고 하여 **공식대국에서는
  금지하고 있는데도** 여전히 실전대국에서는 이루어지고 있어서 놀랐다."*
- 24456 (<http://www.sstimes.kr/news/articleView.html?idxno=24456>): *"서로 상(象)이
  바라보고 있기 때문에 진출하면 반드시 교환된다. 이는 상을 서로 떼고 두는 격이므로
  바람직하다고 볼 수 없다. 따라서 **정식 대국에서는 금지되는 포진이다**."*

Rationale: the two 귀윗상 must trade, which amounts to both sides playing without
elephants.

**Caveat:** I read the archived Korea Janggi Association 대국규칙 and 대국규정
pages in full and **found no such clause**. Treat this as a well-sourced claim
about tournament practice from a professional, not a verified rulebook rule. It
may live in a tournament-specific regulation, or in the 대한장기연맹's separate
2019 rules revision, neither of which I retrieved.

---

## 6. The unresolved part: whose left is "왼상"?

Two self-consistent conventions are in live use. **They give opposite answers to
the original question.**

### Convention (B) — board-absolute ("as drawn, Cho at the bottom")

Both armies' back ranks are named by **board file order**. Both players choosing
왼상차림 therefore produces **identical file-by-file back ranks**, i.e.
**mirror/translational** symmetry — and by §5 that pairing is **엇상**, not 맞상.

Evidence:

1. **ko.wikipedia 「상 (장기)」** — <https://ko.wikipedia.org/wiki/%EC%83%81_(%EC%9E%A5%EA%B8%B0)>.
   The single most on-point source found; it addresses this exact question
   directly. Using KJA notation (rank-then-file, rank `0` = bottom, rank `1` =
   top):
   > 초의 입장에서 볼때 각 차림에 따른 상의 위치는 다음과 같다.
   > 왼상차림 — 왼상 **02**, 오른상 **07** / 오른상차림 — **03**, **08** /
   > 안상차림 — **03**, **07** / 바깥상차림 — **02**, **08**
   >
   > 만약 **한과 초가 모두 왼상차림**일경우 상의 배치는 다음과 같다. […]
   > * **12 & 02**의 상 : 왼상
   > * **17 & 07**의 상 : 오른상
   >
   > 주의할것은 "왼상"과 "오른상"은 "왼상차림"과 "오른상차림"과는 다른 용어이다.
   > 왼상과 오른상은 차림 용어가 아니라 초기 배치시 각 상의 위치의 따른 명칭이다.

   I downloaded and visually inspected the accompanying diagram
   ([File:Yang sang.png](https://commons.wikimedia.org/wiki/File:Yang_sang.png))
   at 960px. It shows a full board with **four elephants: two red at the top on
   files 2 and 7, two green at the bottom on files 2 and 7** — i.e. **identical
   files for both armies**, explicitly captioned as both playing 왼상차림. This is
   the clearest single statement of convention (B) anywhere.
   Strength: on-point and unambiguous, but ko.wikipedia is amateur-written.
2. **en.wikipedia `Template:Janggi setup`** —
   <https://en.wikipedia.org/wiki/Template:Janggi_setup>. Source inspected. It
   renders a Han row and a Cho row from the **same parameters `{{{1}}}…{{{6}}}` in
   the same left-to-right order**:
   ```
   |[[File:janggi h{{{1}}} dl.svg|…]] … |[[File:janggi h{{{6}}} dr.svg|…]]
   |[[File:janggi c{{{1}}} dl.svg|…]] … |[[File:janggi c{{{6}}} dr.svg|…]]
   ```
   So **every setup diagram on en.wikipedia shows both sides identical file by
   file** — translational. If you are implementing "Wikipedia's four setups", (B)
   is what Wikipedia means.
   Strength: unambiguous about what the diagrams show, but probably derived from
   the Korean article rather than independent.
3. **장하영 프로's string usage** — proved in §5.3. Strongest evidence in this
   column, because it is derived from a professional's own game coordinates
   rather than from an assertion.

### Convention (A) — seat-relative (each player's own left)

The name is read from each player's own seat, so both players choosing 왼상차림
produces a **180-degree rotationally symmetric** board — and by §5 that pairing
**is** 맞상.

Evidence:

1. **namu.wiki 「귀마 포진」 and 「장기/용어」** — <https://namu.wiki/w/%EA%B7%80%EB%A7%88%20%ED%8F%AC%EC%A7%84>,
   <https://namu.wiki/w/%EC%9E%A5%EA%B8%B0/%EC%9A%A9%EC%96%B4>. Two mutually
   reinforcing claims:
   - 맞상 arises when the setups are *"'마상마상' vs '마상마상' 또는 '상마상마' vs
     '상마상마'"* — the **same** string on both sides;
   - *"**왼상차림과 오른상차림이 겨루는** 일반적인 귀마 vs 귀마는 **엇상포진**으로
     불린다"* — **different** names give 엇상.

   Given §5, both only work if the strings are read from each player's own left.
   Also the source of the term **귀윗상** and of the 귀마 sub-classification
   (맞상 / 정형 / 변형).
   **Strength: weak-to-moderate as retrieved.** namu.wiki blocks automated
   fetching (see §9), so these are search-engine renderings of the page, not
   verbatim reads. The two claims are mutually consistent and recurred across
   several independent queries, which raises confidence, but I could not read the
   raw text.
2. **pychess janggi documentation** —
   <https://github.com/gbtami/pychess-variants/blob/master/static/docs/janggi.md>
   (rendered at <https://www.pychess.org/variants/janggi>):
   > "If Cho and Han choose the same setup among 3 or 4, it is called **Mat Sang**
   > (Elephants facing each other)."

   Its setup UI is seat-relative too. In `client/roundCtrl.ts`:
   ```js
   const leftSide = this.mycolor === 'white' ? -1 : 1;
   const rightSide = leftSide * -1;
   ```
   with `switchLetters(-1)` editing the left half of the FEN rank string and
   `+1` the right half. Because the board is flipped for the black player, this
   makes the "flip left" button act on that player's **own visual left** either
   way. That is a UI nicety rather than a nomenclature claim, but it shows
   pychess thinks of the flanks seat-relatively.
3. **Korean player community, 장기 마이너 갤러리 (dcinside)** —
   <https://gall.dcinside.com/mgallery/board/view/?id=janggi&no=4912>:
   *"맞상장기(맞상)는 한과 초가 모두 **같은 상차림**일 경우를 말한다."*
   Strength: weak individually (anonymous forum, retrieved via search summary),
   but valuable as an indication of how ordinary players talk.
4. **장하영 프로's own prose**, 서산시대 24456: *"귀마 대 귀마 포진이지만 초와 한의
   마와 상의 **배치가 동일하다** […] '맞상장기'라고도 하는데…"* — he describes 맞상
   as both players having made *the same* arrangement.

### The disagreement, stated precisely

Everyone agrees 맞상 is the rotational board. The dispute is purely over how the
names map onto it:

- **(B) camp:** "왼상차림" names board files 2 and 7 for *whoever* plays it, so
  both playing 왼상차림 gives the translational board, which is 엇상.
- **(A) camp:** "왼상차림" names each player's own-left-outer elephant, so both
  playing 왼상차림 gives the rotational board, which is 맞상.

Broadly: **written/diagrammatic sources (both Wikipedias) use board-absolute;
player-community sources (namu.wiki, dcinside, pychess) use seat-relative.**
There is a plausible practical reason for the split — over the board, sitting
opposite each other, there is no absolute left, so players naturally speak from
their own seat; whereas an author annotating a fixed printed diagram naturally
reads files off the page.

### Sources found to be wrong or self-contradicting — flag these

- **pychess's prose inverts which name is which.** It says:
  > "3. **Left elephant is inside**, and right elephant is outside (Oen Sang
  > Charim, means 'Left Elephant Setup')
  > 4. Left elephant is outside, and right elephant is inside (Oreun Sang Charim,
  > 'Right Elephant Setup')"

  Every Korean source makes **왼상차림 = 상마상마**, in which the left elephant is
  the **outer** one (file 2, next to the chariot); ko.wikipedia puts 왼상 at
  **02**. pychess's description is therefore either an outright error or was
  written from the *top* player's seat (from Han's seat, elephants on files 2 and
  7 do read as "left elephant inside, right elephant outside"). **Do not rely on
  pychess's prose for the name-to-shape mapping.** Its 맞상 statement and its UI
  behaviour are separate claims and are not affected by this.
- **장하영 프로 is internally inconsistent between two columns.** His string
  notation is board-absolute (proved in §5.3: 맞상 = **'상마상마-마상마상'**,
  different strings), yet his prose describes 맞상 as *"초와 한의 마와 상의 배치가
  동일하다"* (the arrangements are the same). These are only reconcilable if
  "배치가 동일" means "both players made the same choice, each relative to
  themselves" rather than "the same board files" — which is a natural thing to say
  but is the opposite convention from his own strings. Both statements describe
  the same physical position; only the vocabulary flips. Cite him for the
  geometry, not for the nomenclature.

---

## 7. File-by-file encodings

Notation: `R` = chariot 차, `E` = elephant 상, `H` = horse 마, `G` = guard 사,
`K` = general 궁 (which sits one rank in from the back rank, on file 5, so the
back rank itself is empty on file 5).

### "Left Elephant Setup" (왼상차림 = 상마상마)

**Convention (B) — board-absolute. This is what both Wikipedias show.**

```
file:          1  2  3  4  5  6  7  8  9
Han back rank  R  E  H  G  .  G  E  H  R      (rank 10)
Cho back rank  R  E  H  G  .  G  E  H  R      (rank 1)
```
Elephants on files 2 and 7 for both armies; horses on 3 and 8. Symmetric under
reflection across the middle of the board. Both 귀마 develop on the board's left.
In Korean terms this pairing is **엇상**.

**Convention (A) — seat-relative. This is namu.wiki / pychess / community usage.**

```
file:          1  2  3  4  5  6  7  8  9
Han back rank  R  H  E  G  .  G  H  E  R      (rank 10; Han's own left is file 9)
Cho back rank  R  E  H  G  .  G  E  H  R      (rank 1; Cho's own left is file 1)
```
Cho's elephants on files 2 and 7; Han's on 3 and 8. Symmetric under 180-degree
rotation. Cho's 귀마 develops on the board's left, Han's on the board's right.
In Korean terms this pairing **is 맞상** — the shape reportedly barred from
official play.

### "Right Elephant Setup" (오른상차림 = 마상마상)

The left-right mirror of the above. Board-absolute back rank for the army it is
named for:
```
file:          1  2  3  4  5  6  7  8  9
               R  H  E  G  .  G  H  E  R
```
Elephants on files 3 and 8.

### The two symmetric setups (no ambiguity)

```
안상차림   (inner):  R  H  E  G  .  G  E  H  R      elephants on 3 and 7
바깥상차림 (outer):  R  E  H  G  .  G  H  E  R      elephants on 2 and 8
```

### The four combinations of two 귀마 setups, by physical shape

| Cho's elephants | Han's elephants | Shape | Korean name |
|---|---|---|---|
| 2, 7 | 2, 7 | translational | 엇상 |
| 3, 8 | 3, 8 | translational | 엇상 |
| 2, 7 | 3, 8 | 180-degree rotational | **맞상** |
| 3, 8 | 2, 7 | 180-degree rotational | **맞상** |

This table is convention-independent and is the one to code against.

---

## 8. How existing software models this

- **pychess-variants** (the main open-source janggi server,
  <https://github.com/gbtami/pychess-variants>) does **not** offer four named
  setup buttons. It runs a **setup phase** during which each player is shown
  their own back rank with two "swap" buttons (one per flank) and a confirm
  check-mark; the client mutates the FEN directly and posts it. From
  `client/roundCtrl.ts::onMsgSetup`. So on pychess the naming question never
  arises in the UI — players just toggle their own flanks.
- pychess's janggi **start FEN** is
  `rnba1abnr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ABNR w - - 0 1`
  (from `tests/test_corr_janggi_setup.py`), i.e. **안상차림 for both** by default
  (`r n b a 1 a b n r` = chariot, horse, elephant, guard, gap, guard, elephant,
  horse, chariot — elephants on files 3 and 7). Uppercase is Cho (moves first),
  lowercase Han; the first FEN field is the **top** rank. Test fixtures in that
  file also show a red setup `rbna1abnr/…` (elephants on files 2 and 7) and a blue
  setup `…/RBNA1ANBR` (바깥상차림) — these are just fixtures and carry no naming
  information.
- **chessvariants**' "Janggi – opening setups" page (Hans Bodlaender) sidesteps
  names entirely: *"red has the choice of the following four setups: Standard
  setup / At one side knight and elephant switched / At the other side knight and
  elephant switched / At both sides knight and elephant switched… This results in
  16 possible starting setups, many of which are symmetric to each other."*
  Reachable only via the Wayback Machine (see §9).
- **Hangame janggi** (the largest Korean online janggi service) publishes the
  four 차림 names in its glossary but no board diagram showing both sides.
  장하영's columns were drawn using Hangame's board and pieces.

---

## 9. Dead ends and things checked but ruled out

Recorded so nobody re-does them.

- **namu.wiki cannot be fetched programmatically.** Direct `curl` and WebFetch
  both return **HTTP 403** (Cloudflare). Also tried and failed: `r.jina.ai`
  proxy (returns the Cloudflare "Just a moment…" interstitial),
  `api.allorigins.win` (HTTP 500), `api.codetabs.com` (HTTP 522),
  `translate.google.com` / `namu-wiki.translate.goog` (redirect loop back to
  namu.wiki). The Wayback Machine has **no snapshot of 「귀마 포진」**. All
  namu.wiki content in this document therefore comes from search-engine
  summarisation and should be treated as second-hand.
- **The board diagrams in the 서산시대 columns are not on the web.** I extracted
  every `cdn.sstimes.kr` image from articles 21698, 21988, 24456 and 24515: each
  article has exactly **one** image, and it is a **photograph of the author**,
  not the `<시작도>` / `<장면도>` board diagrams the text refers to. Reading those
  diagrams would have settled the naming question outright. If anyone can obtain
  the print edition of 서산시대 for 2020-11-03 (column 「대표적 포진에서의 핵심(1)」),
  its `<장면도-2>` is a labelled 맞상장기 board and would be decisive.
- **chessvariants.com** returns **HTTP 403** to direct fetches; the Wayback
  Machine copy works. The page turned out to contain no setup names at all.
- **BrainKing**'s game-rules URL guess (`brainking.com/en/GameRules?tp=42`) served
  the *Small Pente* rules, not janggi. Not pursued further.
- **The Korea Janggi Association archive** (`kja.or.kr/janggi_intro/*`, EUC-KR
  encoded — decode as cp949) was read in full: `b.php`, `b2.php`, `b3.php`
  (history/anecdotes), `c.php` (piece movement), `d.php` (etiquette), `e.php`
  (대국규칙), `f.php` (대국규정). Only the setup-order rule quoted in §4 is
  relevant. **There is no 차림-naming definition and no 맞상 prohibition** in the
  archived pages. The live site's 기물차림 page was not archived with usable
  content.
- **GitHub code search API** requires authentication (HTTP 401); I enumerated the
  pychess repo via the git-trees API instead, which worked.
- **ko.wikipedia's infobox photo** `janggi_set.png` is captioned *"초는 바깥상
  차림이고 한은 안상 차림이다"* — both are left-right symmetric setups, so it
  cannot disambiguate. Likewise `Yang sang2.png` (both sides in the North Korean
  기동차 차림) is symmetric and no help.
- **pychess's `ActiveElephant2.png`** guide image was downloaded and inspected. It
  shows a real position in which **both armies have elephant on file 2 and horse
  on file 3** — the translational shape. But a single example position is
  consistent with *either* naming convention (the two players would simply have
  chosen differently-named setups under (A)), so it is **not** evidence about
  naming. Useful only as confirmation that this shape occurs and that the
  accompanying advice ("open the edge file on the side where your elephant is
  outer") is about wings.
- **ko.wikibooks 「장기/초반 포진법」** — a formation overview with half-board
  diagrams of Cho only; no information on the two-player question.
- **A YouTube video** titled "Janggi - Starting Positions (Left Elephant vs.
  Right Elephant)" (`youtube.com/watch?v=QwrGMGWnih0`) appeared in search results
  and was **not** examined. It may be worth a look.
- **Hangame's 좌변졸/좌진졸/중앙졸/우진졸/우변졸 pawn names** (*"맨 왼쪽에 있는
  졸부터… 병도 마찬가지로 좌변병 좌진병…"*) are another place where Korean janggi
  vocabulary uses left/right without saying whose. Checked; ambiguous; no help.
- **namu.wiki's 좌원앙마/우원앙마 note** (*"포진의 명칭은 왼상차림(상마상마)을
  기준으로 정해지기 때문에… 오른상(마상마상) 기준으론 반대가 된다"*) is about
  naming an *opponent's* formation relative to your own setup; interesting but it
  does not resolve the seat question, and it came through a search summary.

---

## 10. Open questions / what I could not establish

1. **Which naming convention, if either, is canonical.** No authoritative
   Korean rulebook or federation glossary defining 왼상 / 오른상 with respect to a
   specific player's seat was found. The Korea Janggi Association's archived
   pages do not define it, and their live site was not reachable in a usable form.
   The 대한장기연맹 (a separate federation, `kojf.net`) has a 2019 rules revision
   posting that I did not retrieve; that is the most promising remaining lead.
2. **namu.wiki's exact wording**, verbatim. Everything attributed to it here is
   second-hand. In particular, its 맞상 sentence — reported as "'마상마상' vs
   '마상마상' 또는 '상마상마' vs '상마상마'" — could conceivably be a summariser's
   garbling of a sentence listing the two *mixed* orderings. Its second sentence
   ("왼상차림과 오른상차림이 겨루는… 엇상포진") is harder to explain away and is
   what makes me treat namu as genuinely seat-relative, but a raw read is needed.
3. **The 서산시대 board diagrams**, which are not published online (§9). The
   `<장면도-2>` of column 24456 is a labelled 맞상 board and would settle both the
   naming question and 장하영's internal inconsistency in one look.
4. **Whether 맞상 is actually prohibited by written rule** in South Korean
   official competition, or is merely strongly deprecated. Two of 장하영's columns
   assert a prohibition; the archived KJA rulebook does not contain it.
5. **Whether printed Korean janggi textbooks** (e.g. 김지환 『필승 장기강좌』,
   『장기 포진법』, which 장하영 cites as his own source) define the terms
   seat-relatively. No digitised copies were located.
6. **How Korean commercial janggi apps label the setups**, if they label them at
   all. Hangame's glossary lists the names but I found no product screenshot of a
   setup screen showing named options for the top player.

---

## 11. Practical recommendations for an implementation

1. **Model the choice per army, not per board.** Store each side's arrangement
   independently and render it on that side's own back rank. All 16 combinations
   become reachable and the naming dispute never bites. (This is exactly what
   pychess does, and what chessvariants describes.)
2. **Never let a single shared label determine both armies' files.** A user
   picking "Left Elephant" for both sides has no single correct board; the two
   conventions disagree.
3. **If you show labels in the UI**, seat-relative labels ("your left") match how
   Korean players talk (namu.wiki, dcinside, pychess: "if both choose the same
   차림 it's 맞상"). But be aware that the Wikipedia diagrams a user may compare
   against are board-absolute, so the same label will look inconsistent with them.
   Labelling by the resulting **formation** (귀마 left / 귀마 right / 원앙마 /
   양귀마) avoids the ambiguity entirely and is arguably more informative.
4. **The classification that actually matters mechanically is 맞상 vs 엇상** —
   opposite vs same board wing — which you can compute directly from the two
   arrangements using the table in §7. If you want tournament fidelity, consider
   flagging or disallowing 맞상 when both sides choose 귀마 setups (§5.4, with its
   caveat).
5. **Setup order:** Han (red) places first, then Cho (blue), and Han may not
   revise afterwards; Cho then moves first and Han receives 1.5 덤 points. If you
   implement the setup phase faithfully, Cho is the player who decides whether the
   game becomes 맞상.

---

## 12. Source table

| Source | URL | What it claims | Weight |
|---|---|---|---|
| ko.wikipedia 「상 (장기)」 + `File:Yang sang.png` | <https://ko.wikipedia.org/wiki/%EC%83%81_(%EC%9E%A5%EA%B8%B0)> | 왼상차림 = elephants at 02/07; explicit both-왼상차림 board diagram with **both armies on files 2 and 7** | **Primary and directly on-point**, but amateur-authored |
| ko.wikipedia 「장기」 | <https://ko.wikipedia.org/wiki/%EC%9E%A5%EA%B8%B0> | four 차림 and their strings; KJA coordinate notation; setup order; 5분법 formations; North Korean 기동차 차림 | Good background |
| en.wikipedia Janggi | <https://en.wikipedia.org/wiki/Janggi> | the four setups in `r m e / e m r` form; Han places first then Cho; Central Chariot Setup; scoring | Derivative of the Korean article |
| en.wikipedia `Template:Janggi setup` | <https://en.wikipedia.org/wiki/Template:Janggi_setup> | renders Han and Cho rows from identical parameters — all en.wikipedia diagrams are translational | Primary for "what Wikipedia depicts" |
| 장하영 프로, 서산시대 「귀마 대 귀마 포진에서의 전형적 10수」 | <http://www.sstimes.kr/news/articleView.html?idxno=21698> | 10,000-game statistics; 맞상 = **'상마상마-마상마상'**; 맞상 banned officially; annotated game decoded in §5.3 | **Strongest single source**; board-absolute strings |
| 장하영 프로, 「대표적 포진에서의 핵심(1)」 | <http://www.sstimes.kr/news/articleView.html?idxno=24456> | 맞상 = "초와 한의 마와 상의 배치가 동일하다"; elephants must be traded; "정식 대국에서는 금지되는 포진" | Good for geometry; **self-contradicting on nomenclature** |
| 장하영 프로, 「양귀마 대 귀마 포진에서 후수 귀마의 대응책」 | <http://www.sstimes.kr/news/articleView.html?idxno=21988> | explicit move list used to pin down the column's notation | Supporting |
| 장하영 프로, 「포진에서 마와 상의 관계」 | <https://www.sstimes.kr/news/articleView.html?idxno=24375> | 마 and 상 positions determine each other; formation overview | Background |
| namu.wiki 「귀마 포진」 / 「장기/용어」 | <https://namu.wiki/w/%EA%B7%80%EB%A7%88%20%ED%8F%AC%EC%A7%84> | 맞상 = same string on both sides; 엇상 = 왼상차림 vs 오른상차림; **귀윗상**; 맞상/정형/변형 sub-types; Han sets up first | Moderate; **retrieved only via search summaries — could not be read raw** |
| pychess janggi docs | <https://github.com/gbtami/pychess-variants/blob/master/static/docs/janggi.md> | "same setup by both = Mat Sang"; Cho's three privileges; outer elephant is the active one | Moderate; **its name-to-shape prose is inverted — see §6** |
| pychess `client/roundCtrl.ts` | <https://github.com/gbtami/pychess-variants/blob/master/client/roundCtrl.ts> | setup phase is two seat-relative flank-swap buttons; no named setups in the UI | Primary for how the server behaves |
| 장기 마이너 갤러리 (dcinside) | <https://gall.dcinside.com/mgallery/board/view/?id=janggi&no=4912> | "맞상장기는 한과 초가 모두 같은 상차림일 경우" | Weak (anonymous forum, via search summary), useful as community usage |
| 한게임 장기 용어 | <https://janggi.hangame.com/tip.nhn?id=1> | the four 차림 with strings; 맞상포진 = elephants facing diagonally; 정형/변형; pawn names | Reliable for vocabulary; silent on orientation |
| BrainTV 「장기의 포진법과 장단점」 | <https://www.braintv.co.kr/web_basic/board/view.asp?pagen=142&sno=3189> | five formations; 맞상 = "상이 대각선으로 마주보는 형태"; 차림 vs 포진 distinction; 차림-to-포진 mapping | Reliable for vocabulary; silent on orientation |
| 대한장기협회 대국규정 / 대국규칙 (archived) | <https://web.archive.org/web/20131005190526/http://kja.or.kr/janggi_intro/f.php> | **setup order rule** (quoted §4); scoring; repetition rules | **Authoritative** for setup order; contains no 차림 naming and no 맞상 ban |
| chessvariants "Janggi – opening setups" | <https://www.chessvariants.com/oriental.dir/korean/changgi-opening.html> (403 direct; use Wayback) | red arranges first; 16 combinations; describes setups without names | Weak but confirms structure |
| ko.wikibooks 「장기/초반 포진법」 | <https://ko.wikibooks.org/wiki/%EC%9E%A5%EA%B8%B0/%EC%B4%88%EB%B0%98_%ED%8F%AC%EC%A7%84%EB%B2%95> | formation overview; 구귀마 / 신귀마 | Background |

---

## 13. Confidence summary

| Claim | Confidence |
|---|---|
| Setup order: Han places first, Cho second, Han cannot revise; Cho moves first | **High** — quoted from the KJA's own regulations |
| The four setups and their 마상 strings | **High** — five independent sources agree |
| 맞상 = the two 귀마 / outer elephants on opposite board wings = the 180-degree rotational board; 엇상 = same wing = the translational board | **High** — geometric derivation from the elephant's `(±2,±3)`/`(±3,±2)` move, matching four independent Korean definitions, plus one professional's annotated game decoded coordinate by coordinate |
| In 왼상차림 (= 상마상마), the elephant that gives the setup its name is the **outer** one, next to the chariot | **High** — Hangame, BrainTV, ko.wikipedia (왼상 at 02), en.wikipedia all agree; **pychess's prose disagrees and is the outlier** |
| Which physical shape the *name* 왼상차림 denotes for the top player — i.e. rotational vs translational when both pick the same name | **Low — sources genuinely conflict.** Do not treat either convention as canonical |
| 맞상 is prohibited in official South Korean competition | **Moderate** — asserted twice by a professional; **not found in the archived KJA rulebook** |
