# Making the synthesised instruments sound real

User feedback: the sounds should be more realistic. Everything in `webapp/src/audio/` is synthesised
(no samples), so this records what the real instruments do that a plain synth does not, what was
tried, and what was kept, so nobody re-runs the same experiments.

## What makes a plucked or struck sound read as "synth"

Every partial sharing one envelope, a static spectrum, and nothing standing in for the instrument's
body. The fixes are the same everywhere: give each partial its own decay, model the pluck/strike
transient, and put the sound through a few fixed body resonances.

## Kept

**Gayageum** (`instruments/Gayageum.ts`, `instruments/gayageum/StringPartialsOf.ts`). A silk string
plucked near one end: the upper partials die much faster than the fundamental, the plucking point
thins the spectrum (partial *n* is weighted by `|sin(nπp)|`, p ≈ 0.16), a stiff string rings slightly
sharp, and the soundboard has fixed resonances (~200, 450, 1100 Hz). 농현 (the left-hand pressing
beyond the bridge) is a small scoop into the note plus a one-sided vibrato on long notes. So: up to 8
additive sines with per-partial decays, a 12 ms nail burst of noise, three peaking filters and a
lowpass that follows the note's pitch. The sawtooth it replaced had every partial at 1/n decaying
together.

The first version was too pure: in the full mix it sounded like a chipmunk, thin and high beside
the rest, and the deployed sawtooth was preferred. What brought it back, tuned by ear in the running
game (a floating button per candidate that restarted the music, then an audition page), was:

- an `edge` (0–1) that keeps the upper partials brighter and longer-ringing, shortens the rise and
  nail, and opens the lowpass, **0.5 by default** (a plucked note with the flesh of the thumb). A picked
  or pulled note sounded right at 0.7–0.8 and the **check** cue uses 0.8, because the sawtooth's
  sharpness is what alerted the player. Below about 0.4 it is thin; at 0.8 on a loop it tires;
- a **12-cent scoop** into each note instead of 40, which read as a squeak;
- **upper partials that die more slowly** (partial *n* takes `length / n^0.55`, not `n^0.9`): the
  faster fade made the note plinky and softer than the sawtooth beside it;
- a lowpass that follows the note's pitch (about 8× it) rather than a fixed cutoff, and a rise of
  about 6 ms, which took the sharpness out of the attack on a loop;
- a shallow, one-sided **농현** on long notes: 40 cents, 3.5 Hz, beginning at once. Pressing the
  string beyond the bridge only raises pitch, so it never goes below the note. 70 cents and above,
  or 4.5 Hz and above, was too much beside the music.

Judging a voice in isolation misled: the first version was fine on its own and wrong in the mix.

**Tried and dropped, all on the gayageum** (the code was removed): repeated there-and-back slides
(a "trill") at 30–170 ms and 60–150 cents, in every combination, plus a quick slide on a note in a
phrase. Heard as awful in every one. The single release (+300 cents falling in 140 ms) and one
down-up slide sounded natural on their own but poor in a phrase, so nothing plays them. A phrase built
from many hard, picked plucks (a "sanjo-like" one) was obnoxious on a loop.

**Wood block** (`instruments/WoodBlock.ts`). Only a bug fix: see the leak below.

## Tried and dropped (indistinguishable or worse by ear)

- **Janggu**: a second and third inharmonic membrane mode on each head (~1.59 and 2.14 times the
  fundamental), a quiet big-head boom under every stick stroke (the heads share one body), a rattle of
  the skin's fibres, and ±2 % pitch and ±10 % level per stroke. Level-matched to the old drum, and
  judged fine on its own, but the original was kept.
- **Daegeum**: fundamental plus overtones, a buzz band from the 7th partial up for the 청 (the reed
  membrane; the research says its partials differ from about the 7th), a breath puff and pitch scoop
  at the onset, drifting vibrato. The plain sine was preferred.
- **Gong**: a beating twin at ×1.004, two more inharmonic partials, a mallet thump and clang. The
  original five partials were preferred.
- **Board**: three bar-mode partials (1, 2.76, 5.4) in place of the triangle body. Inaudible.
- **Ajaeng** (check theme): bow noise and a wandering pitch. Inaudible.
- **Reverb**: 15 ms pre-delay and early reflections in the impulse response, darker tail.
  Inaudible.

Not tried: Karplus–Strong. A feedback `DelayNode` cannot go below one 128-sample render quantum
(about 375 Hz at 48 kHz), so it needs an AudioWorklet; additive did well enough not to need one.

## The gain-leak bug (found twice)

An `AudioParam` holds its default until its first scheduled event. `strike(gain, {when: t + 0.008})`
on a gain whose oscillator starts at `t` leaves the gain at its default of **1** for those 8 ms, so a
full-volume tone leaks. The wood block's heavy-blow thud did this, which is what clipped medium and
heavy captures; a rattle written during this work did the same. **Start the source at the moment its
envelope starts** (`tone.start(struck)`), or start the envelope at the source.

## Checking

The node graph has no unit tests (Node has no `AudioContext`), and ear is the test that matters.
What can be measured is **loudness and headroom**: render a voice in an `OfflineAudioContext` in
headless Chromium and compare RMS and peak with the old voice. That is how the gayageum and janggu
were level-matched, and how the leak above was found (a peak of 2.0 where 0.7 was expected). The soft
clip starts at 0.75, effects sit at 0.55, and music shares the bus, so keep a heavy hit's peak under
about 0.65 before the soft clip.

## Sources

- Gayageum physical modelling with a noise exciter: http://koreascience.or.kr/article/JAKO201816563163547.page
- 농현: https://en.wikipedia.org/wiki/Gayageum
- Daegeum 청 timbre: https://www.researchgate.net/publication/264099036_A_Study_on_the_Timbre_and_Noise_of_Daegeum_by_Cheong_Vibration
- Janggu heads: https://en.wikipedia.org/wiki/Janggu
- Karplus–Strong: https://en.wikipedia.org/wiki/Karplus%E2%80%93Strong_string_synthesis
