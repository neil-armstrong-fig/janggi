import {turnNotificationOf} from "@src/sw/notifying/TurnNotificationOf";

it("names who played, and says it is the player's turn", () => {
  expect(turnNotificationOf(JSON.stringify({opponent: "Kim Yu-sin"}), "en").options.body).toBe(
    "Kim Yu-sin has moved. It's your turn.",
  );
});

it("is titled with the app's name", () => {
  expect(turnNotificationOf(undefined, "en").title).toBe("Janggi");
});

it("replaces a notification of the same game still showing, and sounds again when it does", () => {
  const {options} = turnNotificationOf(undefined, "en");

  expect(options.tag).toBe("turn");
  expect(options.renotify).toBe(true);
});

it.each([
  ["nothing", undefined],
  ["text that is not JSON", "Kim"],
  ["JSON that is not an object", "7"],
  ["an object with no opponent", JSON.stringify({other: "Kim"})],
  ["an opponent that is not text", JSON.stringify({opponent: 7})],
  ["an empty opponent", JSON.stringify({opponent: "  "})],
  ["an opponent far too long to be a name", JSON.stringify({opponent: "a".repeat(41)})],
])("still says it is the player's turn when the push is %s", (_why, pushed) => {
  expect(turnNotificationOf(pushed, "en").options.body).toBe("It's your turn.");
});

it("says it in Korean for a player who reads the game in Korean", () => {
  const {title, options} = turnNotificationOf(JSON.stringify({opponent: "Kim Yu-sin"}), "ko");

  expect(title).toBe("장기");
  expect(options.body).toBe("Kim Yu-sin님이 수를 두었습니다. 당신의 차례입니다.");
});

it("still says it is their turn in Korean where the push cannot be read", () => {
  expect(turnNotificationOf(undefined, "ko").options.body).toBe("당신의 차례입니다.");
});
