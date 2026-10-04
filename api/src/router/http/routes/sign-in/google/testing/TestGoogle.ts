import {FakeGoogle} from "@src/router/http/routes/sign-in/google/testing/FakeGoogle";

/** The one Google every test's mocked Google functions share (`SetupApiTests`), knowing nobody before each test. */
export const testGoogle = new FakeGoogle();
