/**
 * The positions the style preview can show a style in, each one that makes some marks appear, which no single position
 * does: a check and a bikjang cannot stand on one board.
 * Here rather than in the webapp because the words for each are in `language/`, which reaches nothing but this package.
 */
export const SCENE_NAMES = ["opening", "hints", "check", "bikjang"] as const;

export type SceneName = (typeof SCENE_NAMES)[number];
