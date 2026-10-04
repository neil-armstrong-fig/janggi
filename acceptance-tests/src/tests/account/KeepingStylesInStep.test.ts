import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {Janggi} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * A player's own styles follow them between devices, and so does getting rid of one: a style deleted on one device
 * must not come back from another that still held it. Styles are only ever the player's own — what the server
 * holds is theirs alone, and nobody else's styles can reach them except a key they paste by hand.
 */
given("a player with a board of their own, signed in with Google on two devices", () => {
  let secondDevice: Janggi;

  beforeEach(async ({janggi}) => {
    secondDevice = await janggi.openSeparateDevice();

    await janggi.settings.progress.loadSave(saveKeyWith({xp: 300}));
    await janggi.stylesSheet.makeStyle("Board", "Classic", "My board");
    await janggi.settings.account.signInWithGoogle();
    await expect.poll(() => janggi.settings.account.getSyncState()).toBe("synced");

    await secondDevice.settings.account.signInWithGoogle();
    await expect.poll(() => secondDevice.stylesSheet.ownStyles.getNames("Board")).toEqual(["My board"]);
  });

  when("they delete it on the second device, and the first catches up", () => {
    beforeEach(async ({janggi}) => {
      await secondDevice.stylesSheet.ownStyles.delete("Board", "My board");
      await expect.poll(() => secondDevice.settings.account.getSyncState()).toBe("synced");

      await janggi.reload();
    });

    then("it is gone from the first device as well", async ({janggi}) => {
      await expect.poll(() => janggi.stylesSheet.ownStyles.getNames("Board")).toEqual([]);
    });
  });
});
