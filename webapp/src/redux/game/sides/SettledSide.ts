import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {randomSide} from "@src/redux/game/sides/RandomSide";

/**
 * The army a choice comes to. Cho and Han are themselves; Random is rolled here and now, so that what the
 * store holds is always a definite army and nothing downstream has to ask what the player meant.
 */
export function settledSide(choice: SideChoiceName): Side {
  switch (choice) {
    case "Cho":
      return "cho";
    case "Han":
      return "han";
    case "Random":
      return randomSide();
  }
}
