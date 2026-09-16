import type {PieceBodyStyle} from "@src/styles/types/PieceStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * What the three modern sets have in common: a solid disc in the army's colour with a pale ring
 * inside the rim, and the face any writing on it is set in.
 *
 * Shared on purpose. Those sets differ in exactly one thing — whether the mark is a drawing, a
 * hanja character or a hangul one — and a reader should be able to see that from the fact that they
 * are handed the same body, rather than by comparing three lists of colours.
 */
export function modernBody(side: Side): PieceBodyStyle {
  return BODIES[side];
}

/**
 * A sans face rather than the traditional set's serif: these are modern pieces that happen to carry
 * writing, not photographs of carved ones, and the writing is set the way a sign is. Nothing is
 * bundled, so a device with no Korean font of its own falls back to whatever it has.
 */
export const MODERN_SANS =
  "'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans CJK KR', 'PingFang SC', sans-serif";

/** Every modern set draws its pieces at one size, bar the general, which a player must find fast. */
export const STANDARD_SIZE = 0.86;
export const GENERAL_SIZE = 0.94;

const BODIES: Record<Side, PieceBodyStyle> = {
  han: {
    shape: "disc",
    fill: "#c0392b",
    stroke: "#8c261a",
    strokeWidth: 2,
    inlay: {inset: 0.14, stroke: "#e9b0a7", strokeWidth: 1.5},
  },
  cho: {
    shape: "disc",
    fill: "#1a8760",
    stroke: "#0f5c41",
    strokeWidth: 2,
    inlay: {inset: 0.14, stroke: "#a5dcc4", strokeWidth: 1.5},
  },
};
