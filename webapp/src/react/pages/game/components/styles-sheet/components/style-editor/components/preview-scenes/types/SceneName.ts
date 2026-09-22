/**
 * The positions the preview can show a style in, listed as well as typed so the switcher is read off the
 * list. Each is a position that makes some marks appear, which no single position does: a check and a
 * bikjang cannot stand on one board.
 */
export const SCENE_NAMES = ["opening", "hints", "check", "bikjang"] as const;

export type SceneName = (typeof SCENE_NAMES)[number];
