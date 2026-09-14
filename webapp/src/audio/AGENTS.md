# AGENTS.md — the sound

`src/audio/` plays the game's sound: the sound effects of the board and the music under it. **It is
playback, and knows nothing of janggi.** It is handed cues — a named sound, and how hard to strike it
— and a mood — how tense, whether the check theme plays, whether and how the music ends — and plays
them. It draws nothing, and holds nothing the page could come to lean on.

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
instruments/            one synthesised instrument each: WoodBlock, Janggu, Gayageum, Daegeum, Piri, Gong, Breath
modes/                  평조 and 계면조, the two five-note modes everything is tuned in, and PitchOf
music/
  CreateConductor.ts    the lookahead scheduler that plays the layers
  layers/               the six layers, each a thin shell around a pattern and an instrument
  patterns/             what each layer plays on a step: LeadNoteAt, EchoNoteAt, PulseHitsAt, …
  cycle/                BeatAt, with JANGDAN beneath it — the court music's six-beat cycle
  bars/                 StepInBar, with STEPS_PER_BAR beneath it — plain eight-step bars
  mood/                 LayerGainsFor and SecondsPerStep — how loud and how fast the music plays
```

The root is what `react/` reaches — the director and the types it takes and gives — and every other
folder is reached only by the director, through `cues/` and `music/`. Beneath those, a file sits under
what uses it: `modes/` is at the root because both the cues and the music tune by it, and a type an
instrument needs lives with the instruments (`Slide`, like `JangguHead`) even where the music fills it
in, so `instruments/` never reaches up into `music/`.

## The two musics

**The game's own music is in the manner of 수제천**, the slow court piece — not a copy of it. Its
melody is generated, and nothing is transcribed. What it takes from that music is its manner:

- **Rhythm:** a spacious court-music pace, counted in an uneven six-beat cycle (`JANGDAN`) rather than in
  even bars.
- **Lead:** a piri-like reed holds one long note to each beat, moving by no more than a step, scooping up
  into notes and letting their ends fall away.
- **Echo:** a daegeum takes up the reed's last note on the cycle's final beat while the reed rests (연음).
- **Drums:** janggu strokes are placed on that cycle.

**The check theme is its own music and is deliberately left alone** — a trembling low string in 계면조
over a heartbeat drum, counted in plain eight-step bars at a pace of its own. It was liked as it is:
`SecondsPerStep.test.ts` pins its tempo, and a change to the court music must not drag it along.

## Deciding is pure; sounding is not

Every decision the playback makes is a pure function and is unit tested — how loud each layer should
be for a mood (`layerGainsFor`), how loud a channel is at a player's volume (`channelGainFor`), what a
layer plays on a step (`patterns/`), how fast the music goes (`secondsPerStep`), and which note a
degree of a mode is (`pitchOf`). **Put a new decision in one of those shapes**, with its test beside
it, and keep the node graph that plays it as thin as the layers are. A decision that needs the game
to make is not one of these: it belongs with the page, beside `cuesFor` and `moodOf`.

The node graph itself — the instruments, the voicings, the layers, the conductor and the director —
**is not unit tested, and is checked by ear.** Node has no `AudioContext`, and a test that stubbed
enough of one to run would assert the calls this code makes rather than anything a player hears. What
a browser test can see is the choice a player makes (`acceptance-tests/src/tests/board/ChoosingSound`),
and `useGameAudio`'s test covers what the page asks of the director with the director mocked.

Chance in the music is **handed in**, never rolled inside a pattern: `leadNoteAt` and `echoNoteAt` take
their rolls as arguments, and the layers pass `Math.random()`. That is what makes the patterns testable.

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
- **Loudness eases, it never jumps.** A layer moves towards its level with `setTargetAtTime`, and a
  change of tempo waits for a bar line. The check theme eases in quickly and out slowly — a check lands
  at once, and the dread lingers after it is answered. The game's own layers never drop out as tension
  rises; they are ducked underneath the check theme rather than stopped, so they are still there when
  it fades.
- **Every layer is scheduled on the audio clock, from one conductor**, so they cannot drift apart.
  A timer that fires late books its notes on time anyway. Do not start an instrument from a
  `setTimeout`.
- **The music keeps no history.** It moves towards whatever mood it was last handed, so a mood that
  falls — a take-back, a new deal — takes the music down with it and nothing here has to know why.
