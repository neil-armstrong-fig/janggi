import type {Locator} from "@playwright/test";
import {Switch} from "@src/dsl/janggi/components/settings/playwright/components/switch/Switch";
import type {Visibility} from "@src/dsl/janggi/components/settings/tabs/look-pane/playwright/components/visibility-switch/types/Visibility";

/** A hint or highlight switch expressed as Shown or Hidden. */
export class VisibilitySwitch extends Switch<Visibility> {
  constructor(toggle: Locator) {
    super(toggle, "Shown", "Hidden");
  }
}
