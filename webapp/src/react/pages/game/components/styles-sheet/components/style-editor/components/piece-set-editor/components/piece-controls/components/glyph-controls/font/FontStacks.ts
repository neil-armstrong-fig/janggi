import type {FontStack} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/font/types/FontStack";
import {MODERN_SANS} from "@src/react/pages/game/components/board/piece-styles/builtin/utils/ModernSet";

/**
 * The faces the sets that ship with the app write in, offered by name. The serif and the monospace are
 * spelled out here as the sets spell them out — those stacks are private to the sets — so a set that wears
 * one of them shows it as chosen. Any other stack a style has is shown as none of these, and left alone.
 */
export const FONT_STACKS: readonly [FontStack, ...FontStack[]] = [
  {name: "Serif", css: "'Nanum Myeongjo', 'Noto Serif KR', 'Source Han Serif KR', 'Songti SC', 'SimSun', serif"},
  {name: "Sans", css: MODERN_SANS},
  {name: "Mono", css: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace"},
];
