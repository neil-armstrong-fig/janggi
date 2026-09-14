import type {Chip} from "@src/react/pages/game/components/board/components/impact/types/Chip";
import type {Vector} from "@src/react/pages/game/components/board/types/Vector";

/**
 * The chips a capture throws: fanned out ahead of the capturing piece, in the direction it was going,
 * never back the way it came.
 *
 * Scattered, so no two captures look stamped from one mould — but scattered by a seed rather than by
 * `Math.random`, because this is worked out while rendering, and a render must give the same answer
 * however many times React asks. A capture's own moment id is the seed, so one capture always throws
 * the same chips and the next throws different ones.
 */
export function chipPaths(count: number, heading: Vector, seed: number): readonly Chip[] {
  const ahead = Math.atan2(heading.y, heading.x);

  return Array.from({length: count}, (_, index) => {
    const along = count === 1 ? 0 : index / (count - 1) - 0.5;
    const angle = ahead + along * 2 * SPREAD + (scatter(seed, index, 1) - 0.5) * (SPREAD / count);
    const distance = NEAREST + scatter(seed, index, 2) * (FURTHEST - NEAREST);

    return {
      id: `chip-${index}`,
      across: Math.cos(angle) * distance,
      down: Math.sin(angle) * distance,
      spin: (scatter(seed, index, 3) - 0.5) * 540,
    };
  });
}

/**
 * A number between nought and one that looks random and is not — the same seed, chip and purpose
 * always give the same one. The usual shader hash; nothing here needs better than that.
 */
function scatter(seed: number, index: number, purpose: number): number {
  const value = Math.sin(seed * 12.9898 + index * 78.233 + purpose * 37.719) * 43758.5453;

  return value - Math.floor(value);
}

/** Either side of straight ahead, in radians — seventy degrees, so no chip is thrown backwards even scattered. */
const SPREAD = (70 * Math.PI) / 180;

/** How far a chip is thrown, in cells. */
const NEAREST = 0.35;
const FURTHEST = 0.75;
