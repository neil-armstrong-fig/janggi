/**
 * The public half of the VAPID key pair the API signs its web pushes with, as unpadded base64url. The app subscribes a device
 * to pushes from this key alone, so a push service will take them from nobody else. Public by design, like `API_ORIGIN`: it is
 * in the app's code, and the private half is the Worker's secret (`VAPID_PRIVATE_KEY`, `MANUAL-SETUP-STEPS.md`). Rotating the
 * pair means changing both, and every device must then subscribe again.
 */
export const VAPID_PUBLIC_KEY =
  "BMVrDWgSv89h844VgnMh0EkDD0FSt2DBqwDpuDQjWkPsmir9Q4Z-MFnxYnEwLTl3RInixgtpa5Hk4JO9TIw1qQg";
