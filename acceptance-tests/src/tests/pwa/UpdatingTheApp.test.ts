import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player has a game in progress when another app release becomes available", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
    await janggi.releaseUpdate.makeAvailable();
  });

  when("the new release is ready", () => {
    then("the app offers to refresh", async ({janggi}) => {
      expect(await janggi.releaseUpdate.isOffered()).toBe(true);
      expect(await janggi.releaseUpdate.isWaiting()).toBe(true);
    });

    when("the player leaves it until later", () => {
      beforeEach(async ({janggi}) => {
        await janggi.releaseUpdate.leaveUntilLater();
      });

      then("the offer leaves the game out of the way", async ({janggi}) => {
        expect(await janggi.releaseUpdate.isDismissed()).toBe(true);
        expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
      });
    });

    when("the player refreshes", () => {
      beforeEach(async ({janggi}) => {
        await janggi.releaseUpdate.refresh();
      });

      then("the new release runs with the game restored", async ({janggi}) => {
        expect(await janggi.releaseUpdate.isAvailableReleaseRunning()).toBe(true);
        expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
      });
    });
  });
});

given("someone is reading the references when another app release becomes available", () => {
  beforeEach(async ({janggi}) => {
    await janggi.references.visitReferences();
    await janggi.releaseUpdate.makeAvailable();
  });

  when("the new release is ready", () => {
    then("the reading page offers to refresh too", async ({janggi}) => {
      expect(await janggi.releaseUpdate.isOffered()).toBe(true);
    });
  });
});
