import type {Side} from "@janggi/shared/janggi/pieces/Side";

export interface FriendSetupMessages {
  readonly playing: (opponent: string) => string;
  readonly choose: (side: Side) => string;
  /** Handed the setup's name in the language being read. */
  readonly chose: (setup: string) => string;
}
