import type {HttpRoute} from "@src/router/http/routes/types/HttpRoute";
import type {HttpRouteAnswer} from "@src/router/http/routes/types/HttpRouteAnswer";
import {deleteAccount} from "@src/router/http/routes/delete-account/DeleteAccount";
import {finishSignIn} from "@src/router/http/routes/sign-in/finish/FinishSignIn";
import {forSignedInPlayer} from "@src/router/http/routes/signed-in-player/ForSignedInPlayer";
import {logOut} from "@src/router/http/routes/log-out/LogOut";
import {openRoom} from "@src/router/http/routes/open-room/OpenRoom";
import {subscribeToPush} from "@src/router/http/routes/push-subscription/SubscribeToPush";
import {unsubscribeFromPush} from "@src/router/http/routes/push-subscription/UnsubscribeFromPush";
import {readData} from "@src/router/http/routes/read-data/ReadData";
import {readMe} from "@src/router/http/routes/read-me/ReadMe";
import {renameMe} from "@src/router/http/routes/rename-me/RenameMe";
import {startSignIn} from "@src/router/http/routes/sign-in/start/StartSignIn";
import {writeData} from "@src/router/http/routes/write-data/WriteData";
import {httpRouteAnswerFor} from "@src/router/http/routes/answer/HttpRouteAnswerFor";

/**
 * One route to one handler, each named in full: the whole of what the API answers over HTTP, in one place. The ones that are a
 * signed-in player's own go through `forSignedInPlayer`, which hands them an account or answers 401. Deleting the account is its
 * own case, reached by that route and no other. A route added to `HTTP_ROUTES` with no case here is a compile error, and one not in
 * the list is never matched (`httpRouteOf`), so nothing falls through to a handler by being the last.
 */
export async function answerHttpRoute(route: HttpRoute, request: Request): Promise<HttpRouteAnswer> {
  switch (route) {
    case "GET /api/auth/google":
      return httpRouteAnswerFor(await startSignIn(request));
    case "GET /api/auth/google/callback":
      return finishSignIn(request);
    case "POST /api/auth/logout":
      return httpRouteAnswerFor(await logOut(request));
    case "GET /api/me":
      return httpRouteAnswerFor(await forSignedInPlayer(request, account => Promise.resolve(readMe(account))));
    case "PATCH /api/me":
      return httpRouteAnswerFor(await forSignedInPlayer(request, account => renameMe(request, account)));
    case "GET /api/data":
      return httpRouteAnswerFor(await forSignedInPlayer(request, account => readData(account)));
    case "PUT /api/data":
      return httpRouteAnswerFor(await forSignedInPlayer(request, account => writeData(request, account)));
    case "POST /api/rooms":
      return httpRouteAnswerFor(await forSignedInPlayer(request, account => openRoom(request, account)));
    case "PUT /api/push-subscription":
      return httpRouteAnswerFor(await forSignedInPlayer(request, account => subscribeToPush(request, account)));
    case "DELETE /api/push-subscription":
      return httpRouteAnswerFor(await forSignedInPlayer(request, account => unsubscribeFromPush(request, account)));
    case "DELETE /api/account":
      return httpRouteAnswerFor(await forSignedInPlayer(request, account => deleteAccount(account)));
  }
}
