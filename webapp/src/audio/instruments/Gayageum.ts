import type {SoundOutput} from "@src/audio/types/SoundOutput";
import {strike} from "@src/audio/instruments/utils/Strike";
import {noiseBuffer} from "@src/audio/instruments/utils/NoiseBuffer";
import {pitchPathOf} from "@src/audio/instruments/gayageum/PitchPathOf";
import {stringPartialsOf} from "@src/audio/instruments/gayageum/StringPartialsOf";

/** One plucked note. */
export interface GayageumPluck {
  /** In hertz. */
  readonly frequency: number;
  /** From nought to one. */
  readonly weight: number;
  /** How long the string rings, in seconds. */
  readonly length: number;
  /** From nought to one, and `DEFAULT_EDGE` unless said: a harder, brighter, sharper note, for one that must cut through. */
  readonly edge?: number;
}

/**
 * A plucked string in the manner of the 가야금, the zither the music's melodies and plucked lines are
 * played on.
 *
 * Built up from the string's own partials, each dying at its own rate, so a note is bright at the pluck
 * and pure as it rings — which a filter closing over one bright oscillator never quite is. A breath of
 * noise is the nail meeting the silk, and the whole passes through the soundboard's few resonances.
 * The pitch is pushed up into the note and settles, a long note gets a shallow, one-sided 농현, and as it
 * dies the pitch sags a touch: the player's hand pressing the string beyond the bridge, which more than
 * anything is what makes a plucked note sound Korean rather than merely plucked. See `docs/sound.md`.
 */
export function gayageum({context, destination}: SoundOutput, when: number, gayageumPluck: GayageumPluck): void {
  const {frequency, weight, length, edge = DEFAULT_EDGE} = gayageumPluck;
  const end = when + length + 0.05;
  const peak = 0.12 + 0.18 * weight;

  const soundboard = createSoundboard(context, {frequency, edge});
  soundboard.output.connect(destination);

  const vibrato = length >= VIBRATO_FROM ? createNonghyeon(context, {when, length, end}) : undefined;
  const path = pitchPathOf(length);

  stringPartialsOf({frequency, weight, length, edge}).forEach(partial => {
    const tone = context.createOscillator();
    tone.type = "sine";
    path.forEach(({seconds, cents}, index) => {
      const pitch = frequency * partial.ratio * 2 ** (cents / 1200);

      if (index === 0) tone.frequency.setValueAtTime(pitch, when);
      else tone.frequency.exponentialRampToValueAtTime(pitch, when + seconds);
    });
    vibrato?.connect(tone.detune);

    const level = context.createGain();
    strike(level.gain, {
      when,
      peak: peak * partial.level * MAKEUP,
      attack: ATTACK_AT_NOUGHT * ATTACK_SHRINKS_BY ** edge,
      decay: partial.decay,
    });

    tone.connect(level).connect(soundboard.input);
    tone.start(when);
    tone.stop(end);
  });

  pluck(context, soundboard.input, {
    when,
    peak: peak * weight * 0.5 * NAIL_WITH_EDGE_SQUARED * edge ** 2,
    edge,
  });
}

/** The nail on the silk: a few thousandths of a second of noise, brighter for a harder pluck. */
function pluck(context: BaseAudioContext, destination: AudioNode, {when, peak, edge}: NailStrike): void {
  const nail = context.createBufferSource();
  nail.buffer = noiseBuffer(context);
  nail.loop = true;

  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2_800 + NAIL_BRIGHTER_BY * edge;
  band.Q.value = 1;

  const level = context.createGain();
  strike(level.gain, {when, peak, attack: 0.001, decay: 0.012});

  nail.connect(band).connect(level).connect(destination);
  nail.start(when, Math.random() * 0.5);
  nail.stop(when + 0.05);
}

/**
 * 농현, wired to each partial's `detune`: the player presses the string beyond the bridge, so the pitch is
 * only ever pushed up from the note, never below it. It begins at once and reaches its full depth over
 * the first third of the note. Deeper or faster than this was too much beside the music.
 */
function createNonghyeon(context: BaseAudioContext, {when, length, end}: NonghyeonSpan): AudioNode {
  const wobble = context.createOscillator();
  wobble.frequency.value = NONGHYEON_HZ;

  // A sine and a steady level added together run from nought to twice the level: all of it above the note.
  const floor = context.createConstantSource();

  const depth = context.createGain();
  depth.gain.setValueAtTime(0, when);
  depth.gain.setValueAtTime(0, when + NONGHYEON_ONSET_S);
  depth.gain.linearRampToValueAtTime(NONGHYEON_CENTS / 2, Math.min(when + NONGHYEON_ONSET_S + length * 0.3, end));

  wobble.connect(depth);
  floor.connect(depth);
  wobble.start(when);
  floor.start(when);
  wobble.stop(end);
  floor.stop(end);

  return depth;
}

/**
 * The wooden body's resonances, which are where they are whatever the note: a low one that gives a
 * plucked note its warmth, a couple in the middle that make it woody, and a lowpass over the top so
 * what is left of the treble is not harsh. `input` is where the string goes in.
 */
function createSoundboard(context: BaseAudioContext, {frequency, edge}: SoundboardOf): Soundboard {
  const input = context.createGain();

  const output = RESONANCES.reduce<AudioNode>((previous, resonance) => {
    const peaking = context.createBiquadFilter();
    peaking.type = "peaking";
    peaking.frequency.value = resonance.frequency;
    peaking.Q.value = resonance.q;
    peaking.gain.value = resonance.gain;

    previous.connect(peaking);

    return peaking;
  }, input);

  const treble = context.createBiquadFilter();
  treble.type = "lowpass";
  treble.frequency.value = Math.min(HIGHEST_CUTOFF, frequency * TREBLE_AT_NOUGHT * TREBLE_OPENS_BY ** edge);
  treble.Q.value = 0.5;
  output.connect(treble);

  return {input, output: treble};
}

interface NailStrike {
  readonly when: number;
  readonly peak: number;
  readonly edge: number;
}

interface SoundboardOf {
  readonly frequency: number;
  readonly edge: number;
}

interface Soundboard {
  readonly input: AudioNode;
  readonly output: AudioNode;
}

interface NonghyeonSpan {
  readonly when: number;
  readonly length: number;
  readonly end: number;
}

interface Resonance {
  readonly frequency: number;
  readonly q: number;
  /** In decibels. */
  readonly gain: number;
}

/** The body's resonances, by ear rather than measurement: warmth, then wood. */
const RESONANCES: readonly Resonance[] = [
  {frequency: 200, q: 2, gain: 4},
  {frequency: 450, q: 3, gain: 3},
  {frequency: 1_100, q: 3, gain: 2},
];

/** Only a note this long is given a 농현. */
const VIBRATO_FROM = 0.8;
const NONGHYEON_HZ = 3.5;
const NONGHYEON_CENTS = 40;
const NONGHYEON_ONSET_S = 0.02;

/**
 * What the partials are multiplied by so a note is as loud as the sawtooth it replaced, measured by
 * rendering both offline: the soundboard's resonances boost the note, and the partials sum to a good deal
 * more than one oscillator did.
 */
const MAKEUP = 0.32;

/**
 * How sharp a note is unless it asks otherwise. Nought is the softest string, which stood out against
 * the rest of the mix as thin and high; this sits between that and the sawtooth it replaced.
 */
const DEFAULT_EDGE = 0.5;

/**
 * How long a partial takes to rise to its peak. A slow onset is a soft pluck, and the corner where an
 * abrupt rise ends is heard as a click — eight partials' worth, all at once — which tires the ear of
 * someone listening to the music on loop. An edge shortens it, by this factor a whole edge: about 6 ms at
 * the default 0.5, and 3 at the check's 0.8, where the click is what is wanted.
 */
const ATTACK_AT_NOUGHT = 0.0213;
const ATTACK_SHRINKS_BY = 0.086;

/** What a full edge does: a louder, higher nail. */
const NAIL_WITH_EDGE_SQUARED = 4.1;
const NAIL_BRIGHTER_BY = 1_500;

/**
 * The lowpass over the top of the note sits at a multiple of the note's own pitch, as the sawtooth's did,
 * so a high note and a low one are equally mellow: about 8 times it at the default edge of 0.5, and 28 at
 * the check's 0.8, where the sharpness is the point. The band just under 3 kHz is what a note heard
 * again and again is tiring for, and a fixed cutoff let too much of it through in the low notes.
 */
const TREBLE_AT_NOUGHT = 1.08;
const TREBLE_OPENS_BY = 58.5;

/** Whatever the note, the filter is never opened above this, in hertz. */
const HIGHEST_CUTOFF = 10_000;
