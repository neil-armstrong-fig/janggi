import type {LayerGains} from "@src/audio/music/types/LayerGains";
import type {Mood} from "@src/audio/types/Mood";

/**
 * How loud each layer of the music should be for a mood.
 *
 * **As tension rises, layers come in and never go out.** The drone and a soft reed lead are there from
 * the first move; sparse drum strokes join as the first pieces come off, a flute answering the lead as
 * the fight opens, and fuller drumming only once the armies are thin. Each fades in across a stretch of
 * tension rather than switching on at a threshold, so however a game goes — a quiet opening or a trade
 * of chariots on move three — the music swells rather than steps.
 *
 * **Check hands the music to its own theme** without stopping the rest: the calm layers drop right
 * back underneath it, so when the check is answered and the theme fades, the game's own music is still
 * there to come back up rather than starting over.
 *
 * **An ending lets everything go but the drone**, which the cadence played for the result sits on.
 *
 * These are targets, not jumps. The player moves each layer towards its target slowly, so a change of
 * mood is heard as a turn in the music and never as a cut.
 */
export function layerGainsFor({tension, inCheck, ending}: Mood): LayerGains {
  if (ending !== "none") return {...SILENT, drone: ENDING_DRONE};

  const calm: LayerGains = {
    drone: 1,
    lead: 0.5 + 0.5 * ramp(tension, 0, 0.3),
    pulse: ramp(tension, 0.15, 0.4),
    echo: ramp(tension, 0.3, 0.6),
    percussion: ramp(tension, 0.5, 0.85),
    checkTheme: 0,
  };

  if (!inCheck) return calm;

  return {
    drone: calm.drone * UNDER_CHECK,
    lead: calm.lead * UNDER_CHECK,
    pulse: calm.pulse * UNDER_CHECK,
    echo: calm.echo * UNDER_CHECK,
    percussion: calm.percussion * UNDER_CHECK,
    checkTheme: 1,
  };
}

/** Nought below `from`, one above `to`, and a straight line between. */
function ramp(value: number, from: number, to: number): number {
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

const SILENT: LayerGains = {drone: 0, lead: 0, pulse: 0, echo: 0, percussion: 0, checkTheme: 0};

/** How much of the game's own music stays underneath the check theme. */
const UNDER_CHECK = 0.25;

const ENDING_DRONE = 0.35;
