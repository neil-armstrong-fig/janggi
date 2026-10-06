import type {ServerData} from "@src/redux/account/syncing/types/ServerData";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";

/** The server's answer for the player's data, or undefined where it is not in the shape the server sends. */
export function serverDataFrom(body: unknown): ServerData | undefined {
  if (!isObject(body)) return undefined;

  const {version, blob} = body;
  if (!isFiniteNumber(version) || (blob !== null && typeof blob !== "string")) return undefined;
  if (blob === null) return {version};

  return {version, blob};
}
