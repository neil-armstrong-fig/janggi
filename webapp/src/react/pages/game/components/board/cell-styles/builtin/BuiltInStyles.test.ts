import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import {boardStyleFrom} from "@src/redux/custom-styles/untrusted/BoardStyleFrom";
import {expect, it} from "vitest";

it("ships a board style for every name @janggi/shared publishes, in the same order", () => {
  expect(BUILT_IN_STYLES.map(style => style.name)).toEqual(BOARD_STYLE_NAMES);
});

/**
 * A built-in is what the style editor starts a player from, and copied out, it is what they share — so
 * one that its own import would refuse would hand the player a style they cannot save.
 */
it("ships only styles that would pass the check an imported style must", () => {
  for (const style of BUILT_IN_STYLES) {
    expect(boardStyleFrom(style)).toEqual({kind: "accepted", value: style});
  }
});
