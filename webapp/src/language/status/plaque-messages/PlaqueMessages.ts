/** What a plaque calls who is playing an army, to a screen reader. */
import type {Side} from "@janggi/shared/janggi/pieces/Side";

export interface PlaqueMessages {
  readonly bot: string;
  readonly player: string;
  readonly takenFrom: (side: Side) => string;
  readonly nextUnlock: (xp: string, unlocks: string) => string;
}
