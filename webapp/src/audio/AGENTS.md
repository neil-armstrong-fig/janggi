# AGENTS.md — the sound

`src/audio/` plays the game's sound: the sound effects of the board and the music under it. **It is
playback, and knows nothing of janggi.** It is handed cues — a named sound, and how hard to strike it
— and a mood — whether a game is under way, how tense, whether the check theme plays, whether and how
the music ends — and plays them. It draws nothing, and holds nothing the page could come to lean on.

What a change sounds like and how a position feels are **the page's decisions** — `cuesFor`/`moodOf`
under `react/pages/game/hooks/`, see `webapp/src/react/AGENTS.md`. **Its inputs are its own types** —
`Cue`, `CueName`, `Mood`, `Ending`, `AudioChannels` — so something new the playback needs to be told is
added to `types/` here and filled in by the page, never read off the engine. Cue names still name the
moments they are for (`check`, `bikjang`), because that is what each one is voiced to sound like; they
are a catalogue of sounds, not a reading of the board.

**Everything is synthesised.** There is no sample, no audio file and no dependency — every sound is
built from oscillators, filtered noise and gain envelopes in the Web Audio API, for the same reason
`public/icon.svg` is generated from strokes rather than drawn: nothing to source, license or cache.

## Layout

The root — `CreateAudioDirector.ts`, `types/`, `utils/ChannelGainFor.ts`, `soft-clip/` — is what
`react/` reaches, and every other folder (`cues/`, `instruments/`, `modes/`, `music/`) is reached only
by the director. Beneath those, a file sits under what uses it: `modes/` (the two five-note modes
everything is tuned in) is at the root of that group because both `cues/` and `music/` tune by it, and
a type an instrument needs lives with the instruments even where the music fills it in, so
`instruments/` never reaches up into `music/`.

`music/AGENTS.md` covers the game's own music — its own folder, its own conventions.

## Conventions particular to here

- **The rarest cues get the loudest voicings.** A quiet move is heard sixty-odd times a game, so
  `piecePlaced` is a soft clack, pitched a few cents differently every time; `pieceTaken` is struck as
  hard as its weight says; `check` is a drum; the three endings are the gong, which is struck for
  nothing else. Do not voice a cue the page sends often without taking that budget into account.
- **A cue is heard once.** `play` takes the id of the moment it came from and ignores any id it has
  already heard, which is what keeps React's double-rendered effects from doubling a sound.
- **Nothing sounds before a gesture.** The `AudioContext` is created by `unlock`, which the page calls
  on the first `pointerdown`. Browsers refuse audio a player did not ask for; everything before then
  is simply not heard.
- **Nothing plays off screen.** The page tells the director when it is put away and brought back
  (`setOnScreen`), and the `AudioContext` is suspended rather than closed — its clock stops, so the
  music carries on from exactly where it was.
- **Loudness eases, it never jumps.** A layer moves towards its level with `setTargetAtTime`, a change
  of tempo waits for a bar line, and a change of 장단 for the end of a round. The check theme eases in
  quickly and out slowly — a check lands at once, and the dread lingers after it is answered. The
  game's own layers never drop out as tension rises; they are ducked underneath the check theme rather
  than stopped, so they are still there when it fades.
- **Every layer is scheduled on the audio clock, from one conductor**, so they cannot drift apart. A
  timer that fires late books its notes on time anyway. Do not start an instrument from a `setTimeout`.
  **Phones are what it is tuned for:** it books a few tenths of a second ahead so a busy main thread
  does not starve it, a timer held up for longer lets the steps it missed go rather than piling them
  onto one instant, and the `AudioContext` asks for a `playback` buffer so the audio thread does not
  run dry. A layer that is silent is unplugged, not just turned down — the browser works every node
  still connected, however quiet.
- **The music keeps no history.** It moves towards whatever mood it was last handed, so a mood that
  falls — a take-back, a new deal — takes the music down with it, and nothing here has to know why.
