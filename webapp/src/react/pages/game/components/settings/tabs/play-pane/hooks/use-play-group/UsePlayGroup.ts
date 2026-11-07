import type {PlayGroupName} from "@janggi/shared/janggi/settings/PlayGroupName";
import {useState} from "react";
import {deviceStorage} from "@src/redux/shared/device-storage/DeviceStorage";
import {readJson} from "@src/redux/shared/device-storage/ReadJson";
import {saveJson} from "@src/redux/shared/device-storage/SaveJson";
import {playGroupFrom} from "@src/react/pages/game/components/settings/tabs/play-pane/hooks/use-play-group/storage/PlayGroupFrom";

interface PlayGroupSelection {
  readonly open: PlayGroupName | undefined;
  readonly toggle: (name: PlayGroupName) => void;
}

const STORAGE_KEY = "janggi.play-group.v1";

/** The open Play group is a device preference, independent of the game on its board. */
export function usePlayGroup(): PlayGroupSelection {
  const [open, setOpen] = useState(() => playGroupFrom(readJson(deviceStorage(), STORAGE_KEY)));
  const toggle = (name: PlayGroupName): void => {
    const next = nextGroup(open, name);
    setOpen(next);
    saveJson(deviceStorage(), STORAGE_KEY, {open: next});
  };
  return {open, toggle};
}

function nextGroup(open: PlayGroupName | undefined, name: PlayGroupName): PlayGroupName | undefined {
  if (open === name) return undefined;

  return name;
}
