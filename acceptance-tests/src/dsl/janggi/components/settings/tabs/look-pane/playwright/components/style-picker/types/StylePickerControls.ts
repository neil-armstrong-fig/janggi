import type {Locator} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

export interface StylePickerControls<Name extends string> {
  readonly select: Locator;
  readonly split: Locator;
  readonly armySelects: Readonly<Record<Side, Locator>>;
  readonly options: Readonly<Record<Name, Locator>>;
}
