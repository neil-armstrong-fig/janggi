import {sessionTokenFrom} from "@src/handler/session/SessionTokenFrom";

it("finds the token among other cookies", () => {
  expect(sessionTokenFrom("theme=dark; session=abc123; other=1")).toBe("abc123");
});

it("finds it where it is the only cookie", () => {
  expect(sessionTokenFrom("session=abc123")).toBe("abc123");
});

it("finds none where there is no cookie header, or no session in it", () => {
  expect(sessionTokenFrom(null)).toBeUndefined();
  expect(sessionTokenFrom("theme=dark")).toBeUndefined();
});

it("finds none in a session cookie that has been cleared", () => {
  expect(sessionTokenFrom("session=")).toBeUndefined();
});

it("does not mistake a cookie whose name merely ends in session", () => {
  expect(sessionTokenFrom("not-session=abc")).toBeUndefined();
});
