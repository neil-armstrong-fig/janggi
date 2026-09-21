# AGENTS.md — music

```
music/
  CreateConductor.ts    the lookahead scheduler that plays the layers
  layers/               the six layers, each a thin shell around a pattern and an instrument
  patterns/             what each layer plays on a step: SoloNotesAt, JangguHitsAt, BassNoteAt, …
  rhythm/               RHYTHMS, RhythmFor and BeatIn — the three 장단 the game's music moves through
  harmony/              ChordAt and ChordToneNear — the chord the bass sets, and a melody bent onto it
  groove/               GrooveOffsetAt — how late each step lands: swung off-steps, loosened by a hair
  space/                CreateSpace — the synthesised room every layer but the check theme rings in
  bars/                 StepInBar, with STEPS_PER_BAR beneath it — plain eight-step bars
  mood/                 LayerGainsFor and SecondsPerStep — how loud and how fast the music plays
```

## The three musics

**The waiting theme plays before a game is under way**, while a player sets it up — which the page
decides with `playHasBegun`, so a game taken back to its start waits again. A 가야금 plucks a fixed
two-phrase theme in 평조 (`waitingNoteAt`, with passing notes left out at random) over a softer bass,
at a pace of its own. The first move lets it fall away quickly as the game's own layers rise over the
same bass.

**The game's own music is in the manner of 산조** — a 가야금 soloist over the 장구, moving through
quicker and quicker 장단 — not a copy of any. Nothing is transcribed. What it takes is the shape:

- **Rhythm:** three 장단 (`RHYTHMS`), chosen by tension — 중모리 at the opening, 중중모리 as the fight
  opens, 자진모리 at its height — each quicker than the last, and a little quicker within itself as
  tension climbs. Every 장단 fills a 24-step round, and a change waits for the round to end, with the
  drum filling into it. There is no 진양조: a game's opening should not crawl.
- **Solo:** the 가야금 plays **motifs**, not a wandering line. A phrase is four chords — a call, the
  call repeated, an answer, a close onto the root — built from motifs written in twos or threes for
  the 장단 it is in, with quick runs part way through a step (`soloNotesAt`, `phrasePlanFor`). A line
  that chose every note afresh was heard as having no tune at all.
- **Answer:** a 대금 breathes a long note where each phrase turns and where it closes, once the game
  has opened (`answerNoteAt`).
- **Janggu:** each 장단 has its own figure — the opening stroke on both heads, the groove in light
  strokes off the beat, ghost strokes as it grows tense (`jangguHitsAt`).

**The bass sets the chord, and the melodies follow it.** One progression (`chordAt`) changes chord
every bar of the waiting theme and every half round of the game; the bass plucks each chord's root on
the beats, and the soloist, the flute and the waiting theme lean only on the chord's tones
(`chordToneNear`). Every chord is three notes of 평조, so nothing is out of key. There is no drone: a
held note under everything became a hum. An ending lets all of the music go.

**The groove is subtle.** Swing only where the 장단 is counted in twos, and only a little; timing
loosened by a few milliseconds at most; syncopation left to the drum, with the bass on the beats. More
than that was heard as players who could not keep time.

**The check theme is its own music and is deliberately left alone** — a trembling low string in 계면조
over a heartbeat drum, counted in plain eight-step bars at a pace of its own. It was liked as it is:
`SecondsPerStep.test.ts` pins its tempo, it is played dry and on the grid (`IN_THE_ROOM` and
`IN_THE_GROOVE` in the conductor), it is not tied to the chords, and a change to the other musics must
not drag it along.

## Deciding is pure; sounding is not

Every decision the playback makes is a pure function and is unit tested — how loud each layer should
be for a mood (`layerGainsFor`), how loud a channel is at a player's volume (`channelGainFor`), what a
layer plays on a step (`patterns/`), which 장단 and chord the music is in (`rhythmFor`, `chordAt`), how
fast the music goes (`secondsPerStep`), and which note a degree of a mode is (`pitchOf`). **Put a new
decision in one of those shapes**, with its test beside it, and keep the node graph that plays it as
thin as the layers are. A decision that needs the game to make is not one of these — it belongs with
the page, beside `cuesFor` and `moodOf`.

The node graph itself — the instruments, the voicings, the layers, the conductor and the director —
**is not unit tested, and is checked by ear.** Node has no `AudioContext`, and a test that stubbed
enough of one to run would assert the calls this code makes rather than anything a player hears. What
a browser test can see is the choice a player makes
(`acceptance-tests/src/tests/board/ChoosingSound`), and `useGameAudio`'s test covers what the page
asks of the director with the director mocked.

Chance in the music is **handed in**, never rolled inside a pattern: `waitingNoteAt`, `phrasePlanFor`
and `grooveOffsetAt` take their rolls as arguments, and the layers and the conductor pass
`Math.random()`. That is what makes the patterns testable.
