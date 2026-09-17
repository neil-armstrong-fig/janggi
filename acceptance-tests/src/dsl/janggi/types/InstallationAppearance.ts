export interface InstallationIcon {
  readonly width: number;
  readonly height: number;
  readonly purpose: string;
}

export interface InstallationAppearance {
  readonly name: string;
  readonly display: string;
  readonly icons: readonly InstallationIcon[];
  readonly appleTouchIcon: InstallationIcon;
}
