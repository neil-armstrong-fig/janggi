import type {DrumHit} from "@src/audio/music/patterns/types/DrumHit";
import {stepInBar} from "@src/audio/music/bars/StepInBar";

/**
 * The check theme's drum: a heartbeat on the low head, a strong stroke followed at once by a weaker
 * one, twice a bar. It is the one rhythm in the music that is not a janggi rhythm at all, which is
 * the point — a general under attack should sound like a pulse racing, not like the game carrying on.
 */
export function heartbeatHitsAt(step: number): readonly DrumHit[] {
  switch (stepInBar(step)) {
    case 0:
    case 4:
      return [{head: "gung", weight: 0.95}];
    case 1:
    case 5:
      return [{head: "gung", weight: 0.55}];
    default:
      return NOTHING;
  }
}

const NOTHING: readonly DrumHit[] = [];
