import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {EFFECTS_NAMES} from "@janggi/shared/janggi/settings/EffectsName";
import {BIKJANG_HINT_NAMES} from "@janggi/shared/janggi/settings/BikjangHintName";
import {MOVABLE_HIGHLIGHT_NAMES} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {UNLOCK_PRICES} from "@src/redux/progress/unlocks/UnlockPrices";
import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";
import {preferencesFrom} from "@src/react/pages/game/hooks/use-preferences/utils/PreferencesFrom";
import {preferencesReducer} from "@src/redux/preferences/PreferencesSlice";

const EVERYTHING_UNLOCKED = Number.MAX_SAFE_INTEGER;

it("finds a board style for every name the store can hold", () => {
  for (const name of BOARD_STYLE_NAMES) {
    expect(
      preferencesFrom({...initial(), boardStyle: name}, EVERYTHING_UNLOCKED, noCustomStyles()).boardStyle.name,
    ).toBe(name);
  }
});

it("finds a piece set for every name the store can hold", () => {
  for (const name of PIECE_SET_NAMES) {
    expect(preferencesFrom({...initial(), pieceSet: name}, EVERYTHING_UNLOCKED, noCustomStyles()).pieceStyle.name).toBe(
      name,
    );
  }
});

it("draws the default board in place of one the player's XP has not unlocked", () => {
  const preferences = preferencesFrom(
    {...initial(), boardStyle: "Neon"},
    UNLOCK_PRICES.boardStyles.Neon - 1,
    noCustomStyles(),
  );

  expect(preferences.boardStyle.name).toBe("Classic");
});

it("wears a board the moment the player's XP reaches its price", () => {
  const preferences = preferencesFrom(
    {...initial(), boardStyle: "Neon"},
    UNLOCK_PRICES.boardStyles.Neon,
    noCustomStyles(),
  );

  expect(preferences.boardStyle.name).toBe("Neon");
});

it("draws the default pieces in place of a set the player's XP has not unlocked", () => {
  const preferences = preferencesFrom(
    {...initial(), pieceSet: "Hanja"},
    UNLOCK_PRICES.pieceSets.Hanja - 1,
    noCustomStyles(),
  );

  expect(preferences.pieceStyle.name).toBe("Modern");
});

it("wears the player's own styles whatever their XP", () => {
  const preferences = preferencesFrom({...initial(), boardStyle: "Mine", pieceSet: "Also mine"}, 0, {
    boards: [{...classicStyle, name: "Mine"}],
    pieceSets: [{...hangulPieces, name: "Also mine"}],
  });

  expect(preferences.boardStyle.name).toBe("Mine");
  expect(preferences.pieceStyle.name).toBe("Also mine");
});

it("draws the defaults in place of styles of the player's own that are no longer there", () => {
  const preferences = preferencesFrom(
    {...initial(), boardStyle: "Deleted", pieceSet: "Also deleted"},
    EVERYTHING_UNLOCKED,
    noCustomStyles(),
  );

  expect(preferences.boardStyle.name).toBe("Classic");
  expect(preferences.pieceStyle.name).toBe("Modern");
});

it("marks the movable pieces only while the mark is shown", () => {
  expect(
    MOVABLE_HIGHLIGHT_NAMES.map(name =>
      preferencesFrom({...initial(), movableHighlight: name}, EVERYTHING_UNLOCKED, noCustomStyles()),
    ),
  ).toEqual([
    expect.objectContaining({movableHighlight: {name: "Shown", shown: true}}),
    expect.objectContaining({movableHighlight: {name: "Hidden", shown: false}}),
  ]);
});

it("labels the moves that could allow a bikjang only while the hint is shown", () => {
  expect(
    BIKJANG_HINT_NAMES.map(name =>
      preferencesFrom({...initial(), bikjangHint: name}, EVERYTHING_UNLOCKED, noCustomStyles()),
    ),
  ).toEqual([
    expect.objectContaining({bikjangHint: {name: "Shown", shown: true}}),
    expect.objectContaining({bikjangHint: {name: "Hidden", shown: false}}),
  ]);
});

it("moves the board in full only while effects are full", () => {
  expect(
    EFFECTS_NAMES.map(name => preferencesFrom({...initial(), effects: name}, EVERYTHING_UNLOCKED, noCustomStyles())),
  ).toEqual([
    expect.objectContaining({effects: {name: "Full", full: true}}),
    expect.objectContaining({effects: {name: "Reduced", full: false}}),
  ]);
});

it("hands both volumes on as they are", () => {
  const preferences = preferencesFrom(
    {...initial(), soundEffectsVolume: 40, musicVolume: 25},
    EVERYTHING_UNLOCKED,
    noCustomStyles(),
  );

  expect(preferences.soundEffectsVolume).toBe(40);
  expect(preferences.musicVolume).toBe(25);
});

function initial(): PreferencesSliceState {
  return preferencesReducer(undefined, {type: "test/initialised"});
}
