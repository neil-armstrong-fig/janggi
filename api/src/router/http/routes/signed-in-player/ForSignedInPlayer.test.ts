import {expect, it, vi} from "vitest";
import {forSignedInPlayer} from "@src/router/http/routes/signed-in-player/ForSignedInPlayer";
import {hashSessionToken} from "@src/router/shared/session/HashSessionToken";
import {testDatabase} from "@src/database/testing/TestDatabase";

async function requestWithSession(token: string | undefined): Promise<Request> {
  const account = await testDatabase.findOrCreateAccount("google-1", {
    id: "user-1",
    displayName: "Kim",
    now: new Date(),
  });
  await testDatabase.createSession({
    idHash: await hashSessionToken("good"),
    userId: account.id,
    expiresAt: new Date(Date.now() + 60_000),
  });

  return new Request("https://api.test/", {headers: cookieHeaderFor(token)});
}

it("hands the route the account of the session", async () => {
  const request = await requestWithSession("good");
  const answer = vi.fn(() => Promise.resolve(new Response(null, {status: 204})));

  const response = await forSignedInPlayer(request, answer);

  expect(response.status).toBe(204);
  expect(answer).toHaveBeenCalledWith({id: "user-1", displayName: "Kim"});
});

it.each([
  ["no cookie", undefined],
  ["a session nobody has", "unknown"],
])("answers 401, and never calls the route, for %s", async (_what, token) => {
  const request = await requestWithSession(token);
  const answer = vi.fn(() => Promise.resolve(new Response(null, {status: 204})));

  expect((await forSignedInPlayer(request, answer)).status).toBe(401);
  expect(answer).not.toHaveBeenCalled();
});

/** The `Cookie` header of a request carrying the session token, or none where there is no token. */
function cookieHeaderFor(token: string | undefined): Record<string, string> | undefined {
  if (token === undefined) return undefined;

  return {Cookie: `session=${token}`};
}
