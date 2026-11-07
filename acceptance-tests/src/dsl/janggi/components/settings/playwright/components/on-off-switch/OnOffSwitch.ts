import type {Locator} from "@playwright/test";
import {Switch} from "@src/dsl/janggi/components/settings/playwright/components/switch/Switch";

/** A switch whose setting is simply on or off. */
export class OnOffSwitch extends Switch<boolean> {
  constructor(toggle: Locator) {
    super(toggle, true, false);
  }
}
