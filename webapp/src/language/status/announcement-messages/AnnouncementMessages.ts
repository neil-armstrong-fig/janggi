import type {DrawnBy} from "@janggi/shared/janggi/results/DrawnBy";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What the turn line says: whose move it is, whether a general is attacked, how a game ended, and what the bot is doing. */
export interface AnnouncementMessages {
  readonly botUnavailable: string;
  readonly botLoading: string;
  readonly botLayingOut: string;
  readonly botThinking: string;
  readonly won: (side: Side) => string;
  readonly wonOnPoints: (side: Side) => string;
  readonly drawn: Record<DrawnBy, string>;
  readonly inCheck: (side: Side) => string;
  readonly toMove: (side: Side) => string;
  readonly layingOut: (side: Side) => string;
}
