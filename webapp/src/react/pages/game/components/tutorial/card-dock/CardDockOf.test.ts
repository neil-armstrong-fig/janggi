import {expect, it} from "vitest";
import {cardDockOf} from "@src/react/pages/game/components/tutorial/card-dock/CardDockOf";
import type {CardDocking} from "@src/react/pages/game/components/tutorial/card-dock/types/CardDocking";

const BOARD = {top: 207, left: 8, width: 374, height: 377};

/**
 * A phone: a board from 207 to 584 down a screen 844 high, the card above the controls reaching 772 at the bottom, and
 * over them 832.
 */
const PHONE: CardDocking = {
  ring: undefined,
  lookingAt: undefined,
  board: BOARD,
  card: {top: 12, left: 12, width: 366, height: 196},
  viewportHeight: 844,
  topEdge: 12,
  bottomEdge: 772,
  lowestEdge: 832,
};

it("stands where it covers less of the board, with the ring on the board clear of either edge", () => {
  expect(cardDockOf({...PHONE, ring: {top: 470, left: 290, width: 40, height: 40}})).toBe("top");
  expect(cardDockOf({...PHONE, board: {...BOARD, top: 150}, ring: {top: 470, left: 290, width: 40, height: 40}})).toBe(
    "bottom",
  );
});

it("stands at the top where the bottom would cover the ring", () => {
  expect(cardDockOf({...PHONE, ring: {top: 560, left: 200, width: 40, height: 40}})).toBe("top");
});

it("stands at the bottom where the top would cover the ring", () => {
  expect(cardDockOf({...PHONE, ring: {top: 180, left: 150, width: 40, height: 40}})).toBe("bottom");
});

it("stands where it covers less of the board when nothing is ringed", () => {
  expect(cardDockOf(PHONE)).toBe("top");
});

it("stands away from the ring where it covers no board either way, beside it on a wide screen", () => {
  const wide = {
    ...PHONE,
    board: {top: 58, left: 368, width: 544, height: 550},
    card: {top: 12, left: 944, width: 320, height: 220},
    viewportHeight: 720,
    bottomEdge: 600,
    ring: {top: 450, left: 600, width: 40, height: 40},
  };

  expect(cardDockOf(wide)).toBe("top");
});

it("stands away from the ring before the card or the board is measured", () => {
  expect(cardDockOf({...PHONE, card: undefined, ring: {top: 700, left: 0, width: 40, height: 40}})).toBe("top");
});

it("stands away from the side of the board the words are about, where the ring allows", () => {
  const ring = {top: 470, left: 290, width: 40, height: 40};
  const tall = {...PHONE, card: {top: 12, left: 12, width: 366, height: 212}, ring};

  expect(cardDockOf({...tall, lookingAt: "top"})).toBe("bottom");
  expect(cardDockOf({...tall, lookingAt: "bottom"})).toBe("top");
});

it("stands over the side the words are about rather than over the ring", () => {
  expect(cardDockOf({...PHONE, lookingAt: "top", ring: {top: 640, left: 200, width: 40, height: 40}})).toBe("top");
});

it("stands lowest, over the controls, for words about the top when above the controls would cover the ring", () => {
  expect(cardDockOf({...PHONE, lookingAt: "top", ring: {top: 560, left: 200, width: 40, height: 40}})).toBe("lowest");
});

it("never stands over the controls for words about no side, which would put Settings under it", () => {
  expect(cardDockOf({...PHONE, ring: {top: 560, left: 200, width: 40, height: 40}})).toBe("top");
});
