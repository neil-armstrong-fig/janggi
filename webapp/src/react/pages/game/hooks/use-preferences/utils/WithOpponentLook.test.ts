import {expect, it} from "vitest";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Preferences} from "@src/react/pages/game/hooks/use-preferences/types/Preferences";
import {preferencesFrom} from "@src/react/pages/game/hooks/use-preferences/utils/PreferencesFrom";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";
import {combinedBoardStyle} from "@src/styles/board-halves/CombinedBoardStyle";
import {combinedPieceSet} from "@src/styles/piece-sets/CombinedPieceSet";
import {withOpponentLook} from "@src/react/pages/game/hooks/use-preferences/utils/WithOpponentLook";

const own: Preferences = preferencesFrom(defaultPreferences(), 0, noCustomStyles());
const FRIENDS_BOARD = {...own.boardStyle, name: "Friend's board"} as BoardStyle;
const FRIENDS_SET = {...own.armyPieceSets.cho, name: "Friend's set"} as PieceSetStyle;

it("draws the friend's half in the board the friend wears and the player's own in their own", () => {
  const asCho = withOpponentLook(own, {ownSide: "cho", look: {displayName: "Yi", boardStyle: FRIENDS_BOARD}});
  const asHan = withOpponentLook(own, {ownSide: "han", look: {displayName: "Yi", boardStyle: FRIENDS_BOARD}});

  expect(asCho.armyBoardStyles).toEqual({cho: own.armyBoardStyles.cho, han: FRIENDS_BOARD});
  expect(asHan.armyBoardStyles).toEqual({han: own.armyBoardStyles.han, cho: FRIENDS_BOARD});
  expect(asCho.boardStyle).toEqual(combinedBoardStyle(asCho.armyBoardStyles));
});

it("puts the friend's army in the friend's set and the player's own in their own", () => {
  const asCho = withOpponentLook(own, {ownSide: "cho", look: {displayName: "Yi", pieceSet: FRIENDS_SET}});
  const asHan = withOpponentLook(own, {ownSide: "han", look: {displayName: "Yi", pieceSet: FRIENDS_SET}});

  expect(asCho.armyPieceSets).toEqual({cho: own.armyPieceSets.cho, han: FRIENDS_SET});
  expect(asHan.armyPieceSets).toEqual({han: own.armyPieceSets.han, cho: FRIENDS_SET});
  expect(asCho.pieceStyle).toEqual(combinedPieceSet(asCho.armyPieceSets));
  expect(asCho.pieceStyle).not.toEqual(own.pieceStyle);
});

it("leaves the player's own look where the friend sent nothing", () => {
  expect(withOpponentLook(own, {ownSide: "cho", look: {displayName: "Yi"}})).toEqual(own);
});

it("keeps the rest of the preferences as they are", () => {
  const seen = withOpponentLook(own, {
    ownSide: "cho",
    look: {displayName: "Yi", boardStyle: FRIENDS_BOARD, pieceSet: FRIENDS_SET},
  });

  expect(seen.effects).toBe(own.effects);
  expect(seen.movableHighlight).toBe(own.movableHighlight);
});
