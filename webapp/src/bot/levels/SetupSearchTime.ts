/**
 * How long the engine may think over each opening it rates while the bot lays out, in milliseconds.
 *
 * One figure for every strength rather than `MOVE_TIMES_MS`, because laying out asks many searches in a
 * row: Cho rates its four answers, and Han rates all sixteen pairings to find each setup's worst case.
 * At the top rung's move time that would be forty seconds of waiting before the first move; at this it
 * is four at most. The bot's Elo still goes with every search, so a weaker bot still judges worse.
 */
export const SETUP_SEARCH_MS = 250;
