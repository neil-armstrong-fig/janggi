import {expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player wants to know which build of the app they are running", () => {
  when("they look in App & help on the You tab", () => {
    then("the build is named by the short hash of the commit it was made from", async ({janggi}) => {
      expect(await janggi.settings.getAppVersion()).toMatch(/^[0-9a-f]{7}$/);
    });
  });
});
