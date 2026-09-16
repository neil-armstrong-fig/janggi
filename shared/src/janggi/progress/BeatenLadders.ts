import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The strengths of bot beaten on one ladder, each once, in the order they were first beaten. */
export type BeatenElos = readonly BotElo[];

/** What each army has beaten, in one format. */
export type BeatenBySide = Readonly<Record<Side, BeatenElos>>;

/**
 * The four ladders a player climbs: each army in each of janggi's two games.
 *
 * **Apart, because they are four different things to be good at.** Janggi is not symmetrical — Han moves
 * second and is given 덤 for it — and a scored game is not the casual one, bikjang and repetition being
 * gated differently. Beating a bot as Cho in a casual game says nothing about playing Han, or about
 * playing the scored game, so it opens nothing there. The opening arrangement is not part of it: a setup
 * is a choice within a game, not a different game.
 *
 * Here rather than beside the webapp's progress slice because it is also the shape a save key carries
 * (`SaveKeyJson`), which the acceptance tests build keys against.
 */
export type BeatenLadders = Readonly<Record<MatchFormat, BeatenBySide>>;
