export type HttpRouteAnswer =
  | {
      readonly response: Response;
      readonly outcome: "succeeded" | "rejected" | "failed" | "sign_in_refused";
    }
  | {readonly response: Response; readonly outcome: "sign_in_failed"; readonly errorName: string};
