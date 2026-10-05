/** What a push message to one device is encrypted with: the device's own public key and its authentication secret. */
export interface PushKeys {
  readonly p256dh: string;
  readonly auth: string;
}
