/** One overtone of a plucked string. */
export interface StringPartial {
  /** Times the note's frequency. Just over a whole number: a stiff string rings slightly sharp. */
  readonly ratio: number;
  /** How loud it is at the pluck, relative to the others; the loudest is one. */
  readonly level: number;
  /** How long it takes to die away, in seconds. */
  readonly decay: number;
}

/** What is asked of a string: its pitch, how hard it is plucked, and how long it rings. */
export interface StringRing {
  /** In hertz. */
  readonly frequency: number;
  /** From nought to one. */
  readonly weight: number;
  /** In seconds. */
  readonly length: number;
  /** From nought (the default) to one: how hard and bright the note is made, beyond how hard it is struck. */
  readonly edge?: number;
}

/**
 * The overtones a plucked silk string rings with, and how each dies.
 *
 * What separates a string from a sawtooth is that its upper partials fall away much faster than its
 * fundamental, so the note is bright at the pluck and pure a moment later. Which partials there are
 * follows the pluck's place along the string: a partial with a node at the plucking point is not excited,
 * which thins the spectrum in the way a plucked note is recognised by. A harder pluck excites the upper
 * ones more, and an edge keeps them ringing longer too — a note meant to cut through.
 */
export function stringPartialsOf({frequency, weight, length, edge = 0}: StringRing): StringPartial[] {
  const partials = Array.from({length: PARTIALS}, (_, index) => partialAt(index + 1, {weight, length, edge})).filter(
    partial => frequency * partial.ratio <= HIGHEST,
  );
  const loudest = Math.max(...partials.map(partial => partial.level));

  return partials.map(partial => ({...partial, level: partial.level / loudest}));
}

function partialAt(number: number, {weight, length, edge}: PartialAsked): StringPartial {
  const tilt = TILT - TILT_WITH_WEIGHT * weight - TILT_WITH_EDGE * edge;
  const decayRise = DECAY_RISE - DECAY_RISE_WITH_EDGE * edge;

  return {
    ratio: number * Math.sqrt(1 + STIFFNESS * number * number),
    level: Math.abs(Math.sin(number * Math.PI * PLUCK_AT)) / number ** tilt,
    decay: Math.max(MIN_DECAY, length / number ** decayRise),
  };
}

interface PartialAsked {
  readonly weight: number;
  readonly length: number;
  readonly edge: number;
}

/** How many partials there are, at most — each one is an oscillator on a phone. */
const PARTIALS = 8;

/** Nothing above this is rung; it is inaudible on a small speaker and only feeds the clip. */
const HIGHEST = 8_000;

/** How far along the string it is plucked, as a fraction of its length. */
const PLUCK_AT = 0.16;

/** How stiff the string is; the higher the partial the further it is pulled sharp. */
const STIFFNESS = 0.0001;

/** Partial *n* is `1 / n ** tilt` as loud as the fundamental, before the pluck's place is counted. */
const TILT = 1.3;

/** How much of that tilt a full-strength pluck takes off. */
const TILT_WITH_WEIGHT = 0.5;

/** How much of the tilt a full edge takes off, and of the rise in how fast the partials die. */
const TILT_WITH_EDGE = 0.7;
const DECAY_RISE_WITH_EDGE = 0.05;

/** Partial *n* dies `n ** DECAY_RISE` times as fast as the fundamental. */
const DECAY_RISE = 0.57;

/** No partial dies faster than this, in seconds, or it is a click. */
const MIN_DECAY = 0.06;
