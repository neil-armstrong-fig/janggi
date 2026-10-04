import type {HttpRoute} from "@src/router/http/routes/types/HttpRoute";
import {deleteAccount} from "@src/router/http/routes/delete-account/DeleteAccount";
import {finishSignIn} from "@src/router/http/routes/sign-in/finish/FinishSignIn";
import {forSignedInPlayer} from "@src/router/http/routes/signed-in-player/ForSignedInPlayer";
import {logOut} from "@src/router/http/routes/log-out/LogOut";
import {openRoom} from "@src/router/http/routes/open-room/OpenRoom";
import {readData} from "@src/router/http/routes/read-data/ReadData";
import {readMe} from "@src/router/http/routes/read-me/ReadMe";
import {renameMe} from "@src/router/http/routes/rename-me/RenameMe";
import {startSignIn} from "@src/router/http/routes/sign-in/start/StartSignIn";
import {writeData} from "@src/router/http/routes/write-data/WriteData";

/**
 * One route to one handler, each named in full: the whole of what the API answers over HTTP, in one place. The ones that are a
 * signed-in player's own go through `forSignedInPlayer`, which hands them an account or answers 401. Deleting the account is its
 * own case, reached by that route and no other. A route added to `HTTP_ROUTES` with no case here is a compile error, and one not in
 * the list is never matched (`httpRouteOf`), so nothing falls through to a handler by being the last.
 */
export function answerHttpRoute(route: HttpRoute, request: Request): Promise<Response> {
  switch (route) {
    case "GET /api/auth/google":
      return startSignIn(request);
    case "GET /api/auth/google/callback":
      return finishSignIn(request);
    case "POST /api/auth/logout":
      return logOut(request);
    case "GET /api/me":
      return forSignedInPlayer(request, account => Promise.resolve(readMe(account)));
    case "PATCH /api/me":
      return forSignedInPlayer(request, account => renameMe(request, account));
    case "GET /api/data":
      return forSignedInPlayer(request, account => readData(account));
    case "PUT /api/data":
      return forSignedInPlayer(request, account => writeData(request, account));
    case "POST /api/rooms":
      return forSignedInPlayer(request, account => openRoom(request, account));
    case "DELETE /api/account":
      return forSignedInPlayer(request, account => deleteAccount(account));
  }
}
