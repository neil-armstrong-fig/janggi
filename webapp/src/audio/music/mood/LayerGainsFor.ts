import type {LayerGains} from "@src/audio/music/types/LayerGains";
import type {Mood} from "@src/audio/types/Mood";

/**
 * How loud each layer of the music should be for a mood.
 *
 * **Before a game is under way only the waiting theme plays**, over a softer bass. The first move
 * hands the music over to the game's own layers, which rise as the waiting theme falls away; a game
 * taken back to its start, or dealt afresh, hands it back.
 *
 * **As tension rises, layers come in and never go out.** The bass, the soloist and a soft 장구 are
 * there from the first move; the drum comes up to full as the fight opens, and the flute joins to
 * breathe under the solo's phrases once it has. Each fades in across a stretch of tension rather than
 * switching on at a threshold, so the music swells rather than steps — the rest of the build is the
 * 장단 itself changing, which is the conductor's, not a matter of loudness.
 *
 * **Check hands the music to its own theme** without stopping the rest: the calm layers drop right
 * back underneath it, so when the check is answered and the theme fades, the game's own music is still
 * there to come back up rather than starting over.
 *
 * **An ending lets all of the music go**, and leaves the cadence played for the result to ring out alone.
 *
 * These are targets, not jumps. The player moves each layer towards its target slowly, so a change of
 * mood is heard as a turn in the music and never as a cut.
 */
export function layerGainsFor({tension, inCheck, ending, underWay}: Mood): LayerGains {
  if (ending !== "none") return SILENT;

  if (!underWay) return {...SILENT, waiting: 1, bass: WAITING_BASS};

  const calm: LayerGains = {
    waiting: 0,
    bass: 1,
    solo: QUIET_SOLO + (1 - QUIET_SOLO) * ramp(tension, 0, 0.3),
    janggu: QUIET_JANGGU + (1 - QUIET_JANGGU) * ramp(tension, 0.1, 0.6),
    answer: ramp(tension, 0.35, 0.65),
    checkTheme: 0,
  };

  if (!inCheck) return calm;

  return {
    waiting: 0,
    bass: calm.bass * UNDER_CHECK,
    solo: calm.solo * UNDER_CHECK,
    janggu: calm.janggu * UNDER_CHECK,
    answer: calm.answer * UNDER_CHECK,
    checkTheme: 1,
  };
}

/** Nought below `from`, one above `to`, and a straight line between. */
function ramp(value: number, from: number, to: number): number {
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

const SILENT: LayerGains = {waiting: 0, bass: 0, solo: 0, janggu: 0, answer: 0, checkTheme: 0};

/** How much of the game's own music stays underneath the check theme. */
const UNDER_CHECK = 0.25;

/** The bass under the waiting theme: there, so the key is heard, but kept back behind the theme. */
const WAITING_BASS = 0.6;

/** The soloist at the opening: playing, but with room still to grow. */
const QUIET_SOLO = 0.7;

/** The drum at the opening: a soft groove to move to, and no more. */
const QUIET_JANGGU = 0.4;
