import {PLAY_GROUP_NAMES} from "@janggi/shared/janggi/settings/PlayGroupName";
import type {PlayGroupName} from "@janggi/shared/janggi/settings/PlayGroupName";
import {isObject} from "@src/redux/shared/untrusted/IsObject";
import {isAmong} from "@src/redux/shared/untrusted/IsAmong";

export function playGroupFrom(value: unknown): PlayGroupName | undefined {
  if (!isObject(value)) return undefined;
  if (!isAmong(PLAY_GROUP_NAMES, value.open)) return undefined;

  return value.open;
}
