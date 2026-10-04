import type {ClientMessage} from "@janggi/shared/janggi/online/messages/ClientMessage";
import {SETUP_NAMES} from "@janggi/shared/janggi/settings/SetupName";
import {MAX_CLIENT_MESSAGE_LENGTH} from "@src/room/answering/parsing/limits/MaxClientMessageLength";
import {isRecord} from "@src/json/IsRecord";
import {parseIntroduction} from "@src/room/answering/parsing/parts/ParseIntroduction";
import {parseLook} from "@src/room/answering/parsing/parts/ParseLook";
import {parseRoomAction} from "@src/room/answering/parsing/parts/ParseRoomAction";

/**
 * A `ClientMessage` from the text of a WebSocket frame, or undefined if it is not one. Everything that reaches the room
 * comes through here, so what the reducer is handed has already been checked: it never sees a move off the board.
 */
export function parseClientMessage(text: string): ClientMessage | undefined {
  if (text.length > MAX_CLIENT_MESSAGE_LENGTH) return undefined;

  const value = parsedJson(text);
  if (!isRecord(value)) return undefined;

  if (value["kind"] === "introduce") {
    const introduction = parseIntroduction(value["introduction"]);
    if (introduction === undefined) return undefined;

    return {kind: "introduce", introduction};
  }

  if (value["kind"] === "choose-setup") {
    const setup = SETUP_NAMES.find(name => name === value["setup"]);
    if (setup === undefined) return undefined;

    return {kind: "choose-setup", setup};
  }

  if (value["kind"] === "act") {
    const action = parseRoomAction(value["action"]);
    if (action === undefined) return undefined;

    return {kind: "act", action};
  }

  if (value["kind"] === "update-look") {
    const look = parseLook(value["look"]);
    if (look === undefined) return undefined;

    return {kind: "update-look", look};
  }

  return undefined;
}

function parsedJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
