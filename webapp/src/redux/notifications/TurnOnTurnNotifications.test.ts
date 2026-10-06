import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {turnOnTurnNotifications} from "@src/redux/notifications/TurnOnTurnNotifications";

const unsubscribe = vi.fn(() => Promise.resolve(true));
const subscribe = vi.fn();
const getSubscription = vi.fn();
const fetched = vi.fn();
let permission: NotificationPermission;
let asked: NotificationPermission;

beforeEach(() => {
  permission = "default";
  asked = "granted";
  subscribe.mockResolvedValue({
    endpoint: "https://push.example/phone",
    toJSON: () => ({endpoint: "https://push.example/phone", keys: {p256dh: "k", auth: "a"}}),
    unsubscribe,
  });
  getSubscription.mockResolvedValue(null);
  fetched.mockResolvedValue(new Response(undefined, {status: 204}));

  vi.stubGlobal("navigator", {
    serviceWorker: {getRegistration: () => Promise.resolve({pushManager: {subscribe, getSubscription}})},
  });
  vi.stubGlobal("PushManager", class {});
  vi.stubGlobal("Notification", {
    get permission() {
      return permission;
    },
    requestPermission: () => {
      permission = asked;

      return Promise.resolve(asked);
    },
  });
  vi.stubGlobal("fetch", fetched);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it("subscribes with the app's key and gives the server the address, and says it is on", async () => {
  getSubscription.mockResolvedValue({});

  expect(await turnOnTurnNotifications()).toBe("on");
  expect(subscribe).toHaveBeenCalledWith(expect.objectContaining({userVisibleOnly: true}));
  expect(fetched).toHaveBeenCalledWith(
    expect.stringContaining("/api/push-subscription"),
    expect.objectContaining({method: "PUT", credentials: "include"}),
  );
});

it("subscribes nowhere when the player says no to the browser's question", async () => {
  asked = "denied";

  expect(await turnOnTurnNotifications()).toBe("blocked");
  expect(subscribe).not.toHaveBeenCalled();
  expect(fetched).not.toHaveBeenCalled();
});

it("lets the browser's subscription go again when the server would not take it, so no address is held that it does not know", async () => {
  fetched.mockResolvedValue(new Response(undefined, {status: 503}));

  expect(await turnOnTurnNotifications()).toBe("off");
  expect(unsubscribe).toHaveBeenCalledOnce();
});

it("says it is off, and does not throw, when the push service cannot be reached", async () => {
  subscribe.mockRejectedValue(new Error("no push service"));

  expect(await turnOnTurnNotifications()).toBe("off");
});
