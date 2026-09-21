export interface InstallationManifest {
  readonly name?: string;
  readonly display?: string;
  readonly icons?: readonly InstallationManifestIcon[];
}

export interface InstallationManifestIcon {
  readonly src: string;
  readonly purpose?: string;
}
