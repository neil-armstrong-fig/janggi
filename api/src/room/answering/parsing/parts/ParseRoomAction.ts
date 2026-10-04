import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {WirePoint} from "@janggi/shared/janggi/online/messages/action/WirePoint";
import {FILE_COUNT, RANK_COUNT} from "@janggi/engine/board/BoardDimensions";
import {isRecord} from "@src/json/IsRecord";

const KINDS_WITHOUT_DETAIL = ["pass", "call-bikjang", "offer-draw", "accept-draw", "resign"] as const;

/** A `RoomAction` from whatever arrived, or undefined: a move's points must be whole numbers on the board. */
export function parseRoomAction(value: unknown): RoomAction | undefined {
  if (!isRecord(value)) return undefined;

  const kind = value["kind"];
  const plain = KINDS_WITHOUT_DETAIL.find(each => each === kind);
  if (plain !== undefined) return {kind: plain};

  if (kind !== "move" || !isRecord(value["move"])) return undefined;

  const from = pointIn(value["move"]["from"]);
  const to = pointIn(value["move"]["to"]);
  if (from === undefined || to === undefined) return undefined;

  return {kind: "move", move: {from, to}};
}

function pointIn(value: unknown): WirePoint | undefined {
  if (!isRecord(value)) return undefined;

  const {file, rank} = value;
  if (!isWithin(file, FILE_COUNT) || !isWithin(rank, RANK_COUNT)) return undefined;

  return {file, rank};
}

function isWithin(value: unknown, largest: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= largest;
}
