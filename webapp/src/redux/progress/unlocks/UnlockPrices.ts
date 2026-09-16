import type {UnlockPrices} from "@src/redux/progress/unlocks/types/UnlockPrices";

/**
 * What XP opens, and at how much.
 *
 * The first visit gets the board as it sits on a table and the three piece sets that between them
 * suit any reader. Hanja and Neon come within the first few games, and each theme after that roughly
 * doubles the one before — a Scored win is worth 40 XP, so Dancheong is a long evening's work.
 *
 * **Hacker is priced to be hacked.** A million XP is some twenty-five thousand scored wins: reachable in
 * principle, and never in practice. The way in is the number kept under `janggi.progress.v1`, or a
 * save key with a bigger number in it.
 *
 * Typed as a record over every built-in name, so a style added to `@janggi/shared` without a price
 * does not compile.
 */
export const UNLOCK_PRICES: UnlockPrices = {
  boardStyles: {
    Classic: 0,
    Neon: 60,
    Diagram: 150,
    Tournament: 600,
    Celadon: 1_200,
    Dancheong: 2_500,
    Hacker: 1_000_000,
  },
  pieceSets: {
    Traditional: 0,
    Hangul: 0,
    Modern: 0,
    Hanja: 30,
    Diagram: 150,
    Tournament: 600,
    Celadon: 1_200,
    Dancheong: 2_500,
    Hacker: 1_000_000,
  },
  styleEditor: 300,
};
