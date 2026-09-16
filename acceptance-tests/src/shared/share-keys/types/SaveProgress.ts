import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The strengths each army has beaten in one format. An army left out has beaten none. */
export type BeatenBySide = Readonly<Partial<Record<Side, readonly BotElo[]>>>;

/**
 * The four ladders, by format and then army — a format left out has been played by neither. Each rung is
 * earned from the one below it, so a ladder naming 1600 without 800 climbs no further than 800.
 */
export type BeatenLadders = Readonly<Partial<Record<MatchFormat, BeatenBySide>>>;

/** Where a spec wants a player to stand: an amount of XP, and optionally the bots they have beaten. */
export interface SaveProgress {
  readonly xp: number;
  readonly beaten?: BeatenLadders;
}
