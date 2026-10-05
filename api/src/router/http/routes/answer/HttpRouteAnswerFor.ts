import type {HttpRouteAnswer} from "@src/router/http/routes/types/HttpRouteAnswer";

/** Classifies a route's response without reading or changing it. */
export function httpRouteAnswerFor(response: Response): HttpRouteAnswer {
  if (response.status >= 500) return {response, outcome: "failed"};
  if (response.status >= 400) return {response, outcome: "rejected"};

  return {response, outcome: "succeeded"};
}
