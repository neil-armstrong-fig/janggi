import type {GoogleAuthorization} from "@src/router/http/routes/sign-in/google/types/GoogleAuthorization";
import type {GoogleExchange} from "@src/router/http/routes/sign-in/google/types/GoogleExchange";

/**
 * Google as the tests meet it: every code is the consent of whichever subject a test has told it to know, and the rest are
 * refused. A class because it holds state — those subjects. `SetupApiTests` makes the Google functions this one's.
 */
export class FakeGoogle {
  readonly subjectsByCode = new Map<string, string>();
  /** What it was asked, in order, for a test that cares what the route sent. */
  readonly authorizations: GoogleAuthorization[] = [];
  readonly exchanges: GoogleExchange[] = [];

  authorizationUrl = (authorization: GoogleAuthorization): Promise<URL> => {
    this.authorizations.push(authorization);

    return Promise.resolve(new URL(`https://accounts.google.test/consent?state=${authorization.state}`));
  };

  subjectOf = (exchange: GoogleExchange): Promise<string> => {
    this.exchanges.push(exchange);

    const subject = this.subjectsByCode.get(exchange.code);
    if (subject === undefined) return Promise.reject(new Error("Google refused the code"));

    return Promise.resolve(subject);
  };

  /** Forgets every subject: each test starts knowing nobody. */
  reset = (): void => {
    this.subjectsByCode.clear();
    this.authorizations.length = 0;
    this.exchanges.length = 0;
  };
}
