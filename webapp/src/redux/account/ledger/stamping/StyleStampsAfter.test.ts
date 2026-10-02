import {expect, it} from "vitest";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import type {StampingContext} from "@src/redux/account/ledger/types/StampingContext";
import type {SyncLedgerSliceState} from "@src/redux/account/ledger/types/SyncLedgerSliceState";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";
import {styleStampsAfter} from "@src/redux/account/ledger/stamping/StyleStampsAfter";

const mine: BoardStyle = {
  name: "Mine",
  ...DEFAULT_BOARD_MARKS,
  surface: "#ffffff",
  defaultCell: {stroke: "#000000", strokeWidth: 1},
  lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
};

const none = noCustomStyles();
const holding = (...boards: BoardStyle[]): CustomStylesSliceState => ({...none, boards});
const EMPTY: SyncLedgerSliceState = {
  boards: {},
  pieceSets: {},
  deleted: [],
  preferencesAt: 0,
  ratingsResetAt: undefined,
};
const LEDGER: SyncLedgerSliceState = {...EMPTY, boards: {Mine: {id: "first", at: 100}}};

let made = 0;
const context = (now: number): StampingContext => ({now, newId: () => `made-${++made}`});

it("gives a new style an id and the time", () => {
  const stamps = styleStampsAfter({previous: none, next: holding(mine), ledger: EMPTY}, context(500));

  expect(stamps.boards).toEqual({Mine: {id: expect.stringMatching(/^made-/), at: 500}});
});

it("keeps a style's id and moves its time on when its content changes", () => {
  const changed = {...mine, surface: "#000000"};

  expect(
    styleStampsAfter({previous: holding(mine), next: holding(changed), ledger: LEDGER}, context(500)).boards,
  ).toEqual({
    Mine: {id: "first", at: 500},
  });
});

it("leaves a style alone that did not change", () => {
  expect(styleStampsAfter({previous: holding(mine), next: holding(mine), ledger: LEDGER}, context(500)).boards).toEqual(
    LEDGER.boards,
  );
});

it("remembers a style that has gone as deleted, with the time", () => {
  const stamps = styleStampsAfter({previous: holding(mine), next: none, ledger: LEDGER}, context(500));

  expect(stamps.deleted).toEqual([{kind: "Board", id: "first", at: 500}]);
  expect(stamps.boards).toEqual({});
});

it("gives a style made again under a deleted one's name a new id, so the deletion cannot take it too", () => {
  const afterDeleting = styleStampsAfter({previous: holding(mine), next: none, ledger: LEDGER}, context(500));
  const remade = styleStampsAfter(
    {
      previous: none,
      next: holding(mine),
      ledger: {...LEDGER, boards: afterDeleting.boards, deleted: afterDeleting.deleted},
    },
    context(900),
  );

  expect(remade.boards["Mine"]?.id).not.toBe("first");
  expect(remade.deleted).toEqual([{kind: "Board", id: "first", at: 500}]);
});

it("keeps what was deleted before", () => {
  const earlier = {kind: "Pieces", id: "old", at: 1} as const;

  expect(
    styleStampsAfter({previous: none, next: none, ledger: {...EMPTY, deleted: [earlier]}}, context(500)).deleted,
  ).toEqual([earlier]);
});

it("catches the ledger up with styles that were there before it, at the beginning of time", () => {
  const stamps = styleStampsAfter({previous: holding(mine), next: holding(mine), ledger: EMPTY}, context(0));

  expect(stamps.boards["Mine"]?.at).toBe(0);
});

it("keeps a piece set's stamp apart from a board's", () => {
  const set = {name: "Mine"} as unknown as CustomStylesSliceState["pieceSets"][number];

  const stamps = styleStampsAfter({previous: none, next: {...none, pieceSets: [set]}, ledger: EMPTY}, context(500));

  expect(Object.keys(stamps.boards)).toEqual([]);
  expect(Object.keys(stamps.pieceSets)).toEqual(["Mine"]);
});

it("does not remember as deleted a style that was never stamped, there being nothing to tell its deletion by", () => {
  expect(styleStampsAfter({previous: holding(mine), next: none, ledger: EMPTY}, context(500)).deleted).toEqual([]);
});

it("remembers a deleted piece set as one, apart from the boards", () => {
  const set = {name: "Mine"} as unknown as CustomStylesSliceState["pieceSets"][number];
  const ledger = {...EMPTY, pieceSets: {Mine: {id: "set-1", at: 100}}};

  expect(
    styleStampsAfter({previous: {...none, pieceSets: [set]}, next: none, ledger: ledger}, context(500)).deleted,
  ).toEqual([{kind: "Pieces", id: "set-1", at: 500}]);
});
