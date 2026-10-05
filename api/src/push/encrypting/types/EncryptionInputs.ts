/** Everything an encryption takes beyond the message, with the two things that are random each time given rather than made. */
export interface EncryptionInputs {
  readonly plaintext: Uint8Array;
  readonly deviceKey: Uint8Array;
  readonly authSecret: Uint8Array;
  readonly serverPrivateKey: CryptoKey;
  readonly serverPublicKey: Uint8Array;
  readonly salt: Uint8Array;
}
