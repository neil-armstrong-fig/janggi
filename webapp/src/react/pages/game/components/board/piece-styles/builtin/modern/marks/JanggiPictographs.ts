import type {PictographSet} from "@src/react/pages/game/components/board/piece-styles/types/PictographSet";

/**
 * The drawings that ship with the app, for players who cannot read either script.
 *
 * PROVENANCE. Every path below was written by hand as raw SVG coordinates while building this app —
 * numbers typed out, rendered, looked at, and adjusted, over several rounds at the size a piece
 * actually gets on a phone. Nothing here was traced, converted, or copied from an icon set, a font,
 * or any other artwork, so there is no third-party licence attached to any of it. Four of the seven
 * are deliberately the shape chess has used for centuries — a crown, a knight's head, a pawn — but
 * they are generic silhouettes of those ideas rather than a copy of any particular set's rendering
 * of them, and the idea of drawing a king as a crown is not anyone's to own.
 *
 * Each is a silhouette with no interior detail. Nine files have to fit across a phone, which leaves
 * a piece around thirty pixels wide, and at that size an outline survives where a line inside it
 * turns to mud. The wheel's hole is the one exception, cut by winding its inner circle against the
 * outer one so the non-zero fill rule leaves it open.
 */
export const JANGGI_PICTOGRAPHS: PictographSet = {
  /** A crown: five points and a band. */
  general: "M22 65 V29 L37 43 L50 19 L63 43 L78 29 V65 Z M20 69 H80 V81 H20 Z",

  /** A shield. The guard never leaves the palace and does nothing but stand in front of it. */
  guard: "M50 15 L80 25 V50 C80 68 67 79 50 85 C33 79 20 68 20 50 V25 Z",

  /** A horse's head, cut the way a chess knight is. */
  horse:
    "M28 92 C28 76 32 66 44 58 L30 60 L24 52 C22 48 24 42 30 39 C40 32 50 26 58 22 L55 12 L64 18 L70 10 L74 22 C80 34 80 52 76 68 C73 80 72 86 72 92 Z",

  /** Head-on: two ears, a domed brow, and the trunk that is the only part which must survive. */
  elephant:
    "M28 30 C12 27 6 42 12 56 C17 68 28 70 33 62 Z M72 30 C88 27 94 42 88 56 C83 68 72 70 67 62 Z M50 14 C65 14 74 25 74 40 C74 52 68 60 60 63 V50 H40 V63 C32 60 26 52 26 40 C26 25 35 14 50 14 Z M41 48 H59 V70 C59 78 64 81 68 77 L73 82 C65 91 47 89 46 70 Z",

  /**
   * A wheel: rim, four spokes and a hub. The rim's inner circle is wound against the outer one, so
   * the non-zero rule leaves the gap between the spokes open.
   */
  chariot:
    "M50 10 A40 40 0 1 1 50 90 A40 40 0 1 1 50 10 Z M50 24 A26 26 0 1 0 50 76 A26 26 0 1 0 50 24 Z M45 14 H55 V86 H45 Z M14 45 H86 V55 H14 Z M50 38 A12 12 0 1 1 50 62 A12 12 0 1 1 50 38 Z",

  /** A field gun side-on: breech, barrel, flared muzzle, and the carriage under it. */
  cannon:
    "M23 27 H75 V51 H23 Z M73 21 H85 V57 H73 Z M16 32 H24 V46 H16 Z M19 49 H67 L59 65 H13 Z M33 59 A10 10 0 1 1 33 79 A10 10 0 1 1 33 59 Z M61 59 A10 10 0 1 1 61 79 A10 10 0 1 1 61 59 Z",

  /** A pawn. The rank the whole board is counted in, and the shape everyone already reads as one. */
  soldier:
    "M50 8 A15 15 0 1 1 50 38 A15 15 0 1 1 50 8 Z M35 38 H65 V47 H35 Z M38 47 C38 67 30 78 25 90 H75 C70 78 62 67 62 47 Z",
};
