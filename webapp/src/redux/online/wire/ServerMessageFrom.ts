import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {SeatedAction} from "@janggi/shared/janggi/online/messages/action/SeatedAction";
import type {ServerMessage} from "@janggi/shared/janggi/online/messages/ServerMessage";
import {REJECTION_REASONS} from "@janggi/shared/janggi/online/messages/RejectionReason";
import {SETUP_NAMES} from "@janggi/shared/janggi/settings/SetupName";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isObject} from "@src/redux/untrusted/IsObject";

const ACTIONS_WITHOUT_DETAIL = ["pass", "call-bikjang", "offer-draw", "accept-draw", "resign"] as const;

/**
 * A `ServerMessage` from the text of a frame, or undefined where it is not one. The room is ours, but what arrives is read
 * as anything arriving is: the kind is known, each part has the type it is meant to, and a move's points are checked against
 * the board where the move is applied (`moveFromWire`).
 */
export function serverMessageFrom(text: string): ServerMessage | undefined {
  const value = parsed(text);
  if (!isObject(value)) return undefined;

  switch (value["kind"]) {
    case "waiting":
    case "opponent-left":
    case "opponent-back":
      return {kind: value["kind"]};
    case "matched":
      return matchedFrom(value);
    case "started":
      return startedFrom(value);
    case "acted":
      return actedFrom(value);
    case "snapshot":
      return snapshotFrom(value);
    case "opponent-look":
      return opponentLookMessageFrom(value);
    case "rejected":
      if (isAmong(REJECTION_REASONS, value["reason"])) {
        return {kind: "rejected", reason: value["reason"]};
      }

      return undefined;
    default:
      return undefined;
  }
}

function opponentLookMessageFrom(value: Record<string, unknown>): ServerMessage | undefined {
  const look = value["look"];
  if (!isObject(look)) return undefined;

  const {boardKey, piecesKey} = look;
  const optional = (key: unknown): boolean => key === undefined || typeof key === "string";
  if (!optional(boardKey) || !optional(piecesKey)) return undefined;

  return {
    kind: "opponent-look",
    look: {
      ...(typeof boardKey === "string" ? {boardKey} : {}),
      ...(typeof piecesKey === "string" ? {piecesKey} : {}),
    },
  };
}

function matchedFrom(value: Record<string, unknown>): ServerMessage | undefined {
  const opponent = introductionFrom(value["opponent"]);
  if (isAmong(SIDES, value["side"]) && opponent !== undefined) {
    return {kind: "matched", side: value["side"], opponent};
  }

  return undefined;
}

function startedFrom(value: Record<string, unknown>): ServerMessage | undefined {
  if (isAmong(SETUP_NAMES, value["hanSetup"]) && isAmong(SETUP_NAMES, value["choSetup"])) {
    return {kind: "started", hanSetup: value["hanSetup"], choSetup: value["choSetup"]};
  }

  return undefined;
}

function actedFrom(value: Record<string, unknown>): ServerMessage | undefined {
  const action = actionFrom(value["action"]);
  if (isAmong(SIDES, value["by"]) && action !== undefined) {
    return {kind: "acted", by: value["by"], action};
  }

  return undefined;
}

function snapshotFrom(value: Record<string, unknown>): ServerMessage | undefined {
  const opponent = introductionFrom(value["opponent"]);
  const history = historyFrom(value["history"]);
  const {hanSetup, choSetup} = value;
  const dealt = hanSetup !== undefined || choSetup !== undefined;
  const setupsValid = !dealt || (isAmong(SETUP_NAMES, hanSetup) && isAmong(SETUP_NAMES, choSetup));

  if (!isAmong(SIDES, value["side"]) || opponent === undefined || history === undefined || !setupsValid) {
    return undefined;
  }

  return {
    kind: "snapshot",
    side: value["side"],
    opponent,
    ...(dealt ? {hanSetup: hanSetup as never, choSetup: choSetup as never} : {}),
    history,
  };
}

function historyFrom(value: unknown): readonly SeatedAction[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const entries = value.map((entry: unknown) => {
    const action = isObject(entry) ? actionFrom(entry["action"]) : undefined;
    if (isObject(entry) && isAmong(SIDES, entry["by"]) && action !== undefined) {
      return {by: entry["by"], action};
    }

    return undefined;
  });
  if (entries.every(entry => entry !== undefined)) {
    return entries;
  }

  return undefined;
}

function actionFrom(value: unknown): RoomAction | undefined {
  if (!isObject(value)) return undefined;

  const plain = ACTIONS_WITHOUT_DETAIL.find(kind => kind === value["kind"]);
  if (plain !== undefined) return {kind: plain};

  const move = value["move"];
  if (value["kind"] !== "move" || !isObject(move) || !isObject(move["from"]) || !isObject(move["to"])) return undefined;

  const {from, to} = move;
  const numbers = [from["file"], from["rank"], to["file"], to["rank"]];
  if (!numbers.every(number => typeof number === "number")) return undefined;

  return {
    kind: "move",
    move: {
      from: {file: from["file"] as number, rank: from["rank"] as number},
      to: {file: to["file"] as number, rank: to["rank"] as number},
    },
  };
}

function introductionFrom(value: unknown): Introduction | undefined {
  if (!isObject(value) || typeof value["displayName"] !== "string") return undefined;

  const {boardKey, piecesKey} = value;
  const optional = (key: unknown): boolean => key === undefined || typeof key === "string";
  if (!optional(boardKey) || !optional(piecesKey)) return undefined;

  return {
    displayName: value["displayName"],
    ...(typeof boardKey === "string" ? {boardKey} : {}),
    ...(typeof piecesKey === "string" ? {piecesKey} : {}),
  };
}

function parsed(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
