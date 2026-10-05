// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {beforeEach, expect, it, vi} from "vitest";
import type {TurnNotificationsState} from "@janggi/shared/janggi/online/TurnNotificationsState";
import {turnNotificationsStateNow} from "@src/redux/notifications/TurnNotificationsStateNow";
import {turnOffTurnNotifications} from "@src/redux/notifications/TurnOffTurnNotifications";
import {turnOnTurnNotifications} from "@src/redux/notifications/TurnOnTurnNotifications";
import {useTurnNotifications} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account/components/turn-notifications/hooks/use-turn-notifications/UseTurnNotifications";

vi.mock("@src/redux/notifications/TurnNotificationsStateNow");
vi.mock("@src/redux/notifications/TurnOnTurnNotifications");
vi.mock("@src/redux/notifications/TurnOffTurnNotifications");

function standingAt(state: TurnNotificationsState): void {
  vi.mocked(turnNotificationsStateNow).mockResolvedValue(state);
}

beforeEach(() => {
  vi.resetAllMocks();
});

it("is checking until the browser has said where it stands, and then says it", async () => {
  standingAt("off");

  const {result} = renderHook(() => useTurnNotifications());

  expect(result.current.state).toBe("checking");
  await waitFor(() => expect(result.current.state).toBe("off"));
});

it("turns them on when toggled while off, and takes the state the browser reports after", async () => {
  standingAt("off");
  vi.mocked(turnOnTurnNotifications).mockResolvedValue("on");
  const {result} = renderHook(() => useTurnNotifications());
  await waitFor(() => expect(result.current.state).toBe("off"));

  act(() => result.current.toggle());

  await waitFor(() => expect(result.current.state).toBe("on"));
  expect(turnOffTurnNotifications).not.toHaveBeenCalled();
});

it("turns them off when toggled while on", async () => {
  standingAt("on");
  vi.mocked(turnOffTurnNotifications).mockResolvedValue("off");
  const {result} = renderHook(() => useTurnNotifications());
  await waitFor(() => expect(result.current.state).toBe("on"));

  act(() => result.current.toggle());

  await waitFor(() => expect(result.current.state).toBe("off"));
  expect(turnOnTurnNotifications).not.toHaveBeenCalled();
});

it.each<TurnNotificationsState>(["blocked", "unavailable"])("does nothing when toggled while %s", async state => {
  standingAt(state);
  const {result} = renderHook(() => useTurnNotifications());
  await waitFor(() => expect(result.current.state).toBe(state));

  act(() => result.current.toggle());

  expect(turnOnTurnNotifications).not.toHaveBeenCalled();
  expect(turnOffTurnNotifications).not.toHaveBeenCalled();
});
