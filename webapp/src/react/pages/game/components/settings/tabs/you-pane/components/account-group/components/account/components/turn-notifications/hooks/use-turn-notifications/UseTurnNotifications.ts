import {turnNotificationsStateNow} from "@src/redux/notifications/TurnNotificationsStateNow";
import {turnOffTurnNotifications} from "@src/redux/notifications/TurnOffTurnNotifications";
import {turnOnTurnNotifications} from "@src/redux/notifications/TurnOnTurnNotifications";
import type {TurnNotificationsState} from "@janggi/shared/janggi/online/TurnNotificationsState";
import {useEffect, useState} from "react";

interface TurnNotifications {
  readonly state: TurnNotificationsState;
  /** Turns them on where they are off, and off where they are on; nothing where they are neither. */
  readonly toggle: () => void;
}

/**
 * Where this device stands on being told when it is the player's turn, and the one thing a player can do about it. The browser
 * is the source of truth — its permission and its push subscription — so this asks it on mounting rather than keeping a copy that
 * could be stale, and takes whatever state the browser says it is in after each change.
 */
export function useTurnNotifications(): TurnNotifications {
  const [state, setState] = useState<TurnNotificationsState>("checking");

  useEffect(() => {
    let current = true;

    void turnNotificationsStateNow().then(found => {
      if (current) setState(found);
    });

    return () => {
      current = false;
    };
  }, []);

  const toggle = (): void => {
    if (state === "on") {
      void turnOffTurnNotifications().then(setState);
    }

    if (state === "off") {
      void turnOnTurnNotifications().then(setState);
    }
  };

  return {state, toggle};
}
