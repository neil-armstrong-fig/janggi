# AGENTS.md — the sound

`src/audio/` plays the game's sound: the sound effects of the board and the music under it. **It is
playback, and knows nothing of janggi.** It is handed cues — a named sound, and how hard to strike it
— and a mood — whether a game is under way, how tense, whether the check theme plays, whether and how
the music ends — and plays them. It draws nothing, and holds nothing the page could come to lean on.

What a change sounds like and how a position feels are **the page's decisions**, made from the game
state the page already holds: `cuesFor` and `moodOf` under `react/pages/game/hooks/`, called by
`useGameAudio`. A take-back being one quiet sound, a capture struck by what it took, tension being
material off the board — all of that is decided there, and documented beside the code that decides it.

**Everything is synthesised.** There is no sample, no audio file and no dependency — every sound is
built from oscillators, filtered noise and gain envelopes in the Web Audio API, for the same reason
`public/icon.svg` is generated from strokes rather than drawn: nothing to source, license or cache.

## Layering

`react/ → audio/`, and nothing below it. Enforced by `audioIsIsolated` in `webapp/eslint.config.js`:
no `game/`, `redux/` or `react/`, no `@janggi/shared`, and neither React nor Redux.

**Its inputs are its own types** — `Cue`, `CueName`, `Mood`, `Ending`, `AudioChannels` — so something
new the playback needs to be told is added to `types/` here and filled in by the page, never read
off the engine. Cue names still name the moments they are for (`check`, `bikjang`), because that is
what each one is voiced to sound like; they are a catalogue of sounds, not a reading of the board.

## Layout

```
CreateAudioDirector.ts  createAudioDirector(): AudioDirector — the one object the page holds
types/                  Cue, CueName, Mood, Ending, AudioChannels, AudioDirector — all the page sees
utils/ChannelGainFor.ts channelGainFor(volume, full): number — a slider's volume as a gain, squared

cues/CueVoicings.ts     how every cue is played, typed against the list of cues
instruments/            one synthesised instrument each: WoodBlock, Janggu, Gayageum, Daegeum, Gong, Breath
modes/                  평조 and 계면조, the two five-note modes everything is tuned in, and PitchOf
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

The root is what `react/` reaches — the director and the types it takes and gives — and every other
folder is reached only by the director, through `cues/` and `music/`. Beneath those, a file sits under
what uses it: `modes/` is at the root because both the cues and the music tune by it, and a type an
instrument needs lives with the instruments (like `JangguHead`) even where the music fills it in, so
`instruments/` never reaches up into `music/`.

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
  call repeated, an answer, a close onto the root — built from motifs written in twos or threes for the
  장단 it is in, with quick runs part way through a step (`soloNotesAt`, `phrasePlanFor`). A line that
  chose every note afresh was heard as having no tune at all.
- **Answer:** a 대금 breathes a long note where each phrase turns and where it closes, once the game
  has opened (`answerNoteAt`).
- **Janggu:** each 장단 has its own figure — the opening stroke on both heads, the groove in light
  strokes off the beat, ghost strokes as it grows tense (`jangguHitsAt`).

**The bass sets the chord, and the melodies follow it.** One progression (`chordAt`) changes chord
every bar of the waiting theme and every half round of the game; the bass plucks each chord's root on
the beats, and the soloist, the flute and the waiting theme lean only on the chord's tones
(`chordToneNear`). Every chord is three notes of 평조, so nothing is out of key — the point is that no
line leans on a note that rubs against the bass. There is no drone: a held note under everything
became a hum. An ending lets all of the music go.

**The groove is subtle.** Swing only where the 장단 is counted in twos, and only a little; timing
loosened by a few milliseconds at most; syncopation left to the drum, with the bass on the beats.
More than that was heard as players who could not keep time.

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
thin as the layers are. A decision that needs the game to make is not one of these: it belongs with the
page, beside `cuesFor` and `moodOf`.

The node graph itself — the instruments, the voicings, the layers, the conductor and the director —
**is not unit tested, and is checked by ear.** Node has no `AudioContext`, and a test that stubbed
enough of one to run would assert the calls this code makes rather than anything a player hears. What
a browser test can see is the choice a player makes (`acceptance-tests/src/tests/board/ChoosingSound`),
and `useGameAudio`'s test covers what the page asks of the director with the director mocked.

Chance in the music is **handed in**, never rolled inside a pattern: `waitingNoteAt`, `phrasePlanFor`
and `grooveOffsetAt` take their rolls as arguments, and the layers and the conductor pass
`Math.random()`. That is what makes the patterns testable.

## Conventions particular to here

- **The rarest cues get the loudest voicings.** A quiet move is heard sixty-odd times a game, so
  `piecePlaced` is a soft clack, pitched a few cents differently every time; `pieceTaken` is struck as
  hard as its weight says; `check` is a drum; the three endings are the gong, which is struck for
  nothing else. Do not voice a cue the page sends often without taking that budget into account.
- **A cue is heard once.** `play` takes the id of the moment it came from and ignores any id it has
  already heard, which is what keeps React's double-rendered effects from doubling a sound.
- **Nothing sounds before a gesture.** The `AudioContext` is created by `unlock`, which the page calls on
  the first `pointerdown`. Browsers refuse audio a player did not ask for; everything before then is
  simply not heard.
- **Nothing plays off screen.** The page tells the director when it is put away and brought back
  (`setOnScreen`), and the `AudioContext` is suspended rather than closed — its clock stops, so the
  music carries on from exactly where it was. A context a phone will not resume by itself is woken by
  the next tap.
- **Loudness eases, it never jumps.** A layer moves towards its level with `setTargetAtTime`, a change
  of tempo waits for a bar line, and a change of 장단 for the end of a round. The music comes in a layer
  at a time when it starts (`ENTERING`). The check theme eases in quickly and out slowly — a check lands
  at once, and the dread lingers after it is answered. The game's own layers never drop out as tension
  rises; they are ducked underneath the check theme rather than stopped, so they are still there when
  it fades.
- **Every layer is scheduled on the audio clock, from one conductor**, so they cannot drift apart.
  A timer that fires late books its notes on time anyway. Do not start an instrument from a
  `setTimeout`. **Phones are what it is tuned for:** it books a few tenths of a second ahead so a busy
  main thread does not starve it, a timer held up for longer lets the steps it missed go rather than
  piling them onto one instant, and the `AudioContext` asks for a `balanced` buffer so the audio thread
  does not run dry. A layer that is silent is unplugged, not just turned down — the browser works every
  node still connected, however quiet.
- **The music keeps no history.** It moves towards whatever mood it was last handed, so a mood that
  falls — a take-back, a new deal — takes the music down with it, back to a calmer 장단 or all the way
  to the waiting theme, and nothing here has to know why.
