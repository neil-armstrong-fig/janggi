import {FakeLimits} from "@src/router/http/routes/rate-limit/testing/FakeLimits";

/** The one set of limits every test's mocked rate-limit functions share (`SetupApiTests`), allowing everything before each test. */
export const testLimits = new FakeLimits();
