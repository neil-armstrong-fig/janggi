import type {Locator} from "@playwright/test";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";

export interface SetupSettingControls {
  readonly army: Locator;
  readonly grid: Locator;
  readonly options: Readonly<Record<SetupName, Locator>>;
}
